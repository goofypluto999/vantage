#!/usr/bin/env node
/**
 * Auto-regenerates ALL feed + sitemap files from source-of-truth data.
 *
 * Inputs:
 *   - src/data/blogPosts.ts         (post titles + descriptions + dates for sitemap/RSS)
 *   - public/blog/*.md              (full content for Atom + JSON Feed)
 *   - src/data/interviewQuestions.ts (role packs for sitemap-roles)
 *   - src/data/companyPacks.ts      (company packs for sitemap-companies)
 *
 * Outputs:
 *   - public/sitemap-blog.xml
 *   - public/sitemap-roles.xml
 *   - public/sitemap-companies.xml
 *   - public/rss.xml             (RSS 2.0 + media:thumbnail + dc:creator)
 *   - public/atom.xml            (Atom 1.0 + full content + author URI)
 *   - public/feed.json           (JSON Feed 1.1 + content_html + content_text + tags)
 *
 * Run automatically as `prebuild` so feeds always match the data.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const HOST = 'https://aimvantage.uk';
const SITE_NAME = 'Vantage';
const SITE_DESC = 'AI job preparation. Upload your CV, paste a job link, get the full prep pack in ~90 seconds.';
const AUTHOR_NAME = 'Gio';
const AUTHOR_URL = `${HOST}/press`;
const SITE_LOGO = `${HOST}/og-image.png`;
const SITE_FAVICON = `${HOST}/favicon.svg`;
const SITE_LANG = 'en-GB';

// ---------- Parsers ----------

function parseBlogPostsFromTs() {
  const src = readFileSync(resolve(ROOT, 'src/data/blogPosts.ts'), 'utf-8');
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

/**
 * Parse a markdown post for the Atom + JSON Feed generator.
 * Returns the full body as HTML + plaintext, plus all frontmatter fields.
 */
function parseBlogPostMd(slug) {
  const path = resolve(ROOT, `public/blog/${slug}.md`);
  let raw;
  try {
    raw = readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fm) return null;
  const meta = {};
  for (const line of fm[1].split('\n')) {
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
  const body = fm[2].trim();
  return { meta, body };
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

function parseCompanyPacks() {
  const src = readFileSync(resolve(ROOT, 'src/data/companyPacks.ts'), 'utf-8');
  const packs = [];
  const re = /\{\s*slug:\s*'([^']+)',\s*company:\s*'([^']+)',\s*updated:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    packs.push({ slug: m[1], company: m[2], updated: m[3] });
  }
  return packs;
}

// ---------- Markdown → HTML (minimal, no deps) ----------
// Handles: headers (h1-h3), paragraphs, ordered + unordered lists,
// blockquotes, code blocks (triple-backtick), inline code, bold,
// italic, links. Does not handle images or nested lists; the blog
// content does not use them.

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code fence
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, '').trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Headers
    if (/^### /.test(line)) {
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (/^## /.test(line)) {
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (/^# /.test(line)) {
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
      i++;
      continue;
    }

    // Blockquote (potentially multi-line)
    if (/^> /.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${inline(quoteLines.join(' '))}</blockquote>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^[-*]\s/, ''))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Empty line — skip
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Paragraph (gather adjacent non-empty, non-special lines)
    const paraLines = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !/^>/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^```/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      out.push(`<p>${inline(paraLines.join(' '))}</p>`);
    }
  }

  return out.join('\n');
}

function inline(s) {
  // Order matters: code first (so we don't double-process its contents),
  // then links, then bold, then italic.
  let result = s;
  // Inline code
  result = result.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);
  // Links [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`);
  // Bold **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, (_, text) => `<strong>${text}</strong>`);
  // Italic *text* (avoid matching ** which is already bold)
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (_, text) => `<em>${text}</em>`);
  return result;
}

