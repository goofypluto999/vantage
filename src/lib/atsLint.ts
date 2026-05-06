/**
 * ATS Lint Engine — browser port of cv-mirror-mcp-repo/src/lint.mjs.
 *
 * Pure functions. No I/O, no DOM, no async. Operates on plain text.
 *
 * Used by AtsScannerSection.tsx to give a compact, free, client-side preview
 * of how 5 major ATS platforms (Workday, Greenhouse, Lever, Taleo, iCIMS)
 * will read a candidate's CV.
 *
 * Vendor rules are intentionally conservative — each rule is keyed to a
 * public source (see cv-mirror-mcp-repo/docs/vendor-sources.md). We avoid
 * claims we can't back up.
 */

export const ATS_VENDORS = ['workday', 'greenhouse', 'lever', 'taleo', 'icims'] as const;
export type AtsVendor = (typeof ATS_VENDORS)[number];

export const VENDOR_NAMES: Record<AtsVendor, string> = {
  workday: 'Workday',
  greenhouse: 'Greenhouse',
  lever: 'Lever',
  taleo: 'Taleo',
  icims: 'iCIMS',
};

export type Severity = 'error' | 'warn' | 'info';

export interface Finding {
  code: string;
  severity: Severity;
  message: string;
  fix: string;
}

export interface VendorReport {
  vendor: AtsVendor;
  name: string;
  findings: Finding[];
  /** errors === 0 && warns === 0 means clean pass */
  errors: number;
  warns: number;
  infos: number;
  topFinding?: Finding;
}

export interface Signals {
  wordCount: number;
  nonEmptyLines: number;
  multiColumnLines: number;
  multiColumnRatio: number;
  wordsPerKB: number;
  hasHeaderFooterLikeText: boolean;
  dateCounts: { monthYear: number; isoLike: number; mmYY: number; quarter: number };
  hasEmoji: boolean;
  hasSmartQuotes: boolean;
  hasFancyBullets: boolean;
  headersFound: string[];
  hasNonStandardHeaders: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
}

// ---------------------------------------------------------------- signals ---

export function computeSignals(text: string, fileSize: number): Signals {
  const lines = text.split('\n');
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  const wordCount = (text.match(/\b\w+\b/g) || []).length;

  // Multi-column heuristic: lines with a large gap of whitespace inside them.
  const multiColumnLines = nonEmpty.filter((l) => /\S {5,}\S/.test(l)).length;
  const multiColumnRatio = nonEmpty.length > 0 ? multiColumnLines / nonEmpty.length : 0;

  const wordsPerKB = fileSize > 0 ? wordCount / (fileSize / 1024) : 0;

  const hasHeaderFooterLikeText = /^\s*page \d+( of \d+)?\s*$/im.test(text);

  const datePatterns = {
    monthYear: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b/gi,
    isoLike: /\b\d{4}-\d{1,2}\b/g,
    mmYY: /\b\d{1,2}\/\d{2,4}\b/g,
    quarter: /\bQ[1-4]\s+\d{4}\b/g,
  };
  const dateCounts = {
    monthYear: (text.match(datePatterns.monthYear) || []).length,
    isoLike: (text.match(datePatterns.isoLike) || []).length,
    mmYY: (text.match(datePatterns.mmYY) || []).length,
    quarter: (text.match(datePatterns.quarter) || []).length,
  };

  const hasEmoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text);
  const hasSmartQuotes = /[‘’“”]/.test(text);
  const hasFancyBullets = /[▪▫◦❖➜➔]/.test(text);

  const standardHeaders = [
    'experience', 'work experience', 'professional experience',
    'education', 'skills', 'summary', 'objective', 'projects',
    'certifications', 'awards',
  ];
  const headersFound = standardHeaders.filter((h) =>
    new RegExp(`^\\s*${h}\\s*$`, 'im').test(text)
  );
  const hasNonStandardHeaders = /^\s*(my\s+story|the\s+journey|chapters|highlights\s+reel)\s*$/im.test(text);

  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text);
  const hasPhone = /(\+?\d[\d\s().-]{7,}\d)/.test(text);

  return {
    wordCount,
    nonEmptyLines: nonEmpty.length,
    multiColumnLines,
    multiColumnRatio,
    wordsPerKB,
    hasHeaderFooterLikeText,
    dateCounts,
    hasEmoji,
    hasSmartQuotes,
    hasFancyBullets,
    headersFound,
    hasNonStandardHeaders,
    hasEmail,
    hasPhone,
  };
}

// -------------------------------------------------------------- vendor rules

type VendorRule = (s: Signals) => Finding[];

