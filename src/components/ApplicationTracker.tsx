// ApplicationTracker — compact CRM panel for Dashboard.
//
// Pure client-side (useApplicationTracker localStorage hook). User-
// scoped storage segregates per-user; swept on logout. No server
// transit, no token cost.
//
// Built 2026-05-11 as the companion to the upcoming job-search
// feature. Today: manually log + track applications. Phase 2 (when
// job search ships): "Save to tracker" button in search results
// auto-populates company + role + URL.
//
// UX pillars:
//   - Inline add (no full modal) — friction-light
//   - Status pipeline shown as horizontal chips with counts
//   - Stale-flag surfaced on Applied >14d (so user knows to follow up)
//   - Inline expand/edit per row
//   - Animated transitions (Framer Motion) on add/remove/status-change
//   - role="region" + keyboard accessible

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Plus, X, Search, AlertTriangle, ExternalLink, Edit2, Check, Download, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  useApplicationTracker,
  APPLICATION_STATUSES,
  STATUS_LABEL,
  isStaleApplication,
  type ApplicationStatus,
  type ApplicationEntry,
  type TrackerFilters,
} from '../lib/useApplicationTracker';

interface Props {
  userScope?: string;
}

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  'saved':        'bg-slate-500/15 text-slate-300 border-slate-500/30',
  'applied':      'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'phone-screen': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'on-site':      'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'offer':        'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'rejected':     'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'withdrawn':    'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
};

