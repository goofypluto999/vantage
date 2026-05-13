// useApplicationTracker — pure client-side localStorage CRM for job
// applications the user is actively running.
//
// Built 2026-05-11 as the companion piece to the upcoming job-search
// feature: jobs saved from search will feed into this tracker, and
// users coming in via the existing tool flow can manually log jobs.
//
// Design pillars (mirrors useFormDraft / useResultHistory patterns):
//   - User-scoped storage key (segregates by signed-in user.id)
//   - Byte caps + quota-error retry that sheds oldest first
//   - Cross-tab `storage` event sync
//   - Sweep helper for logout
//   - Schema-versioned key for forward compatibility
//
// Privacy posture:
//   - Stored: company, role, status, source URL, salary band the user
//     typed, free-text notes
//   - NOT stored: the user's CV, the full JD, any AI output
//   - Storage is device localStorage only — no server transit
//   - User-scope key prevents shared-device leakage; sweep on logout

import { useCallback, useEffect, useState } from 'react';

const STORAGE_VERSION = 1;
const DEFAULT_MAX_ENTRIES = 200; // ~200 active applications is a lot
const MAX_BYTES = 512 * 1024; // 512KB total
const MAX_BYTES_PER_ENTRY = 8 * 1024; // 8KB per entry (notes can be long)

/** Pipeline statuses, ordered by "natural progression" (used for sort). */
export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'phone-screen',
  'on-site',
  'offer',
  'rejected',
  'withdrawn',
] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  'saved': 'Saved',
  'applied': 'Applied',
  'phone-screen': 'Phone screen',
  'on-site': 'On-site / final round',
  'offer': 'Offer',
  'rejected': 'Rejected',
  'withdrawn': 'Withdrawn',
};

export interface ApplicationEntry {
  /** Stable ID — caller-supplied or generated. */
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  /** Source URL (LinkedIn / company careers page / job board). Optional. */
  sourceUrl?: string;
  location?: string;
  /** Salary band as typed by the user, e.g. "£75-90k" or "remote, USD" */
  salaryBand?: string;
  /** ISO date string (YYYY-MM-DD) when the user applied. */
  appliedDate?: string;
  /** Free-text notes. Capped at 1000 chars to bound size. */
  notes?: string;
  /** Auto-updated timestamps. */
  createdAt: number;
  updatedAt: number;
}

interface Stored {
  v: number;
  entries: ApplicationEntry[];
}

export interface UseApplicationTrackerReturn {
  entries: ApplicationEntry[];
  add: (entry: Omit<ApplicationEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  update: (id: string, patch: Partial<Omit<ApplicationEntry, 'id' | 'createdAt'>>) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Returns true if the entry passes all active filters. */
  filterEntry: (entry: ApplicationEntry, filters: TrackerFilters) => boolean;
}

export interface TrackerFilters {
  /** Statuses to include (empty = all). */
  statuses: ApplicationStatus[];
  /** Free-text search across company + role + notes. */
  query: string;
}

function buildKey(userScope?: string): string {
  const base = 'vantage-tracker-v1';
  return userScope ? `${base}:${userScope}` : base;
}

function readSafe(key: string): ApplicationEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (!parsed || !Array.isArray(parsed.entries)) return [];
    // Forward-version safety (review MED): when we detect a v>STORAGE_VERSION
    // entry from a future deploy, preserve the raw blob under a backup key
    // so a downgrade doesn't lose user data, then return []. Older versions
    // (v<STORAGE_VERSION) just return [] — they were a one-off, no upgrade
    // path needed yet.
    if (typeof parsed.v === 'number' && parsed.v > STORAGE_VERSION) {
      try {
        window.localStorage.setItem(`${key}:backup-v${parsed.v}`, raw);
      } catch { /* ignore */ }
      return [];
    }
    if (parsed.v !== STORAGE_VERSION) return [];
    return parsed.entries.filter(isValidEntry);
  } catch {
    return [];
  }
}