const VENDOR_RULES: Record<AtsVendor, VendorRule> = {
  workday: (s) => {
    const out: Finding[] = [];
    if (s.multiColumnRatio > 0.15) {
      out.push({
        code: 'WORKDAY_MULTI_COLUMN',
        severity: 'error',
        message: `${Math.round(s.multiColumnRatio * 100)}% of lines look multi-column. Workday reads left-to-right and interleaves columns, corrupting role-by-role history.`,
        fix: 'Convert to single-column layout. Move sidebars (Skills, Tools, Languages) above or below the main content.',
      });
    }
    if (s.dateCounts.quarter > 0 && s.dateCounts.monthYear === 0) {
      out.push({
        code: 'WORKDAY_QUARTER_DATES',
        severity: 'warn',
        message: 'Quarter-format dates (e.g. "Q3 2024") are not parsed by Workday. Years-of-experience calculations will be wrong.',
        fix: 'Use Month-Year format ("Sep 2024 – Mar 2026") for every role.',
      });
    }
    if (!s.hasEmail || !s.hasPhone) {
      const missing = [!s.hasEmail && 'email', !s.hasPhone && 'phone'].filter(Boolean).join(', ');
      out.push({
        code: 'WORKDAY_CONTACT_MISSING',
        severity: 'error',
        message: `Workday auto-populates the contact form from your CV. Missing: ${missing}.`,
        fix: 'Put email and phone in plain text near the top of page 1, not in headers/footers.',
      });
    }
    return out;
  },

  greenhouse: (s) => {
    const out: Finding[] = [];
    if (s.hasEmoji) {
      out.push({
        code: 'GREENHOUSE_EMOJI',
        severity: 'warn',
        message: 'Emoji detected. Greenhouse strips emoji and surrounding context can be lost, especially in headers.',
        fix: 'Remove emoji from headers and bullet points.',
      });
    }
    if (s.hasFancyBullets) {
      out.push({
        code: 'GREENHOUSE_FANCY_BULLETS',
        severity: 'info',
        message: 'Non-standard bullet glyphs detected. Most are fine but some get collapsed to spaces.',
        fix: 'Use standard "•" or "-" bullets.',
      });
    }
    if (s.hasNonStandardHeaders) {
      out.push({
        code: 'GREENHOUSE_NONSTANDARD_HEADER',
        severity: 'warn',
        message: 'Non-standard section headers (e.g. "My Story") are not classified by Greenhouse. The content gets dumped into "Other".',
        fix: 'Use standard headers: Experience, Education, Skills, Summary, Projects.',
      });
    }
    return out;
  },

  lever: (s) => {
    const out: Finding[] = [];
    if (s.hasHeaderFooterLikeText) {
      out.push({
        code: 'LEVER_HEADER_FOOTER',
        severity: 'warn',
        message: 'Header/footer-like text detected ("Page 1 of 2"). Lever historically drops PDF header/footer content.',
        fix: 'Remove headers and footers. Page numbers are not needed on a CV.',
      });
    }
    if (s.headersFound.length === 0) {
      out.push({
        code: 'LEVER_NO_STANDARD_HEADERS',
        severity: 'error',
        message: 'No standard section headers found. Lever uses header detection to delimit Experience vs Education vs Skills.',
        fix: 'Add explicit "Experience" and "Education" headers as their own lines.',
      });
    }
    return out;
  },

  taleo: (s) => {
    const out: Finding[] = [];
    if (s.dateCounts.isoLike > 0 && s.dateCounts.monthYear < s.dateCounts.isoLike) {
      out.push({
        code: 'TALEO_ISO_DATES',
        severity: 'warn',
        message: 'ISO-style dates (2024-09) detected. Taleo prefers Month-Year text format and may fail to extract durations.',
        fix: 'Convert dates to "Sep 2024 – Mar 2026" format throughout.',
      });
    }
    if (s.wordsPerKB < 1 && s.wordCount < 200) {
      out.push({
        code: 'TALEO_LOW_TEXT_DENSITY',
        severity: 'error',
        message: `Very low text-per-kilobyte ratio (${s.wordsPerKB.toFixed(2)} words/kB). The file may be image-based or heavily designed.`,
        fix: 'Re-export the CV from Word/Pages as text-based, not "Save as Image".',
      });
    }
    if (s.hasSmartQuotes) {
      out.push({
        code: 'TALEO_SMART_QUOTES',
        severity: 'info',
        message: 'Smart quotes (curly quotes) detected. Older Taleo deployments occasionally mangle them.',
        fix: 'Use straight quotes if applying to Fortune-500 roles where Taleo is common.',
      });
    }
    return out;
  },

  icims: (s) => {
    const out: Finding[] = [];
    if (s.multiColumnRatio > 0.20) {
      out.push({
        code: 'ICIMS_MULTI_COLUMN',
        severity: 'error',
        message: `iCIMS handles multi-column poorly (${Math.round(s.multiColumnRatio * 100)}% multi-column lines). Skills sidebars typically merge with the line above.`,
        fix: 'Single-column layout. If you keep a "Skills" sidebar, move it to its own section above or below.',
      });
    }
    if (s.headersFound.length < 2) {
      out.push({
        code: 'ICIMS_FEW_HEADERS',
        severity: 'warn',
        message: 'Fewer than 2 standard section headers detected. iCIMS section detection looks for keyword headers.',
        fix: 'Add at least Experience and Education headers as their own lines.',
      });
    }
    return out;
  },
};

// ---------------------------------------------------------------- public API

export function analyzeText(text: string, fileSize: number): VendorReport[] {
  const signals = computeSignals(text, fileSize);
  return ATS_VENDORS.map((vendor) => {
    const findings = VENDOR_RULES[vendor](signals);
    const errors = findings.filter((f) => f.severity === 'error').length;
    const warns = findings.filter((f) => f.severity === 'warn').length;
    const infos = findings.filter((f) => f.severity === 'info').length;
    // Sort findings: error > warn > info, then return the most critical.
    const sorted = [...findings].sort((a, b) => {
      const order: Record<Severity, number> = { error: 0, warn: 1, info: 2 };
      return order[a.severity] - order[b.severity];
    });
    return {
      vendor,
      name: VENDOR_NAMES[vendor],
      findings: sorted,
      errors,
      warns,
      infos,
      topFinding: sorted[0],
    };
  });
}

/** Aggregate pass count: a vendor "passes" if it has zero errors. */
export function passCount(reports: VendorReport[]): number {
  return reports.filter((r) => r.errors === 0).length;
}
