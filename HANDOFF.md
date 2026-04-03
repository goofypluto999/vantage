# Vantage — Project Handoff Document

**Date:** March 2026
**Status:** MVP Frontend Complete — Auth + Payments = Next Phase

---

## What We Built

Vantage is an AI-powered job preparation tool. A user uploads their CV, pastes a job URL, and receives a full intelligence package in about 30–60 seconds:

| Output | Description |
|---|---|
| Company Snapshot | Name, industry, size, founded year, mission, culture signals, recent highlights — auto-extracted from the job URL via Gemini + Google Search |
| Role Match | CV fit score (0–100), key requirements, matched points from CV |
| Strategic Brief | Company context, role requirements, CV alignment, narrative angle |
| Cover Letter | Personalised, grounded in CV evidence. 4 tone variants: Formal / Warm / Direct / Creative |
| Presentation Outline | Slide structure for interview presentations |
| Interview Prep | Flashcards (Q&A format) + AI mock interview session with voice transcription |

---

## Running the Project

### Requirements
- Node.js 18+
- A Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# 3. Start dev server
npm run dev
# Opens at http://localhost:3000
```

---

## Sharing the Project (Zip + Send)

### What to send
Do **NOT** include `node_modules/` — it's 300MB+. The recipient runs `npm install` to recreate it.

**On Windows, to create a clean zip:**
1. Open the project folder: `c:\Cloaude Logic\vantage-landing\`
2. Select everything **except** `node_modules` and `public/frames`
3. Right-click → "Compress to ZIP file"
4. Send the ZIP

**Or use terminal:**
```bash
cd "c:/Cloaude Logic"
# This zips everything except node_modules and the large frames folder
tar -czf vantage-landing.tar.gz --exclude="vantage-landing/node_modules" --exclude="vantage-landing/public/frames" vantage-landing/
```

### Recipient setup
```bash
# Unzip, then:
cd vantage-landing
npm install
# Create .env with their own Gemini key
echo "VITE_GEMINI_API_KEY=their_key_here" > .env
npm run dev
```

---

## Loading in a New VS Code

1. Open VS Code
2. File → Open Folder → select the `vantage-landing` folder
3. Open terminal (Ctrl + `)
4. `npm install` (first time only)
5. `npm run dev`
6. Install recommended extensions if prompted (ESLint, Tailwind CSS IntelliSense)

### Recommended VS Code Extensions
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **ESLint** — catches TypeScript errors inline
- **Prettier** — auto-formatting

---

## Starting a New Claude Agent on This Project

The file `CLAUDE.md` in the project root is specifically written for Claude. When you start a new session:

1. Open Claude Code in the `vantage-landing` folder
2. Claude will auto-read `CLAUDE.md` and have full context
3. Or paste this at the start: *"Read CLAUDE.md first, then..."*

---

## Architecture Overview

```
Landing Page (LandingPage.tsx)
    ↓ user clicks "Get Started"
Plan Picker (App.tsx → PlanPicker)
    ↓ user selects plan
Theme Picker (App.tsx → ThemePicker)  ← first-time only
    ↓ user picks light/dark
Tool Workspace (App.tsx → ToolWorkspace)
    ↓ user uploads CV + job URL
AI Processing (services/ai.ts → generateJobIntelligence)
    ↓ Gemini API returns JSON
Results View (App.tsx → ResultsView)
    ├── CompanyIntelligenceCard
    ├── RoleMatchCard
    ├── StrategicBriefCard
    ├── CoverLetterCard (with tone switcher)
    ├── PresentationDeckCard
    ├── FitScoreCard (Pro)
    └── Interview Prep (Pro → UpgradeModal → InterviewPrep.tsx)
```

---

## Key Design Decisions

### Glassmorphic Design System
All cards use: `bg-white/60 backdrop-blur-xl border border-white/50` on a coloured gradient background. Dark mode uses `bg-[#181530]/75 backdrop-blur-xl border border-white/[0.07]`.

### Theme System
Full light/dark mode via React Context (`ThemeContext.tsx`). Every component calls `const { t } = useTheme()` and uses `t.glass`, `t.text`, etc. Theme persists in `localStorage`.

### Gemini + Google Search Constraint
The Gemini API cannot use `googleSearch` tool AND `responseMimeType: 'application/json'` in the same call. The code uses a `useSearch` flag to choose one path or the other depending on whether a URL was provided.

### No Backend
Everything runs client-side. The Gemini API key is in `.env` (prefixed `VITE_` so Vite exposes it to the browser). This is fine for MVP/testing but should be moved server-side before public launch.

---

## What Needs to Be Built Next

### Phase 2 — Auth + Accounts (Supabase)
- User signup / login
- Save and retrieve past job analyses
- User profile (CV storage)
- Plan/tier management

### Phase 3 — Payments (Stripe)
- Pro plan subscription ($X/month)
- Usage metering (analyses per month)
- Stripe webhook to update user tier in Supabase

### Phase 4 — Hosting (Vercel)
- Deploy frontend to Vercel
- Move Gemini API calls to Vercel Edge Functions (keeps API key server-side)
- Custom domain

### Phase 5 — Polish
- Email onboarding flow
- Analytics (Posthog or Mixpanel)
- A/B test landing page hero copy
- Mobile optimisation pass

---

## File Responsibilities

| File | Owns |
|---|---|
| `src/App.tsx` | All workspace state, results display, modals, theme picker, nav |
| `src/components/LandingPage.tsx` | Landing page — hero, story section, features, pricing, FAQ |
| `src/components/InterviewPrep.tsx` | Flashcard UI, Q&A display |
| `src/components/AIInterviewSession.tsx` | Live mock interview with voice transcription |
| `src/contexts/ThemeContext.tsx` | Light/dark theme — `buildStyles()`, `ThemeProvider`, `useTheme()` |
| `src/services/ai.ts` | All Gemini API calls, response parsing, citation stripping |
| `public/frames/` | 49 WebP frames from Compass Video (scroll animation, currently unused) |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_GEMINI_API_KEY` | Gemini API key — get free at aistudio.google.com |

---

## Gemini API Notes

- **Model:** `models/gemini-2.5-flash` (must include `models/` prefix)
- **Free tier:** Generous — sufficient for development and testing
- **Rate limits:** If you hit limits, add a delay between calls or upgrade to paid
- **Grounding:** When `googleSearch` tool is used, responses may contain citation markers like `[1]` — the `stripCitations()` function handles this

---

## Quick Reference — Things That Bit Us

| Issue | Solution |
|---|---|
| Tailwind `preserve-3d` class not working | Use `style={{ transformStyle: 'preserve-3d' }}` inline |
| Gemini returns `[CV, cite: 6]` in text | `stripCitations()` in `ai.ts` handles this |
| `googleSearch` + `responseMimeType` conflict | Never use both — `useSearch` flag separates the paths |
| Avira blocking `@react-three/drei` | Whitelist `node_modules` folder in Avira |
| Dev server on wrong port | Check `vite.config.ts` — server runs on port 3000 |
