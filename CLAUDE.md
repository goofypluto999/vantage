# Vantage — Claude Agent Context File

> Read this entire file before writing any code. It contains the full project state.

---

## What Is This Project?

**Vantage** is an AI-powered job preparation SaaS web app. Users upload their CV and a job URL, and the AI generates:
- A company intelligence snapshot (auto-extracted from the URL)
- A role/CV fit analysis
- A strategic brief and narrative angle
- A personalised cover letter (with tone switching: Formal / Warm / Direct / Creative)
- A presentation outline
- An interview prep pack with flashcards + AI mock interview

The app has a full backend: Supabase Auth, Stripe payments, and Vercel serverless API functions. See `HANDOFF.md` for current status and `WALLET-SPEC.md` for the token system rewrite spec.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin — no config file) |
| Animations | Framer Motion (`motion/react` import, NOT `framer-motion`) |
| 3D (landing) | Three.js + `@react-three/fiber` + `@react-three/drei` |
| AI | `@google/genai` SDK v1.29.0 — model: `models/gemini-2.5-flash` |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL with RLS |
| Payments | Stripe (subscriptions via checkout sessions + webhooks) |
| Backend | Vercel serverless functions (TypeScript, `api/` directory) |
| Doc parsing | `mammoth` (DOCX → text, client-side) |
| Speech | Web Speech API (`SpeechRecognition`) |
| Icons | `lucide-react` |

### Critical Import Rules
- Framer Motion: `import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'`
- Gemini: model string MUST be `'models/gemini-2.5-flash'` (needs the `models/` prefix)
- Tailwind v4: NO `tailwind.config.js` — use `@import "tailwindcss"` in CSS

---

## File Structure

```
vantage/
├── api/                               # Vercel serverless functions (backend)
│   ├── analyze/index.ts               # URL scraping + Gemini analysis (3 credits)
│   ├── credits/index.ts               # Credit balance check
│   ├── rewrite-tone/index.ts          # Cover letter tone rewrite (1 credit)
│   ├── interview/questions.ts         # Generate interview Qs (2 credits, Pro+)
│   ├── interview/evaluate.ts          # Evaluate answers (free, Pro+)
│   ├── stripe/checkout.ts             # Create Stripe checkout session
│   ├── stripe/webhook.ts              # Stripe webhook handler
│   ├── stripe/sync.ts                 # Fallback sync after checkout
│   ├── stripe/portal.ts              # Billing portal session
│   └── waitlist/index.ts              # Waitlist join/count
├── database/
│   └── schema.sql                     # Full Supabase schema (profiles, analyses, RLS)
├── src/
│   ├── App.tsx                        # Auth context, routing, protected routes (~209 lines)
│   ├── main.tsx                       # Entry point
│   ├── index.css                      # Tailwind import + design tokens
│   ├── contexts/
│   │   └── ThemeContext.tsx           # Light/dark theme system
│   ├── lib/
│   │   └── supabase.ts               # Supabase client, Profile type, auth/credit helpers
│   ├── services/
│   │   └── api.ts                     # All API calls with auth token injection (~206 lines)
│   └── components/
│       ├── Dashboard.tsx              # Main workspace (upload, results, credits) (~754 lines)
│       ├── LandingPage.tsx            # Landing page (~996 lines)
│       ├── AIInterviewSession.tsx     # Live AI mock interview session
│       ├── InterviewPrep.tsx          # Flashcard UI
│       ├── Account.tsx                # User account + subscription management
│       ├── Pricing.tsx                # Pricing page with Stripe checkout
│       ├── Login.tsx                  # Login form (email + Google OAuth)
│       ├── Register.tsx               # Registration form
│       ├── ForgotPassword.tsx         # Password reset request
│       ├── ResetPassword.tsx          # Password reset form
│       └── (legal pages, cookie consent, waitlist, demo)
├── HANDOFF.md                         # What works, what's broken, env vars, deployment
├── WALLET-SPEC.md                     # Token wallet rewrite specification
├── FILE-MAP.md                        # Every file mapped with purpose
├── AGENT-PROMPT.md                    # Starter prompt for new agents
├── vercel.json                        # Vercel routing config
├── vite.config.ts
└── package.json
```

---

## Theme System (`ThemeContext.tsx`)

The app has full light/dark mode support via React Context.

```typescript
// Usage in any component:
const { theme, setTheme, t } = useTheme();
// t.glass, t.text, t.textSub, t.textMuted, t.pageBg, t.nav, etc.
```

**ThemeStyles interface fields:**
- `pageBg` — CSS gradient string (use as `style={{ background: t.pageBg }}`)
- `glass` — Tailwind classes for glassmorphic card
- `glassHeader` — card header row classes
- `nav` — navbar bg classes
- `text` — primary text color class
- `textSub` — secondary text color class
- `textMuted` — muted text color class
- `cardInner` — nested inner card bg
- `uploadZone` — file drop zone bg
- `selectorItem` — selector pill bg
- `footer` — footer bg
- `overlayBg` — modal overlay CSS value (use inline style)
- `inputBorder` — border class for inputs
- `divider` — divider line class
- `blobColors` — array of 3 hex colors for background blobs

**localStorage key:** `'vantage-theme'`

**Theme picker:** Shows on first load (when no localStorage key). Sun/moon slider. Sets theme and dismisses.

**Theme toggle button:** In the nav bar, toggles between light and dark at any time.

---

## App.tsx — Key Architecture

