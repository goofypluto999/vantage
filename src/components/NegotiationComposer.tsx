// NegotiationComposer — modal for generating a salary negotiation brief.
//
// Costs 2 tokens. Returns 5 surfaces:
//   - emailSubject + emailBody (the ask-anchor email back to the recruiter)
//   - phoneScript (60-90 second spoken script)
//   - talkingPoints (array of in-conversation reminders)
//   - warnings (array of risk flags about the candidate's asks)
//
// Pattern mirrors FollowupComposer.tsx: lazy-loaded modal, role=dialog,
// ESC/click-outside close, body-scroll lock, atomic token semantics
// handled server-side (deduct-before-AI / refund-on-failure).
//
// Form is split into sections via <details> to reduce visual weight on
// first open — only "Basics" + "Offer + targets" are visible by default.

import { useState, useEffect, useRef } from 'react';
import {
  X, DollarSign, Copy, Check, AlertTriangle, Send, MessageSquare, Phone, ListChecks,
} from 'lucide-react';
import { generateNegotiationBrief, type NegotiationRequest } from '../services/api';
import { useFormDraft } from '../lib/useFormDraft';

interface Props {
  defaultCompanyName?: string;
  defaultRoleName?: string;
  defaultUserName?: string;
  // Called when modal closes. Optional newTokenBalance is the post-call
  // server-returned balance, so parent can update local profile cache.
  onClose: (newTokenBalance?: number) => void;
  // Whether the user has enough tokens to generate (>= 2). Parent decides.
  hasTokens: boolean;
  // Authenticated user id — scopes localStorage so user B can't read
  // user A's draft on a shared device. REQUIRED for shared-device safety
  // but optional in signature so unauthenticated callers (none today)
  // don't break the compile.
  userScope?: string;
}

const COST = 2;

type Currency = 'gbp' | 'usd' | 'eur';
type Tone = 'collaborative' | 'firm';
type Channel = 'email' | 'phone';
type RecipientRole = 'recruiter' | 'hiring-manager' | 'founder' | 'engineering-manager';

const SYMBOL: Record<Currency, string> = { gbp: '£', usd: '$', eur: '€' };

interface Result {
  emailSubject: string;
  emailBody: string;
  phoneScript: string;
  talkingPoints: string[];
  warnings: string[];
  balance: number;
  /** Server returned graceful-fallback (parse-failure path). UI shows
   * a banner so the user knows the brief is generic, not bespoke. */
  degraded?: boolean;
}

