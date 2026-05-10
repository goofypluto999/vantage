# ICO Registration Tracker

> Single source of truth for the ICO data-protection registration status.
> Update the status section as the registration progresses.

---

## Application reference

**Direct debit application reference: `C1928153`**

Issued: 2026-05-08 by ICO when Gio completed the direct-debit setup form.

This is **NOT** the public registration number. It's the reference for the
DD instruction itself — keep it on file but it doesn't go on the website.

Fee tier: Tier 1 (£40/year — sole trader, ≤10 staff, ≤£632k turnover).

---

## Status

- [x] **2026-05-08** — Direct debit instruction set up at ICO
- [ ] **~2026-05-13 to 2026-05-15** — ICO pulls £40 from Gio's bank account (BACS rules: 3-5 working days)
- [ ] **~2026-05-16 to 2026-05-20** — ICO confirms registration is live, sends email with ZA number
- [ ] **Once received** — Apply ZA number across the codebase (see "Swap procedure" below)

---

## What to expect from ICO

A confirmation email with subject roughly "Your ICO registration is now active" or "Your registration number is ZA…". The number will be in the format `ZA#######` (Z + 7 digits) or `ZA######` (Z + 6 digits).

You'll also be able to find yourself on the public register at
https://ico.org.uk/ESDWebPages/Search by searching "Giovanni Sizino Ennes"
or "Vantage AI".

If neither happens by 2026-05-22, contact ICO at 0303 123 1113 with the
DD reference C1928153.

---

## Swap procedure (when ZA number arrives)

Replace `<ZA-NUMBER>` with the actual issued number in 4 places. All edits
are pure copy substitution — no logic changes.

### 1. `src/components/PrivacyPolicy.tsx` — Section 2

Find:

```
Annual data protection fee paid via direct debit. Public registration
number will be added here once issued by the ICO (typically within 3-5
working days of payment).
```

Replace with:

```
Annual data protection fee paid via direct debit. ICO public registration
number: <ZA-NUMBER>.
```

### 2. `src/components/AboutPage.tsx` — Hard Facts ICO row

Find:

```
Registered as a data controller with the UK Information Commissioner's Office
(annual fee paid via direct debit, registration in progress as of 2026-05-08).
```

Replace with:

```
Registered as a data controller with the UK Information Commissioner's Office
under registration number <ZA-NUMBER>.
```

### 3. `src/components/LandingPage.tsx` — Trust bar (5th item)

Find:

```jsx
<span className="text-sm font-bold text-[#3B3A5C]">UK ICO Registered</span>
```

Replace with:

```jsx
<span className="text-sm font-bold text-[#3B3A5C]">ICO <ZA-NUMBER></span>
```

### 4. `docs/ico-registration-tracker.md` (this file)

Update the status checkboxes + add the ZA number under "Application
reference" so it's recorded in the codebase as well as the website.

---

## Optional: cross-site propagation

When the ZA number lands, it should also be applied to the other public
sites Gio operates as the same sole trader:

- Foresay Labs (foresay-labs-live.vercel.app) — privacy policy
- AdForge — privacy policy + footer
- Plate & Press / Etsy — Etsy shop policies if applicable
- Wadda Play — privacy policy
- LinkedIn Engine — internal only, not public-facing
- The Mansions Agency — internal only, not public-facing

Same registration covers all of them (sole trader = single data controller
= one ZA number).

---

## Why this file exists

The ZA number is going to arrive in ~5-10 days in an email Gio could
easily miss or lose. This file:
- Records the application reference C1928153 in the codebase (not just
  in his inbox)
- Documents the expected timeline so a future agent (or Gio) doesn't
  panic when the public register is empty for the first 10 days
- Provides a copy-paste swap procedure so the actual update is a 1-minute
  commit when the time comes

*Created 2026-05-10 during the conversion-fixes session.*
