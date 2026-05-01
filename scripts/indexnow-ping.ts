#!/usr/bin/env node
/**
 * Vantage IndexNow ping — notify Bing, Yandex, and other IndexNow-compatible
 * search engines about updated URLs. Run after publish to accelerate indexing.
 *
 * Usage:
 *   INDEXNOW_KEY=<key> npx tsx scripts/indexnow-ping.ts
 *
 * Setup:
 * 1. Generate a key: 8-128 char hex string
 * 2. Host the key at https://vantage-livid.vercel.app/<KEY>.txt with body = key
 *    (drop a file at public/<KEY>.txt)
 * 3. Set INDEXNOW_KEY in env when running
 */

const HOST = 'vantage-livid.vercel.app';
const KEY = process.env.INDEXNOW_KEY ?? '';

if (!KEY) {
  console.error('INDEXNOW_KEY missing from environment.');
  process.exit(1);
}

const URLS = [
  // Top-level
  `https://${HOST}/`,
  `https://${HOST}/pricing`,
  `https://${HOST}/register`,
  `https://${HOST}/blog`,
  `https://${HOST}/tools`,
  `https://${HOST}/compare`,

  // Cohort cluster
  `https://${HOST}/laid-off`,
  `https://${HOST}/laid-off/from/oracle`,
  `https://${HOST}/laid-off/from/meta`,
  `https://${HOST}/laid-off/from/asml`,
  `https://${HOST}/laid-off/from/snap`,
  `https://${HOST}/laid-off/from/nike`,
  `https://${HOST}/playbook`,

  // ATS cluster
  `https://${HOST}/ats`,
  `https://${HOST}/ats/workday`,
  `https://${HOST}/ats/greenhouse`,
  `https://${HOST}/ats/lever`,
  `https://${HOST}/ats/taleo`,
  `https://${HOST}/ats/icims`,

  // Developer / press
  `https://${HOST}/skills`,
  `https://${HOST}/docs/api`,
  `https://${HOST}/press`,

  // Recently published blog posts
  `https://${HOST}/blog/just-laid-off-april-2026-cv-fix`,
  `https://${HOST}/blog/oracle-meta-asml-layoff-cv-checklist`,
  `https://${HOST}/blog/tailoring-every-resume-vs-the-smarter-alternative`,
  `https://${HOST}/blog/500-applications-zero-interviews-the-ats-parse-problem`,
  `https://${HOST}/blog/how-to-spot-a-ghost-job-in-30-seconds`,

  // Discovery files
  `https://${HOST}/sitemap.xml`,
  `https://${HOST}/sitemap-pages.xml`,
  `https://${HOST}/sitemap-blog.xml`,
  `https://${HOST}/llms.txt`,
  `https://${HOST}/llms-full.txt`,
];

async function main() {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: URLS,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  console.log(`Pinging ${URLS.length} URLs to ${endpoints.length} IndexNow endpoints...`);

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
      });
      console.log(`  ${ep}: HTTP ${res.status} ${res.statusText}`);
    } catch (err) {
      console.warn(`  ${ep}: failed - ${err instanceof Error ? err.message : err}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
