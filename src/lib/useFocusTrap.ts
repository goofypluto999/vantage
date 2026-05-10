import { useEffect, useRef, type RefObject } from 'react';

/**
 * useFocusTrap — keyboard focus management for modal dialogs.
 *
 * When `open` becomes true:
 *   1. Stores the currently-focused element so we can restore it on close.
 *   2. Focuses the first focusable element inside the ref'd container
 *      (or the container itself if it has tabIndex).
 *   3. Traps Tab + Shift+Tab inside the container — wraps from last → first
 *      and first → last so keyboard users can't escape into the page behind.
 *
 * When `open` becomes false:
 *   1. Restores focus to the previously-focused element.
 *
 * Combine with role="dialog" + aria-modal="true" + aria-labelledby on the
 * container, plus an ESC handler that flips `open` to false. WCAG 2.1.2
 * (No Keyboard Trap is satisfied because ESC + close button still exit).
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useFocusTrap(open, ref);
 *   return <div ref={ref} role="dialog" aria-modal>{...}</div>;
 *
 * Why a hook (not a wrapper component): React 19 strict-mode + Suspense
 * make wrapper components with refs fragile. A hook on the container is
 * the simplest pattern that works across HowItWorksModal, DemoWalkthrough,
 * AIInterviewSession, and the Dashboard demo popup.
 */
export function useFocusTrap<T extends HTMLElement>(
  open: boolean,
  containerRef: RefObject<T | null>,
): void {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    // Snapshot the element that had focus before the modal opened, so we
    // can return focus there on close. Skip body — body focus = no real
    // previous focus, restoring it would be a no-op.
    const active = document.activeElement;
    previouslyFocused.current =
      active && active !== document.body ? (active as HTMLElement) : null;

    const FOCUSABLE_SELECTOR = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const getFocusable = (): HTMLElement[] =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null);

    // Initial focus — first focusable element. Slight delay so child motion
    // animations (motion.div initial → animate) don't steal focus mid-tween.
    const focusFirst = () => {
      const focusables = getFocusable();
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        // Container itself if it has tabIndex (e.g. demo popup).
        if (container.hasAttribute('tabindex')) container.focus();
      }
    };
    const initialTimer = window.setTimeout(focusFirst, 50);

    // Tab trap — wrap focus from last → first on Tab, first → last on Shift+Tab.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(initialTimer);
      document.removeEventListener('keydown', onKeyDown);
      // Restore focus to the element that had it before open. Wrapped in
      // try/catch because the previously-focused element may have been
      // unmounted (rare but possible during route transitions).
      try {
        previouslyFocused.current?.focus();
      } catch { /* noop */ }
    };
  }, [open, containerRef]);
}
