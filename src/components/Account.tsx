import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft, Sparkles, User, Mail, CreditCard, Shield, LogOut,
  Zap, Star, Crown, Lock, ExternalLink, Check, AlertTriangle, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../App';
import { supabase, getCreditsRemaining } from '../lib/supabase';
import { createBillingPortal, syncSubscription } from '../services/api';

const PLAN_META: Record<string, { color: string; icon: LucideIcon; label: string }> = {
  starter: { color: '#6B6B8D', icon: Zap, label: 'Starter' },
  pro:     { color: '#4F46E5', icon: Star, label: 'Pro' },
  premium: { color: '#7C3AED', icon: Crown, label: 'Premium' },
};

export default function Account() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Refresh profile on mount — catches subscription changes made via Stripe portal
  React.useEffect(() => {
    refreshProfile();
    // Also sync with Stripe to catch cancellations that webhooks may not have delivered yet
    if (profile?.stripe_subscription_id) {
      syncSubscription().then(() => refreshProfile()).catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Name editing
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profile?.full_name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Billing portal
  const [portalLoading, setPortalLoading] = useState(false);

  // General error
  const [error, setError] = useState('');

  const creditsRemaining = profile ? getCreditsRemaining(profile) : 0;
  const planInfo = PLAN_META[profile?.plan || 'starter'] || PLAN_META.starter;
  const PlanIcon = planInfo.icon;
  const hasActiveSub = profile?.subscription_status === 'active' || profile?.subscription_status === 'cancelling' || profile?.subscription_status === 'past_due';

  const handleSaveName = async () => {
    if (!user) return;
    setNameSaving(true);
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: nameValue })
        .eq('id', user.id);
      if (updateError) throw updateError;
      setEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update name');
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    // Length policy matched to Supabase Auth's default minimum (8) — was
    // previously 6 which is below modern NIST SP 800-63B guidance and
    // typically rejected by Supabase before reaching the API. Also enforce
    // an upper bound (72 — bcrypt truncates beyond this, so longer
    // 'passwords' would silently match shorter prefixes — a real footgun
    // for users who think a long passphrase is more secure).
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword.length > 72) {
      setPasswordError('Password must be 72 characters or fewer (bcrypt limit). Use a passphrase that fits.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    setError('');
    try {
      const result = await createBillingPortal();
      window.location.href = result.url;
    } catch (err: any) {
      setError(err.message || 'Failed to open billing portal');
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-display font-bold text-white">Vantage</span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors text-sm min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto p-6">
        {/* No motion entrance — same defensive change as Pricing/Auth/Dashboard
            (2026-05-07). Account page is post-login, must always paint. */}
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Account Settings</h1>
          <p className="text-white/50 mb-8">Manage your profile, subscription, and security</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Profile Info */}
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <User className="w-5 h-5 text-violet-400" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">Profile</h2>
            </div>

            {/* Avatar + Email */}
            <div className="flex items-center gap-4 mb-5">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border-2 border-violet-500/30 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-500/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-violet-400" aria-hidden="true" />
                </div>
              )}
              <div>
                <p className="text-white font-semibold">{profile?.full_name || 'No name set'}</p>
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  {user?.email || profile?.email}
                </div>
              </div>
            </div>

            {/* Name editing */}
            <label htmlFor="account-fullname" className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
              Full Name
            </label>
            {editingName ? (
              <div className="flex gap-2">
                <input
                  id="account-fullname"
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                  autoComplete="name"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-50 min-h-[44px]"
                >
                  {nameSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingName(false); setNameValue(profile?.full_name || ''); }}
                  className="px-3 py-2 rounded-lg bg-white/5 text-white/50 text-sm hover:bg-white/10 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">{profile?.full_name || 'Not set'}</span>
                {nameSuccess && <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
                <button
                  onClick={() => { setEditingName(true); setNameValue(profile?.full_name || ''); }}
                  className="ml-auto text-violet-400 text-sm hover:text-violet-300 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </section>

          {/* Subscription */}
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <CreditCard className="w-5 h-5 text-violet-400" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">Subscription</h2>
            </div>

            {/* Plan badge */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${planInfo.color}20`, border: `1px solid ${planInfo.color}40` }}
              >
                <PlanIcon className="w-5 h-5" style={{ color: planInfo.color }} />
              </div>
              <div>
                <p className="text-white font-bold">
                  {hasActiveSub ? `${planInfo.label} Plan` : 'No active subscription'}
                </p>
                {/* Status line now reads actual renewal / cancellation date from
                    profile.subscription_renews_at + subscription_cancel_at.
                    Pre-fix: 'Cancelling at end of period' with no date — user
                    couldn't tell when access ends. Audit 2026-05-14. */}
                {(() => {
                  const status = profile?.subscription_status;
                  const renewsAt = profile?.subscription_renews_at;
                  const cancelAt = profile?.subscription_cancel_at;
                  const fmt = (iso: string | undefined): string => {
                    if (!iso) return '';
                    try {
                      const d = new Date(iso);
                      if (Number.isNaN(d.getTime())) return '';
                      return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
                    } catch { return ''; }
                  };
                  let colorClass = 'text-white/60';
                  let text: React.ReactNode = 'Buy tokens or subscribe to a plan';
                  if (status === 'active') {
                    colorClass = 'text-emerald-400';
                    const r = fmt(renewsAt);
                    text = r ? <>{planInfo.label} — <span className="font-semibold">renews {r}</span></> : `${planInfo.label} — Active`;
                  } else if (status === 'cancelling') {
                    colorClass = 'text-amber-400';
                    const c = fmt(cancelAt) || fmt(renewsAt);
                    text = c
                      ? <><span className="font-semibold">Ends {c}</span> — renewal cancelled</>
                      : 'Cancelling at end of period';
                  } else if (status === 'past_due') {
                    colorClass = 'text-rose-300';
                    text = <><span className="font-semibold">Payment failed</span> — update card via Manage Subscription, or your plan will end.</>;
                  } else if (status === 'cancelled') {
                    colorClass = 'text-amber-400';
                    text = 'Cancelled — tokens kept. Resubscribe any time.';
                  }
                  return (
                    <p className={`text-sm ${colorClass}`}>
                      {text}
                    </p>
                  );
                })()}
              </div>
            </div>

            {/* Token Balance — colour-coded by remaining count + inline top-up
                CTA when running low. Previously showed a green number even at
                0, with no obvious next step. Empty/low states now signal the
                action: top-up £5 for 20 more or subscribe. */}
            <div
              className={`p-3 rounded-xl border mb-5 ${
                creditsRemaining === 0
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : creditsRemaining <= 2
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Token Balance</span>
                <span
                  className={`font-bold ${
                    creditsRemaining === 0
                      ? 'text-rose-300'
                      : creditsRemaining <= 2
                      ? 'text-amber-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {creditsRemaining}
                </span>
              </div>
              {creditsRemaining === 0 && (
                <p className="text-rose-200/80 text-xs mt-2 leading-relaxed">
                  You're out of tokens. Top up £5 for 20 more (never expires) or subscribe for monthly refresh.
                </p>
              )}
              {creditsRemaining > 0 && creditsRemaining <= 2 && (
                <p className="text-amber-200/80 text-xs mt-2 leading-relaxed">
                  Running low — {creditsRemaining} {creditsRemaining === 1 ? 'pack' : 'packs'} left. Top up £5 for 20 more (never expires).
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {hasActiveSub ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 min-h-[44px]"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  {portalLoading ? 'Opening...' : 'Manage Subscription'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:from-violet-500 hover:to-purple-500 transition-all min-h-[44px]"
                >
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  Subscribe
                </button>
              )}
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors min-h-[44px]"
              >
                <Crown className="w-4 h-4" aria-hidden="true" />
                {hasActiveSub ? 'Upgrade Plan' : 'View Plans'}
              </button>
            </div>
          </section>

          {/* Password */}
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-5 h-5 text-violet-400" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">Password</h2>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label htmlFor="account-new-password" className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="account-new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors placeholder-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/55 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="account-confirm-password" className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="account-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors placeholder-white/20"
                />
              </div>
            </div>

            {passwordError && (
              <div className="mb-3 text-red-400 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-3 text-emerald-400 text-sm flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Password updated successfully
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={passwordSaving || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              {passwordSaving ? 'Updating...' : 'Change Password'}
            </button>
          </section>

          {/* Danger Zone */}
          <section className="p-6 rounded-2xl bg-red-500/5 border border-red-500/15 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="w-5 h-5 text-red-400" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">Danger Zone</h2>
            </div>
            <p className="text-white/60 text-sm mb-4">Sign out of your account on this device.</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors min-h-[44px]"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sign Out
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
