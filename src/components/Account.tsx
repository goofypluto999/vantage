import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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
  const hasActiveSub = profile?.subscription_status === 'active' || profile?.subscription_status === 'past_due';

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
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
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
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Vantage</span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-display font-bold text-white mb-1">Account Settings</h1>
          <p className="text-white/50 mb-8">Manage your profile, subscription, and security</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Profile Info */}
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <User className="w-5 h-5 text-violet-400" />
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
                  <User className="w-6 h-6 text-violet-400" />
                </div>
              )}
              <div>
                <p className="text-white font-semibold">{profile?.full_name || 'No name set'}</p>
                <div className="flex items-center gap-1.5 text-white/40 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email || profile?.email}
                </div>
              </div>
            </div>

            {/* Name editing */}
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
              Full Name
            </label>
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-50"
                >
                  {nameSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingName(false); setNameValue(profile?.full_name || ''); }}
                  className="px-3 py-2 rounded-lg bg-white/5 text-white/50 text-sm hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">{profile?.full_name || 'Not set'}</span>
                {nameSuccess && <Check className="w-4 h-4 text-emerald-400" />}
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
              <CreditCard className="w-5 h-5 text-violet-400" />
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
                <p className="text-white font-bold">{planInfo.label} Plan</p>
                <p className={`text-sm capitalize ${
                  profile?.subscription_status === 'active' ? 'text-emerald-400' :
                  profile?.subscription_status === 'cancelled' ? 'text-amber-400' :
                  profile?.subscription_status === 'past_due' ? 'text-red-400' :
                  'text-white/40'
                }`}>
                  {profile?.subscription_status === 'cancelled' ? 'Cancelled — tokens kept' : profile?.subscription_status || 'inactive'}
                </p>
              </div>
            </div>

            {/* Token Balance */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Token Balance</span>
                <span className="text-emerald-400 font-bold">{creditsRemaining}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {hasActiveSub ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  {portalLoading ? 'Opening...' : 'Manage Subscription'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:from-violet-500 hover:to-purple-500 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Subscribe
                </button>
              )}
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <Crown className="w-4 h-4" />
                {hasActiveSub ? 'Upgrade Plan' : 'View Plans'}
              </button>
            </div>
          </section>

          {/* Password */}
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-bold text-white">Password</h2>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors placeholder-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors placeholder-white/20"
                />
              </div>
            </div>

            {passwordError && (
              <div className="mb-3 text-red-400 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-3 text-emerald-400 text-sm flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Password updated successfully
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={passwordSaving || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              {passwordSaving ? 'Updating...' : 'Change Password'}
            </button>
          </section>

          {/* Danger Zone */}
          <section className="p-6 rounded-2xl bg-red-500/5 border border-red-500/15 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-bold text-white">Danger Zone</h2>
            </div>
            <p className="text-white/40 text-sm mb-4">Sign out of your account on this device.</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
