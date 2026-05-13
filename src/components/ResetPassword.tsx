import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// motion entrance animation removed 2026-05-07 (same pattern that broke
// Pricing). Auth surfaces must always paint.
import { Lock, Eye, EyeOff, ArrowLeft, BrainCircuit, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Length policy matched to Supabase Auth default (8). Bcrypt upper
    // bound (72) prevents the silent-prefix-match footgun.
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password.length > 72) {
      setError('Password must be 72 characters or fewer (bcrypt limit). Use a passphrase that fits.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      // Map common reset-link failures into a recognizable error string the
      // template below can branch on. Supabase's wording isn't stable across
      // versions, so we match by substring on a small allowlist.
      const raw = (err?.message || '').toLowerCase();
      if (
        raw.includes('expired') ||
        raw.includes('invalid') ||
        raw.includes('not found') ||
        raw.includes('no user') ||
        raw.includes('jwt') ||
        raw.includes('token')
      ) {
        setError('LINK_EXPIRED');
      } else {
        setError(err.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 50%, #2d2654 100%)' }}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
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

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Password updated!</h1>
              <p className="text-white/50">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Set new password</h1>
              <p className="text-white/50 mb-8">Enter your new password below</p>

              {error === 'LINK_EXPIRED' && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-amber-300 text-sm font-semibold mb-2">
                    This reset link has expired or is invalid.
                  </p>
                  <p className="text-amber-100/80 text-xs leading-relaxed mb-3">
                    Reset links expire after about an hour for security. Request a fresh one and try again — the new link will arrive in your inbox within 60 seconds.
                  </p>
                  <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-200 hover:text-amber-100 underline"
                  >
                    Send a new reset link →
                  </Link>
                </div>
              )}
              {error && error !== 'LINK_EXPIRED' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reset-new-password" className="block text-sm font-semibold text-white/70 mb-2">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden="true" />
                    <input
                      id="reset-new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
                      placeholder="Min. 6 characters"
                      required
                      autoComplete="new-password"
                      autoFocus
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

                <div>
                  <label htmlFor="reset-confirm-password" className="block text-sm font-semibold text-white/70 mb-2">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" aria-hidden="true" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
                      placeholder="Repeat password"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/55 hover:text-white/50"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                    </button>
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
                    'Update Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Almost there
          </h2>
          <p className="text-white/70 text-lg">
            Choose a strong password and you'll be back in action.
          </p>
        </div>
      </div>
    </div>
  );
}
