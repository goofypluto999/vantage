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
            <Check className="w-8 h-8 text-emerald-400" />
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
          <p className="text-white/40 text-xs mt-6">
            Already confirmed? <Link to="/login" className="text-violet-400 underline hover:text-violet-300">Sign in</Link>
          </p>
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
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-white">Vantage</span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/50 mb-6">Start preparing for your next job today</p>

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
            <Chrome className="w-5 h-5 text-[#4285F4]" />
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
              <span className="px-4 bg-[#1a1635] text-white/30">or use email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
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
              <label className="block text-sm font-semibold text-white/70 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
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
              <label className="block text-sm font-semibold text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Free-tier reassurance — replaces the old plan picker which scared
                visitors off at signup (every CTA elsewhere says "free" but the picker
                screamed paid plans). Plan picker now lives on dashboard, post-signup. */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
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
                  Create Account <ArrowRight className="w-5 h-5" />
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
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" /><span>One company-research write-up per role (mission, culture, recent moves)</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" /><span>One tailored cover letter — switchable across 4 tones</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" /><span>8–12 likely interview questions, generated from the actual JD</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" /><span>A 5-minute pitch outline you can rehearse out loud</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" /><span>A free ATS preview that shows whether 5 major parsers will read your CV cleanly</span></li>
          </ul>
          <p className="text-white/60 text-sm mt-6 leading-relaxed">
            Built solo by Giovanni Sizino Ennes (UK independent founder). No paywalls hidden behind the signup button. Stripe-only billing.
            <Link to="/about" className="underline hover:text-white ml-1">About the operator</Link>
          </p>
        </div>
      </div>
    </div>
  );
}