function isValidEntry(e: any): e is ApplicationEntry {
  return (
    !!e &&
    typeof e === 'object' &&
    typeof e.id === 'string' &&
    typeof e.company === 'string' &&
    typeof e.role === 'string' &&
    typeof e.status === 'string' &&
    (APPLICATION_STATUSES as readonly string[]).includes(e.status) &&
    typeof e.createdAt === 'number' &&
    typeof e.updatedAt === 'number'
  );
}

/** Write with byte budget enforcement + quota retry. */
/**
 * Broadcast a same-tab change event so all useApplicationTracker hook
 * instances (e.g. JobSearchSection's + ApplicationTracker's) refresh
 * their `entries` state immediately after a write. The browser's
 * 'storage' event doesn't fire in the writing tab, so without this
 * dispatch one hook instance can save and the other doesn't see it
 * until a refresh. Detail carries the storage key so listeners can
 * filter to their own scope.
 */
function broadcastChange(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('vantage-tracker:change', { detail: { key } }));
  } catch { /* CustomEvent unsupported — best-effort */ }
}

function writeSafe(key: string, entries: ApplicationEntry[]): boolean {
  if (typeof window === 'undefined') return false;
  // Reject any single entry exceeding the per-entry budget.
  const filtered = entries.filter((e) => {
    try {
      return JSON.stringify(e).length <= MAX_BYTES_PER_ENTRY;
    } catch {
      return false;
    }
  });
  let attempt = filtered.slice();
  while (attempt.length > 0) {
    let serialized: string;
    try {
      serialized = JSON.stringify({ v: STORAGE_VERSION, entries: attempt });
    } catch {
      attempt.pop();
      continue;
    }
    if (serialized.length <= MAX_BYTES) {
      try {
        window.localStorage.setItem(key, serialized);
        broadcastChange(key);
        return true;
      } catch {
        attempt.pop();
        continue;
      }
    } else {
      attempt.pop();
    }
  }
  // Edge case: empty payload still serializable
  try {
    window.localStorage.setItem(key, JSON.stringify({ v: STORAGE_VERSION, entries: [] }));
    broadcastChange(key);
    return true;
  } catch {
    return false;
  }
}