### State (ToolWorkspace)
```typescript
// Upload state
cvFile: File | null
jobUrl: string
jobDescFile: File | null
includeFitScore: boolean

// Results state
results: JobIntelligence | null
isLoading: boolean
error: string | null
currentView: 'plan' | 'workspace' | 'results'

// Cover letter
tone: 'Formal' | 'Warm' | 'Direct' | 'Creative'
displayLetter: string
isRegenerating: boolean
toneCache: Map<string, string>  // (ref, not state)

// Modals
showUpgradeModal: boolean
showInterviewModal: boolean
```

### Components in App.tsx
- `ThemePicker` — First-load modal (sun/moon slider)
- `ThemeToggle` — Nav bar toggle button
- `PlanPicker` — Plan selection (Free / Pro / Enterprise)
- `UpgradeModal` — Pro upgrade prompt (test mode bypass available)
- `ToolWorkspace` — Main upload form
- `UploadZone` — File drop zone
- `OutputSelector` — Checkboxes for what to generate
- `ProcessingView` — Loading state while AI runs
- `ResultsView` — Full results dashboard
- `CompanyIntelligenceCard` — Company snapshot card
- `RoleMatchCard` — CV fit score and match points
- `StrategicBriefCard` — Strategic brief sections
- `CoverLetterCard` — Cover letter with tone switcher
- `LockedFeatureTeaser` — Pro feature lock with upgrade CTA
- `PresentationDeckCard` — Presentation outline
- `FitScoreCard` — Visual fit score gauge
- `DownloadBtn` — Download results as text
- `AIInterviewModal` — Mock interview session wrapper

---

## AI Service (`services/ai.ts`)

### Main Function
```typescript
generateJobIntelligence(
  cvFile: File,
  jobUrl: string,
  jobDescFile?: File,
  includeFitScore?: boolean
): Promise<JobIntelligence>
```

### Key Interfaces
```typescript
interface CompanySnapshot {
  name?: string;
  industry?: string;
  founded?: string;
  size?: string;
  mission: string;
  cultureSignals: string[];
  recentHighlights: string[];
}

interface JobIntelligence {
  companySnapshot: CompanySnapshot;
  briefSections: BriefSections;
  keyRequirements: string[];
  cvMatchPoints: string[];
  strategicBrief: string;
  coverLetter: string;
  presentation: string[];
  fitScore?: number;
}
```

### Gemini Constraint — CRITICAL
`googleSearch` tool and `responseMimeType: 'application/json'` are **mutually exclusive**.

The `useSearch` flag handles this:
- When `jobUrl` provided → uses `tools: [{ googleSearch: {} }]` only (JSON shape embedded in prompt text)
- When no URL → uses `responseMimeType: 'application/json'` only

**Never combine both in the same request.**

### Cover Letter Tone Rewriting
```typescript
rewriteCoverLetterTone(letter: string, tone: string): Promise<string>
```
Returns rewritten letter in specified tone. Called when user clicks tone buttons. Results cached in a `Map` ref.

### Citation Stripping
```typescript
stripCitations(text: string): string
// Removes: [CV, cite: 6], [cite: N], [1], etc.
```
Applied to all cover letter output (Gemini grounding artifacts).

---

## Landing Page (`LandingPage.tsx`)

### Sections (top to bottom)
1. **Navbar** — Logo, nav links, Get Started CTA, theme toggle
2. **Hero** — Headline, subtext, CTA buttons, 3D dot globe (Three.js)
3. **Stats bar** — 3 key metrics
4. **Story Cards** — 4 alternating glassmorphic cards (scroll-in from left/right)
5. **How It Works** — 3-step horizontal flow
6. **Features Grid** — 6 feature cards
7. **Testimonials** — 3 glassmorphic quote cards
8. **Pricing** — Free / Pro / Enterprise cards
9. **FAQ** — Accordion
10. **Footer** — Links + branding

### HowItWorksModal
Opened by "See How It Works" button. Dark glassmorphic modal showing the 6-step flow + 8 feature grid.

### 3D Globe
`DotGlobe` component using Three.js fibonacci sphere + orbital rings. Speeds up on hover.

---

## CSS Patterns

### Glassmorphic Card (light mode)
```
bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(79,70,229,0.07)]
```

### Glassmorphic Card (dark mode)
```
bg-[#181530]/75 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.5)]
```

### CSS 3D Transforms — CRITICAL
Tailwind v4 does NOT reliably apply `preserve-3d` and `backface-hidden` classes.
**Always use inline styles for 3D CSS:**
```tsx
style={{ transformStyle: 'preserve-3d' }}        // NOT className="preserve-3d"
style={{ backfaceVisibility: 'hidden' }}          // NOT className="backface-hidden"
style={{ perspective: '1200px' }}                 // NOT className="perspective-1000"
```

---

## Environment Variables

See `HANDOFF.md` for the full list. Key vars:
```
# Supabase
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

# Gemini
VITE_GEMINI_API_KEY, GEMINI_API_KEY

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM
```

---

## What's NOT Built Yet

- **Token wallet rewrite** — See `WALLET-SPEC.md` (CRITICAL, current credit system is broken)
- **Results persistence** — `analyses` table exists but not wired up to UI
- **Email** — No onboarding or transactional emails
- **Analytics** — No tracking
- **Mobile optimization** — Needs a pass
- **Email** — No email capture or comms

---

## Dev Commands

```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npx tsc --noEmit     # TypeScript check (must be clean before any PR)
```

---

## Known Issues / Watch Out For

1. Avira antivirus may block `@react-three/drei` downloads — whitelist if needed
2. The `public/frames/` directory exists with 49 WebP frames (from Compass Video.mp4 at 12fps) — currently unused since the scroll video section was replaced with static cards
3. The `useScroll` and `useTransform` imports from `motion/react` may show as unused — safe to ignore, used in some components
4. Always run `npx tsc --noEmit` after edits and fix all errors before considering work done
