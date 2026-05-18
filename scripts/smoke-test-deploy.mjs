#!/usr/bin/env node
/**
 * Post-deploy smoke test for AimVantage.
 *
 * Why this exists: on 2026-05-15 we shipped Sentry instrumentation that
 * crashed every paid API endpoint with ERR_MODULE_NOT_FOUND. Vercel marked
 * the deploy "Ready" because TS compiled fine. The crash only happened at
 * request time. We had ZERO automated detection — the bug went live for
 * 2 days until a real user (the founder, demoing to a friend) hit it.
 *
 * This script catches that class of bug in seconds. Hits every critical
 * API endpoint (11 of them) with a sanity request and asserts the response
 * is JSON with the expected HTTP status. If anything returns HTML or
 * unexpected status, the script exits 1.
 *
 * USAGE:
 *   node scripts/smoke-test-deploy.mjs                 # default: prod
 *   node scripts/smoke-test-deploy.mjs --url https://aimvantage-xyz.vercel.app
 *   npm run smoke                                      # alias
 *   npm run smoke:preview -- --url <preview-url>       # against a preview
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed (script prints which)
 *   2 — bad CLI args / network unreachable
 *
 * Designed for:
 *   - manual run after a `git push` while waiting for Vercel to deploy
 *   - cron / GitHub Action triggered by Vercel `deployment.succeeded` webhook
 *   - included in BACKLOG / SESSION ledger as the canonical "is the deploy
 *     actually serving requests" answer
 *
 * Author: Claude, post-2026-05-15-Sentry-outage retrospective.
 */

import process from 'node:process';

// -----------------------------------------------------------------------------
// CLI args
// -----------------------------------------------------------------------------

const args = process.argv.slice(2);
let baseUrl = 'https://aimvantage.uk';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && args[i + 1]) {
    baseUrl = args[i + 1].replace(/\/$/, '');
    i++;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(
      'smoke-test-deploy — verify every critical endpoint returns valid JSON\n\n' +
        'Usage:\n' +
        '  node scripts/smoke-test-deploy.mjs [--url <baseUrl>]\n\n' +
        'Defaults: --url https://aimvantage.uk',
    );
    process.exit(0);
  }
}

// -----------------------------------------------------------------------------
// Test plan
// -----------------------------------------------------------------------------

/** @typedef {{
 *    path: string;
 *    method?: 'GET' | 'POST' | 'HEAD' | 'OPTIONS';
 *    body?: any;
 *    expectStatus: number[];
 *    expectJsonShape?: (obj: any) => string | null;
 *    note?: string;
 *  }} Check
 */

/** @type {Check[]} */
const checks = [
  {
    path: '/api/health',
    method: 'GET',
    expectStatus: [200],
    expectJsonShape: (b) => (b?.status === 'ok' ? null : `status field should be 'ok', got ${JSON.stringify(b?.status)}`),
    note: 'Minimal liveness probe — must always be 200 ok',
  },
  {
    path: '/api/health-deep',
    method: 'GET',
    expectStatus: [200],
    expectJsonShape: (b) => {
      if (b?.status !== 'ok' && b?.status !== 'degraded') return `expected status 'ok' or 'degraded', got ${JSON.stringify(b?.status)}`;
      if (!Array.isArray(b?.probes)) return `expected probes array, got ${typeof b?.probes}`;
      return null;
    },
    note: 'Multi-probe operational status',
  },
  {
    path: '/api/analyze',
    method: 'GET',
    expectStatus: [401, 405],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'Paid endpoint, must reject GET — catches ERR_MODULE_NOT_FOUND class',
  },
  {
    path: '/api/interview/jobsearch',
    method: 'GET',
    expectStatus: [401, 405],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'AI Job Search endpoint — caught the 2026-05-15 Sentry-import outage',
  },
  {
    path: '/api/rewrite-tone',
    method: 'GET',
    expectStatus: [401, 405],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'Cover-letter tone-switch endpoint',
  },
  {
    path: '/api/stripe/webhook',
    method: 'GET',
    expectStatus: [400, 405],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'Stripe webhook — would crash silently if Sentry bundling regresses',
  },
  {
    path: '/api/stripe/checkout',
    method: 'GET',
    expectStatus: [401, 405],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'Stripe checkout creation — would block all paid signups if broken',
  },
  {
    path: '/api/delete-account',
    method: 'GET',
    expectStatus: [401, 405],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'GDPR self-serve deletion endpoint — must return JSON 401/405 on GET, not crash with ERR_MODULE_NOT_FOUND',
  },
  {
    path: '/api/user?endpoint=credits',
    method: 'GET',
    expectStatus: [401],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'User multiplexer — credits action',
  },
  {
    path: '/api/waitlist',
    method: 'GET',
    expectStatus: [200, 405],
    note: 'Waitlist endpoint',
  },
  {
    path: '/api/roast',
    method: 'GET',
    expectStatus: [405],
    expectJsonShape: (b) => (typeof b?.error === 'string' ? null : `expected JSON error field, got ${JSON.stringify(b)}`),
    note: 'Public roast tool — has 7-layer abuse defense, must return JSON',
  },
];