function markdownToText(md) {
  // Strip frontmatter handled upstream. Strip code fences, blockquote
  // markers, list markers, headers — produce a plaintext version.
  return md
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/^#{1,6}\s/gm, '') // headers
    .replace(/^>\s?/gm, '') // blockquote markers
    .replace(/^[-*]\s/gm, '') // unordered list bullets
    .replace(/^\d+\.\s/gm, '') // ordered list numbers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/\n{3,}/g, '\n\n') // collapse blank lines
    .trim();
}

// ---------- Sitemap writers ----------

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

function writeCompaniesSitemap(packs) {
  const latest = packs.map((p) => p.updated).sort().reverse()[0] ?? '2026-04-25';
  const entries = [
    urlEntry(`${HOST}/interview-prep`, latest, '0.9', 'weekly'),
    ...packs.map((p) => urlEntry(`${HOST}/interview-prep/${p.slug}`, p.updated, '0.85', 'monthly')),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
  writeFileSync(resolve(ROOT, 'public/sitemap-companies.xml'), xml);
  return entries.length;
}

// ---------- Feed writers ----------

function rfc822(iso) {
  return new Date(iso).toUTCString().replace('GMT', '+0000');
}

function isoDateTime(iso) {
  // 2026-05-04 -> 2026-05-04T00:00:00.000Z
  return new Date(iso).toISOString();
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Build per-post enriched object (combines TS + MD frontmatter). */
function enrichPost(post) {
  const md = parseBlogPostMd(post.slug);
  if (!md) {
    return {
      ...post,
      tags: [],
      author: AUTHOR_NAME,
      contentHtml: `<p>${escapeXml(post.description)}</p>`,
      contentText: post.description,
    };
  }
  const tags = Array.isArray(md.meta.tags) ? md.meta.tags : [];
  const author = md.meta.author || AUTHOR_NAME;
  // Strip the redundant H1 from the md body if it matches the title; the
  // feed reader already shows the title separately.
  const body = md.body.replace(new RegExp(`^# ${post.title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*\\n`, 'm'), '');
  return {
    ...post,
    tags,
    author,
    contentHtml: markdownToHtml(body),
    contentText: markdownToText(body),
  };
}

function writeRss(posts) {
  const sorted = posts.slice().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const enriched = sorted.map(enrichPost);
  const lastBuild = sorted[0]?.publishedAt ?? '2026-04-25';

  const items = enriched
    .map((p) => {
      const categories = (p.tags || []).map((t) => `      <category>${escapeXml(t)}</category>`).join('\n');
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${HOST}/blog/${p.slug}</link>
      <guid isPermaLink="true">${HOST}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.publishedAt)}</pubDate>
      <dc:creator><![CDATA[${p.author}]]></dc:creator>
      <description>${escapeXml(p.description)}</description>
      <content:encoded><![CDATA[${p.contentHtml}]]></content:encoded>
${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Vantage Blog — AI Job Prep, CV Optimisation, Interview Strategy</title>
    <link>${HOST}/blog</link>
    <atom:link href="${HOST}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical, current guides on AI job preparation, CV optimisation, ATS-friendly resumes, cover letters, and interview strategy. Long-form, from a solo founder building Vantage in public.</description>
    <language>${SITE_LANG.toLowerCase()}</language>
    <copyright>${SITE_NAME} 2026</copyright>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
    <managingEditor>noreply@aimvantage.uk (${AUTHOR_NAME})</managingEditor>
    <webMaster>noreply@aimvantage.uk (${AUTHOR_NAME})</webMaster>
    <generator>Vantage scripts/generate-feeds.mjs</generator>
    <image>
      <url>${SITE_LOGO}</url>
      <title>${SITE_NAME}</title>
      <link>${HOST}/blog</link>
      <width>1200</width>
      <height>630</height>
    </image>

${items}
  </channel>
</rss>
`;
  writeFileSync(resolve(ROOT, 'public/rss.xml'), xml);
  return sorted.length;
}

function writeAtom(posts) {
  const sorted = posts.slice().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const enriched = sorted.map(enrichPost);
  const lastBuild = sorted[0]?.publishedAt ?? '2026-04-25';

  const entries = enriched
    .map((p) => {
      const categories = (p.tags || []).map((t) => `    <category term="${escapeXml(t)}"/>`).join('\n');
      return `  <entry>
    <title type="text">${escapeXml(p.title)}</title>
    <link href="${HOST}/blog/${p.slug}" rel="alternate" type="text/html"/>
    <id>${HOST}/blog/${p.slug}</id>
    <published>${isoDateTime(p.publishedAt)}</published>
    <updated>${isoDateTime(p.publishedAt)}</updated>
    <author>
      <name>${escapeXml(p.author)}</name>
      <uri>${AUTHOR_URL}</uri>
    </author>
    <summary type="text">${escapeXml(p.description)}</summary>
    <content type="html"><![CDATA[${p.contentHtml}]]></content>
${categories}
  </entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE_NAME}</title>
  <subtitle>${SITE_DESC}</subtitle>
  <link href="${HOST}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${HOST}/" rel="alternate" type="text/html"/>
  <link href="${HOST}/blog" rel="related" type="text/html"/>
  <id>${HOST}/</id>
  <updated>${isoDateTime(lastBuild)}</updated>
  <icon>${SITE_FAVICON}</icon>
  <logo>${SITE_LOGO}</logo>
  <rights>© 2026 Vantage Labs</rights>
  <generator uri="${HOST}" version="2.0">Vantage scripts/generate-feeds.mjs</generator>

${entries}
</feed>
`;
  writeFileSync(resolve(ROOT, 'public/atom.xml'), xml);
  return sorted.length;
}

function writeJsonFeed(posts) {
  const sorted = posts.slice().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const enriched = sorted.map(enrichPost);

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${SITE_NAME} Blog`,
    home_page_url: `${HOST}/blog`,
    feed_url: `${HOST}/feed.json`,
    description: SITE_DESC,
    icon: SITE_LOGO,
    favicon: SITE_FAVICON,
    language: SITE_LANG,
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
    items: enriched.map((p) => ({
      id: `${HOST}/blog/${p.slug}`,
      url: `${HOST}/blog/${p.slug}`,
      title: p.title,
      summary: p.description,
      content_html: p.contentHtml,
      content_text: p.contentText,
      date_published: isoDateTime(p.publishedAt),
      date_modified: isoDateTime(p.publishedAt),
      tags: p.tags,
      authors: [{ name: p.author, url: AUTHOR_URL }],
      language: SITE_LANG,
    })),
  };

  writeFileSync(resolve(ROOT, 'public/feed.json'), JSON.stringify(feed, null, 2) + '\n');
  return sorted.length;
}

// ---------- Run ----------

const posts = parseBlogPostsFromTs();
const rolePacks = parseRolePacks();
const companyPacksData = parseCompanyPacks();

const blogCount = writeBlogSitemap(posts);
const rolesCount = writeRolesSitemap(rolePacks);
const companiesCount = writeCompaniesSitemap(companyPacksData);
const rssCount = writeRss(posts);
const atomCount = writeAtom(posts);
const jsonCount = writeJsonFeed(posts);

console.log(`[generate-feeds] blog sitemap: ${blogCount} entries (${posts.length} posts + index)`);
console.log(`[generate-feeds] roles sitemap: ${rolesCount} entries (${rolePacks.length} packs + hub)`);
console.log(`[generate-feeds] companies sitemap: ${companiesCount} entries (${companyPacksData.length} packs + hub)`);
console.log(`[generate-feeds] RSS:  ${rssCount} items (with full content + dc:creator + categories)`);
console.log(`[generate-feeds] Atom: ${atomCount} entries (with full content + author URI + categories)`);
console.log(`[generate-feeds] JSON Feed: ${jsonCount} items (with content_html + content_text + tags)`);

if (posts.length === 0 || rolePacks.length === 0 || companyPacksData.length === 0) {
  console.error('[generate-feeds] WARNING: parser produced 0 entries from one or more data files. Check the regex.');
  process.exit(1);
}