// Helper to parse a numeric input safely. Empty/whitespace → undefined
// so we don't send `0` for fields the user didn't fill. Negative +
// non-finite → undefined too. Whitespace handling added 2026-05-11 per
// multi-agent type review (silent "  " → 0 transform was confusing).
function toNum(s: string): number | undefined {
  if (s == null) return undefined;
  const trimmed = String(s).trim();
  if (trimmed === '') return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

export default function NegotiationComposer({ defaultCompanyName, defaultRoleName, defaultUserName, onClose, hasTokens, userScope }: Props) {
  // Basics
  const [companyName, setCompanyName] = useState(defaultCompanyName || '');
  const [roleName, setRoleName] = useState(defaultRoleName || '');
  const [userName, setUserName] = useState(defaultUserName || '');
  const [levelTitle, setLevelTitle] = useState('');
  const [yearsExperience, setYearsExperience] = useState<string>('');

  // Offer numbers (strings in state so empty inputs work; converted at submit)
  const [currency, setCurrency] = useState<Currency>('gbp');
  const [baseOffered, setBaseOffered] = useState('');
  const [baseTarget, setBaseTarget] = useState('');
  const [signOffered, setSignOffered] = useState('');
  const [signTarget, setSignTarget] = useState('');
  const [rsuOffered, setRsuOffered] = useState('');
  const [rsuTarget, setRsuTarget] = useState('');
  const [bonusPctOffered, setBonusPctOffered] = useState('');
  const [bonusPctTarget, setBonusPctTarget] = useState('');
  const [ptoOffered, setPtoOffered] = useState('');
  const [ptoTarget, setPtoTarget] = useState('');
  const [remotePolicyOffered, setRemotePolicyOffered] = useState('');
  const [remotePolicyTarget, setRemotePolicyTarget] = useState('');

  // Competing offer
  const [hasCompetingOffer, setHasCompetingOffer] = useState(false);
  const [competingCompany, setCompetingCompany] = useState('');
  const [competingOfferContext, setCompetingOfferContext] = useState('');

  // Channel + tone + recipient + extras
  const [preferredChannel, setPreferredChannel] = useState<Channel>('email');
  const [tone, setTone] = useState<Tone>('collaborative');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState<RecipientRole | ''>('');
  const [additionalContext, setAdditionalContext] = useState('');

  // Result state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [returnedBalance, setReturnedBalance] = useState<number | undefined>(undefined);
  // Draft-restore prompt visibility: shown only when (a) a saved draft
  // exists and (b) the user hasn't already dismissed/restored it this
  // open. Avoids nagging on every re-render.
  const [draftPromptShown, setDraftPromptShown] = useState<boolean>(false);
  const [draftDecisionMade, setDraftDecisionMade] = useState<boolean>(false);

  // Persist the form to localStorage so an accidental refresh doesn't
  // wipe 20 hand-typed fields. Built 2026-05-11. Version-tagged key —
  // bump `-v1` if the draft shape changes incompatibly.
  const draftPayload = {
    companyName, roleName, userName, levelTitle, yearsExperience,
    currency, baseOffered, baseTarget, signOffered, signTarget,
    rsuOffered, rsuTarget, bonusPctOffered, bonusPctTarget,
    ptoOffered, ptoTarget, remotePolicyOffered, remotePolicyTarget,
    hasCompetingOffer, competingCompany, competingOfferContext,
    preferredChannel, tone, recipientName, recipientRole, additionalContext,
  };
  const { loadDraft, clearDraft } = useFormDraft('vantage-negotiation-draft-v1', draftPayload, { userScope });

  const dialogRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  // Sync double-click guard. Multi-agent type review 2026-05-11: a fast
  // user could fire two clicks before setLoading(true) re-rendered the
  // disabled button. Both invocations saw stale `loading=false` from
  // closure → server charged 4 tokens for one intent. Ref check is
  // synchronous so the second click hits the early-return.
  const inFlightRef = useRef(false);

  // ESC + body-scroll lock + open-focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(returnedBalance);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move keyboard/screen-reader focus into the dialog when it opens
    // (review HIGH: focus was staying on the launcher).
    const focusTimer = setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      clearTimeout(focusTimer);
    };
  }, [onClose, returnedBalance]);

  // When a result arrives, move focus to it AND scroll into view, so
  // SR users get an announcement (via aria-live region below) AND
  // sighted users see the new content. Without this, the form simply
  // disappears under the keyboard with no signal where focus went.
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.focus();
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  // On modal open, check for a saved draft and surface the restore
  // prompt. The check runs once per mount (NOT on every keystroke)
  // and only fires if there's a real saved draft.
  useEffect(() => {
    const saved = loadDraft();
    if (saved && !draftDecisionMade) {
      setDraftPromptShown(true);
    }
    // We deliberately ignore loadDraft in deps — it's stable via useCallback
    // and re-running this on every render would re-show the prompt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function restoreDraft() {
    const saved = loadDraft();
    if (!saved) {
      setDraftPromptShown(false);
      setDraftDecisionMade(true);
      return;
    }
    // Apply each saved field — only the ones we know about, to be
    // resilient to old saved shapes.
    if (typeof saved.companyName === 'string') setCompanyName(saved.companyName);
    if (typeof saved.roleName === 'string') setRoleName(saved.roleName);
    if (typeof saved.userName === 'string') setUserName(saved.userName);
    if (typeof saved.levelTitle === 'string') setLevelTitle(saved.levelTitle);
    if (typeof saved.yearsExperience === 'string') setYearsExperience(saved.yearsExperience);
    if (saved.currency === 'gbp' || saved.currency === 'usd' || saved.currency === 'eur') {
      setCurrency(saved.currency);
    }
    if (typeof saved.baseOffered === 'string') setBaseOffered(saved.baseOffered);
    if (typeof saved.baseTarget === 'string') setBaseTarget(saved.baseTarget);
    if (typeof saved.signOffered === 'string') setSignOffered(saved.signOffered);
    if (typeof saved.signTarget === 'string') setSignTarget(saved.signTarget);
    if (typeof saved.rsuOffered === 'string') setRsuOffered(saved.rsuOffered);
    if (typeof saved.rsuTarget === 'string') setRsuTarget(saved.rsuTarget);
    if (typeof saved.bonusPctOffered === 'string') setBonusPctOffered(saved.bonusPctOffered);
    if (typeof saved.bonusPctTarget === 'string') setBonusPctTarget(saved.bonusPctTarget);
    if (typeof saved.ptoOffered === 'string') setPtoOffered(saved.ptoOffered);
    if (typeof saved.ptoTarget === 'string') setPtoTarget(saved.ptoTarget);
    if (typeof saved.remotePolicyOffered === 'string') setRemotePolicyOffered(saved.remotePolicyOffered);
    if (typeof saved.remotePolicyTarget === 'string') setRemotePolicyTarget(saved.remotePolicyTarget);
    if (typeof saved.hasCompetingOffer === 'boolean') setHasCompetingOffer(saved.hasCompetingOffer);
    if (typeof saved.competingCompany === 'string') setCompetingCompany(saved.competingCompany);
    if (typeof saved.competingOfferContext === 'string') setCompetingOfferContext(saved.competingOfferContext);
    if (saved.preferredChannel === 'email' || saved.preferredChannel === 'phone') {
      setPreferredChannel(saved.preferredChannel);
    }
    if (saved.tone === 'collaborative' || saved.tone === 'firm') {
      setTone(saved.tone);
    }
    if (typeof saved.recipientName === 'string') setRecipientName(saved.recipientName);
    if (
      saved.recipientRole === 'recruiter' || saved.recipientRole === 'hiring-manager' ||
      saved.recipientRole === 'founder' || saved.recipientRole === 'engineering-manager' ||
      saved.recipientRole === ''
    ) {
      setRecipientRole(saved.recipientRole);
    }
    if (typeof saved.additionalContext === 'string') setAdditionalContext(saved.additionalContext);
    setDraftPromptShown(false);
    setDraftDecisionMade(true);
  }

  function dismissDraft() {
    clearDraft();
    setDraftPromptShown(false);
    setDraftDecisionMade(true);
  }

  // Derived: does the user have at least one ask above offered?
  // Same logic as the server. If false, Generate button is disabled +
  // we show a helpful inline hint so users don't waste a request.
  const askCount = (() => {
    let n = 0;
    const bo = toNum(baseOffered) ?? 0;
    const bt = toNum(baseTarget) ?? 0;
    if (bt > bo) n++;
    const so = toNum(signOffered) ?? 0;
    const st = toNum(signTarget) ?? 0;
    if (st > so) n++;
    const ro = toNum(rsuOffered) ?? 0;
    const rt = toNum(rsuTarget) ?? 0;
    if (rt > ro) n++;
    const bpo = toNum(bonusPctOffered) ?? 0;
    const bpt = toNum(bonusPctTarget) ?? 0;
    if (bpt > bpo) n++;
    const po = toNum(ptoOffered) ?? 0;
    const pt = toNum(ptoTarget) ?? 0;
    if (pt > po) n++;
    if (
      remotePolicyOffered.trim() &&
      remotePolicyTarget.trim() &&
      remotePolicyOffered.trim() !== remotePolicyTarget.trim()
    ) n++;
    return n;
  })();

  const baseDeltaPct = (() => {
    const bo = toNum(baseOffered);
    const bt = toNum(baseTarget);
    if (!bo || !bt || bt <= bo) return null;
    return Math.round(((bt - bo) / bo) * 1000) / 10;
  })();

  const canGenerate =
    !loading &&
    hasTokens &&
    companyName.trim().length > 0 &&
    roleName.trim().length > 0 &&
    userName.trim().length > 0 &&
    toNum(baseOffered) !== undefined &&
    toNum(baseTarget) !== undefined &&
    askCount >= 1;

  async function handleGenerate() {
    // Sync gate FIRST — checked + set before any React state change so a
    // double-click can't race the `loading` re-render. (Type-review HIGH.)
    if (inFlightRef.current) return;
    if (!canGenerate) return;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const req: NegotiationRequest = {
        companyName: companyName.trim(),
        roleName: roleName.trim(),
        userName: userName.trim(),
        currency,
        baseOffered: toNum(baseOffered)!,
        baseTarget: toNum(baseTarget)!,
        preferredChannel,
        tone,
      };
      // Optional fields — only include if provided
      const so = toNum(signOffered);
      const st = toNum(signTarget);
      if (so !== undefined) req.signOffered = so;
      if (st !== undefined) req.signTarget = st;
      const ro = toNum(rsuOffered);
      const rt = toNum(rsuTarget);
      if (ro !== undefined) req.rsuOffered = ro;
      if (rt !== undefined) req.rsuTarget = rt;
      const bpo = toNum(bonusPctOffered);
      const bpt = toNum(bonusPctTarget);
      if (bpo !== undefined) req.bonusPctOffered = bpo;
      if (bpt !== undefined) req.bonusPctTarget = bpt;
      const po = toNum(ptoOffered);
      const pt = toNum(ptoTarget);
      if (po !== undefined) req.ptoOffered = po;
      if (pt !== undefined) req.ptoTarget = pt;
      if (remotePolicyOffered.trim()) req.remotePolicyOffered = remotePolicyOffered.trim();
      if (remotePolicyTarget.trim()) req.remotePolicyTarget = remotePolicyTarget.trim();
      if (hasCompetingOffer) {
        req.hasCompetingOffer = true;
        if (competingCompany.trim()) req.competingCompany = competingCompany.trim();
        if (competingOfferContext.trim()) req.competingOfferContext = competingOfferContext.trim();
      }
      const ye = toNum(yearsExperience);
      if (ye !== undefined) req.yearsExperience = ye;
      if (levelTitle.trim()) req.levelTitle = levelTitle.trim();
      if (recipientName.trim()) req.recipientName = recipientName.trim();
      if (recipientRole) req.recipientRole = recipientRole;
      if (additionalContext.trim()) req.additionalContext = additionalContext.trim();

      const res = await generateNegotiationBrief(req);
      if (
        !res.success ||
        !res.emailSubject ||
        !res.emailBody ||
        !res.phoneScript ||
        !res.talkingPoints ||
        !res.warnings
      ) {
        setError(res.error || 'Generation failed. If tokens were deducted, they have been refunded.');
        return;
      }
      setResult({
        emailSubject: res.emailSubject,
        emailBody: res.emailBody,
        phoneScript: res.phoneScript,
        talkingPoints: res.talkingPoints,
        warnings: res.warnings,
        balance: res.token_balance ?? 0,
        // Surface server's parse-failure-fallback flag so the UI can
        // tell the user the brief is generic, not bespoke. Server sets
        // this to true on the graceful 200 fallback path.
        degraded: res.degraded === true,
      });
      setReturnedBalance(res.token_balance);
      // Inputs produced output — they probably don't want this draft
      // auto-restored next time. Clear after success only.
      clearDraft();
    } catch (e: any) {
      // Map known error shapes to actionable copy; never expose stack traces.
      const raw = String(e?.message || '').toLowerCase();
      if (raw.includes('failed to fetch') || raw.includes('network')) {
        setError('Network error — check your connection and try again.');
      } else if (raw.includes('timeout') || raw.includes('aborted')) {
        setError('This is taking too long. The AI service may be busy — try again.');
      } else {
        setError('Generation failed. If tokens were deducted, they have been refunded.');
      }
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  async function copyTo(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2200);
    } catch {
      setCopiedField(null);
    }
  }

  const symbol = SYMBOL[currency];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="neg-title"
      ref={dialogRef}
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-6 overflow-y-auto"
      style={{ background: 'rgba(13, 11, 30, 0.85)' }}
      onMouseDown={(e) => { if (e.target === dialogRef.current) onClose(returnedBalance); }}
    >
      <div className="w-full max-w-3xl rounded-3xl bg-[#181530] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.5)] my-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-violet-400" aria-hidden="true" />
              <h2 id="neg-title" className="text-xl font-bold text-white">Salary Negotiation Brief</h2>
            </div>
            <p className="text-sm text-white/60 mt-1">
              Costs {COST} tokens. Refunded if generation fails. You'll get: an email back to the recruiter, a phone script, 5–7 talking points, and any risk flags about your asks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose(returnedBalance)}
            aria-label="Close negotiation composer"
            className="p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Visually-hidden polite live region for copy-button success
              announcements. Sighted users see the "Copied" badge, SR users
              hear "Subject copied to clipboard." etc. */}
          <div className="sr-only" role="status" aria-live="polite">
            {copiedField === 'subject' && 'Email subject copied to clipboard.'}
            {copiedField === 'body' && 'Email body copied to clipboard.'}
            {copiedField === 'full-email' && 'Full email copied to clipboard.'}
            {copiedField === 'phone' && 'Phone script copied to clipboard.'}
            {copiedField === 'points' && 'Talking points copied to clipboard.'}
          </div>

          {/* Result panel — tabIndex=-1 so resultRef.current.focus() works
              and an aria-live=polite wrapper announces arrival to SR users. */}
          {result && (
            <div
              ref={resultRef}
              tabIndex={-1}
              role="region"
              aria-label="Generated negotiation brief"
              aria-live="polite"
              className="space-y-3 outline-none"
            >
              {/* Degraded-fallback banner: server returned a parse-failure
                  graceful 200 with generic content. Tell the user so they
                  don't think the AI judged their ask is generic. */}
              {result.degraded && (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Limited result</p>
                  </div>
                  <p className="text-sm text-amber-100/90">
                    The AI couldn't fully parse the inputs and returned a conservative draft. Simplify any free-text fields and "Generate another" for a sharper brief.
                  </p>
                </div>
              )}
              {result.warnings.length > 0 ? (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Heads up — review before sending</p>
                  </div>
                  <ul className="text-sm text-amber-100/90 space-y-1.5 list-disc pl-5">
                    {result.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3">
                  <p className="text-sm text-emerald-200/90 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    No risk flags — your asks look in range for the role.
                  </p>
                </div>
              )}

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-violet-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Email — Subject</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyTo('subject', result.emailSubject)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                  >
                    {copiedField === 'subject' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
                <p className="text-sm text-white font-medium">{result.emailSubject}</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-violet-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Email — Body</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyTo('body', result.emailBody)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                    >
                      {copiedField === 'body' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy body</>}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyTo('full-email', `Subject: ${result.emailSubject}\n\n${result.emailBody}`)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition"
                    >
                      {copiedField === 'full-email' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy full email</>}
                    </button>
                  </div>
                </div>
                <pre className="text-sm text-white/90 whitespace-pre-wrap font-sans leading-relaxed">{result.emailBody}</pre>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-violet-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Phone script (60–90 seconds)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyTo('phone', result.phoneScript)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                  >
                    {copiedField === 'phone' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
                <pre className="text-sm text-white/90 whitespace-pre-wrap font-sans leading-relaxed">{result.phoneScript}</pre>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-violet-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Talking points — keep these in your head during the call</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyTo('points', result.talkingPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'))}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                  >
                    {copiedField === 'points' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
                  </button>
                </div>
                <ul className="text-sm text-white/90 space-y-2 list-decimal pl-5">
                  {result.talkingPoints.map((p, idx) => <li key={idx}>{p}</li>)}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setResult(null); setError(null); }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                >
                  Generate another (2 more tokens)
                </button>
                <span className="text-xs text-white/50">Balance: {result.balance} tokens left</span>
              </div>
            </div>
          )}

          {/* Form panel — shown when no result yet */}
          {!result && (
            <>
              {/* Draft restore prompt — appears once on open when a saved
                  draft exists (from previous unfinished session). User
                  can restore everything, or dismiss and start fresh.
                  Added 2026-05-11; SR-announced via aria-live (review MED). */}
              {draftPromptShown && !draftDecisionMade && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-lg bg-violet-500/10 border border-violet-500/30 p-3 flex flex-wrap items-center gap-3 justify-between"
                >
                  <p className="text-sm text-violet-200 flex-1 min-w-[200px]">
                    Found an unfinished negotiation draft on this browser. Restore your inputs?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={restoreDraft}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                      Restore draft
                    </button>
                    <button
                      type="button"
                      onClick={dismissDraft}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      Start fresh
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p>{error}</p>
                    {/* Retry path so the user doesn't have to scroll back to
                        the Generate button. Disabled-until-canGenerate so
                        the gate still applies. */}
                    {canGenerate && (
                      <button
                        type="button"
                        onClick={handleGenerate}
                        className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-200 transition"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Basics */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Basics</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="neg-company" className="block text-xs font-semibold text-white/70 mb-1">Company *</label>
                    <input
                      ref={firstFieldRef}
                      id="neg-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      maxLength={120}
                      placeholder="Stripe"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="neg-role" className="block text-xs font-semibold text-white/70 mb-1">Role *</label>
                    <input
                      id="neg-role"
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      maxLength={160}
                      placeholder="Senior Product Manager"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="neg-username" className="block text-xs font-semibold text-white/70 mb-1">Your full name *</label>
                    <input
                      id="neg-username"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      maxLength={80}
                      placeholder="Alex Morgan"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="neg-level" className="block text-xs font-semibold text-white/70 mb-1">Level title <span className="text-white/40">(optional)</span></label>
                    <input
                      id="neg-level"
                      type="text"
                      value={levelTitle}
                      onChange={(e) => setLevelTitle(e.target.value)}
                      maxLength={80}
                      placeholder="L5 / Staff / Principal"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="neg-years" className="block text-xs font-semibold text-white/70 mb-1">Years of experience <span className="text-white/40">(optional, calibrates warnings)</span></label>
                    <input
                      id="neg-years"
                      type="number"
                      min={0}
                      max={80}
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="8"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="neg-currency" className="block text-xs font-semibold text-white/70 mb-1">Currency *</label>
                    <select
                      id="neg-currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    >
                      <option value="gbp">GBP (£)</option>
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Offer + targets. Mobile-first grid (single col under sm) to
                  prevent label truncation at 375px viewport flagged by UX
                  review 2026-05-11. Every input now has htmlFor/id paired
                  (17 missing pairs were the single biggest a11y miss). */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Offer + your targets</legend>
                <p id="neg-asks-explainer" className="text-xs text-white/50 -mt-2">Each line: leave blank if not negotiating that item. You need at least one target above offered to generate.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="neg-base-offered" className="block text-xs font-semibold text-white/70 mb-1">Base offered *</label>
                    <input
                      id="neg-base-offered"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={baseOffered}
                      onChange={(e) => setBaseOffered(e.target.value)}
                      aria-describedby="neg-asks-explainer"
                      placeholder={`${symbol}120,000`}
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="neg-base-target" className="block text-xs font-semibold text-white/70 mb-1">
                      Base target *
                      {baseDeltaPct !== null && <span className="text-emerald-400 font-mono ml-1" aria-label={`asking ${baseDeltaPct} percent more than the offer`}>(+{baseDeltaPct}% vs offer)</span>}
                    </label>
                    <input
                      id="neg-base-target"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={baseTarget}
                      onChange={(e) => setBaseTarget(e.target.value)}
                      aria-describedby="neg-asks-explainer"
                      placeholder={`${symbol}135,000`}
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="neg-sign-offered" className="block text-xs font-semibold text-white/70 mb-1">Signing offered</label>
                    <input id="neg-sign-offered" type="number" min={0} inputMode="decimal" value={signOffered} onChange={(e) => setSignOffered(e.target.value)} placeholder="0" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label htmlFor="neg-sign-target" className="block text-xs font-semibold text-white/70 mb-1">Signing target</label>
                    <input id="neg-sign-target" type="number" min={0} inputMode="decimal" value={signTarget} onChange={(e) => setSignTarget(e.target.value)} placeholder={`${symbol}15,000`} className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>

                  <div>
                    <label htmlFor="neg-rsu-offered" className="block text-xs font-semibold text-white/70 mb-1">RSU offered (4yr total)</label>
                    <input id="neg-rsu-offered" type="number" min={0} inputMode="decimal" value={rsuOffered} onChange={(e) => setRsuOffered(e.target.value)} placeholder="0" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label htmlFor="neg-rsu-target" className="block text-xs font-semibold text-white/70 mb-1">RSU target (4yr total)</label>
                    <input id="neg-rsu-target" type="number" min={0} inputMode="decimal" value={rsuTarget} onChange={(e) => setRsuTarget(e.target.value)} placeholder={`${symbol}80,000`} className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>

                  <div>
                    <label htmlFor="neg-bonus-offered" className="block text-xs font-semibold text-white/70 mb-1">Bonus % offered</label>
                    <input id="neg-bonus-offered" type="number" min={0} max={100} inputMode="decimal" value={bonusPctOffered} onChange={(e) => setBonusPctOffered(e.target.value)} placeholder="0" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label htmlFor="neg-bonus-target" className="block text-xs font-semibold text-white/70 mb-1">Bonus % target</label>
                    <input id="neg-bonus-target" type="number" min={0} max={100} inputMode="decimal" value={bonusPctTarget} onChange={(e) => setBonusPctTarget(e.target.value)} placeholder="15" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>

                  <div>
                    <label htmlFor="neg-pto-offered" className="block text-xs font-semibold text-white/70 mb-1">PTO offered (days)</label>
                    <input id="neg-pto-offered" type="number" min={0} max={365} inputMode="numeric" value={ptoOffered} onChange={(e) => setPtoOffered(e.target.value)} placeholder="25" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label htmlFor="neg-pto-target" className="block text-xs font-semibold text-white/70 mb-1">PTO target (days)</label>
                    <input id="neg-pto-target" type="number" min={0} max={365} inputMode="numeric" value={ptoTarget} onChange={(e) => setPtoTarget(e.target.value)} placeholder="30" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>

                  <div>
                    <label htmlFor="neg-remote-offered" className="block text-xs font-semibold text-white/70 mb-1">Remote policy offered</label>
                    <input id="neg-remote-offered" type="text" maxLength={60} value={remotePolicyOffered} onChange={(e) => setRemotePolicyOffered(e.target.value)} placeholder="3 days in office" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label htmlFor="neg-remote-target" className="block text-xs font-semibold text-white/70 mb-1">Remote policy target</label>
                    <input id="neg-remote-target" type="text" maxLength={60} value={remotePolicyTarget} onChange={(e) => setRemotePolicyTarget(e.target.value)} placeholder="Fully remote" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                  </div>
                </div>

                {/* askCount status — role="status" so changes (0 → 1) are
                    announced to screen readers when fields update. id is
                    referenced by the Generate button via aria-describedby. */}
                <p
                  id="neg-ask-hint"
                  role="status"
                  className={`text-xs ${askCount === 0 ? 'text-amber-300' : 'text-white/50'}`}
                >
                  {askCount === 0
                    ? '⚠ No asks yet — at least one target must be above its offered value.'
                    : `${askCount} ${askCount === 1 ? 'ask' : 'asks'} detected. ${askCount === 1 ? 'Email will anchor on it; phone script will be tight.' : `Email will anchor on the largest delta; phone script will cover all ${askCount}.`}`}
                </p>
              </fieldset>

              {/* Competing offer (collapsed by default) */}
              <details className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                <summary className="text-sm font-semibold text-white/80 cursor-pointer select-none">Competing offer (boosts leverage if real)</summary>
                <div className="space-y-3 mt-3">
                  <label htmlFor="neg-has-competing" className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                    <input
                      id="neg-has-competing"
                      type="checkbox"
                      checked={hasCompetingOffer}
                      onChange={(e) => setHasCompetingOffer(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
                    />
                    I have an active competing offer
                  </label>
                  {hasCompetingOffer && (
                    <>
                      <div>
                        <label htmlFor="neg-competing-co" className="block text-xs font-semibold text-white/70 mb-1">Competing company</label>
                        <input
                          id="neg-competing-co"
                          type="text"
                          maxLength={120}
                          value={competingCompany}
                          onChange={(e) => setCompetingCompany(e.target.value)}
                          placeholder="Anthropic"
                          className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="neg-competing-ctx" className="block text-xs font-semibold text-white/70 mb-1">Brief context <span className="text-white/40">(optional, max 300 chars)</span></label>
                        <textarea
                          id="neg-competing-ctx"
                          rows={2}
                          value={competingOfferContext}
                          onChange={(e) => setCompetingOfferContext(e.target.value.slice(0, 300))}
                          placeholder="Decision needed by Friday. Comparable level, slightly higher base + signing."
                          className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50 resize-y"
                        />
                      </div>
                    </>
                  )}
                </div>
              </details>

              {/* Channel + tone + recipient */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Style</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="neg-channel" className="block text-xs font-semibold text-white/70 mb-1">Preferred channel</label>
                    <select
                      id="neg-channel"
                      value={preferredChannel}
                      onChange={(e) => setPreferredChannel(e.target.value as Channel)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    >
                      <option value="email">Email (anchor + soft-handoff to call)</option>
                      <option value="phone">Phone / video call</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="neg-tone" className="block text-xs font-semibold text-white/70 mb-1">Tone</label>
                    <select
                      id="neg-tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value as Tone)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    >
                      <option value="collaborative">Collaborative (partnership framing)</option>
                      <option value="firm">Firm (transactional, direct)</option>
                    </select>
                  </div>
                </div>
                <details className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                  <summary className="text-sm font-semibold text-white/80 cursor-pointer select-none">Recipient (optional)</summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label htmlFor="neg-recipient-name" className="block text-xs font-semibold text-white/70 mb-1">Recipient name</label>
                      <input id="neg-recipient-name" type="text" maxLength={80} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Sarah Chen" className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
                    </div>
                    <div>
                      <label htmlFor="neg-recipient-role" className="block text-xs font-semibold text-white/70 mb-1">Their role</label>
                      <select id="neg-recipient-role" value={recipientRole} onChange={(e) => setRecipientRole(e.target.value as RecipientRole | '')} className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50">
                        <option value="">— Choose —</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="hiring-manager">Hiring Manager</option>
                        <option value="founder">Founder / CEO</option>
                        <option value="engineering-manager">Engineering Manager</option>
                      </select>
                    </div>
                  </div>
                </details>
                <details className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                  <summary className="text-sm font-semibold text-white/80 cursor-pointer select-none">Additional context (optional)</summary>
                  <div className="mt-3">
                    <label htmlFor="neg-additional" className="block text-xs font-semibold text-white/70 mb-1">Anything else worth knowing <span className="text-white/40">(max 500 chars)</span></label>
                    <textarea
                      id="neg-additional"
                      rows={3}
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value.slice(0, 500))}
                      placeholder="e.g. The recruiter mentioned they have flex on signing but not base. I want to stay in the same city, so no relocation needed."
                      aria-describedby="neg-additional-hint"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50 resize-y"
                    />
                    <p id="neg-additional-hint" className="text-[10px] text-white/40 mt-1">
                      Saved to this browser for 7 days as part of the draft. Don't paste account numbers or other sensitive personal info.
                    </p>
                  </div>
                </details>
              </fieldset>

              {/* Submit */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {!hasTokens && (
                  <span className="text-xs text-amber-300">Out of tokens — top up to generate.</span>
                )}
                <button
                  type="button"
                  onClick={() => onClose(returnedBalance)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/70 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  aria-describedby="neg-ask-hint"
                  aria-busy={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      Generate brief ({COST} tokens)
                    </>
                  )}
                </button>
              </div>
              {/* Loading status — SR-announced via aria-live. Sets time
                  expectation so users don't think the UI froze. */}
              {loading && (
                <p role="status" aria-live="polite" className="text-xs text-white/50 text-right">
                  Drafting your brief — usually 10–20 seconds…
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
