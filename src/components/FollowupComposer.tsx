// FollowupComposer — modal for generating a follow-up email after an
// application / interview stage. Pre-fills companyName / roleName /
// userName from the analysis result + auth profile so the user only has
// to pick stage + days + urgency.
//
// Wired into Dashboard.tsx's results section (AI Mock Interview row).
// Lazy-loaded by Dashboard so this component + its deps don't bloat the
// initial bundle.
//
// Atomic token semantics: server deducts before calling Gemini and refunds
// on AI failure. Client just shows error + relies on server-returned
// token_balance to refresh the displayed credits.
//
// PII: never logs the generated email body. Only sends auth header +
// request body to /api/followup.

import { useState, useEffect, useRef } from 'react';
import { X, Send, Copy, Check, AlertTriangle, Mail } from 'lucide-react';
import {
  generateFollowupEmail,
  type FollowupStage,
  type FollowupUrgency,
  type FollowupRecipientRole,
} from '../services/api';
import { useFormDraft } from '../lib/useFormDraft';

interface Props {
  // Context auto-filled from the parent analysis result.
  defaultCompanyName?: string;
  defaultRoleName?: string;
  defaultUserName?: string;
  // Called when modal closes (so parent can refresh token balance).
  onClose: (newTokenBalance?: number) => void;
  // Disable the Generate button if the user is out of tokens; parent
  // controls this since it owns the profile.
  hasTokens: boolean;
  // Authenticated user id — scopes the draft localStorage key so user
  // B can't read user A's data on a shared device. Optional in signature.
  userScope?: string;
}

const STAGE_LABELS: { value: FollowupStage; label: string; hint: string }[] = [
  { value: 'post-application', label: 'After applying', hint: 'No response since I submitted the application' },
  { value: 'post-phone-screen', label: 'After a phone screen', hint: 'Asking about next steps' },
  { value: 'post-onsite', label: 'After an on-site / virtual onsite', hint: 'Checking on decision timing' },
  { value: 'post-final-round', label: 'After the final round', hint: 'Asking about the offer decision' },
  { value: 'after-offer-received', label: 'After receiving an offer', hint: 'Asking for time / specific question' },
];

const URGENCY_LABELS: { value: FollowupUrgency; label: string; hint: string }[] = [
  { value: 'patient', label: 'Patient', hint: 'Low-pressure, low-anxiety. No urgency.' },
  { value: 'polite-nudge', label: 'Polite nudge', hint: 'Direct but respectful. Asking for a specific update.' },
  { value: 'time-sensitive', label: 'Time-sensitive', hint: 'Honest about a deadline or competing offer.' },
];

const RECIPIENT_ROLE_LABELS: { value: FollowupRecipientRole; label: string }[] = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'hiring-manager', label: 'Hiring Manager' },
  { value: 'founder', label: 'Founder / CEO' },
  { value: 'engineering-manager', label: 'Engineering Manager' },
];