export default function ApplicationTracker({ userScope }: Props) {
  const { t } = useTheme();
  const { entries, add, update, remove, clear, filterEntry } = useApplicationTracker({ userScope });

  // Add-form state — inline, not a modal
  const [showAdd, setShowAdd] = useState(false);
  const [draftCompany, setDraftCompany] = useState('');
  const [draftRole, setDraftRole] = useState('');
  const [draftStatus, setDraftStatus] = useState<ApplicationStatus>('saved');
  const [draftUrl, setDraftUrl] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftSalary, setDraftSalary] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [draftNotes, setDraftNotes] = useState('');

  // Filters
  const [activeStatuses, setActiveStatuses] = useState<ApplicationStatus[]>([]);
  const [query, setQuery] = useState('');
  // Stale-only filter — toggled by clicking the 'N stale' chip in the header.
  // When true, hides all non-stale entries so the user can focus on
  // follow-ups. Clear with a 'show all' button on the empty-state copy.
  const [staleOnly, setStaleOnly] = useState(false);
  const filters: TrackerFilters = { statuses: activeStatuses, query };

  // Expanded-row tracking
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Per-row edit drafts (only one editable at a time)
  const [editId, setEditId] = useState<string | null>(null);
  const [editPatch, setEditPatch] = useState<Partial<ApplicationEntry>>({});
  const editDirtyRef = useRef(false);

  // First-input focus on add-form open (review LOW). Without this, the
  // user has to Tab from the toggle button into the form — friction.
  const firstAddInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showAdd) {
      const t = setTimeout(() => firstAddInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showAdd]);

  const filtered = useMemo(
    () => entries.filter((e) => {
      if (!filterEntry(e, filters)) return false;
      if (staleOnly && !isStaleApplication(e)) return false;
      return true;
    }),
    [entries, filters, filterEntry, staleOnly],
  );

  // Counts per status — drives chip badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of APPLICATION_STATUSES) counts[s] = 0;
    for (const e of entries) counts[e.status] = (counts[e.status] || 0) + 1;
    return counts;
  }, [entries]);

  const staleCount = useMemo(
    () => entries.filter((e) => isStaleApplication(e)).length,
    [entries],
  );

  function resetDraft() {
    setDraftCompany('');
    setDraftRole('');
    setDraftStatus('saved');
    setDraftUrl('');
    setDraftLocation('');
    setDraftSalary('');
    setDraftDate('');
    setDraftNotes('');
  }

  function handleAdd() {
    if (!draftCompany.trim() || !draftRole.trim()) return;
    add({
      company: draftCompany.trim(),
      role: draftRole.trim(),
      status: draftStatus,
      sourceUrl: draftUrl.trim() || undefined,
      location: draftLocation.trim() || undefined,
      salaryBand: draftSalary.trim() || undefined,
      appliedDate: draftDate.trim() || undefined,
      notes: draftNotes.trim() || undefined,
    });
    resetDraft();
    setShowAdd(false);
  }

  function toggleStatusFilter(s: ApplicationStatus) {
    setActiveStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function startEdit(entry: ApplicationEntry) {
    // If switching away from a dirty edit on another row, confirm
    // first (review MED — was silently discarding the patch).
    if (editId && editId !== entry.id && editDirtyRef.current) {
      if (!window.confirm('You have unsaved changes on another row. Discard them?')) return;
    }
    setEditId(entry.id);
    setEditPatch({ ...entry });
    editDirtyRef.current = false;
  }
  function saveEdit() {
    if (!editId) return;
    update(editId, editPatch);
    setEditId(null);
    setEditPatch({});
    editDirtyRef.current = false;
  }
  function cancelEdit() {
    if (editDirtyRef.current) {
      if (!window.confirm('Discard unsaved changes?')) return;
    }
    setEditId(null);
    setEditPatch({});
    editDirtyRef.current = false;
  }
  function patchEdit(p: Partial<ApplicationEntry>) {
    setEditPatch((prev) => ({ ...prev, ...p }));
    editDirtyRef.current = true;
  }

  // Confirm-then-remove. Single-row delete was previously silent (review MED).
  function confirmRemove(entry: ApplicationEntry) {
    if (window.confirm(`Remove "${entry.company} — ${entry.role}" from your tracker?`)) {
      remove(entry.id);
    }
  }

  /**
   * Export the current tracker to a CSV file. Insurance against
   * localStorage loss (browser nuke, switch devices, private mode) —
   * the description copy promises 'synced to your account next push'
   * but until that ships, CSV export is the user's safety net.
   *
   * CSV escaping: any field containing a comma, double-quote, or
   * newline gets wrapped in double-quotes with internal quotes doubled,
   * per RFC 4180. Otherwise rendered raw. Tests via opening in Excel /
   * Google Sheets / Numbers — all parse correctly.
   */
  function csvEscape(v: string | number | undefined | null): string {
    if (v === null || v === undefined) return '';
    let s = String(v);
    // CSV INJECTION DEFENSE (OWASP / CWE-1236). Excel, LibreOffice, and
    // Google Sheets execute any cell starting with =, +, -, @, or tab/CR
    // as a formula — including externally-fetched payloads like
    // =cmd|'/c calc'!A1 which can run arbitrary commands on the user's
    // machine when they open our exported CSV. Prefix a single tick to
    // such fields so spreadsheets render them as text but the original
    // value is still visible. Council review 2026-05-13 flagged this
    // as critical before the export feature shipped.
    if (/^[=+\-@\t\r]/.test(s)) {
      s = "'" + s;
    }
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  function exportToCsv() {
    if (entries.length === 0) return; // button is hidden in this state
    const header = [
      'Company', 'Role', 'Status', 'Source URL', 'Location', 'Salary band',
      'Applied date', 'Notes', 'Created', 'Updated', 'Stale flag',
    ].join(',');
    const rows = entries.map((e) => [
      csvEscape(e.company),
      csvEscape(e.role),
      csvEscape(STATUS_LABEL[e.status] || e.status),
      csvEscape(e.sourceUrl),
      csvEscape(e.location),
      csvEscape(e.salaryBand),
      csvEscape(e.appliedDate),
      csvEscape(e.notes),
      csvEscape(new Date(e.createdAt).toISOString()),
      csvEscape(new Date(e.updatedAt).toISOString()),
      csvEscape(isStaleApplication(e) ? 'YES' : ''),
    ].join(','));
    // BOM so Excel opens the file as UTF-8 correctly (without BOM, accented
    // characters in company names / notes render as garbage on Windows Excel).
    const csv = '﻿' + header + '\n' + rows.join('\n') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    a.href = url;
    a.download = `vantage-tracker-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke async so some browsers (Safari) finish the download before
    // the URL is invalidated.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * RFC 4180 CSV parser. Handles quoted fields containing commas,
   * embedded newlines, and escaped double-quotes (""). State machine:
   *
   *   normal      — outside quotes
   *   quoted      — inside quotes; commas/newlines are literal
   *   quoted-end  — saw a closing quote; next char decides: '"' → escaped,
   *                 anything else → end of field
   *
   * Returns rows as string[][]. Empty/whitespace-only input returns [].
   * Leading UTF-8 BOM is stripped if present (our exporter writes one).
   */
  function parseCsv(text: string): string[][] {
    if (!text || typeof text !== 'string') return [];
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let state: 'normal' | 'quoted' | 'quoted-end' = 'normal';
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i];
      if (state === 'normal') {
        if (c === '"') { state = 'quoted'; continue; }
        if (c === ',') { row.push(field); field = ''; continue; }
        if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
        if (c === '\r') { continue; } // strip CR; treat CRLF as just LF
        field += c;
      } else if (state === 'quoted') {
        if (c === '"') { state = 'quoted-end'; continue; }
        // CRLF normalization inside quoted fields: a literal \r before a
        // \n is part of the line break, not the data. Strip stray \r so
        // round-tripping a Windows-exported CSV doesn't leave artifacts
        // in the field. Council finding.
        if (c === '\r' && text[i + 1] === '\n') continue;
        field += c; // commas, newlines, etc. are literal inside quotes
      } else { // quoted-end
        if (c === '"') { field += '"'; state = 'quoted'; continue; }
        if (c === ',') { row.push(field); field = ''; state = 'normal'; continue; }
        if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; state = 'normal'; continue; }
        if (c === '\r') { state = 'normal'; continue; }
        // Stray data after closing quote (malformed CSV) — treat as normal
        field += c; state = 'normal';
      }
    }
    // Tail: flush any pending field/row
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows;
  }

  /**
   * Reverse the CSV-injection tick prefix added by csvEscape on export.
   * Without this, importing back a previously-exported file would carry
   * extra apostrophes on any field that started with =/+/-/@ — visibly
   * wrong.
   */
  function stripExportTick(s: string): string {
    if (s.length >= 2 && s[0] === "'" && /^[=+\-@\t\r]/.test(s[1])) {
      return s.slice(1);
    }
    return s;
  }

  /** Reverse-map STATUS_LABEL display strings to canonical status codes. */
  function parseStatus(s: string): ApplicationStatus | null {
    const trimmed = (s || '').trim().toLowerCase();
    if (!trimmed) return null;
    // Direct match on canonical code
    if ((APPLICATION_STATUSES as readonly string[]).includes(trimmed)) {
      return trimmed as ApplicationStatus;
    }
    // Match on display label
    for (const code of APPLICATION_STATUSES) {
      if (STATUS_LABEL[code].toLowerCase() === trimmed) return code;
    }
    return null;
  }

  // Import-mode state — confirmation modal showing a preview of how
  // many valid rows we parsed and asking whether to replace or append.
  // statusesCoerced counts how many rows had an unrecognised Status value
  // that we silently defaulted to 'saved' — surfaced in the preview so
  // the user isn't surprised when half their data ends up under "Saved".
  type ImportRow = Omit<ApplicationEntry, 'id' | 'createdAt' | 'updatedAt'> & {
    _preserveCreatedAt?: number;
    _preserveUpdatedAt?: number;
  };
  const [importPreview, setImportPreview] = useState<{
    valid: ImportRow[];
    skipped: number;
    statusesCoerced: number;
    totalParsed: number;
    fileName: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImportFile(file: File) {
    if (!file) return;
    // Tightened from 5MB to 2MB: the tracker caps at 200 entries × ~8KB
    // per entry = ~1.6MB worst case. 2MB gives headroom without inviting
    // pathological inputs that would burn memory during parse. Council
    // finding.
    if (file.size > 2 * 1024 * 1024) {
      window.alert('File is larger than 2MB. The tracker stores at most 200 applications — please trim the CSV and try again.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => window.alert('Could not read the file. Make sure it is a valid CSV.');
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const rows = parseCsv(text);
        if (rows.length < 2) {
          window.alert('CSV is empty or has no data rows after the header.');
          return;
        }
        // Match columns by header name so reordered exports still work.
        const header = rows[0].map((h) => h.trim().toLowerCase());
        const col = (name: string) => header.indexOf(name.toLowerCase());
        const iCompany = col('Company');
        const iRole = col('Role');
        const iStatus = col('Status');
        const iUrl = col('Source URL');
        const iLocation = col('Location');
        const iSalary = col('Salary band');
        const iApplied = col('Applied date');
        const iNotes = col('Notes');
        // Optional: round-trip support for Created/Updated columns
        // (preserves stale-flag timeline). Council finding: without
        // these, a re-import resets every entry's createdAt to 'now',
        // hiding all follow-up nudges.
        const iCreated = col('Created');
        const iUpdated = col('Updated');
        if (iCompany < 0 || iRole < 0) {
          window.alert('CSV is missing required columns (need at least Company and Role).');
          return;
        }
        const valid: ImportRow[] = [];
        let skipped = 0;
        let statusesCoerced = 0;
        for (let r = 1; r < rows.length; r += 1) {
          const row = rows[r];
          if (row.length === 0 || (row.length === 1 && row[0] === '')) continue; // blank line
          const company = stripExportTick((row[iCompany] || '').trim());
          const role = stripExportTick((row[iRole] || '').trim());
          if (!company || !role) { skipped += 1; continue; }
          const statusRaw = iStatus >= 0 ? stripExportTick((row[iStatus] || '').trim()) : '';
          const parsedStatus = parseStatus(statusRaw);
          if (statusRaw && !parsedStatus) statusesCoerced += 1;
          const status: ApplicationStatus = parsedStatus || 'saved';
          const sourceUrl = iUrl >= 0 ? stripExportTick((row[iUrl] || '').trim()) : '';
          const location = iLocation >= 0 ? stripExportTick((row[iLocation] || '').trim()) : '';
          const salaryBand = iSalary >= 0 ? stripExportTick((row[iSalary] || '').trim()) : '';
          // Normalize appliedDate to YYYY-MM-DD. Free-text dates ("yesterday",
          // "5/5/2025", "May 5th") break the stale-flag timeline (Date.parse
          // returns NaN, isStaleApplication returns false, follow-up nudge
          // never fires) AND the edit form's type="date" input can't display
          // them so they appear blank in the UI. Drop unparseable values
          // entirely — better blank than misleading.
          let appliedDate: string = '';
          if (iApplied >= 0) {
            const raw = stripExportTick((row[iApplied] || '').trim());
            if (raw) {
              if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
                appliedDate = raw;
              } else {
                const ms = Date.parse(raw);
                if (Number.isFinite(ms)) {
                  const d = new Date(ms);
                  // Sanity: reject dates >5y old or >1y in the future to
                  // catch obvious parsing mistakes like Date.parse('1234').
                  const now = Date.now();
                  const fiveYearsMs = 5 * 365 * 24 * 60 * 60 * 1000;
                  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
                  if (ms >= now - fiveYearsMs && ms <= now + oneYearMs) {
                    appliedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  }
                }
              }
            }
          }
          const notes = iNotes >= 0 ? stripExportTick((row[iNotes] || '').trim()).slice(0, 1000) : '';
          // Parse ISO Created/Updated if present. Date.parse returns
          // NaN on invalid input — caught by add()'s isValidTs guard.
          const createdRaw = iCreated >= 0 ? stripExportTick((row[iCreated] || '').trim()) : '';
          const updatedRaw = iUpdated >= 0 ? stripExportTick((row[iUpdated] || '').trim()) : '';
          const createdMs = createdRaw ? Date.parse(createdRaw) : NaN;
          const updatedMs = updatedRaw ? Date.parse(updatedRaw) : NaN;
          valid.push({
            company: company.slice(0, 200),
            role: role.slice(0, 200),
            status,
            sourceUrl: sourceUrl || undefined,
            location: location || undefined,
            salaryBand: salaryBand || undefined,
            appliedDate: appliedDate || undefined,
            notes: notes || undefined,
            _preserveCreatedAt: Number.isFinite(createdMs) ? createdMs : undefined,
            _preserveUpdatedAt: Number.isFinite(updatedMs) ? updatedMs : undefined,
          });
        }
        if (valid.length === 0) {
          window.alert(`No valid rows found in ${file.name} (parsed ${rows.length - 1}, all skipped due to missing Company/Role).`);
          return;
        }
        setImportPreview({ valid, skipped, statusesCoerced, totalParsed: rows.length - 1, fileName: file.name });
      } catch (err: any) {
        console.error('CSV parse error', err);
        window.alert('Could not parse the CSV. Make sure it was exported from Vantage or follows the same column layout.');
      } finally {
        // Allow re-importing the same file later (input wouldn't fire change otherwise)
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  }

  function commitImport(mode: 'append' | 'replace') {
    if (!importPreview) return;
    if (mode === 'replace') {
      if (!window.confirm(`This will REPLACE your ${entries.length} existing tracked application${entries.length === 1 ? '' : 's'} with the ${importPreview.valid.length} from ${importPreview.fileName}. Continue?`)) {
        return;
      }
      // Cancel any in-progress edit BEFORE clearing, so the editing UI
      // doesn't sit there referencing an id that no longer exists.
      // Council finding: without this, mid-edit Save would silently
      // vanish after a replace import.
      cancelEdit();
      setExpandedId(null);
      clear();
    }
    // Append in reverse so the first row in the CSV ends up first in the list
    // (`add` prepends — calling it from the bottom of the array keeps order).
    // Track persistence failures so we can honest-report partial imports
    // (writeSafe returns '' on quota exhaustion — see council finding).
    let writeFailures = 0;
    for (let i = importPreview.valid.length - 1; i >= 0; i -= 1) {
      const newId = add(importPreview.valid[i]);
      if (!newId) writeFailures += 1;
    }
    setImportPreview(null);
    if (writeFailures > 0) {
      window.alert(
        `Imported ${importPreview.valid.length - writeFailures} of ${importPreview.valid.length} entries. ` +
        `${writeFailures} couldn't be saved — your browser may be out of storage space, in private mode, ` +
        `or have site storage disabled.`
      );
    }
  }

  // Validate URL strictly — only http(s) schemes. Don't render a link
  // for anything else (defense in depth — `javascript:` etc).
  function safeHref(url: string | undefined): string | undefined {
    if (!url || typeof url !== 'string') return undefined;
    try {
      const u = new URL(url);
      if (u.protocol === 'http:' || u.protocol === 'https:') return url;
      return undefined;
    } catch {
      return undefined;
    }
  }

  return (
    <div
      id="application-tracker"
      role="region"
      aria-label="Application tracker"
      className="p-6 rounded-2xl bg-white/5 border border-white/10 scroll-mt-20"
    >
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-violet-400" aria-hidden="true" />
          Application Tracker
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold ml-2">New</span>
          {staleCount > 0 && (
            <button
              type="button"
              onClick={() => setStaleOnly((v) => !v)}
              aria-pressed={staleOnly}
              className={`px-2 py-0.5 rounded-full text-xs font-bold ml-1 inline-flex items-center gap-1 transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                staleOnly
                  ? 'bg-amber-500/40 text-amber-100 border border-amber-400/70'
                  : 'bg-amber-500/15 text-amber-300 border border-transparent hover:bg-amber-500/25 hover:border-amber-500/40'
              }`}
              title={staleOnly
                ? 'Currently showing only stale applications. Click to show all again.'
                : `Click to filter view to the ${staleCount} stale application${staleCount === 1 ? '' : 's'} (applied >14 days ago with no progression).`}
            >
              <AlertTriangle className="w-3 h-3" aria-hidden="true" /> {staleCount} stale {staleOnly && '✓'}
            </button>
          )}
        </h3>
        <div className="inline-flex items-center gap-2 flex-wrap">
          {/* Hidden file input — triggered by the Import button. ref'd so we
              can clear .value after each pick (otherwise re-importing the
              same file wouldn't fire `change`). */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
            }}
            aria-label="Choose a CSV file to import"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm font-semibold border border-white/15 transition focus:outline-none focus:ring-2 focus:ring-violet-400"
            title="Import a CSV of tracked applications. Useful when restoring from a Vantage export, moving devices, or migrating from another tracker."
            aria-label="Import tracked applications from a CSV file"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={exportToCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm font-semibold border border-white/15 transition focus:outline-none focus:ring-2 focus:ring-violet-400"
              title={`Download your ${entries.length} tracked application${entries.length === 1 ? '' : 's'} as a CSV file (opens in Excel / Google Sheets / Numbers). Insurance against localStorage loss.`}
              aria-label={`Export ${entries.length} tracked application${entries.length === 1 ? '' : 's'} as CSV`}
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-400"
            aria-expanded={showAdd}
          >
            {showAdd ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Track an application</>}
          </button>
        </div>
      </div>

      <p className={`text-sm ${t.textSub} mb-4`}>
        Track jobs you've applied to. Saved on this device only (synced to your account next push). Stale flag fires on applications &gt;14 days old with no progression.
      </p>

      {/* Inline add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 mb-4 rounded-lg bg-white/[0.03] border border-white/10">
              <div>
                <label htmlFor="trk-company" className="block text-xs font-semibold text-white/70 mb-1">Company *</label>
                <input
                  ref={firstAddInputRef}
                  id="trk-company"
                  type="text"
                  value={draftCompany}
                  onChange={(e) => setDraftCompany(e.target.value.slice(0, 120))}
                  placeholder="Stripe"
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label htmlFor="trk-role" className="block text-xs font-semibold text-white/70 mb-1">Role *</label>
                <input
                  id="trk-role"
                  type="text"
                  value={draftRole}
                  onChange={(e) => setDraftRole(e.target.value.slice(0, 160))}
                  placeholder="Senior Product Manager"
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label htmlFor="trk-status" className="block text-xs font-semibold text-white/70 mb-1">Status</label>
                <select
                  id="trk-status"
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value as ApplicationStatus)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="trk-date" className="block text-xs font-semibold text-white/70 mb-1">Applied date (optional)</label>
                <input
                  id="trk-date"
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label htmlFor="trk-location" className="block text-xs font-semibold text-white/70 mb-1">Location</label>
                <input
                  id="trk-location"
                  type="text"
                  value={draftLocation}
                  onChange={(e) => setDraftLocation(e.target.value.slice(0, 80))}
                  placeholder="London / Remote"
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label htmlFor="trk-salary" className="block text-xs font-semibold text-white/70 mb-1">Salary band</label>
                <input
                  id="trk-salary"
                  type="text"
                  value={draftSalary}
                  onChange={(e) => setDraftSalary(e.target.value.slice(0, 40))}
                  placeholder="£90-120k"
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="trk-url" className="block text-xs font-semibold text-white/70 mb-1">Source URL (https only)</label>
                <input
                  id="trk-url"
                  type="url"
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value.slice(0, 500))}
                  placeholder="https://stripe.com/jobs/listing/..."
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-baseline justify-between mb-1">
                  <label htmlFor="trk-notes" className="block text-xs font-semibold text-white/70">Notes (optional)</label>
                  <span
                    className={`text-[10px] tabular-nums ${
                      draftNotes.length >= 1000 ? 'text-rose-300 font-bold' :
                      draftNotes.length >= 900 ? 'text-amber-300' :
                      'text-white/40'
                    }`}
                    aria-live="polite"
                  >
                    {draftNotes.length} / 1000
                  </span>
                </div>
                <textarea
                  id="trk-notes"
                  rows={2}
                  value={draftNotes}
                  maxLength={1000}
                  onChange={(e) => setDraftNotes(e.target.value.slice(0, 1000))}
                  placeholder="Recruiter: Sarah. Mentioned signing on £15k. Next step: take-home."
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50 resize-y"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { resetDraft(); setShowAdd(false); }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/70 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!draftCompany.trim() || !draftRole.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  Add to tracker
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status filter chips with live counts */}
      {entries.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {APPLICATION_STATUSES.map((s) => {
              const active = activeStatuses.includes(s);
              const count = statusCounts[s] || 0;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatusFilter(s)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                    active
                      ? STATUS_COLOR[s]
                      : 'bg-white/[0.02] text-white/50 border-white/10 hover:bg-white/5'
                  }`}
                >
                  {STATUS_LABEL[s]}
                  <span className={`px-1.5 rounded-full text-[10px] ${active ? 'bg-black/20' : 'bg-white/5'}`}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, role, or notes…"
              aria-label="Search applications"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none focus:border-violet-500/50"
            />
          </div>
        </>
      )}

      {/* List */}
      {entries.length === 0 ? (
        <p className={`text-sm ${t.textMuted} text-center py-8`}>
          No applications tracked yet. Click <strong>Track an application</strong> above to log your first one.
        </p>
      ) : filtered.length === 0 ? (
        <div className={`text-sm ${t.textMuted} text-center py-6`}>
          <p>No matches. Clear filters to see all {entries.length} application{entries.length === 1 ? '' : 's'}.</p>
          {(staleOnly || activeStatuses.length > 0 || query.trim()) && (
            <button
              type="button"
              onClick={() => { setStaleOnly(false); setActiveStatuses([]); setQuery(''); }}
              className="mt-2 inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-violet-500/20 text-violet-200 hover:bg-violet-500/30 border border-violet-400/30 transition focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              Show all applications
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {filtered.map((entry) => {
              const isExpanded = expandedId === entry.id;
              const isEditing = editId === entry.id;
              const stale = isStaleApplication(entry);
              const href = safeHref(entry.sourceUrl);
              return (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-white/[0.03] border border-white/10 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="flex-1 text-left flex items-center gap-3 min-w-0 focus:outline-none focus:ring-2 focus:ring-violet-400 rounded"
                      aria-expanded={isExpanded}
                      aria-label={`${entry.company} — ${entry.role}, status ${STATUS_LABEL[entry.status]}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white truncate max-w-[40ch]">{entry.company}</span>
                          <span className="text-sm text-white/70 truncate max-w-[40ch]">— {entry.role}</span>
                          {stale && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3" aria-hidden="true" /> Follow up
                            </span>
                          )}
                        </div>
                        {(entry.location || entry.salaryBand || entry.appliedDate) && (
                          <div className="text-xs text-white/50 mt-0.5 flex flex-wrap gap-x-3">
                            {entry.location && <span>{entry.location}</span>}
                            {entry.salaryBand && <span>{entry.salaryBand}</span>}
                            {entry.appliedDate && <span>Applied {entry.appliedDate}</span>}
                          </div>
                        )}
                      </div>
                    </button>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLOR[entry.status]}`}>
                      {STATUS_LABEL[entry.status]}
                    </span>
                    <button
                      type="button"
                      onClick={() => isEditing ? cancelEdit() : startEdit(entry)}
                      aria-label={`Edit ${entry.company} ${entry.role}`}
                      className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded text-white/60 hover:text-white hover:bg-white/5 transition focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                      <Edit2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmRemove(entry)}
                      aria-label={`Remove ${entry.company} ${entry.role}`}
                      className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Expanded body */}
                  <AnimatePresence>
                    {(isExpanded || isEditing) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10"
                      >
                        <div className="p-3 space-y-2">
                          {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <select
                                value={editPatch.status || entry.status}
                                onChange={(e) => patchEdit({ status: e.target.value as ApplicationStatus })}
                                className="rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                                aria-label="Update status"
                              >
                                {APPLICATION_STATUSES.map((s) => (
                                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                                ))}
                              </select>
                              <input
                                type="date"
                                value={editPatch.appliedDate ?? entry.appliedDate ?? ''}
                                onChange={(e) => patchEdit({ appliedDate: e.target.value || undefined })}
                                aria-label="Applied date"
                                className="rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                              />
                              <div className="sm:col-span-2 relative">
                                <textarea
                                  rows={2}
                                  value={editPatch.notes ?? entry.notes ?? ''}
                                  maxLength={1000}
                                  onChange={(e) => patchEdit({ notes: e.target.value.slice(0, 1000) })}
                                  placeholder="Notes…"
                                  aria-label="Notes"
                                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50 resize-y"
                                />
                                {(() => {
                                  const current = (editPatch.notes ?? entry.notes ?? '').length;
                                  return (
                                    <span
                                      className={`absolute bottom-2 right-2 text-[10px] tabular-nums pointer-events-none ${
                                        current >= 1000 ? 'text-rose-300 font-bold' :
                                        current >= 900 ? 'text-amber-300' :
                                        'text-white/40'
                                      }`}
                                      aria-live="polite"
                                    >
                                      {current} / 1000
                                    </span>
                                  );
                                })()}
                              </div>
                              <div className="sm:col-span-2 flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={saveEdit}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition focus:outline-none focus:ring-2 focus:ring-violet-400"
                                >
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" /> Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {entry.notes && (
                                <p className="text-sm text-white/80 whitespace-pre-wrap">{entry.notes}</p>
                              )}
                              {href ? (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer nofollow"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 underline"
                                >
                                  Open source URL <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                              ) : entry.sourceUrl ? (
                                <p className="text-xs text-white/40 italic">Source URL not http(s) — not linked for safety.</p>
                              ) : null}
                              <p className="text-[10px] text-white/40">
                                Created {new Date(entry.createdAt).toLocaleDateString()}
                                {entry.updatedAt !== entry.createdAt && ` · Updated ${new Date(entry.updatedAt).toLocaleDateString()}`}
                              </p>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      {entries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <p className={`text-xs ${t.textMuted}`}>
            {entries.length} tracked · {staleCount} stale · saved on this device
          </p>
          <button
            type="button"
            onClick={() => { if (window.confirm('Clear all tracked applications? This cannot be undone.')) clear(); }}
            className={`text-xs underline ${t.textSub} hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-rose-400/50 rounded`}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Import preview modal — fixed overlay, dismissable, asks user
          whether to append the imported entries to existing or replace
          everything. Capacity warning surfaces when the import would
          exceed the 200-entry maxEntries cap. */}
      <AnimatePresence>
        {importPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm CSV import"
            onClick={(e) => { if (e.target === e.currentTarget) setImportPreview(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md p-5 rounded-2xl bg-[#181530] border-2 border-violet-500/40 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-start gap-3 mb-3">
                <Upload className="w-5 h-5 text-violet-300 flex-shrink-0 mt-1" aria-hidden="true" />
                <div className="flex-1">
                  <h4 className="text-base font-bold text-white">Import preview</h4>
                  <p className="text-xs text-white/60 mt-0.5">{importPreview.fileName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImportPreview(null)}
                  className="text-white/50 hover:text-white text-xl leading-none"
                  aria-label="Cancel import"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <ul className="text-sm text-white/80 space-y-1 mb-4">
                <li>· <strong className="text-emerald-300">{importPreview.valid.length}</strong> valid {importPreview.valid.length === 1 ? 'entry' : 'entries'} ready to import</li>
                {importPreview.skipped > 0 && (
                  <li>· <strong className="text-amber-300">{importPreview.skipped}</strong> row{importPreview.skipped === 1 ? '' : 's'} skipped (missing Company or Role)</li>
                )}
                {importPreview.statusesCoerced > 0 && (
                  <li>· <strong className="text-amber-300">{importPreview.statusesCoerced}</strong> {importPreview.statusesCoerced === 1 ? 'entry has' : 'entries have'} an unrecognised Status — will default to "Saved" (you can edit after import)</li>
                )}
                <li>· You currently have <strong>{entries.length}</strong> tracked application{entries.length === 1 ? '' : 's'}</li>
                {entries.length + importPreview.valid.length > 200 && (
                  <li className="text-amber-300">
                    ⚠ Append would push you over the 200-entry cap — the <strong>{Math.min(entries.length, entries.length + importPreview.valid.length - 200)} oldest application{(entries.length + importPreview.valid.length - 200) === 1 ? '' : 's'}</strong> you have today will be dropped to make room.
                  </li>
                )}
              </ul>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => commitImport('append')}
                  className="flex-1 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]"
                  title={`Add the ${importPreview.valid.length} imported ${importPreview.valid.length === 1 ? 'entry' : 'entries'} alongside your existing ${entries.length}. Most common choice.`}
                >
                  Append (keep existing)
                </button>
                <button
                  type="button"
                  onClick={() => commitImport('replace')}
                  className="px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 text-sm font-bold border border-rose-500/40 transition focus:outline-none focus:ring-2 focus:ring-rose-400 min-h-[44px]"
                  title={`Delete your existing ${entries.length} tracked application${entries.length === 1 ? '' : 's'} first, then import. Cannot be undone.`}
                  disabled={entries.length === 0}
                >
                  Replace all
                </button>
                <button
                  type="button"
                  onClick={() => setImportPreview(null)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-white/70 hover:text-white min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
