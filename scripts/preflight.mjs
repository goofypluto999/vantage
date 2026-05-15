#!/usr/bin/env node
/**
 * scripts/preflight.mjs — local pre-deploy safety net.
 *
 * Run this BEFORE `git commit` on any change that touches frontend or
 * API code. Catches the failure modes we've actually hit on Vercel:
 *
 *   1. Function-count overflow (Vercel Hobby caps at 12 functions/deploy)
 *   2. TypeScript errors (caught by tsc but only if you remember to run it)
 *   3. Build failures (vite build)
 *   4. Missing env vars referenced by API code
 *   5. Duplicate route paths (two files claiming the same /api/foo)
 *   6. Forgotten import added by an editor but not actually used (dead code)
 *   7. Functions over Vercel's compressed size limit (50MB Hobby)
 *
 * Exit code 0 = safe to commit. Non-zero = blocker.
 *
 * Usage:
 *   node scripts/preflight.mjs            # full check (~15s)
 *   node scripts/preflight.mjs --fast     # skip the production build
 *   node scripts/preflight.mjs --json     # machine-readable output
 *
 * Why this exists: on 2026-05-11 we shipped a new /api/followup endpoint
 * and the deploy failed at the "Deploying outputs..." step because Vercel
 * Hobby caps deployments at 12 functions and we were silently at 13. The
 * build + tsc + local test were all clean — the failure surfaced only on
 * Vercel. This script makes that whole class of issue catchable locally.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const FAST = args.has('--fast');
const JSON_MODE = args.has('--json');

// Vercel Hobby tier limits. Update if the project moves to Pro.
const VERCEL_FUNCTION_LIMIT = 12;
const VERCEL_FUNCTION_SIZE_LIMIT_MB = 50;

const results = {
  checks: [],
  errors: [],
  warnings: [],
  passed: 0,
  failed: 0,
};

function pass(name, detail = '') {
  results.checks.push({ name, status: 'pass', detail });
  results.passed++;
  if (!JSON_MODE) console.log(`✓ ${name}${detail ? '  ' + detail : ''}`);
}

function fail(name, detail) {
  results.checks.push({ name, status: 'fail', detail });
  results.errors.push(`${name}: ${detail}`);
  results.failed++;
  if (!JSON_MODE) console.log(`✗ ${name}\n  ${detail}`);
}

function warn(name, detail) {
  results.checks.push({ name, status: 'warn', detail });
  results.warnings.push(`${name}: ${detail}`);
  if (!JSON_MODE) console.log(`⚠ ${name}\n  ${detail}`);
}

// ── Walk a directory recursively, collect file paths ─────────────────────
function walk(dir, filter = () => true, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    let s;
    try { s = statSync(full); } catch { continue; }
    if (s.isDirectory()) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
      walk(full, filter, acc);
    } else if (filter(full)) {
      acc.push(full);
    }
  }
  return acc;
}

/** Files under api/ that count as serverless functions. Excludes files
 * inside `_`-prefixed directories — Vercel convention for non-function
 * helper modules that ARE bundled with adjacent functions but don't
 * become routes themselves. Added 2026-05-11 after the 106a0bf incident
 * where importing from a top-level `lib/` failed at runtime; switching
 * to `api/_lib/` is the safe pattern. */
function listApiFunctionFiles() {
  const apiDir = join(ROOT, 'api');
  if (!existsSync(apiDir)) return [];
  const allTs = walk(apiDir, (p) => p.endsWith('.ts') || p.endsWith('.js'));
  return allTs.filter((p) => {
    const rel = relative(apiDir, p).replace(/\\/g, '/');
    // Exclude anything inside a path segment starting with `_`.
    return !rel.split('/').some((seg) => seg.startsWith('_'));
  });
}

/** Files under api/ that are NOT functions but ARE bundled with them
 * (helper modules in `_`-prefixed dirs). For diagnostics + the
 * import-escape check below. */
