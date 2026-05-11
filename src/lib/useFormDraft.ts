// useFormDraft — small persistence hook for multi-field forms.
//
// Built 2026-05-11. Hardened in the same session after a multi-agent
// security + UX review surfaced four issues this rewrite addresses:
//   - HIGH: clearDraft did not cancel the pending debounce → the next
//     auto-save fired ~500ms later and resurrected the cleared draft.
//     Fixed via `suppressNextWritesRef` + explicit timer cancel.
//   - HIGH: storage key was global per-deploy → on a shared device, the
//     next user could read the previous user's salary+PII draft. Fixed
//     via the optional `userScope` parameter — caller passes auth user
//     id; key becomes `<base>:<userScope>` and is segregated per user.
//   - MED: header comment ("no PII persisted") was misleading. Rewritten
//     to be truthful: this DOES persist whatever the caller passes,
//     including free-text PII. Callers must accept that risk explicitly.
//   - MED: no programmatic way to clear across tabs. Added a `storage`
//     event listener so a clear in Tab A propagates a soft-reset signal
//     to Tab B (it stops auto-saving until the user actively types).
//
// What it does:
//   1. Watches the supplied draft object. On every render where the
//      draft changes, debounces 500ms and writes to localStorage.
//   2. On mount the saved draft (if any, and not expired) is returned
//      via `loadDraft()` — caller decides whether to restore.
//   3. `clearDraft()` cancels any pending write, removes the storage
//      entry, AND suppresses the next render-driven save so the caller
//      can clear-then-render-fresh-state without re-saving.
//
// What it deliberately DOES NOT do:
//   - Touch sessionStorage or cookies
//   - Send anything to the server
//   - Scrub PII from the caller's payload — the caller is responsible
//     for what it persists
//   - Provide TTL enforcement that resists tampering (savedAt is
//     client-controlled; treat as a UX timer, not a security boundary)
//
// Storage shape (forward-compatible):
//   { v: 1, savedAt: <ms timestamp>, data: <draft object> }
//
// TTL is 7 days by default. After that the saved entry is ignored and
// silently overwritten on next save.

import { useEffect, useRef, useCallback } from 'react';

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEBOUNCE_MS = 500;
const STORAGE_VERSION = 1;

interface StoredDraft<T> {
  v: number;
  savedAt: number;
  data: T;
}

export interface UseFormDraftReturn<T> {
  /** Returns the saved draft if one exists and is not expired, else null.
   * Caller decides whether to restore (typically by prompting the user). */
  loadDraft: () => T | null;
  /** Cancels any in-flight debounced save, wipes the saved entry,
   * AND suppresses the next render-driven auto-save so a "Start fresh"
   * flow can't resurrect the cleared draft 500ms later. */
  clearDraft: () => void;
}

export interface UseFormDraftOptions {
  enabled?: boolean;
  ttlMs?: number;
  /** Scope the storage key to a user identity. Critical on shared
   * devices: prevents user B from reading user A's draft. Pass the
   * authenticated user's id (or any stable per-user string). When
   * absent, the key is shared across all visitors on the device. */
  userScope?: string;
}

function buildKey(base: string, userScope?: string): string {
  if (!userScope) return base;
  // The user-scope segment is appended after `:` so a future migration
  // can reliably split base+scope without ambiguity.
  return `${base}:${userScope}`;
}

/**
 * Persist a form's state to localStorage with debouncing + TTL.
 *
 * Usage:
 *   const { loadDraft, clearDraft } = useFormDraft(
 *     'vantage-foo-v1',
 *     { companyName, roleName, ... },
 *     { userScope: profile?.id }
 *   );
 *
 * `key` must be stable across renders. Bump the trailing version
 * suffix (e.g. `-v2`) whenever the draft shape changes incompatibly.
 *
 * `enabled = false` is a no-op (useful for SSR/prerender or tests).
 */
export function useFormDraft<T extends object>(
  key: string,
  draft: T,
  options: UseFormDraftOptions = {},
): UseFormDraftReturn<T> {
  const { enabled = true, ttlMs = DEFAULT_TTL_MS, userScope } = options;
  const scopedKey = buildKey(key, userScope);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;
  // Suppression flag: when true, the auto-save effect skips its next
  // write and resets the flag. Set by clearDraft() so the cleared
  // state is not re-saved by an in-flight render cycle.
  const suppressNextWriteRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    if (suppressNextWriteRef.current) {
      // Caller just cleared; skip this cycle's write and re-arm normally
      // for the cycle after that.
      suppressNextWriteRef.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const payload: StoredDraft<T> = {
          v: STORAGE_VERSION,
          savedAt: Date.now(),
          data: draftRef.current,
        };
        window.localStorage.setItem(scopedKey, JSON.stringify(payload));
      } catch {
        // Quota exceeded, storage disabled (private mode), etc.
        // Silently skip — auto-save is best-effort, never a blocker.
      }
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scopedKey, draft, enabled]);

  // Cross-tab clear signal: if another tab calls clearDraft, this tab
  // also stops trying to auto-save until the user types something new.
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === scopedKey && e.newValue === null) {
        // Another tab cleared this draft. Cancel any pending write so
        // we don't resurrect it.
        if (timerRef.current) clearTimeout(timerRef.current);
        suppressNextWriteRef.current = true;
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [scopedKey, enabled]);

  const loadDraft = useCallback((): T | null => {
    if (!enabled) return null;
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(scopedKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredDraft<T>>;
      if (!parsed || parsed.v !== STORAGE_VERSION) return null;
      if (typeof parsed.savedAt !== 'number') return null;
      if (Date.now() - parsed.savedAt > ttlMs) {
        window.localStorage.removeItem(scopedKey);
        return null;
      }
      return (parsed.data as T) ?? null;
    } catch {
      return null;
    }
  }, [scopedKey, enabled, ttlMs]);

  const clearDraft = useCallback(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    if (timerRef.current) clearTimeout(timerRef.current);
    suppressNextWriteRef.current = true;
    try {
      window.localStorage.removeItem(scopedKey);
    } catch {
      // ignore
    }
  }, [scopedKey, enabled]);

  return { loadDraft, clearDraft };
}

/**
 * Sweep all Vantage draft + history keys for the given user from
 * localStorage. Call on logout to prevent shared-device leakage of
 * salary/PII fields across users.
 *
 * Conservative: only touches keys with our `vantage-` prefix. Safe
 * against accidental damage to other origins' storage.
 */
export function sweepDraftsForUser(userScope: string | undefined): void {
  if (typeof window === 'undefined') return;
  if (!userScope) return;
  try {
    const suffix = `:${userScope}`;
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('vantage-') && k.endsWith(suffix)) {
        toRemove.push(k);
      }
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
