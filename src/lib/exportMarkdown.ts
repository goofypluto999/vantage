// exportMarkdown — small framework-agnostic helper to build a clean
// Markdown string from an AI tool result + trigger a download.
//
// Why: users repeatedly ask "how do I save this roast / decode / check?"
// localStorage history (useResultHistory) covers same-device revisit,
// but doesn't help when they want to paste into Notion / email a coach
// / archive across machines. Markdown is the universal format for that.
//
// Built 2026-05-11. No server transit, no auth required, pure client.
// The util produces a string + offers a `downloadMarkdown()` helper
// that wraps the Blob URL pattern with cleanup.

const APP_FOOTER = '\n\n---\n*Generated with Vantage AI — https://aimvantage.uk*\n';

/** Escape a plain-text value for safe inline insertion into Markdown.
 *
 * Hardened 2026-05-11 after multi-agent review flagged TWO HIGH XSS
 * vectors when downloaded files are opened in Markdown renderers that
 * permit raw HTML (Obsidian default, GitHub preview without strict
 * sanitiser, VS Code with `markdown.preview.html=true`, marked.js):
 *
 *   1. Raw HTML in body — `<script>`, `<img onerror>`, `<iframe>` etc
 *      survive a backticks-only escape. Now HTML-escape `<` `>` `&`.
 *   2. Dangerous link schemes — `[click](javascript:...)`,
 *      `[click](data:text/html,...)`, `[click](vbscript:...)` survive
 *      as clickable links in Obsidian/GitHub. Now neutered to `#blocked`.
 *
 * What we still preserve:
 *   - `*` / `_` / `#` / `[]` so any AI-emitted bold/italic/header
 *     formatting keeps working
 *   - http(s):// and mailto: links (legitimate sources)
 *   - Backslashes (the user may want them in quoted text)
 *
 * Backticks are still escaped so AI-quoted phrases ('look like this')
 * don't accidentally close an unintended code span.
 */
function mdEscape(s: string): string {
  if (typeof s !== 'string') return '';
  return s
    // HTML-escape FIRST so subsequent transforms don't re-introduce raw
    // `<` or `>`. Ampersand must lead so we don't double-encode our
    // own entity output.
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Backticks — keep code-span discipline.
    .replace(/`/g, '\\`')
    // Markdown link with a dangerous scheme: `[text](javascript:...)`,
    // `[text](data:...)`, `[text](vbscript:...)`. Replace the URL with
    // `#blocked` so the link visibly exists but does nothing.
    .replace(/\]\(\s*(javascript|data|vbscript)\s*:[^)]*\)/gi, '](#blocked)');
}

function mdHeading(text: string, level: 1 | 2 | 3 = 2): string {
  return `${'#'.repeat(level)} ${text}\n`;
}

function mdParagraph(text: string): string {
  return `${text.trim()}\n`;
}

/**
 * Emit a heading + body only if the body has substantive content.
 * Prevents dangling empty sections when an AI response is missing a
 * field (review MED). Returns an empty string if body trims to nothing.
 */
function mdSection(heading: string, body: string, level: 1 | 2 | 3 = 2): string {
  const trimmed = (body || '').trim();
  if (!trimmed) return '';
  return `${mdHeading(heading, level)}\n${trimmed}\n`;
}

function mdList(items: string[], ordered = false): string {
  if (!Array.isArray(items) || items.length === 0) return '';
  return items
    .map((item, idx) => {
      // Per-item: continuation indent for embedded newlines so a multi-
      // line entry stays inside the same list-item per CommonMark
      // (review LOW #15).
      const indented = String(item).replace(/\r?\n/g, '\n  ');
      return ordered ? `${idx + 1}. ${indented}` : `- ${indented}`;
    })
    .join('\n') + '\n';
}