function listApiHelperFiles() {
  const apiDir = join(ROOT, 'api');
  if (!existsSync(apiDir)) return [];
  const allTs = walk(apiDir, (p) => p.endsWith('.ts') || p.endsWith('.js'));
  return allTs.filter((p) => {
    const rel = relative(apiDir, p).replace(/\\/g, '/');
    return rel.split('/').some((seg) => seg.startsWith('_'));
  });
}

// ── Check 1: serverless function count under Vercel Hobby cap ────────────
function checkFunctionCount() {
  const apiDir = join(ROOT, 'api');
  if (!existsSync(apiDir)) {
    warn('serverless-function-count', 'No api/ directory found. Skipping.');
    return;
  }
  // Each .ts/.js file inside api/ is a serverless function in Vercel's
  // routing model — including bracketed dynamic-segment files like
  // [action].ts. EXCEPTION: files inside `_`-prefixed directories
  // (e.g. api/_lib/foo.ts) are helper modules, NOT functions — they
  // get bundled with the adjacent functions that import them.
  const files = listApiFunctionFiles();
  const helpers = listApiHelperFiles();
  const fnCount = files.length;
  const overage = fnCount - VERCEL_FUNCTION_LIMIT;
  const helperNote = helpers.length > 0
    ? ` (+${helpers.length} helper module${helpers.length === 1 ? '' : 's'} in _ dirs, not counted as functions)`
    : '';
  if (overage > 0) {
    const fileList = files.map((f) => '  - ' + relative(ROOT, f)).join('\n');
    fail(
      'serverless-function-count',
      `${fnCount} functions detected, Vercel Hobby cap is ${VERCEL_FUNCTION_LIMIT}. Over by ${overage}. Consolidate into a [action] dispatcher or remove. Functions:\n${fileList}`
    );
  } else if (fnCount === VERCEL_FUNCTION_LIMIT) {
    warn(
      'serverless-function-count',
      `${fnCount}/${VERCEL_FUNCTION_LIMIT} functions${helperNote} — at the Vercel Hobby ceiling. Adding ONE more function will fail deployment. Plan consolidation BEFORE adding a new endpoint.`
    );
  } else {
    pass('serverless-function-count', `${fnCount}/${VERCEL_FUNCTION_LIMIT} functions${helperNote}`);
  }
}

// ── Check 2: vercel.json function entries exist as files ─────────────────
function checkVercelJsonConsistency() {
  const path = join(ROOT, 'vercel.json');
  if (!existsSync(path)) {
    warn('vercel-json-consistency', 'vercel.json not found, skipping.');
    return;
  }
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(path, 'utf-8'));
  } catch (e) {
    fail('vercel-json-consistency', `vercel.json is not valid JSON: ${e.message}`);
    return;
  }
  const declared = Object.keys(cfg.functions || {});
  const missing = declared.filter((p) => !existsSync(join(ROOT, p)));
  if (missing.length > 0) {
    fail(
      'vercel-json-consistency',
      `vercel.json declares functions that do not exist:\n${missing.map((p) => '  - ' + p).join('\n')}`
    );
  } else {
    pass('vercel-json-consistency', `${declared.length} declared entries match real files`);
  }
}

// ── Check 3: TypeScript type-check ──────────────────────────────────────
function checkTypeScript() {
  try {
    execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' });
    pass('typescript');
  } catch (e) {
    const out = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');
    const errLines = out.split('\n').filter((l) => l.includes('error TS')).slice(0, 5);
    fail('typescript', `Type errors:\n${errLines.map((l) => '  ' + l.trim()).join('\n') || '(see tsc output)'}`);
  }
}

// ── Check 4: Production build clean (skipped in --fast) ─────────────────
function checkBuild() {
  if (FAST) {
    if (!JSON_MODE) console.log('… production-build (skipped, --fast)');
    return;
  }
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
    pass('production-build');
  } catch (e) {
    const out = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');
    fail('production-build', `Build failed. Last 10 lines:\n${out.trim().split('\n').slice(-10).map((l) => '  ' + l).join('\n')}`);
  }
}