function genId(): string {
  // Crypto-strong if available, fallback to time + random.
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* ignore */ }
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useApplicationTracker(
  options: { userScope?: string; maxEntries?: number; enabled?: boolean } = {},
): UseApplicationTrackerReturn {
  const { userScope, maxEntries = DEFAULT_MAX_ENTRIES, enabled = true } = options;
  const key = buildKey(userScope);
  const [entries, setEntries] = useState<ApplicationEntry[]>([]);

  // Load on mount + when scope changes
  useEffect(() => {
    if (!enabled) return;
    setEntries(readSafe(key));
  }, [key, enabled]);

  // Cross-tab + cross-component sync.
  //
  // The 'storage' event ONLY fires in OTHER tabs/windows — never in the
  // tab that triggered the write. So when JobSearchSection's hook
  // instance adds an entry and ApplicationTracker's hook instance is
  // mounted in the same document, the tracker doesn't see the change
  // until a full re-render or page refresh. Reported 2026-05-12:
  // 'when I click the Save to tracker, it does not save to the tracker
  // section live, it might work when I refresh the page'.
  //
  // Fix: emit a custom DOM event on every local write, listen for it
  // in every hook instance, and re-read from localStorage on receipt.
  // This is the cheapest cross-instance pub-sub that doesn't require
  // a React context refactor.
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setEntries(readSafe(key));
    };
    const onLocalChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string } | undefined;
      if (!detail || detail.key === key) setEntries(readSafe(key));
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('vantage-tracker:change', onLocalChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('vantage-tracker:change', onLocalChange);
    };
  }, [key, enabled]);

  const add = useCallback(
    (entry: Omit<ApplicationEntry, 'id' | 'createdAt' | 'updatedAt'>): string => {
      if (!enabled) return '';
      const now = Date.now();
      const full: ApplicationEntry = {
        ...entry,
        id: genId(),
        createdAt: now,
        updatedAt: now,
      };
      // Cap notes
      if (full.notes && full.notes.length > 1000) {
        full.notes = full.notes.slice(0, 1000);
      }
      const fromDisk = readSafe(key);
      const next = [full, ...fromDisk].slice(0, maxEntries);
      // Return empty string on persistence failure (quota exhausted, security
      // policy blocking localStorage, etc.) so the caller can surface a toast
      // and not falsely claim success. Previously this returned `full.id`
      // even when writeSafe silently failed, which made the UI claim the
      // job was saved when it actually wasn't.
      const ok = writeSafe(key, next);
      setEntries(readSafe(key));
      return ok ? full.id : '';
    },
    [key, enabled, maxEntries],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<ApplicationEntry, 'id' | 'createdAt'>>) => {
      if (!enabled) return;
      const fromDisk = readSafe(key);
      const next = fromDisk.map((e) => {
        if (e.id !== id) return e;
        const merged: ApplicationEntry = { ...e, ...patch, updatedAt: Date.now() };
        if (merged.notes && merged.notes.length > 1000) {
          merged.notes = merged.notes.slice(0, 1000);
        }
        return merged;
      });
      writeSafe(key, next);
      setEntries(readSafe(key));
    },
    [key, enabled],
  );

  const remove = useCallback(
    (id: string) => {
      if (!enabled) return;
      const fromDisk = readSafe(key);
      const next = fromDisk.filter((e) => e.id !== id);
      writeSafe(key, next);
      // Re-read after write so we see what writeSafe actually persisted
      // (quota retry may have shed entries). Matches add/update pattern.
      setEntries(readSafe(key));
    },
    [key, enabled],
  );

  const clear = useCallback(() => {
    if (!enabled) return;
    setEntries([]);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch { /* ignore */ }
    }
  }, [key, enabled]);

  const filterEntry = useCallback(
    (entry: ApplicationEntry, filters: TrackerFilters): boolean => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(entry.status)) return false;
      const q = (filters.query || '').trim().toLowerCase();
      if (!q) return true;
      const haystack = `${entry.company} ${entry.role} ${entry.notes || ''} ${entry.location || ''}`.toLowerCase();
      return haystack.includes(q);
    },
    [],
  );

  return { entries, add, update, remove, clear, filterEntry };
}

/** Sweep helper called by Dashboard.handleSignOut. */
export function sweepTrackerForUser(userScope: string | undefined): void {
  if (typeof window === 'undefined' || !userScope) return;
  try {
    window.localStorage.removeItem(buildKey(userScope));
  } catch { /* ignore */ }
}

/** Returns true if the entry is "stale" — no progression beyond a
 * threshold tied to the current status. UI surfaces a follow-up nudge.
 *
 * Thresholds (multi-agent review MED — was previously only `applied`):
 *   - applied:      14 days since applied date
 *   - phone-screen: 21 days since updatedAt
 *   - on-site:      14 days since updatedAt
 * Other statuses (saved/offer/rejected/withdrawn) never go stale —
 * by design (offer/rejected/withdrawn are terminal; saved is a draft). */
export function isStaleApplication(entry: ApplicationEntry, now: number = Date.now()): boolean {
  const dayMs = 1000 * 60 * 60 * 24;
  if (entry.status === 'applied') {
    if (!entry.appliedDate) return false;
    const applied = Date.parse(entry.appliedDate);
    if (Number.isNaN(applied)) return false;
    return (now - applied) / dayMs >= 14;
  }
  if (entry.status === 'phone-screen') {
    return (now - entry.updatedAt) / dayMs >= 21;
  }
  if (entry.status === 'on-site') {
    return (now - entry.updatedAt) / dayMs >= 14;
  }
  return false;
}
