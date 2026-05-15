#!/usr/bin/env node
/**
 * V5 — sustainable weekly content engine.
 *
 * Generates a new blog post stub in src/data/blogPosts.ts + an open
 * checklist of source material to use, enforcing the V8 non-commodity
 * title formula and a structure Google has been rewarding since 2024.
 *
 * Run weekly:
 *   node scripts/new-blog-post.mjs "I sat behind a recruiter for 80 CV scans"
 *
 * Or interactively (no arg):
 *   node scripts/new-blog-post.mjs
 *
 * What this script does:
 *   1. Asks for a non-commodity title (or accepts as arg)
 *   2. Validates the title against the commodity-shape blocklist
 *   3. Asks for the source material: one git-log entry, one user signal,
 *      one piece of data, one specific moment
 *   4. Writes a draft skeleton to src/data/blogPosts.ts
 *   5. Reminds you of the V8 + V5 rules in the file header
 *
 * It does NOT auto-publish. The output is a draft you finish writing,
 * tsc-check, and commit yourself. Speed-over-specificity content is
 * what the GOSPEL says kills domains. This template forces specificity.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_FILE = resolve(ROOT, 'src/data/blogPosts.ts');

// V8 commodity-shape blocklist — patterns Google has been demoting since 2024.
const COMMODITY_PATTERNS = [
  { re: /^top\s+\d+\b/i, name: 'Top-N listicle' },
  { re: /^\d+\s+(things|ways|tips|reasons|tricks|hacks|mistakes)\b/i, name: 'N-things listicle' },
  { re: /^the\s+\d+\s+(things|ways|tips|reasons|tricks|hacks|mistakes)\b/i, name: 'The-N-things listicle' },
  { re: /^best\s+\d+\b/i, name: 'Best-N listicle' },
  { re: /^how\s+to\s+/i, name: 'How-to commodity (rewrite as first-person experience)' },
  { re: /^why\s+(you|your)\s+/i, name: 'Why-you commodity (rewrite as first-person)' },
  { re: /\bultimate\s+guide\b/i, name: 'Ultimate guide (commodity)' },
  { re: /\bcomplete\s+guide\b/i, name: 'Complete guide (commodity)' },
  { re: /\beverything\s+you\s+need\s+to\s+know\b/i, name: 'Everything-you-need-to-know (commodity)' },
];

function checkCommodityShape(title) {
  const hits = COMMODITY_PATTERNS.filter((p) => p.re.test(title));
  return hits;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function escapeForTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function ask(prompt) {
  const rl = createInterface({ input, output });
  const answer = await rl.question(prompt);
  rl.close();
  return answer.trim();
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function buildEntry({
  slug,
  title,
  description,
  hook,
  excerpt,
  publishedAt,
  realStorySource,
  concreteData,
  specificMoment,
  gitLogReference,
  userSignal,
}) {
  // Author and tags get sensible defaults; the user fills in the rest.
  return `
  // === DRAFT — written ${todayISO()} from V5 weekly content engine. Replace TODOs before publishing. ===
  {
    slug: '${escapeForTs(slug)}',
    title: '${escapeForTs(title)}',
    description: '${escapeForTs(description)}',
    publishedAt: '${publishedAt}',
    author: 'Gio',
    readingTime: '6 min read',
    tags: ['TODO-tag-1', 'TODO-tag-2'],
    excerpt: '${escapeForTs(excerpt)}',
    hook: '${escapeForTs(hook)}',
    sections: [
      { type: 'p', text: '${escapeForTs(realStorySource || 'TODO: Open with the specific moment that made you write this. One sentence. Real, dated, named.')}' },
      { type: 'p', text: 'TODO: Second paragraph that earns the title. Keep it concrete — no abstract scene-setting.' },

      { type: 'callout', text: 'Quick answer: TODO: one-line summary the impatient reader keeps if they bounce now.' },

      { type: 'h2', text: 'TODO: First section heading — phrased as the reader question.' },
      { type: 'p', text: '${escapeForTs(concreteData || 'TODO: ONE concrete number or measurement here. No round-number guesses. If you do not have it, do not write the post yet.')}' },

      { type: 'h2', text: 'TODO: Second section heading.' },
      { type: 'p', text: '${escapeForTs(specificMoment || 'TODO: The moment in your work that surfaced this insight. Not theoretical. Real.')}' },
      ${userSignal ? `{ type: 'callout', text: '${escapeForTs(userSignal)}' },` : `// TODO: optional callout with a user-signal datapoint`}

      { type: 'h2', text: 'TODO: What to do about it.' },
      { type: 'ol', items: [
        'TODO: Concrete step 1.',
        'TODO: Concrete step 2.',
        'TODO: Concrete step 3.',
      ] },

      { type: 'h2', text: 'How AimVantage handles this' },
      { type: 'p', text: 'TODO: 2-3 sentences max. The point is the post, not the upsell. Link to /register or a specific tool.' },
    ],
  },

  // V5 source material checklist used to write the draft above (delete before commit):
  //   git log reference: ${gitLogReference || '[NONE — please add]'}
  //   user signal: ${userSignal || '[NONE — please add]'}
  //   concrete data point: ${concreteData || '[NONE — please add]'}
  //   specific moment: ${specificMoment || '[NONE — please add]'}
`;
}

async function main() {
  console.log('\n=== V5 weekly content engine ===\n');

  // Title intake — argv first, prompt second.
  let title = process.argv.slice(2).join(' ').trim();
  if (!title) {
    title = await ask('Non-commodity title (concrete, first-person OR specific data): ');
  }
  if (!title) {
    console.error('No title provided. Aborting.');
    process.exit(1);
  }

  const hits = checkCommodityShape(title);
  if (hits.length > 0) {
    console.error('\n❌ Commodity-shape title detected — Google demotes these.');
    for (const h of hits) console.error(`   • ${h.name}`);
    console.error('\nRewrite: lead with first-person experience, a specific dated source, or a concrete number.');
    console.error('Examples in src/data/blogPosts.ts:');
    console.error('  - "I sat behind a recruiter for 80 CV scans. She rejected 71 in 30 seconds each."');
    console.error('  - "42,000 tech workers got laid off last month. Here is the fix-list before you start applying."');
    process.exit(2);
  }

  console.log('\n✅ Title shape OK.\n');

  const description = await ask('1-sentence description (used in <meta description> + og — ≤160 chars): ');
  const excerpt = description ? `${description}` : '';
  const hook = await ask('Inline hook (a sharper one-liner shown above the article body): ');

  console.log('\n--- Source material (V5 rule: every weekly post must cite at least 2 of these) ---');
  const gitLogReference = await ask('git-log reference (a real commit, dated change, shipped feature): ');
  const userSignal = await ask('User signal (Discord question, support email, GSC query — quote it): ');
  const concreteData = await ask('Concrete data point (one specific number — your own usage data, public stat, etc.): ');
  const specificMoment = await ask('Specific moment that triggered this post (one real scene, dated): ');
  const realStorySource = specificMoment;

  // Enforce the rule: at least 2 source-material fields filled.
  const filled = [gitLogReference, userSignal, concreteData, specificMoment].filter((s) => s).length;
  if (filled < 2) {
    console.error('\n❌ V5 rule failure: every weekly post must cite at least 2 source-material fields.');
    console.error(`   You filled ${filled}/4. Open the dev tools log, support inbox, GSC report, or your own usage data and try again.`);
    console.error('   The point of V5 is to prevent commodity content. Going to abort rather than ship empty.');
    process.exit(3);
  }

  const slug = slugify(title);
  const publishedAt = todayISO();

  const entry = buildEntry({
    slug, title, description, hook, excerpt, publishedAt,
    realStorySource, concreteData, specificMoment, gitLogReference, userSignal,
  });

  // Insert before the closing `];` of blogPosts array.
  const file = await readFile(BLOG_FILE, 'utf8');
  const closingMarker = '];';
  const lastIdx = file.lastIndexOf(closingMarker);
  if (lastIdx === -1) {
    console.error('Could not find blogPosts array end marker. Aborting.');
    process.exit(4);
  }
  const newFile = file.slice(0, lastIdx) + entry + '\n' + file.slice(lastIdx);
  await writeFile(BLOG_FILE, newFile, 'utf8');

  console.log(`\n✅ Draft inserted into ${BLOG_FILE}.`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Date: ${publishedAt}`);
  console.log(`\nNext steps:`);
  console.log(`   1. Open ${BLOG_FILE}, find the DRAFT marker, fill in TODOs.`);
  console.log(`   2. Run: npx tsc --noEmit && npm run build`);
  console.log(`   3. Commit with: git commit -m "blog: <title>"`);
  console.log(`   4. Push. Sitemap rebuilds automatically.`);
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(99);
});
