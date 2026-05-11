# Multi-Agent Review Process — The Actual LLM Council

> Honest framing: Claude doesn't have a Gemini/DeepSeek/Codex council
> available in this terminal. What it DOES have is the `Agent` tool with
> a `subagent_type` parameter, which lets Claude spawn fresh sub-agents
> with independent context. Each sub-agent gets briefed on a specific
> review role + the same code to review. This is the most genuine
> multi-LLM-council pattern available given the tooling — distinct
> contexts, focused roles, real adversarial pressure, even if all
> reviewers are Claude.
>
> Use this process for any change bigger than a one-line copy fix.

## The three minimum reviewers

For any new feature or non-trivial change, spawn these three agents in
**parallel** (one Agent tool call per role, all in the same message).
Parallel because they don't depend on each other's findings + because
sequential rounds waste time.

### Agent 1 — Security reviewer

**Briefing template:**

```
You are auditing a code change for security issues. Be paranoid. Assume
attackers will try to exploit anything you don't explicitly defend.

Files changed in this PR:
  <file1>
  <file2>
  ...

Read the changed files and report ONLY:
1. Authentication bypass risks (anything that should be auth-gated but isn't)
2. Authorization gaps (does the user check + plan check happen in the right order?)
3. Token/credit economics (atomic deduct? refund on failure? race conditions?)
4. Prompt-injection vectors (any user-supplied string flowing into a Gemini prompt without a guard?)
5. Input validation gaps (length caps? type checks? enum membership?)
6. Information leakage in error messages (do error responses tell attackers WHY they failed?)
7. PII handling (anything logged that shouldn't be?)
8. SSRF / open-redirect / XSS vectors

Format: for each finding, give file:line, severity (CRITICAL/HIGH/MED/LOW),
description, suggested fix. If you find nothing, say "no findings" — do
NOT pad with theoretical concerns.

Read the existing /api/rewrite-tone/index.ts and /api/analyze/index.ts
as the reference patterns. New endpoints should match these on auth +
token-deduct + refund semantics.
```

### Agent 2 — Type-safety + edge-case reviewer

**Briefing template:**

```
You are auditing a code change for type safety + edge cases. Adversarial
mindset: what input would break this?

Files changed:
  <file1>
  <file2>
  ...

Read the changed files + the relevant types in src/services/api.ts and
src/lib/supabase.ts. Report:

1. Type drift (does the client send a shape the server doesn't accept?
   Does the server return a shape the client doesn't parse?)
2. Enum coverage (if there's a switch statement, does it handle all
   members + a default?)
3. Boundary values (what happens at min/max of every number input?
   empty string? whitespace-only? null vs undefined?)
4. Concurrency (what if the user double-clicks Submit? What if two
   requests race for the same token deduct?)
5. Failure modes (network drops mid-call, API returns 500, Gemini
   returns malformed JSON — does the client handle each gracefully?)
6. Lazy-loading correctness (if React.lazy is used, is there a Suspense
   boundary? Does the chunk actually code-split?)

Format: file:line, severity, description, suggested fix. No padding.
```

### Agent 3 — UX + accessibility reviewer

**Briefing template:**

```
You are auditing a code change for UX + a11y. Focus on what the user
actually experiences.

Files changed (focus on the frontend / component files):
  <file1>
  <file2>
  ...

Report:
1. Loading states — does the user see something during the API call,
   or does the UI freeze?
2. Error states — when something fails, what does the user see? Is it
   actionable (tells them what to do next) or just "Error"?
3. Empty states — when there's no data, what shows? "" / "0 items" /
   helpful guidance?
4. Mobile layout — at 375x667 (iPhone SE), does the change overflow,
   does it stack readably?
5. A11y — role/aria-modal/aria-labelledby on modals, htmlFor+id on
   labels, focus management on open/close, keyboard navigation
   (Tab/Esc), screen-reader live regions for async results
6. Copy quality — does the button label say what it does? Does the
   form field hint give enough context? Does the error message explain
   without blaming?
7. Cognitive load — is the form too long? Could fields be optional?
   Could a smart default reduce required input?

Format: file:line, severity (HIGH if it breaks the conversion, MED if
it confuses, LOW if it's polish), description, suggested fix.
```

## Optional fourth reviewer for high-risk features

### Agent 4 — Production-readiness reviewer

For anything that touches money, auth, or data persistence:

```
You are auditing a change that touches production-critical paths. Your
job: would you ship this to a real money-handling SaaS at scale?

Files changed:
  <file1>
  ...

Report:
1. Observability — if this fails in production at 3am, do we have logs
   that tell us WHY without exposing PII?
2. Rollback — is this change reversible? What's the rollback procedure
   if it breaks?
3. Backwards compatibility — does this break any existing client?
   Specifically: are users with a stale cached frontend going to hit
   an endpoint that no longer exists?
4. Idempotency — if this request is retried (network flake, user
   double-click), is it safe? Or could the user be charged twice?
5. Database consistency — any new RPC calls? Any new tables? Does the
   RLS policy match the auth model?
6. Performance — what's the p99 latency on this endpoint? Is there a
   timeout? Does Gemini API failure cascade?
7. Cost — what does this cost the company per call? Per user? Per day
   at projected scale?

Format: severity, description, fix.
```

## How to actually spawn them

In a single Claude message, three tool calls (parallel):

```
Agent({
  description: "Security review of <feature>",
  subagent_type: "general-purpose",
  prompt: "<security briefing template above, filled in with file paths>"
})
Agent({
  description: "Type/edge-case review of <feature>",
  subagent_type: "general-purpose",
  prompt: "<type briefing template above, filled in>"
})
Agent({
  description: "UX/a11y review of <feature>",
  subagent_type: "general-purpose",
  prompt: "<ux briefing template above, filled in>"
})
```

All three reports come back. Merge their findings into a single
`docs/<feature>-review-2026-XX-XX.md` document. Address every CRITICAL
+ HIGH before commit. Defer MED + LOW with a TODO comment if they're
non-blocking.

## What this is and isn't

**This IS:**
- A genuine multi-perspective review with three independent contexts
- A way to catch issues a single-pass review misses
- A natural fit for the Agent tool that Claude already has

**This ISN'T:**
- A literal Gemini/DeepSeek/Codex council (those would need their own
  API keys + tooling integration that doesn't exist here)
- A substitute for human review on truly critical changes
- A way to skip the existing pre-flight script (run preflight first;
  reviewers focus on what preflight can't see)

## When to skip the multi-agent review

It's overhead. Don't run it for:
- One-line copy fixes
- Pure docs commits
- Bug fixes that are <10 LoC and don't touch auth/tokens/data
- Reverting a previous commit

Always run it for:
- New API endpoints
- Changes to auth / token economics
- New frontend modals or any change that introduces a new user-input
  field flowing to an LLM prompt
- Changes to Stripe webhook handler
- Schema migrations or RLS policy changes

---

*This process is itself V1. Iterate as we learn what classes of bug it
catches vs misses.*
