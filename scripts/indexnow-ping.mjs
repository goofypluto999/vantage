#!/usr/bin/env node
/**
 * IndexNow ping — submits all sitemap URLs to Bing/Yandex/Seznam in one POST.
 *
 * Run after every deploy:
 *   node scripts/indexnow-ping.mjs
 *
 * Why: Google ignores IndexNow but Bing, Yandex, Seznam pull from it directly.
 * For brand-new pages, IndexNow gets you indexed in hours instead of weeks.
 *
 * Spec: https://www.indexnow.org/documentation
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const HOST = 'vantage-livid.vercel.app';
const KEY = '745e7c1576ba55e88704a1df0306edf7d3d8036cfd2141c8';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

// Pull all <loc> values from every sitemap-*.xml file
function extractLocs(xml) {
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

const sitemapFiles = [
  'public/sitemap-pages.xml',
  'public/sitemap-blog.xml',
  'public/sitemap-roles.xml',
];

const urls = [];
for (const file of sitemapFiles) {
  try {
    const xml = readFileSync(resolve(ROOT, file), 'utf-8');
    urls.push(...extractLocs(xml));
  } catch (err) {
    console.error(`[skip] could not read ${file}: ${err.message}`);
  }
}

const unique = [...new Set(urls)].filter((u) => u.startsWith(`https://${HOST}`));

if (unique.length === 0) {
  console.error('No URLs to submit. Aborting.');
  process.exit(1);
}

console.log(`[indexnow] submitting ${unique.length} URLs from ${HOST}`);

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: unique,
};

try {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // IndexNow returns 200 on accept, 202 on pending. Anything else = real failure.
  // Some endpoints respond with empty body.
  const text = await res.text();
  console.log(`[indexnow] HTTP ${res.status}${text ? ` — ${text.slice(0, 200)}` : ''}`);

  if (res.status === 200 || res.status === 202) {
    console.log(`[indexnow] OK — ${unique.length} URLs accepted by Bing/Yandex/Seznam`);
    process.exit(0);
  }

  console.error('[indexnow] non-success response. Review request and retry.');
  process.exit(1);
} catch (err) {
  console.error(`[indexnow] request failed: ${err.message}`);
  process.exit(1);
}