// -----------------------------------------------------------------------------
// Runner
// -----------------------------------------------------------------------------

const FETCH_TIMEOUT_MS = 15_000;

/** @returns {Promise<{ok: boolean; status: number; contentType: string; body: any; rawText?: string; networkError?: string}>} */
async function probe(check) {
  const url = `${baseUrl}${check.path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: check.method || 'GET',
      headers: { 'User-Agent': 'aimvantage-smoke-test/1.0' },
      body: check.body ? JSON.stringify(check.body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);
    const contentType = res.headers.get('content-type') || '';
    const rawText = await res.text();
    let body = null;
    if (contentType.includes('application/json') && rawText) {
      try {
        body = JSON.parse(rawText);
      } catch {
        return { ok: false, status: res.status, contentType, body: null, rawText: rawText.slice(0, 300) };
      }
    }
    return { ok: true, status: res.status, contentType, body, rawText };
  } catch (err) {
    clearTimeout(timer);
    return {
      ok: false,
      status: 0,
      contentType: '',
      body: null,
      networkError: err?.name === 'AbortError' ? 'timeout' : String(err?.message || err),
    };
  }
}

/** @returns {Promise<{path: string; pass: boolean; reason: string; status: number; contentType: string}>} */
async function runCheck(check) {
  const r = await probe(check);
  if (r.networkError) {
    return { path: check.path, pass: false, reason: `network: ${r.networkError}`, status: 0, contentType: '' };
  }
  if (!r.ok) {
    return { path: check.path, pass: false, reason: `body not JSON despite content-type ${r.contentType}: ${r.rawText?.slice(0, 100)}`, status: r.status, contentType: r.contentType };
  }
  if (!check.expectStatus.includes(r.status)) {
    // Special-case: HTML body on unexpected status = the failure mode we
    // really care about (ERR_MODULE_NOT_FOUND etc.). Surface it loudly.
    const looksLikeHtml = r.rawText?.trimStart().startsWith('<') || r.contentType.includes('text/html');
    const reason = looksLikeHtml
      ? `status ${r.status} (expected ${check.expectStatus.join('/')}) AND body is HTML — function likely crashed pre-handler. Body sample: ${r.rawText?.slice(0, 120)}`
      : `status ${r.status} (expected ${check.expectStatus.join('/')})`;
    return { path: check.path, pass: false, reason, status: r.status, contentType: r.contentType };
  }
  if (!r.contentType.includes('application/json')) {
    return { path: check.path, pass: false, reason: `content-type was '${r.contentType}', expected application/json`, status: r.status, contentType: r.contentType };
  }
  if (check.expectJsonShape) {
    const shapeErr = check.expectJsonShape(r.body);
    if (shapeErr) {
      return { path: check.path, pass: false, reason: `shape mismatch: ${shapeErr}`, status: r.status, contentType: r.contentType };
    }
  }
  return { path: check.path, pass: true, reason: 'ok', status: r.status, contentType: r.contentType };
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

(async () => {
  console.log(`smoke-test-deploy → ${baseUrl}\n`);
  console.log(`Running ${checks.length} checks (timeout ${FETCH_TIMEOUT_MS}ms per probe)...\n`);
  const started = Date.now();
  const results = [];
  for (const check of checks) {
    const r = await runCheck(check);
    results.push({ ...r, note: check.note });
    const icon = r.pass ? '✓' : '✗';
    const tag = r.pass ? 'PASS' : 'FAIL';
    console.log(`${icon} ${tag.padEnd(4)} ${String(r.status).padStart(3)}  ${r.path.padEnd(34)}  ${r.pass ? '' : `→ ${r.reason}`}`);
  }
  const elapsed = Date.now() - started;
  const pass = results.filter((r) => r.pass).length;
  const fail = results.length - pass;
  console.log(`\n${pass}/${results.length} passed in ${elapsed}ms`);
  if (fail > 0) {
    console.log(`\n${fail} FAILED — deploy is broken or partially broken. Investigate immediately:`);
    for (const r of results.filter((x) => !x.pass)) {
      console.log(`  • ${r.path}: ${r.reason}`);
      if (r.note) console.log(`    (${r.note})`);
    }
    process.exit(1);
  }
  console.log('All checks passed. Deploy is healthy.');
  process.exit(0);
})().catch((err) => {
  console.error('smoke-test-deploy crashed:', err);
  process.exit(2);
});