export default function FollowupComposer({ defaultCompanyName, defaultRoleName, defaultUserName, onClose, hasTokens, userScope }: Props) {
  // Form state
  const [companyName, setCompanyName] = useState(defaultCompanyName || '');
  const [roleName, setRoleName] = useState(defaultRoleName || '');
  const [userName, setUserName] = useState(defaultUserName || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState<FollowupRecipientRole | ''>('');
  const [daysSinceLast, setDaysSinceLast] = useState(7);
  const [stage, setStage] = useState<FollowupStage>('post-application');
  const [urgencyTone, setUrgencyTone] = useState<FollowupUrgency>('patient');
  const [keyTalkingPoint, setKeyTalkingPoint] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  // Result state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ subject: string; body: string; balance: number } | null>(null);
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | 'full' | null>(null);
  const [returnedBalance, setReturnedBalance] = useState<number | undefined>(undefined);

  // Draft persistence — same pattern as NegotiationComposer.
  const [draftPromptShown, setDraftPromptShown] = useState(false);
  const [draftDecisionMade, setDraftDecisionMade] = useState(false);
  const draftPayload = {
    companyName, roleName, userName, recipientName, recipientRole,
    daysSinceLast, stage, urgencyTone, keyTalkingPoint, additionalContext,
  };
  const { loadDraft, clearDraft } = useFormDraft('vantage-followup-draft-v1', draftPayload, { userScope });

  const dialogRef = useRef<HTMLDivElement>(null);
  // Double-click race guard — checked + set synchronously at the top
  // of handleGenerate before any state-driven re-render. Same pattern
  // as NegotiationComposer (multi-agent review caught the gap here).
  const inFlightRef = useRef(false);

  // ESC to close + body scroll lock (matches existing modal pattern)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(returnedBalance); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, returnedBalance]);

  // Surface restore prompt on open when a saved draft exists.
  useEffect(() => {
    const saved = loadDraft();
    if (saved && !draftDecisionMade) setDraftPromptShown(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function restoreDraft() {
    const saved = loadDraft();
    if (!saved) { setDraftPromptShown(false); setDraftDecisionMade(true); return; }
    if (typeof saved.companyName === 'string') setCompanyName(saved.companyName);
    if (typeof saved.roleName === 'string') setRoleName(saved.roleName);
    if (typeof saved.userName === 'string') setUserName(saved.userName);
    if (typeof saved.recipientName === 'string') setRecipientName(saved.recipientName);
    if (
      saved.recipientRole === 'recruiter' || saved.recipientRole === 'hiring-manager' ||
      saved.recipientRole === 'founder' || saved.recipientRole === 'engineering-manager' ||
      saved.recipientRole === ''
    ) setRecipientRole(saved.recipientRole);
    if (typeof saved.daysSinceLast === 'number' && saved.daysSinceLast >= 1 && saved.daysSinceLast <= 90) {
      setDaysSinceLast(saved.daysSinceLast);
    }
    if (
      saved.stage === 'post-application' || saved.stage === 'post-phone-screen' ||
      saved.stage === 'post-onsite' || saved.stage === 'post-final-round' ||
      saved.stage === 'after-offer-received'
    ) setStage(saved.stage);
    if (saved.urgencyTone === 'patient' || saved.urgencyTone === 'polite-nudge' || saved.urgencyTone === 'time-sensitive') {
      setUrgencyTone(saved.urgencyTone);
    }
    if (typeof saved.keyTalkingPoint === 'string') setKeyTalkingPoint(saved.keyTalkingPoint);
    if (typeof saved.additionalContext === 'string') setAdditionalContext(saved.additionalContext);
    setDraftPromptShown(false);
    setDraftDecisionMade(true);
  }

  function dismissDraft() {
    clearDraft();
    setDraftPromptShown(false);
    setDraftDecisionMade(true);
  }

  const canGenerate = !loading && hasTokens && companyName.trim().length > 0 && roleName.trim().length > 0 && userName.trim().length > 0 && daysSinceLast >= 1 && daysSinceLast <= 90;

  async function handleGenerate() {
    if (inFlightRef.current) return;
    if (!canGenerate) return;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generateFollowupEmail({
        companyName: companyName.trim(),
        roleName: roleName.trim(),
        userName: userName.trim(),
        ...(recipientName.trim() ? { recipientName: recipientName.trim() } : {}),
        ...(recipientRole ? { recipientRole: recipientRole as FollowupRecipientRole } : {}),
        daysSinceLast,
        stage,
        urgencyTone,
        ...(keyTalkingPoint.trim() ? { keyTalkingPoint: keyTalkingPoint.trim() } : {}),
        ...(additionalContext.trim() ? { additionalContext: additionalContext.trim() } : {}),
      });
      if (!res.success || !res.subject || !res.body) {
        setError(res.error || 'Generation failed. Tokens have been refunded.');
        return;
      }
      setResult({ subject: res.subject, body: res.body, balance: res.token_balance ?? 0 });
      setReturnedBalance(res.token_balance);
      clearDraft();
    } catch (e: any) {
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

  async function copyTo(kind: 'subject' | 'body' | 'full') {
    if (!result) return;
    const text = kind === 'subject' ? result.subject
      : kind === 'body' ? result.body
      : `Subject: ${result.subject}\n\n${result.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(kind);
      setTimeout(() => setCopiedField(null), 2200);
    } catch {
      // Clipboard not available — fall back to selection prompt
      setCopiedField(null);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="followup-title"
      ref={dialogRef}
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-6 overflow-y-auto"
      style={{ background: 'rgba(13, 11, 30, 0.85)' }}
      onMouseDown={(e) => { if (e.target === dialogRef.current) onClose(returnedBalance); }}
    >
      <div className="w-full max-w-2xl rounded-3xl bg-[#181530] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.5)] my-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-violet-400" aria-hidden="true" />
              <h2 id="followup-title" className="text-xl font-bold text-white">Generate follow-up email</h2>
            </div>
            <p className="text-sm text-white/60 mt-1">Costs 1 token. Refunded if generation fails.</p>
          </div>
          <button
            type="button"
            onClick={() => onClose(returnedBalance)}
            aria-label="Close follow-up composer"
            className="p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Result panel — only after success */}
          {result && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Subject</p>
                  <button
                    type="button"
                    onClick={() => copyTo('subject')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                  >
                    {copiedField === 'subject' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
                <p className="text-sm text-white font-medium">{result.subject}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-300">Body</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyTo('body')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                    >
                      {copiedField === 'body' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy body</>}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyTo('full')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition"
                    >
                      {copiedField === 'full' ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy full</>}
                    </button>
                  </div>
                </div>
                <pre className="text-sm text-white/90 whitespace-pre-wrap font-sans leading-relaxed">{result.body}</pre>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setResult(null); setError(null); }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition"
                >
                  Generate another (1 more token)
                </button>
                <span className="text-xs text-white/50">Balance: {result.balance} tokens left</span>
              </div>
            </div>
          )}

          {/* Form panel — only when no result yet */}
          {!result && (
            <>
              {/* Draft restore prompt — same pattern as NegotiationComposer. */}
              {draftPromptShown && !draftDecisionMade && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-lg bg-violet-500/10 border border-violet-500/30 p-3 flex flex-wrap items-center gap-3 justify-between"
                >
                  <p className="text-sm text-violet-200 flex-1 min-w-[200px]">
                    Found an unfinished follow-up draft on this browser. Restore your inputs?
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
                <div role="alert" className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p>{error}</p>
                </div>
              )}

              {/* Required basics — pre-filled when launched from analysis context */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="fu-company" className="block text-xs font-semibold text-white/70 mb-1">Company *</label>
                  <input
                    id="fu-company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    maxLength={120}
                    placeholder="Stripe"
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label htmlFor="fu-role" className="block text-xs font-semibold text-white/70 mb-1">Role *</label>
                  <input
                    id="fu-role"
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    maxLength={160}
                    placeholder="Senior Product Manager"
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label htmlFor="fu-username" className="block text-xs font-semibold text-white/70 mb-1">Your full name *</label>
                  <input
                    id="fu-username"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={80}
                    placeholder="Alex Morgan"
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label htmlFor="fu-days" className="block text-xs font-semibold text-white/70 mb-1">Days since last contact *</label>
                  <input
                    id="fu-days"
                    type="number"
                    min={1}
                    max={90}
                    value={daysSinceLast}
                    onChange={(e) => setDaysSinceLast(parseInt(e.target.value || '7', 10))}
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Stage */}
              <div>
                <label htmlFor="fu-stage" className="block text-xs font-semibold text-white/70 mb-1">Stage *</label>
                <select
                  id="fu-stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as FollowupStage)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                >
                  {STAGE_LABELS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label} — {s.hint}</option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label htmlFor="fu-urgency" className="block text-xs font-semibold text-white/70 mb-1">Urgency tone *</label>
                <select
                  id="fu-urgency"
                  value={urgencyTone}
                  onChange={(e) => setUrgencyTone(e.target.value as FollowupUrgency)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                >
                  {URGENCY_LABELS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label} — {u.hint}</option>
                  ))}
                </select>
              </div>

              {/* Optional recipient details */}
              <details className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                <summary className="text-sm font-semibold text-white/80 cursor-pointer select-none">Recipient details (optional)</summary>
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label htmlFor="fu-recipient-name" className="block text-xs font-semibold text-white/70 mb-1">Recipient name</label>
                    <input
                      id="fu-recipient-name"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      maxLength={80}
                      placeholder="Sarah Chen"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="fu-recipient-role" className="block text-xs font-semibold text-white/70 mb-1">Their role</label>
                    <select
                      id="fu-recipient-role"
                      value={recipientRole}
                      onChange={(e) => setRecipientRole(e.target.value as FollowupRecipientRole | '')}
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm outline-none focus:border-violet-500/50"
                    >
                      <option value="">— Choose —</option>
                      {RECIPIENT_ROLE_LABELS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                </div>
              </details>

              {/* Optional anchors */}
              <details className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                <summary className="text-sm font-semibold text-white/80 cursor-pointer select-none">Anchors (optional but produce sharper output)</summary>
                <div className="space-y-3 mt-3">
                  <div>
                    <label htmlFor="fu-anchor" className="block text-xs font-semibold text-white/70 mb-1">
                      One specific thing you want to reference <span className="text-white/40">(max 300 chars)</span>
                    </label>
                    <textarea
                      id="fu-anchor"
                      value={keyTalkingPoint}
                      onChange={(e) => setKeyTalkingPoint(e.target.value.slice(0, 300))}
                      rows={2}
                      placeholder="e.g. I noticed the team is hiring after the EU expansion announcement — I'd love to ask about the markets strategy"
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50 resize-y"
                    />
                  </div>
                  <div>
                    <label htmlFor="fu-context" className="block text-xs font-semibold text-white/70 mb-1">
                      Any other context <span className="text-white/40">(max 500 chars)</span>
                    </label>
                    <textarea
                      id="fu-context"
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value.slice(0, 500))}
                      rows={2}
                      placeholder="e.g. The recruiter mentioned they'd be back from leave by Friday — checking in patiently."
                      className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2 text-sm outline-none focus:border-violet-500/50 resize-y"
                    />
                  </div>
                </div>
              </details>

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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Generate (1 token)
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
