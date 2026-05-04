#!/usr/bin/env node
/**
 * DEV.to cross-post script.
 *
 * Mirrors blog posts from public/blog/*.md to DEV.to with canonical_url
 * pointing back to aimvantage.uk. Real backlinks from a DA-90 domain;
 * Google treats them as legitimate because canonical is set correctly.
 *
 * Usage:
 *   DEV_API_TOKEN=your_token node scripts/devto-crosspost.mjs              # publishes all
 *   DEV_API_TOKEN=your_token node scripts/devto-crosspost.mjs --dry-run   # preview only
 *   DEV_API_TOKEN=your_token node scripts/devto-crosspost.mjs --slug=foo  # single post
 *
 * Get a token: https://dev.to/settings/extensions  →  "DEV Community API Keys"
 *
 * Posts are published in DRAFT mode by default so you review them on DEV.to
 * before going live. Set --publish to publish immediately.
 *
 * Spec: https://developers.forem.com/api/v1#tag/articles
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const TOKEN = process.env.DEV_API_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const PUBLISH = process.argv.includes('--publish');
const SLUG_FILTER = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];

if (!TOKEN && !DRY_RUN) {
  console.error('ERROR: DEV_API_TOKEN environment variable required.');
  console.error('Get one at https://dev.to/settings/extensions');
  console.error('Or pass --dry-run to preview without an API call.');
  process.exit(1);
}

const ENDPOINT = 'https://dev.to/api/articles';
const BLOG_DIR = resolve(ROOT, 'public/blog');

// ---- Frontmatter parser (no yaml dep) ---------------------------------
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!m) continue;
    let [, key, value] = m;
    value = value.trim();
    // Quoted strings
    if (/^".*"$/.test(value)) value = value.slice(1, -1);
    // Arrays like ["foo", "bar"]
    if (/^\[.*\]$/.test(value)) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''));
    }
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

// ---- Collect posts ---------------------------------------------------
const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
const posts = [];
for (const file of files) {
  const slug = basename(file, '.md');
  if (SLUG_FILTER && slug !== SLUG_FILTER) continue;
  const raw = readFileSync(resolve(BLOG_DIR, file), 'utf-8');
  const { meta, body } = parseFrontmatter(raw);

  // DEV.to expects: title, body_markdown, published, canonical_url, tags, description
  // Tags must be lowercase, alphanumeric, max 4 tags
  const tags = (Array.isArray(meta.tags) ? meta.tags : [])
    .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter((t) => t.length > 0)
    .slice(0, 4);

  posts.push({
    slug,
    article: {
      title: meta.title || slug,
      body_markdown: body.trim(),
      published: PUBLISH,
      canonical_url:
        meta.canonical || `https://aimvantage.uk/blog/${slug}`,
      description: meta.description || '',
      tags,
    },
  });
}

if (posts.length === 0) {
  console.error('No posts found.');
  process.exit(1);
}

console.log(
  `[devto] ${posts.length} post(s) ready · mode: ${
    DRY_RUN ? 'DRY-RUN' : PUBLISH ? 'LIVE PUBLISH' : 'DRAFT'
  }`
);

// ---- Submit ---------------------------------------------------------
let ok = 0;
let fail = 0;
const results = [];

for (const post of posts) {
  if (DRY_RUN) {
    console.log(
      `[dry] would post "${post.article.title}" → canonical ${post.article.canonical_url} · tags ${post.article.tags.join(',')}`
    );
    ok++;
    continue;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': TOKEN,
        'User-Agent': 'aimvantage-crosspost/1.0',
        Accept: 'application/vnd.forem.api-v1+json',
      },
      body: JSON.stringify({ article: post.article }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      console.log(
        `[ok] ${post.slug} → ${data.url || data.canonical_url || '(see DEV.to dashboard)'}`
      );
      results.push({ slug: post.slug, url: data.url, status: 'ok' });
      ok++;
    } else {
      console.error(
        `[fail] ${post.slug} HTTP ${res.status}: ${
          data.error || JSON.stringify(data).slice(0, 300)
        }`
      );
      results.push({ slug: post.slug, status: 'fail', error: data.error });
      fail++;
    }
  } catch (err) {
    console.error(`[error] ${post.slug}: ${err.message}`);
    fail++;
  }

  // DEV.to rate-limits at 30 req/30sec. 2-second pause is conservative.
  await new Promise((r) => setTimeout(r, 2000));
}

console.log(`\n[devto] done · ${ok} ok · ${fail} fail`);
if (!DRY_RUN && results.length) {
  console.log('\nDrafts are at https://dev.to/dashboard — review then click Publish.');
}
process.exit(fail > 0 ? 1 : 0);
