import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Users, CreditCard, TrendingUp, Coins,
  Clock, UserPlus, AlertTriangle, Shield, BarChart3,
  Mail, Zap, Star, Crown, ExternalLink,
} from 'lucide-react';
import { fetchAdminDashboard } from '../services/api';

interface Metrics {
  totalUsers: number;
  activeSubscriptions: number;
  cancellingSubscriptions: number;
  cancelledSubscriptions: number;
  totalWaitlist: number;
  recentSignups: number;
  estimatedMRR: number;
  totalTokensInCirculation: number;
  planDistribution: Record<string, number>;
}

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  token_balance: number;
  subscription_status: string;
  has_stripe: boolean;
  created_at: string;
  updated_at: string;
}

interface Analysis {
  id: string;
  user_id: string;
  company_name: string | null;
  job_title: string | null;
  job_url: string | null;
  tokens_spent: number;
  created_at: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  source: string;
  created_at: string;
}

const PLAN_ICONS: Record<string, typeof Zap> = { starter: Zap, pro: Star, premium: Crown };
const PLAN_COLORS: Record<string, string> = { starter: '#6B6B8D', pro: '#4F46E5', premium: '#7C3AED' };
const STATUS_COLORS: Record<string, string> = {
  active: '#10b981', cancelling: '#f59e0b', cancelled: '#f59e0b',
  past_due: '#ef4444', inactive: '#6b7280',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Users; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        <span className="text-white/50 text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
    </div>
  );
}

type Tab = 'overview' | 'users' | 'analyses' | 'waitlist';

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    fetchAdminDashboard()
      .then((data) => {
        setMetrics(data.metrics);
        setUsers(data.users);
        setAnalyses(data.recentAnalyses);
        setWaitlist(data.waitlist);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}>
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}>
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/50 mb-6">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const m = metrics!;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 100%)' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Admin Dashboard</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(['overview', 'users', 'analyses', 'waitlist'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
                tab === t ? 'text-white border-violet-500' : 'text-white/40 border-transparent hover:text-white/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={tab}>
          {tab === 'overview' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Users} label="Total Users" value={m.totalUsers} color="#8b5cf6" />
                <StatCard icon={CreditCard} label="Active Subs" value={m.activeSubscriptions} sub={`${m.cancellingSubscriptions} cancelling`} color="#10b981" />
                <StatCard icon={TrendingUp} label="Est. MRR" value={`\u00a3${m.estimatedMRR}`} color="#3b82f6" />
                <StatCard icon={UserPlus} label="Last 7 Days" value={m.recentSignups} sub="new signups" color="#f59e0b" />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <StatCard icon={Coins} label="Tokens in Circulation" value={m.totalTokensInCirculation} color="#8b5cf6" />
                <StatCard icon={Mail} label="Waitlist" value={m.totalWaitlist} color="#ec4899" />
              </div>

              {/* Plan Distribution */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
                <h3 className="text-white font-bold mb-4">Plan Distribution</h3>
                <div className="flex gap-6">
                  {Object.entries(m.planDistribution).map(([plan, count]) => {
                    const Icon = PLAN_ICONS[plan] || Zap;
                    const total = Object.values(m.planDistribution).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={plan} className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" style={{ color: PLAN_COLORS[plan] }} />
                          <span className="text-white/70 text-sm capitalize">{plan}</span>
                        </div>
                        <div className="text-xl font-bold text-white">{count}</div>
                        <div className="w-full h-2 rounded-full bg-white/10 mt-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: PLAN_COLORS[plan] }} />
                        </div>
                        <div className="text-xs text-white/40 mt-1">{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Analyses */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-bold mb-4">Recent Analyses</h3>
                {analyses.length === 0 ? (
                  <p className="text-white/40 text-sm">No analyses yet.</p>
                ) : (
                  <div className="space-y-2">
                    {analyses.slice(0, 10).map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div>
                          <span className="text-white text-sm font-medium">{a.company_name || 'Unknown Company'}</span>
                          {a.job_url && (
                            <a href={a.job_url} target="_blank" rel="noopener noreferrer" className="ml-2">
                              <ExternalLink className="w-3 h-3 inline text-white/30 hover:text-white/60" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white/40 text-xs">{a.tokens_spent} tokens</span>
                          <span className="text-white/30 text-xs">{formatDate(a.created_at)} {formatTime(a.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'users' && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-4">Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 text-left border-b border-white/10">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 pr-4">Plan</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Tokens</th>
                      <th className="pb-3 pr-4">Stripe</th>
                      <th className="pb-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const PIcon = PLAN_ICONS[u.plan] || Zap;
                      return (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="text-white font-medium">{u.full_name || 'No name'}</div>
                            <div className="text-white/40 text-xs">{u.email}</div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: PLAN_COLORS[u.plan] + '20', color: PLAN_COLORS[u.plan] }}>
                              <PIcon className="w-3 h-3" />
                              {u.plan}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: (STATUS_COLORS[u.subscription_status] || '#6b7280') + '20', color: STATUS_COLORS[u.subscription_status] || '#6b7280' }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[u.subscription_status] || '#6b7280' }} />
                              {u.subscription_status}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-emerald-400 font-mono">{u.token_balance}</span>
                          </td>
                          <td className="py-3 pr-4">
                            {u.has_stripe ? (
                              <span className="text-emerald-400 text-xs">Connected</span>
                            ) : (
                              <span className="text-white/30 text-xs">None</span>
                            )}
                          </td>
                          <td className="py-3 text-white/40 text-xs">{formatDate(u.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'analyses' && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-4">Recent Analyses ({analyses.length})</h3>
              {analyses.length === 0 ? (
                <p className="text-white/40 text-sm">No analyses yet.</p>
              ) : (
                <div className="space-y-2">
                  {analyses.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium truncate">{a.company_name || 'Unknown Company'}</span>
                          {a.job_title && <span className="text-white/40 text-xs truncate hidden md:inline">- {a.job_title}</span>}
                        </div>
                        {a.job_url && (
                          <a href={a.job_url} target="_blank" rel="noopener noreferrer" className="text-violet-400/60 text-xs hover:text-violet-400 truncate block max-w-[300px]">
                            {a.job_url}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <span className="text-white/40 text-xs font-mono">{a.tokens_spent}t</span>
                        <span className="text-white/30 text-xs">{formatDate(a.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'waitlist' && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-white font-bold mb-4">Waitlist ({waitlist.length})</h3>
              {waitlist.length === 0 ? (
                <p className="text-white/40 text-sm">No waitlist signups yet.</p>
              ) : (
                <div className="space-y-2">
                  {waitlist.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div>
                        <span className="text-white text-sm font-medium">{w.email}</span>
                        {w.name && <span className="text-white/40 text-xs ml-2">({w.name})</span>}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white/30 text-xs capitalize">{w.source}</span>
                        <span className="text-white/30 text-xs">{formatDate(w.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