function mdMetaBlock(rows: Array<[string, string | number | undefined | null]>): string {
  const cleaned = rows.filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (cleaned.length === 0) return '';
  return cleaned.map(([k, v]) => `**${k}:** ${v}`).join('  \n') + '\n';
}

// ─── Roast ─────────────────────────────────────────────────────────────

export interface RoastForExport {
  roast: string;
  severityScore?: number;
}

const ROAST_SEVERITY_LABEL: Record<number, string> = {
  0: 'Not enough to roast',
  1: 'Genuinely strong',
  2: 'Decent, fixable',
  3: 'Mid',
  4: 'Rough',
  5: 'LinkedIn fever-dream',
};

export function buildRoastMarkdown(r: RoastForExport): string {
  const sev = typeof r.severityScore === 'number' ? r.severityScore : undefined;
  return [
    mdHeading('Cover Letter Roast', 1),
    mdMetaBlock([
      ['Generated', new Date().toISOString()],
      ['Severity', sev !== undefined ? `${sev}/5 — ${ROAST_SEVERITY_LABEL[sev] ?? ''}`.trim() : undefined],
    ]),
    '',
    mdSection('The roast', mdEscape(r.roast || ''), 2),
    APP_FOOTER,
  ].join('\n');
}

// ─── Decode Rejection ──────────────────────────────────────────────────

export interface DecodeForExport {
  verdict?: string;
  severity?: number;
  translation?: string;
  specificClues?: string[];
  nextMove?: string;
}

const DECODE_VERDICT_LABEL: Record<string, string> = {
  ghosted_template: 'Boilerplate ghosting',
  soft_no_with_room: 'Soft no — keep the door open',
  explicit_no: 'Specific feedback (rare and valuable)',
  saved_for_other_role: '"On file" — polite no',
  ats_filtered: 'ATS-filtered (no human read it)',
  internal_hire: 'Internal hire / freeze',
  headcount_frozen: 'Headcount frozen',
  fit_concern: 'Fit concern',
  experience_gap: 'Experience-level mismatch',
  salary_misaligned: 'Salary expectations off',
  invalid: 'Not a real rejection',
};

export function buildDecodeMarkdown(d: DecodeForExport): string {
  const verdictLabel = d.verdict ? (DECODE_VERDICT_LABEL[d.verdict] || d.verdict) : 'Unknown';
  const cluesList = Array.isArray(d.specificClues) && d.specificClues.length > 0
    ? mdList(d.specificClues.map(mdEscape))
    : '';
  return [
    mdHeading('Rejection Email — Decoded', 1),
    mdMetaBlock([
      ['Generated', new Date().toISOString()],
      ['Verdict', verdictLabel],
      ['Severity', d.severity !== undefined ? `${d.severity}/5` : undefined],
    ]),
    '',
    mdSection('Translation', mdEscape(d.translation || ''), 2),
    cluesList ? mdSection('Specific clues', cluesList, 2) : '',
    mdSection('Your next move', mdEscape(d.nextMove || ''), 2),
    APP_FOOTER,
  ].filter(Boolean).join('\n');
}

// ─── Ghost Job Check ───────────────────────────────────────────────────

export interface GhostForExport {
  ghostProbability?: number;
  verdict?: string;
  summary?: string;
  tells?: string[];
  yourMove?: string;
  degraded?: boolean;
}

const GHOST_VERDICT_LABEL: Record<string, string> = {
  real_job: 'Real job — apply confidently',
  probably_real: 'Probably real — worth applying',
  uncertain: 'Uncertain — apply, but cap prep time',
  probably_ghost: 'Probably a ghost — be selective',
  almost_certainly_ghost: 'Almost certainly a ghost',
  invalid: 'Not enough to score',
};