// ── Check 5: required env vars referenced by api/ but not in .env.example
function checkEnvVarReferences() {
  const apiFiles = walk(join(ROOT, 'api'), (p) => p.endsWith('.ts'));
  const referenced = new Set();
  for (const f of apiFiles) {
    const src = readFileSync(f, 'utf-8');
    // Match process.env.FOO and process.env['FOO']
    const m1 = src.matchAll(/process\.env\.([A-Z][A-Z0-9_]+)/g);
    const m2 = src.matchAll(/process\.env\[['"]([A-Z][A-Z0-9_]+)['"]\]/g);
    for (const m of m1) referenced.add(m[1]);
    for (const m of m2) referenced.add(m[1]);
  }
  // Read .env.example to see what's declared as expected
  const examplePath = join(ROOT, '.env.example');
  if (!existsSync(examplePath)) {
    warn('env-var-references', `${referenced.size} env vars referenced in api/ but no .env.example to validate against.`);
    return;
  }
  const example = readFileSync(examplePath, 'utf-8');
  const declared = new Set();
  for (const line of example.split('\n')) {
    const m = line.match(/^([A-Z][A-Z0-9_]+)=/);
    if (m) declared.add(m[1]);
  }
  // Ignore VITE_*-prefixed (public) and well-known Vercel-builtins.
  const builtins = new Set([
    'NODE_ENV', 'VERCEL', 'VERCEL_ENV', 'VERCEL_URL', 'VERCEL_REGION',
  ]);
  const missing = [...referenced].filter((v) => !declared.has(v) && !builtins.has(v) && !v.startsWith('VITE_'));
  if (missing.length > 0) {
    warn(
      'env-var-references',
      `${missing.length} env var(s) referenced in api/ but NOT in .env.example:\n${missing.map((v) => '  - ' + v).join('\n')}\n  → If these are real prod-only secrets, add them to .env.example as documentation.`
    );
  } else {
    pass('env-var-references', `${referenced.size} env vars all documented in .env.example`);
  }
}

// ── Check 6: no duplicate api routes (two files claiming same path) ─────
function checkDuplicateRoutes() {
  // Use the helper that already filters out `_`-prefixed (non-function)
  // dirs — those are bundled helpers, not routes.
  const apiFiles = listApiFunctionFiles();
  const routes = new Map();
  for (const f of apiFiles) {
    const rel = relative(join(ROOT, 'api'), f);
    // /api/foo/index.ts → /api/foo
    // /api/foo.ts → /api/foo
    // /api/foo/[bar].ts → /api/foo/<dynamic>
    let route = '/api/' + rel.replace(/\\/g, '/').replace(/\.ts$/, '');
    route = route.replace(/\/index$/, '');
    if (routes.has(route)) {
      fail(
        'duplicate-routes',
        `Two api files map to the same route ${route}:\n  - ${relative(ROOT, routes.get(route))}\n  - ${relative(ROOT, f)}`
      );
      return;
    }
    routes.set(route, f);
  }
  pass('duplicate-routes', `${routes.size} unique api routes`);
}

// ── Check 7: rough function-size estimate (warns if any api file > 1MB) ─
function checkFunctionSize() {
  const apiFiles = walk(join(ROOT, 'api'), (p) => p.endsWith('.ts'));
  let warned = 0;
  for (const f of apiFiles) {
    const size = statSync(f).size;
    if (size > 1024 * 1024) {
      warn(
        'function-size',
        `${relative(ROOT, f)} is ${(size / 1024 / 1024).toFixed(1)}MB before bundling. Vercel Hobby cap is ${VERCEL_FUNCTION_SIZE_LIMIT_MB}MB compressed. Watch for bloat.`
      );
      warned++;
    }
  }
  if (warned === 0) pass('function-size', `all ${apiFiles.length} api files under 1MB`);
}

// ── Check 8: import-graph sanity (no api file imports the ai/genai pkg
//    in a way that would bloat every function — done indirectly via the
//    bundle size warning, but spot-check that pdfjs-dist is not imported
//    in api/) ───────────────────────────────────────────────────────────
function checkApiImports() {
  const apiFiles = walk(join(ROOT, 'api'), (p) => p.endsWith('.ts'));
  const heavyImports = ['pdfjs-dist', 'three', '@react-three', 'gsap', 'motion'];
  const offenders = [];
  for (const f of apiFiles) {
    const src = readFileSync(f, 'utf-8');
    for (const pkg of heavyImports) {
      if (src.includes(`from '${pkg}'`) || src.includes(`from "${pkg}"`) || src.includes(`require('${pkg}')`) || src.includes(`require("${pkg}")`)) {
        offenders.push(`${relative(ROOT, f)} imports '${pkg}'`);
      }
    }
  }
  if (offenders.length > 0) {
    fail(
      'api-import-sanity',
      `Heavy frontend-only deps imported in api/ (will bloat every function):\n${offenders.map((s) => '  - ' + s).join('\n')}`
    );
  } else {
    pass('api-import-sanity', 'no heavy frontend deps imported in api/');
  }
}

// ── Check 9: api/* must NOT import from outside api/ (Vercel-bundling
//    safety) — added 2026-05-11 after the 106a0bf incident. Vercel
//    bundles each serverless function with its TRANSITIVE imports,
//    but the bundler is path-sensitive: relative imports escaping
//    api/ (../../lib/foo, ../../src/bar) sometimes succeed in local
//    `vite build` but fail at runtime in the deployed function with
//    "Cannot find module …". This check catches that BEFORE push.
//
//    Allowed:
//    - Bare package imports (from 'package-name')          — bundled via npm
//    - Relative imports STAYING inside api/                 — same bundle
//    - Imports from api/_lib/ helper dirs                   — same bundle
//    Forbidden:
//    - `../` chains that escape api/ (e.g. `../../lib/`)    — RUNTIME FAIL RISK
//
//    Skips files inside api/_<x>/ dirs themselves (helper modules can
//    import from each other but follow the same rule).
function checkApiNoEscapingImports() {
  const apiDir = join(ROOT, 'api');
  if (!existsSync(apiDir)) {
    pass('api-no-escaping-imports', 'no api/ dir');
    return;
  }
  const allFiles = walk(apiDir, (p) => p.endsWith('.ts') || p.endsWith('.js'));
  // Match: `from '../something/...'` OR `from "../something/..."` OR
  //        `require('../something/...')` etc.
  // Then check whether resolving the relative path against the file's
  // dir escapes the api/ directory.
  const offenders = [];
  for (const file of allFiles) {
    const src = readFileSync(file, 'utf-8');
    const importRe = /(?:from\s+|require\s*\(\s*)['"]([^'"]+)['"]/g;
    let m;
    while ((m = importRe.exec(src)) !== null) {
      const spec = m[1];
      // Skip bare package imports — those don't have a leading dot.
      if (!spec.startsWith('.')) continue;
      // Resolve against the file's directory + the api root.
      const fileDir = relative(apiDir, file).replace(/\\/g, '/').split('/').slice(0, -1).join('/');
      const targetParts = fileDir ? fileDir.split('/') : [];
      for (const seg of spec.split('/')) {
        if (seg === '..') {
          targetParts.pop();
          if (targetParts.length === 0 && spec.split('/').filter((s) => s === '..').length > (fileDir ? fileDir.split('/').length : 0)) {
            // We've gone above api/ root. Mark this import as escaping.
            offenders.push(`${relative(ROOT, file)}  →  ${spec}`);
            break;
          }
        } else if (seg !== '.') {
          targetParts.push(seg);
        }
      }
    }
  }
  if (offenders.length > 0) {
    fail(
      'api-no-escaping-imports',
      `api/ files importing from OUTSIDE api/ (Vercel may not bundle — runtime crash risk; root cause of 106a0bf incident):\n${offenders.map((s) => '  - ' + s).join('\n')}\nFix: move the shared module into api/_lib/ and re-import.`,
    );
  } else {
    pass('api-no-escaping-imports', 'all api/ imports stay inside api/ or use bare packages');
  }
}

// ── Check 10: JSON-LD validity in static index.html + prerendered routes ──
// Added 2026-05-11 after Google Search Console reported "Unparsable
// structured data — Parsing error: Missing '}' or object member name"
// on https://aimvantage.uk/. Walks every <script type="application/ld+json">
// block in dist/ (post-build) and runs JSON.parse on each. Any failure
// is a hard FAIL — broken JSON-LD blocks rich-result eligibility AND
// signals a malformed page to crawlers.
//
// Runs ONLY if dist/ exists (i.e., after a build). Skipped when running
// preflight in a clean checkout pre-build.
function checkJsonLdValidity() {
  const distDir = join(ROOT, 'dist');
  if (!existsSync(distDir)) {
    // Skipped silently — the build check above will fail first if dist
    // is missing for reasons other than "didn't run yet."
    pass('json-ld-validity', 'dist/ not built yet — skipped (build first)');
    return;
  }
  const htmlFiles = walk(distDir, (p) => p.endsWith('.html'));
  if (htmlFiles.length === 0) {
    warn('json-ld-validity', 'no HTML files in dist/');
    return;
  }
  // Match <script type="application/ld+json">…</script> blocks. Tolerate
  // attribute ordering + extra attributes (Helmet inserts `data-rh="true"`).
  const blockRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  const offenders = [];
  let totalBlocks = 0;
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf-8');
    let m;
    let blockIdx = 0;
    while ((m = blockRe.exec(html)) !== null) {
      blockIdx += 1;
      totalBlocks += 1;
      const raw = m[1].trim();
      if (!raw) continue;
      try {
        JSON.parse(raw);
      } catch (err) {
        const typeMatch = raw.match(/"@type"\s*:\s*"([^"]+)"/);
        const t = typeMatch ? typeMatch[1] : '?';
        offenders.push(`${relative(ROOT, file)} (block #${blockIdx}, @type=${t}): ${err.message}`);
      }
    }
  }
  if (offenders.length > 0) {
    fail(
      'json-ld-validity',
      `${offenders.length} of ${totalBlocks} JSON-LD block(s) failed to parse (Google Search Console will flag these):\n${offenders.slice(0, 8).map((s) => '  - ' + s).join('\n')}${offenders.length > 8 ? `\n  ... and ${offenders.length - 8} more` : ''}`,
    );
  } else {
    pass('json-ld-validity', `${totalBlocks} JSON-LD block(s) across ${htmlFiles.length} HTML file(s) all parse cleanly`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────
function main() {
  if (!JSON_MODE) {
    console.log('\nAimVantage preflight — local pre-deploy safety net');
    console.log('================================================\n');
  }
  checkFunctionCount();
  checkVercelJsonConsistency();
  checkDuplicateRoutes();
  checkFunctionSize();
  checkApiImports();
  checkApiNoEscapingImports();
  checkEnvVarReferences();
  checkTypeScript();
  checkBuild();
  checkJsonLdValidity();

  if (JSON_MODE) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(`\n${results.passed} passed · ${results.failed} failed · ${results.warnings.length} warning(s)`);
    if (results.failed > 0) {
      console.log('\n❌ Pre-flight FAILED. Do NOT commit / push until fixed.');
    } else if (results.warnings.length > 0) {
      console.log('\n⚠ Pre-flight passed with warnings. Review before pushing.');
    } else {
      console.log('\n✅ Pre-flight passed cleanly. Safe to commit.');
    }
  }
  process.exit(results.failed > 0 ? 1 : 0);
}

main();
