#!/usr/bin/env node
/**
 * Hashnode cross-post script (GraphQL).
 *
 * Mirrors blog posts from public/blog/*.md to a Hashnode publication with
 * canonicalUrl set to aimvantage.uk. Hashnode is DA 90, accepts canonical-tagged
 * reposts, and ranks well in Google for tech/career content.
 *
 * Usage:
 *   HASHNODE_TOKEN=... HASHNODE_PUBLICATION_ID=... node scripts/hashnode-crosspost.mjs --dry-run
 *   HASHNODE_TOKEN=... HASHNODE_PUBLICATION_ID=... node scripts/hashnode-crosspost.mjs            # publishes drafts
 *   HASHNODE_TOKEN=... HASHNODE_PUBLICATION_ID=... node scripts/hashnode-crosspost.mjs --slug=foo
 *
 * Get a token: https://hashnode.com/settings/developer  →  "Personal Access Tokens"
 * Get publication id: https://hashnode.com → your blog → query the API with
 *   { publication(host: "yourname.hashnode.dev") { id } }  or  see /settings/general
 *
 * Posts publish in DRAFT mode by default. The Hashnode createDraft mutation
 * gives you a backlink in their editor; you click "Publish" after review.
 *
 * Spec: https://apidocs.hashnode.com/
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const TOKEN = process.env.HASHNODE_TOKEN;
const PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;
const DRY_RUN = process.argv.includes('--dry-run');
const SLUG_FILTER = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];

if ((!TOKEN || !PUBLICATION_ID) && !DRY_RUN) {
  console.error('ERROR: HASHNODE_TOKEN and HASHNODE_PUBLICATION_ID env vars required.');
  console.error('Token: https://hashnode.com/settings/developer');
  console.error('Pub ID: viewable in /settings/general or via GraphQL query');
  console.error('Or pass --dry-run to preview without an API call.');
  process.exit(1);
}

const ENDPOINT = 'https://gql.hashnode.com';
const BLOG_DIR = resolve(ROOT, 'public/blog');

// ---- Frontmatter parser ----------------------------------------------
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

  // Hashnode requires: title, contentMarkdown, slug, tags (objects)
  // tags must match Hashnode's tag taxonomy; we pass plain names and let it map
  const tagSlugs = (Array.isArray(meta.tags) ? meta.tags : [])
    .map((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    .filter((t) => t.length > 0)
    .slice(0, 5);

  posts.push({
    slug,
    title: meta.title || slug,
    contentMarkdown: body.trim(),
    canonicalUrl: meta.canonical || `https://aimvantage.uk/blog/${slug}`,
    description: meta.description || '',
    tagSlugs,
  });
}

if (posts.length === 0) {
  console.error('No posts found.');
  process.exit(1);
}

console.log(`[hashnode] ${posts.length} post(s) ready · mode: ${DRY_RUN ? 'DRY-RUN' : 'DRAFT'}`);

// ---- Submit ----------------------------------------------------------
// The createDraft mutation accepts originalArticleURL for canonical attribution.
const MUTATION = `
mutation CreateDraft($input: CreateDraftInput!) {
  createDraft(input: $input) {
    draft {
      id
      slug
      title
    }
  }
}
`;

let ok = 0;
let fail = 0;

for (const post of posts) {
  if (DRY_RUN) {
    console.log(
      `[dry] would draft "${post.title}" → canonical ${post.canonicalUrl} · tags ${post.tagSlugs.join(',')}`
    );
    ok++;
    continue;
  }

  const input = {
    title: post.title,
    contentMarkdown: post.contentMarkdown,
    publicationId: PUBLICATION_ID,
    slug: post.slug,
    originalArticleURL: post.canonicalUrl,
    subtitle: post.description.slice(0, 250),
    tags: post.tagSlugs.map((slug) => ({ slug, name: slug.replace(/-/g, ' ') })),
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: TOKEN,
      },
      body: JSON.stringify({ query: MUTATION, variables: { input } }),
    });

    const data = await res.json();
    if (data.errors) {
      console.error(`[fail] ${post.slug}: ${data.errors.map((e) => e.message).join('; ')}`);
      fail++;
    } else if (data.data?.createDraft?.draft) {
      const d = data.data.createDraft.draft;
      console.log(`[ok] ${post.slug} → draft ${d.id} (${d.title})`);
      ok++;
    } else {
      console.error(`[fail] ${post.slug}: unexpected response — ${JSON.stringify(data).slice(0, 300)}`);
      fail++;
    }
  } catch (err) {
    console.error(`[error] ${post.slug}: ${err.message}`);
    fail++;
  }

  await new Promise((r) => setTimeout(r, 1500));
}

console.log(`\n[hashnode] done · ${ok} ok · ${fail} fail`);
if (!DRY_RUN && ok > 0) {
  console.log('\nDrafts at https://hashnode.com/draft — review then click Publish.');
}
process.exit(fail > 0 ? 1 : 0);
