#!/usr/bin/env node
/**
 * publish-everything.mjs — one-command publish flow for Gio.
 *
 * What it does, in order:
 *   1. Reads all 12 blog posts from public/blog/*.md
 *   2. For each, ensures a DEV.to article exists and is PUBLISHED
 *      - if a draft already exists with that canonical → publishes the draft
 *      - if no article exists yet → creates a new published article
 *   3. Same for Hashnode (via GraphQL)
 *   4. Pings IndexNow with the full URL list
 *   5. Prints a final summary table
 *
 * Run:
 *   node --env-file=.env scripts/publish-everything.mjs
 *
 * Required env vars: DEV_API_TOKEN, HASHNODE_TOKEN, HASHNODE_PUBLICATION_ID
 *
 * Safety: 3-second pause between every API call to stay well below platform
 * rate limits. A burst of 24 publishes spread over ~2 minutes is well within
 * normal usage and does not trigger spam detection on either platform.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DEV_TOKEN = process.env.DEV_API_TOKEN;
const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;
const HASHNODE_PUB_ID = process.env.HASHNODE_PUBLICATION_ID;

if (!DEV_TOKEN || !HASHNODE_TOKEN || !HASHNODE_PUB_ID) {
  console.error('ERROR: missing one of DEV_API_TOKEN, HASHNODE_TOKEN, HASHNODE_PUBLICATION_ID.');
  console.error('Set them in .env then run with: node --env-file=.env scripts/publish-everything.mjs');
  process.exit(1);
}

const PAUSE_MS = 3000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ───────────────────────────────────────────────────────────────────────
// 1. Collect blog posts
// ───────────────────────────────────────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!m) continue;
    let [, key, value] = m;
    value = value.trim();
    if (/^".*"$/.test(value)) value = value.slice(1, -1);
    if (/^\[.*\]$/.test(value)) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
    }
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

const BLOG_DIR = resolve(ROOT, 'public/blog');
const posts = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const slug = basename(file, '.md');
    const raw = readFileSync(resolve(BLOG_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);
    const tags = (Array.isArray(meta.tags) ? meta.tags : []);
    return {
      slug,
      title: meta.title || slug,
      bodyMarkdown: body.trim(),
      description: meta.description || '',
      canonical: meta.canonical || `https://aimvantage.uk/blog/${slug}`,
      // DEV.to: lowercase alphanumeric, max 4
      devTags: tags.map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean).slice(0, 4),
      // Hashnode: lowercase, hyphenated, max 5
      hashnodeTagSlugs: tags.map((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).filter(Boolean).slice(0, 5),
    };
  });

console.log(`\n[publish] Found ${posts.length} posts in public/blog/\n`);

const results = { devto: [], hashnode: [] };

// ───────────────────────────────────────────────────────────────────────
// 2. DEV.to: list existing articles, publish drafts, create+publish new
// ───────────────────────────────────────────────────────────────────────
async function devtoListUnpublished() {
  // Page through up to 200 unpublished articles
  const all = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://dev.to/api/articles/me/unpublished?per_page=50&page=${page}`, {
      headers: { 'api-key': DEV_TOKEN, Accept: 'application/vnd.forem.api-v1+json' },
    });
    if (!res.ok) {
      console.error(`[devto] list-unpublished failed: ${res.status}`);
      break;
    }
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) break;
    all.push(...arr);
    if (arr.length < 50) break;
  }
  return all;
}

async function devtoListPublished() {
  // We need this so we don't double-create posts already live
  const all = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://dev.to/api/articles/me/published?per_page=50&page=${page}`, {
      headers: { 'api-key': DEV_TOKEN, Accept: 'application/vnd.forem.api-v1+json' },
    });
    if (!res.ok) break;
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) break;
    all.push(...arr);
    if (arr.length < 50) break;
  }
  return all;
}

async function devtoPublishExisting(id, post) {
  const res = await fetch(`https://dev.to/api/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'api-key': DEV_TOKEN,
      Accept: 'application/vnd.forem.api-v1+json',
    },
    body: JSON.stringify({
      article: {
        published: true,
        canonical_url: post.canonical,
      },
    }),
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

async function devtoCreatePublished(post) {
  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': DEV_TOKEN,
      Accept: 'application/vnd.forem.api-v1+json',
    },
    body: JSON.stringify({
      article: {
        title: post.title,
        body_markdown: post.bodyMarkdown,
        published: true,
        canonical_url: post.canonical,
        description: post.description,
        tags: post.devTags,
      },
    }),
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

console.log('[devto] Reading existing articles…');
const [devUnpub, devPub] = await Promise.all([devtoListUnpublished(), devtoListPublished()]);
console.log(`[devto] ${devUnpub.length} drafts, ${devPub.length} already published`);

const matchByCanonical = (arr, canonical) =>
  arr.find((a) => a.canonical_url === canonical) ||
  arr.find((a) => (a.url || '').includes(canonical.replace('https://aimvantage.uk/blog/', '')));

for (const post of posts) {
  // Already live? Skip.
  const liveMatch = matchByCanonical(devPub, post.canonical);
  if (liveMatch) {
    console.log(`[devto] [live]  ${post.slug} → ${liveMatch.url}`);
    results.devto.push({ slug: post.slug, status: 'already-live', url: liveMatch.url });
    continue;
  }
  // Has a draft? Publish it.
  const draftMatch = matchByCanonical(devUnpub, post.canonical);
  if (draftMatch) {
    process.stdout.write(`[devto] [pub]  ${post.slug} → publishing draft #${draftMatch.id}… `);
    const r = await devtoPublishExisting(draftMatch.id, post);
    if (r.ok) {
      console.log(`OK (${r.data.url || 'see dashboard'})`);
      results.devto.push({ slug: post.slug, status: 'published-draft', url: r.data.url });
    } else {
      console.log(`FAIL ${r.status}`);
      results.devto.push({ slug: post.slug, status: 'fail', error: r.data?.error });
    }
    await sleep(PAUSE_MS);
    continue;
  }
  // No draft, no live? Create as published.
  process.stdout.write(`[devto] [new]  ${post.slug} → creating published… `);
  const r = await devtoCreatePublished(post);
  if (r.ok) {
    console.log(`OK (${r.data.url || 'see dashboard'})`);
    results.devto.push({ slug: post.slug, status: 'created-published', url: r.data.url });
  } else {
    console.log(`FAIL ${r.status} — ${r.data?.error || ''}`);
    results.devto.push({ slug: post.slug, status: 'fail', error: r.data?.error });
  }
  await sleep(PAUSE_MS);
}

// ───────────────────────────────────────────────────────────────────────
// 3. Hashnode: list drafts, publish each. Create+publish new.
// ───────────────────────────────────────────────────────────────────────
const HN = 'https://gql.hashnode.com';

async function hashnodeQuery(query, variables) {
  const res = await fetch(HN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: HASHNODE_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  return { ok: !data.errors, data, errors: data.errors };
}

const LIST_DRAFTS = `
query Drafts($pubId: ObjectId!) {
  publication(id: $pubId) {
    drafts(first: 50) {
      edges { node { id title canonicalUrl } }
    }
    posts(first: 50) {
      edges { node { id title canonicalUrl url } }
    }
  }
}`;

const PUBLISH_DRAFT = `
mutation PublishDraft($input: PublishDraftInput!) {
  publishDraft(input: $input) {
    post { id slug url title }
  }
}`;

const PUBLISH_NEW = `
mutation PublishPost($input: PublishPostInput!) {
  publishPost(input: $input) {
    post { id slug url title }
  }
}`;

console.log('\n[hashnode] Reading existing drafts + posts…');
const listRes = await hashnodeQuery(LIST_DRAFTS, { pubId: HASHNODE_PUB_ID });
if (!listRes.ok) {
  console.error('[hashnode] could not list drafts/posts:', JSON.stringify(listRes.errors).slice(0, 300));
  process.exit(2);
}
const hnDrafts = listRes.data.data?.publication?.drafts?.edges?.map((e) => e.node) || [];
const hnLive = listRes.data.data?.publication?.posts?.edges?.map((e) => e.node) || [];
console.log(`[hashnode] ${hnDrafts.length} drafts, ${hnLive.length} already published`);

for (const post of posts) {
  // Already live?
  const live = hnLive.find((p) => p.canonicalUrl === post.canonical || p.title === post.title);
  if (live) {
    console.log(`[hashnode] [live]  ${post.slug} → ${live.url}`);
    results.hashnode.push({ slug: post.slug, status: 'already-live', url: live.url });
    continue;
  }
  // Existing draft?
  const draft = hnDrafts.find((d) => d.canonicalUrl === post.canonical || d.title === post.title);
  if (draft) {
    process.stdout.write(`[hashnode] [pub]  ${post.slug} → publishing draft ${draft.id}… `);
    const r = await hashnodeQuery(PUBLISH_DRAFT, { input: { draftId: draft.id } });
    if (r.ok) {
      const p = r.data.data?.publishDraft?.post;
      console.log(`OK (${p?.url || 'see dashboard'})`);
      results.hashnode.push({ slug: post.slug, status: 'published-draft', url: p?.url });
    } else {
      console.log(`FAIL — ${JSON.stringify(r.errors).slice(0, 150)}`);
      results.hashnode.push({ slug: post.slug, status: 'fail', error: r.errors });
    }
    await sleep(PAUSE_MS);
    continue;
  }
  // Create + publish new
  process.stdout.write(`[hashnode] [new]  ${post.slug} → publishing fresh… `);
  const tags = post.hashnodeTagSlugs.map((slug) => ({ slug, name: slug.replace(/-/g, ' ') }));
  const r = await hashnodeQuery(PUBLISH_NEW, {
    input: {
      title: post.title,
      contentMarkdown: post.bodyMarkdown,
      publicationId: HASHNODE_PUB_ID,
      slug: post.slug,
      originalArticleURL: post.canonical,
      subtitle: post.description.slice(0, 250),
      tags,
    },
  });
  if (r.ok) {
    const p = r.data.data?.publishPost?.post;
    console.log(`OK (${p?.url || 'see dashboard'})`);
    results.hashnode.push({ slug: post.slug, status: 'created-published', url: p?.url });
  } else {
    console.log(`FAIL — ${JSON.stringify(r.errors).slice(0, 150)}`);
    results.hashnode.push({ slug: post.slug, status: 'fail', error: r.errors });
  }
  await sleep(PAUSE_MS);
}

// ───────────────────────────────────────────────────────────────────────
// 4. IndexNow ping
// ───────────────────────────────────────────────────────────────────────
console.log('\n[indexnow] pinging…');
try {
  const { execSync } = await import('node:child_process');
  execSync(`node "${resolve(__dirname, 'indexnow-ping.mjs')}"`, { stdio: 'inherit' });
} catch (e) {
  console.error('[indexnow] ping failed (non-fatal):', e.message);
}

// ───────────────────────────────────────────────────────────────────────
// 5. Final summary
// ───────────────────────────────────────────────────────────────────────
const summary = (label, arr) => {
  const counts = arr.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  return `${label}: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}`;
};

console.log('\n┌──────────────────── SUMMARY ────────────────────┐');
console.log(`│  ${summary('DEV.to    ', results.devto)}`);
console.log(`│  ${summary('Hashnode  ', results.hashnode)}`);
console.log('└─────────────────────────────────────────────────┘');
console.log('\nLive URLs to check:');
[...results.devto, ...results.hashnode].filter((r) => r.url).forEach((r) => {
  console.log(`  • ${r.slug.slice(0, 50).padEnd(50)} → ${r.url}`);
});

const failures = [...results.devto, ...results.hashnode].filter((r) => r.status === 'fail');
if (failures.length) {
  console.log(`\n⚠  ${failures.length} failures. Re-run script — already-live posts will be skipped.`);
  process.exit(1);
}
console.log('\n✓ All done.\n');
