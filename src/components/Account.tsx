import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft, Sparkles, User, Mail, CreditCard, Shield, LogOut,
  Zap, Star, Crown, Lock, ExternalLink, Check, AlertTriangle, Eye, EyeOff,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../App';
import { supabase, getCreditsRemaining } from '../lib/supabase';
import { createBillingPortal, syncSubscription, deleteAccount } from '../services/api';

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

  // GA4 funnel — `subscription_canceled` fires once per subscription_id when
  // status flips to 'cancelling' (period-end cancel) or 'cancelled' (immediate).
  // Dedupe via localStorage keyed by stripe_subscription_id so a refresh /
  // remount can't re-fire. Cancellations happen at Stripe portal → webhook
  // updates DB → user returns here → this effect observes the transition.
  React.useEffect(() => {
    const subId = profile?.stripe_subscription_id;
    const status = profile?.subscription_status;
    if (!subId || (status !== 'cancelling' && status !== 'cancelled')) return;
    if (typeof localStorage === 'undefined') return;
    const dedupeKey = `av_subcancel_fired_${subId}`;
    if (localStorage.getItem(dedupeKey)) return;
    void import('../lib/ga4').then(({ trackEvent }) => {
      trackEvent('subscription_canceled', {
        plan: profile?.plan || 'unknown',
        reason: status === 'cancelled' ? 'immediate' : 'period_end',
      });
    }).catch(() => { /* analytics never blocks account UI */ });
    try { localStorage.setItem(dedupeKey, '1'); } catch { /* quota — ignore */ }
  }, [profile?.subscription_status, profile?.stripe_subscription_id, profile?.plan]);

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

  // Account deletion (GDPR right-to-erasure, gap #1 self-serve flow)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // General error
  const [error, setError] = useState('');

  const creditsRemaining = profile ? getCreditsRemaining(profile) : 0;
  const planInfo = PLAN_META[profile?.plan || 'starter'] || PLAN_META.starter;
  const PlanIcon = planInfo.icon;
  const hasActiveSub = profile?.subscription_status === 'active' || profile?.subscription_status === 'cancelling' || profile?.subscription_status === 'past_due';

  // Operator-only Stripe-mode banner. End users never see this — would be a
  // conversion-killer ("test mode" sounds sketchy). Admins (operator email
  // listed in VITE_ADMIN_EMAILS) need it as a constant reminder that real
  // payments aren't being captured. Defaults to showing the banner unless
  // VITE_STRIPE_MODE === 'live' — fail-loud is the safe default for a paid
  // SaaS where forgetting to flip to live = lost revenue, not lost data.
  const adminEmails = ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || '')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const isAdmin =
    Boolean(import.meta.env.DEV) ||
    (typeof user?.email === 'string' && adminEmails.includes(user.email.toLowerCase()));
  const stripeMode = ((import.meta.env.VITE_STRIPE_MODE as string | undefined) || 'test').toLowerCase();
  const showStripeTestBanner = isAdmin && stripeMode !== 'live';

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Type DELETE exactly (uppercase) to confirm.');
      return;
    }
    setDeleteSubmitting(true);
    setDeleteError(null);
    const result = await deleteAccount();
    if (!result.success) {
      setDeleteError(result.error || 'Account deletion failed. Please try again or email giovanni.sizino.ennes@hotmail.co.uk.');
      setDeleteSubmitting(false);
      return;
    }
    // Success — Supabase session was revoked server-side. Sign out client-
    // side too (clears localStorage / auth context) + redirect. replace: true
    // so the back button doesn't return to /account.
    await signOut();
    navigate('/?deleted=1', { replace: true });
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
            <span className="text-lg font-display font-bold text-white">AimVantage</span>
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

          {showStripeTestBanner && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-sm flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1.5">
                <div className="font-bold text-amber-300">Stripe TEST mode — operator notice</div>
                <div className="text-amber-100/85 leading-relaxed">
                  This deploy is using Stripe test keys, so checkouts cost
                  nothing and real customer cards will be rejected. Switch
                  STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET +
                  STRIPE_PRICE_* in Vercel to your live values and set
                  VITE_STRIPE_MODE=live to dismiss this. Only visible to
                  emails listed in VITE_ADMIN_EMAILS (and in local dev).
                </div>
              </div>
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
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors placeholder-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    title={showPassword ? 'Hide password' : 'Show password'}
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

            {/* GDPR Gap #1: self-serve account deletion */}
            <div className="mt-6 pt-6 border-t border-red-500/20">
              <h3 className="text-sm font-bold text-red-300 mb-2">Delete your account permanently</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-3">
                Removes your profile, all saved analyses, your CV profile, token balance, and AI Job Search history.
                Your past payment records on Stripe are preserved for tax/financial-records retention — request separate
                Stripe-side erasure by emailing giovanni.sizino.ennes@hotmail.co.uk if you also need that.
                <strong className="text-red-300"> This action cannot be reversed.</strong>
              </p>

              {!deleteOpen ? (
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-semibold hover:bg-red-500/20 transition-colors min-h-[44px]"
                >
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  Delete account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-200 text-xs font-medium">
                    Type <strong className="font-mono text-red-100">DELETE</strong> below to confirm.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-red-500/30 text-white placeholder-white/30 outline-none focus:border-red-500/60 text-sm font-mono"
                    disabled={deleteSubmitting}
                  />
                  {deleteError && (
                    <div className="text-red-300 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      {deleteError}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteSubmitting || deleteConfirmText !== 'DELETE'}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      {deleteSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          Deleting…
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                          Permanently delete my account
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteError(null); }}
                      disabled={deleteSubmitting}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors min-h-[44px] disabled:opacity-40"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
