#!/usr/bin/env node
/**
 * Auto-regenerates sitemap-blog.xml, sitemap-roles.xml, and rss.xml from the
 * source-of-truth data files (src/data/blogPosts.ts, src/data/interviewQuestions.ts).
 *
 * Run automatically as `prebuild` so the feeds are always in sync with the data.
 *
 * What this replaces: the manual step of editing 3 XML files every time you add
 * a blog post or role pack. Now you just add to the .ts data file and run build.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const HOST = 'https://vantage-livid.vercel.app';

// ---------- Parsers (regex over .ts source — no TS compiler needed) ----------

function parseBlogPosts() {
  const src = readFileSync(resolve(ROOT, 'src/data/blogPosts.ts'), 'utf-8');
  // Match every blog post object's slug + publishedAt + title + description fields
  const posts = [];
  const re = /\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']+(?:\\'[^']*)*)',\s*description:\s*'([^']+(?:\\'[^']*)*)',\s*publishedAt:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    posts.push({
      slug: m[1],
      title: m[2].replace(/\\'/g, "'"),
      description: m[3].replace(/\\'/g, "'"),
      publishedAt: m[4],
    });
  }
  return posts;
}

function parseRolePacks() {
  const src = readFileSync(resolve(ROOT, 'src/data/interviewQuestions.ts'), 'utf-8');
  const packs = [];
  const re = /\{\s*slug:\s*'([^']+)',\s*role:\s*'([^']+)',\s*updated:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    packs.push({ slug: m[1], role: m[2], updated: m[3] });
  }
  return packs;
}

// ---------- Writers ----------

function urlEntry(loc, lastmod, priority, changefreq) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function writeBlogSitemap(posts) {
  const sortedDate = posts.map((p) => p.publishedAt).sort().reverse()[0] ?? '2026-04-25';
  const entries = [
    urlEntry(`${HOST}/blog`, sortedDate, '0.9', 'weekly'),
    ...posts
      .slice()
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map((p) => urlEntry(`${HOST}/blog/${p.slug}`, p.publishedAt, '0.8', 'monthly')),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
  writeFileSync(resolve(ROOT, 'public/sitemap-blog.xml'), xml);
  return entries.length;
}

function writeRolesSitemap(packs) {
  const latest = packs.map((p) => p.updated).sort().reverse()[0] ?? '2026-04-25';
  const entries = [
    urlEntry(`${HOST}/interview-questions`, latest, '0.9', 'weekly'),
    ...packs.map((p) => urlEntry(`${HOST}/interview-questions/${p.slug}`, p.updated, '0.8', 'monthly')),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
  writeFileSync(resolve(ROOT, 'public/sitemap-roles.xml'), xml);
  return entries.length;
}

function rfc822(iso) {
  // 2026-04-25 -> Sat, 25 Apr 2026 00:00:00 +0000
  return new Date(iso).toUTCString().replace('GMT', '+0000');
}

function writeRss(posts) {
  const sorted = posts.slice().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const lastBuild = sorted[0]?.publishedAt ?? '2026-04-25';

  const items = sorted
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${HOST}/blog/${p.slug}</link>
      <guid isPermaLink="true">${HOST}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.publishedAt)}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Vantage Blog — AI Job Prep, CV Optimisation, Interview Strategy</title>
    <link>${HOST}/blog</link>
    <atom:link href="${HOST}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical, current guides on AI job preparation, CV optimisation, ATS-friendly resumes, cover letters, and interview strategy.</description>
    <language>en-gb</language>
    <copyright>Vantage 2026</copyright>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
    <generator>Vantage scripts/generate-feeds.mjs</generator>
    <image>
      <url>${HOST}/og-image.png</url>
      <title>Vantage</title>
      <link>${HOST}/blog</link>
    </image>

${items}
  </channel>
</rss>
`;
  writeFileSync(resolve(ROOT, 'public/rss.xml'), xml);
  return sorted.length;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ---------- Run ----------

const posts = parseBlogPosts();
const packs = parseRolePacks();

const blogCount = writeBlogSitemap(posts);
const rolesCount = writeRolesSitemap(packs);
const rssCount = writeRss(posts);

console.log(`[generate-feeds] blog sitemap: ${blogCount} entries (${posts.length} posts + index)`);
console.log(`[generate-feeds] roles sitemap: ${rolesCount} entries (${packs.length} packs + hub)`);
console.log(`[generate-feeds] RSS: ${rssCount} items`);

if (posts.length === 0 || packs.length === 0) {
  console.error('[generate-feeds] WARNING: parser produced 0 entries from one or more data files. Check the regex.');
  process.exit(1);
}