export function buildGhostMarkdown(g: GhostForExport): string {
  const verdictLabel = g.verdict ? (GHOST_VERDICT_LABEL[g.verdict] || g.verdict) : 'Unknown';
  const tellsList = Array.isArray(g.tells) && g.tells.length > 0
    ? mdList(g.tells.map(mdEscape))
    : '';
  return [
    mdHeading('Ghost-Job Check', 1),
    mdMetaBlock([
      ['Generated', new Date().toISOString()],
      ['Ghost probability', g.ghostProbability !== undefined ? `${g.ghostProbability}%` : undefined],
      ['Verdict', verdictLabel],
      ['Note', g.degraded ? 'AI returned a conservative draft (parser fallback).' : undefined],
    ]),
    '',
    mdSection('Summary', mdEscape(g.summary || ''), 2),
    tellsList ? mdSection('Tells', tellsList, 2) : '',
    mdSection('Your move', mdEscape(g.yourMove || ''), 2),
    APP_FOOTER,
  ].filter(Boolean).join('\n');
}

// ─── Download helper ───────────────────────────────────────────────────

/**
 * Trigger a browser download of the given markdown content with the
 * given filename. Cleans up the temporary Blob URL after the click so
 * we don't leak object URLs.
 *
 * Filename is sanitized to a conservative ASCII subset so platforms
 * with strict filename rules (Windows reserved chars, leading dots,
 * trailing spaces) don't reject the save dialog.
 */
export function downloadMarkdown(filename: string, content: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const safeName = sanitizeFilename(filename);
  let url: string | null = null;
  try {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName;
    // Append + click + remove so it works in Firefox.
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    // If Blob/URL APIs are missing (very old browsers), silently fail.
    // The visible button label tells the user what should have happened;
    // no error toast required for a non-critical export.
  } finally {
    if (url) {
      // setTimeout: defer to after the click handler so we don't yank
      // the URL before the download starts in some browsers.
      setTimeout(() => {
        try { URL.revokeObjectURL(url!); } catch { /* ignore */ }
      }, 1500);
    }
  }
}

/**
 * Filename sanitizer. Hardened 2026-05-11 after multi-agent review
 * flagged three classes of risk on a function that's exported as part
 * of a reusable helper (future callers may pass less-trusted strings):
 *   - Windows-reserved device names (CON, PRN, NUL, COM1-9, LPT1-9)
 *     refused at the OS save dialog
 *   - RTL-override / zero-width Unicode (the classic `.md.exe`
 *     masquerade) — strip to prevent
 *   - Length budget: enforce 77 chars THEN append .md so we always end
 *     in 80 chars total, never lose the .md extension
 */
const WIN_RESERVED_BASENAMES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

function sanitizeFilename(name: string): string {
  const trimmed = String(name || '').trim() || 'vantage-export';
  // Replace Windows-reserved chars + control chars with `-`.
  // eslint-disable-next-line no-control-regex
  let cleaned = trimmed.replace(/[\\/:*?"<>|\x00-\x1F]+/g, '-');
  // Strip dangerous Unicode separately for readability + portability:
  //   U+200B–U+200F: zero-width / directional marks
  //   U+202A–U+202E: embed/override (the .md.exe masquerade vector)
  //   U+2066–U+2069: isolate / pop directional isolate
  //   U+FEFF:       zero-width no-break space / BOM
  cleaned = cleaned.replace(/[​-‏‪-‮⁦-⁩﻿]+/g, '-');
  // Collapse repeats, strip leading/trailing dots-and-spaces.
  const collapsed = cleaned.replace(/-+/g, '-').replace(/^[. -]+|[. -]+$/g, '');
  // Block Windows reserved device names by prefixing _ if matched.
  const safeBase = WIN_RESERVED_BASENAMES.test(collapsed) ? `_${collapsed}` : collapsed;
  // Enforce the .md extension with a strict length budget. Reserve 3
  // chars for ".md" + leave 77 for the body so total ≤ 80.
  const baseOnly = (safeBase || 'vantage-export').replace(/\.md$/i, '').slice(0, 77);
  return `${baseOnly}.md`;
}
