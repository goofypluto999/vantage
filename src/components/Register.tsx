import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// motion/react entrance animations were dropped on this surface 2026-05-07
// after a same-pattern bug on the Pricing cards (initial:opacity-0 +
// animate:opacity-1) was getting STUCK at opacity ~0.25 in production —
// hiding the whole signup form. Auth surfaces are critical conversion
// surfaces; they must always paint, no entrance animation.
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, BrainCircuit, Chrome, Check } from 'lucide-react';
import { signUp, signInWithGoogle, mapAuthError } from '../lib/supabase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, trimmedName);
      setSuccess(true);
    } catch (err: any) {
      setError(mapAuthError(err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(mapAuthError(err.message || ''));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}>
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Account created — almost there.</h2>
          <p className="text-white/70 mb-4">
            We just sent a confirmation email to <span className="text-white font-semibold">{email}</span>. Click the link in that email and you're in.
          </p>
          <div className="text-left rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 mb-5">
            <p className="text-amber-300 text-sm font-semibold mb-1">Heads up — check your spam folder.</p>
            <p className="text-amber-100/80 text-xs leading-relaxed">
              Gmail and Outlook aggressively filter mail from new domains. The confirmation email lands in spam about half the time for our visitors. If you don't see it in your inbox in the next 60 seconds, look in <strong>Spam</strong> / <strong>Junk</strong> / <strong>Promotions</strong>.
            </p>
          </div>
          <p className="text-white/50 text-sm mb-1">No email after 5 minutes?</p>
          <p className="text-white/70 text-sm">
            Email <a href="mailto:hello@aimvantage.uk" className="text-violet-400 underline hover:text-violet-300">hello@aimvantage.uk</a> and Gio (the operator) will manually confirm your account within a few hours.
          </p>
          <p className="text-white/60 text-xs mt-6">
            Already confirmed? <Link to="/login" className="text-violet-400 underline hover:text-violet-300">Sign in</Link>
          </p>

          {/* While-you-wait bridge — Gmail/Outlook confirmation emails take
              up to 60 seconds to arrive (sometimes longer when they get
              filtered to spam). Instead of leaving the user staring at the
              page, give them something useful to do that ALSO advances the
              conversion. The 60-second diagnostic is perfect: no signup
              needed (already done), no friction, returns a verdict that
              tells them what to focus on once they're in. */}
          <div className="mt-8 pt-6 border-t border-white/10 text-left">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-2">While you wait for the email</div>
            <p className="text-white/70 text-sm mb-3">
              Run the free 60-second diagnostic — it pinpoints which of 7 failure modes is killing your interview rate (ATS / positioning / proof / market / etc.). When you confirm your email and land on the dashboard, you'll know exactly which prep pack to run first.
            </p>
            <Link
              to="/tools/no-interviews-diagnostic?source=post-signup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 text-sm font-semibold transition-colors"
            >
              Run the 60-second diagnostic →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 50%, #2d2654 100%)' }}>
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-display font-bold text-white">Vantage</span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-white/60 hover:text-white/70 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Home
            </Link>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/50 mb-6">Start preparing for your next job today</p>

          {/* Mobile-only "what you get" — the lg+ right panel with the same
              content is hidden on mobile (hidden lg:flex), which means
              ~70% of signup traffic was missing the value-prop bullets
              entirely. Surface them here on small screens, identical
              content, hidden on lg+ where the right panel takes over. */}
          <div className="lg:hidden mb-6 rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-2 font-bold">What 10 free prep packs include</div>
            <ul className="space-y-1.5 text-white/75 text-sm">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Company-research write-up per role</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Tailored cover letter (4 tones)</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" /><span>8–12 likely interview questions</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" /><span>5-minute pitch outline</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Free ATS preview across 5 parsers</span></li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google OAuth FIRST — skips email-confirmation entirely.
              Email confirmation is the biggest indie-SaaS funnel-leak; OAuth
              users are auto-confirmed and land directly in the dashboard. */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-4 py-3.5 rounded-xl bg-white text-[#2D2B4E] font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
          >
            <Chrome className="w-5 h-5 text-[#4285F4]" aria-hidden="true" />
            <span>Continue with Google</span>
          </button>
          <p className="text-center text-[11px] text-emerald-300/80 mb-5 font-medium">
            ⚡ Fastest path — skips email confirmation. You're in the dashboard in 3 seconds.
          </p>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1635] text-white/55">or use email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-semibold text-white/70 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden="true" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
                  placeholder="John Doe"
                  required
                  minLength={1}
                  autoComplete="name"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-semibold text-white/70 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden="true" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-semibold text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden="true" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 hover:text-white/50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Free-tier reassurance — replaces the old plan picker which scared
                visitors off at signup (every CTA elsewhere says "free" but the picker
                screamed paid plans). Plan picker now lives on dashboard, post-signup. */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm">
                <div className="text-white font-semibold">10 free tokens on us — that's 10 full prep packs.</div>
                <div className="text-white/60 mt-0.5">
                  Account is free. No credit card needed to sign up. After your free analyses,
                  top-ups start at {'£'}5 / $5 for 20 more tokens (one-time, never expire).
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual. No fake numbers — we're a few weeks old.
          Real value prop: speed + concrete deliverables + sole-trader transparency. */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
        <div className="max-w-md">
          <h2 className="text-3xl font-display font-bold text-white mb-5">
            What 10 free prep packs get you
          </h2>
          <ul className="space-y-3 text-white/85 text-base">
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" /><span>One company-research write-up per role (mission, culture, recent moves)</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" /><span>One tailored cover letter — switchable across 4 tones</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" /><span>8–12 likely interview questions, generated from the actual JD</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" /><span>A 5-minute pitch outline you can rehearse out loud</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" /><span>A free ATS preview that shows whether 5 major parsers will read your CV cleanly</span></li>
          </ul>
          <p className="text-white/60 text-sm mt-6 leading-relaxed">
            Built solo by Giovanni Sizino Ennes (UK independent founder). No paywalls hidden behind the signup button. Stripe-only billing.
            <Link to="/about" className="underline hover:text-white ml-1">About the operator</Link>
          </p>

          {/* Verifiable trust block — added 2026-05-10. The right panel
              previously had value-prop bullets + an operator credit but
              no concrete trust artefacts. Each item below is verifiable
              by clicking through, not a claim. Mirrors the built-in-public
              block on the LandingPage but compressed for this surface. */}
          <div className="mt-6 pt-5 border-t border-white/15">
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/65 mb-3">
              Verifiable, not claims
            </p>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  UK ICO-registered for data protection ({' '}
                  <Link to="/privacy#ico-registration" className="underline hover:text-white">
                    proof
                  </Link>
                  )
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Public changelog and commit graph on{' '}
                  <a
                    href="https://github.com/goofypluto999/vantage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    GitHub
                  </a>{' '}
                  ·{' '}
                  <Link to="/changelog" className="underline hover:text-white">
                    changelog
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Open-source companion ATS scanner:{' '}
                  <a
                    href="https://github.com/goofypluto999/cv-mirror-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    cv-mirror-mcp
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Cancel any time · 14-day refund window · Tokens never expire on top-ups
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}