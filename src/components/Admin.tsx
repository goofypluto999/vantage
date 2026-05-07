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

// Defence-in-depth: user-supplied URLs (job_url) must be http(s) only.
// Blocks javascript: / data: / vbscript: URLs that would XSS the admin on click.
function safeHref(u: string | null | undefined): string | undefined {
  if (!u) return undefined;
  try {
    const parsed = new URL(u);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? u : undefined;
  } catch {
    return undefined;
  }
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

type Tab = 'overview' | 'users' | 'analyses' | 'waitlist' | 'reply-drafter' | 'post-templates';

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
          {(['overview', 'users', 'analyses', 'waitlist', 'reply-drafter', 'post-templates'] as Tab[]).map((t) => (
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
                          {safeHref(a.job_url) && (
                            <a href={safeHref(a.job_url)} target="_blank" rel="noopener noreferrer" className="ml-2">
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
                        {safeHref(a.job_url) && (
                          <a href={safeHref(a.job_url)} target="_blank" rel="noopener noreferrer" className="text-violet-400/60 text-xs hover:text-violet-400 truncate block max-w-[300px]">
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

          {tab === 'reply-drafter' && <ReplyDrafter />}
          {tab === 'post-templates' && <PostTemplates />}
        </motion.div>
      </main>
    </div>
  );
}

// =============================================================================
// POST TEMPLATES — canned original posts Gio can fire off without finding a
// thread to reply to. Complements the ReplyDrafter (reactive) with proactive
// distribution.
//
// These are meta-templates with placeholders Gio fills in (e.g. {role},
// {company}, {fitscore}). Each is platform-tailored (X / LinkedIn / Reddit
// length + tone) and points to a specific live surface.
// =============================================================================
const POST_TEMPLATES: { id: string; platform: 'X' | 'LinkedIn' | 'Reddit'; angle: string; body: string; targetUrl: string }[] = [
  {
    id: 'sample-anthropic',
    platform: 'X',
    angle: 'Show, don\'t tell — full sample output',
    body: `Anthropic Senior PM. Real listing.\n\n90-second AI prep pack: company intel, fit score, tailored cover letter (4 tones), 12 mock interview questions.\n\nWhole thing is public, no signup:\nhttps://aimvantage.uk/sample/anthropic-senior-pm`,
    targetUrl: 'https://aimvantage.uk/sample/anthropic-senior-pm',
  },
  {
    id: 'sample-stripe',
    platform: 'X',
    angle: 'Show, don\'t tell — Stripe',
    body: `Stripe Staff PM. Real listing.\n\nFull AI prep pack — fit score, role-specific interview questions, tailored cover letter, pitch outline. 90 seconds.\n\nRead the entire output, no signup:\nhttps://aimvantage.uk/sample/stripe-staff-pm`,
    targetUrl: 'https://aimvantage.uk/sample/stripe-staff-pm',
  },
  {
    id: 'sample-openai',
    platform: 'X',
    angle: 'Show, don\'t tell — OpenAI',
    body: `OpenAI ML Engineer. Real role.\n\nVantage's full output: company brief, CV fit, tailored cover letter, mock interview questions. 90 seconds end-to-end.\n\nWhole thing is public:\nhttps://aimvantage.uk/sample/openai-ml-eng`,
    targetUrl: 'https://aimvantage.uk/sample/openai-ml-eng',
  },
  {
    id: 'roast-tool',
    platform: 'X',
    angle: 'Free tool hook',
    body: `built a free AI cover letter roast.\n\npaste your letter, get a brutal honest verdict + 3 specific cliché callouts + the better swap. no signup, no email, no upsell mid-roast.\n\n(yes there is a paid tool too, that's why this one is free)\n\nhttps://aimvantage.uk/roast`,
    targetUrl: 'https://aimvantage.uk/roast',
  },
  {
    id: 'cv-mirror-hook',
    platform: 'X',
    angle: 'Free open-source tool hook',
    body: `if your job applications keep getting auto-rejected:\n\nbuilt a fully client-side ATS scanner. shows you exactly how Workday / Greenhouse / Lever / Taleo / iCIMS parse your CV, side by side. no upload, no signup, runs in your browser.\n\nopen source: https://cv-mirror-web.vercel.app/`,
    targetUrl: 'https://cv-mirror-web.vercel.app/',
  },
  {
    id: 'building-in-public',
    platform: 'X',
    angle: 'Build in public — operator transparency',
    body: `Vantage AI: solo dev. UK indie founder. {update — what shipped this week, pick one}.\n\n3 free analyses on signup, no card. £5 one-time top-up that never expires. zero recurring billing required.\n\nhttps://aimvantage.uk`,
    targetUrl: 'https://aimvantage.uk',
  },
  {
    id: 'laid-off-cohort',
    platform: 'LinkedIn',
    angle: 'Layoff cohort empathy',
    body: `If you got laid off this year and you're staring at a half-written cover letter at 11pm, this is the post for you.\n\nBuilt a free 90-second AI prep tool: upload your CV, paste a job link, get back the company intel + tailored cover letter (4 tones) + 12 likely interview questions + a 5-minute pitch outline.\n\n3 free runs on signup. No card. EU-hosted. Solo built by a UK indie dev — not VC-backed, no DM outreach, no recruiter spam.\n\nApril 2026 layoff wave specifically: cohort guides for Oracle / Meta / ASML / Snap / Nike alumni at /laid-off.\n\nhttps://aimvantage.uk/laid-off`,
    targetUrl: 'https://aimvantage.uk/laid-off',
  },
  {
    id: 'reddit-honest-rec',
    platform: 'Reddit',
    angle: 'Reddit transparent self-rec',
    body: `(disclaimer: I built it, posting transparently)\n\nSpent the last 60 days building Vantage AI — upload CV + paste a job link, get a full prep pack in ~90s: company intel, tailored cover letter in 4 tones, 12 likely interview questions, fit score, 5-minute pitch.\n\n3 free on signup, no card. £5 one-time top-up that never expires. monthly tiers if you're applying at scale.\n\nhonest tradeoffs:\n- LLM is gemini 2.5 flash. fast and cheap, occasionally generic. you can regenerate.\n- not perfect for super-niche industries (academic, regulated finance compliance).\n- I'm one person, support replies within a day not a minute.\n\nhttps://aimvantage.uk\n\nhappy to roast my own product if anyone asks specific questions.`,
    targetUrl: 'https://aimvantage.uk',
  },
];

function PostTemplates() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'X' | 'LinkedIn' | 'Reddit'>('all');

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const filtered = filter === 'all'
    ? POST_TEMPLATES
    : POST_TEMPLATES.filter(p => p.platform === filter);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-bold">Post templates</h3>
        </div>
        <p className="text-white/50 text-sm mb-4">
          Canned ORIGINAL posts (not replies). Pick one, copy, post when you have 30 seconds.
          Each links to a specific live Vantage surface that's good for converting that audience.
        </p>

        <div className="flex gap-2 mb-2 flex-wrap">
          {(['all', 'X', 'LinkedIn', 'Reddit'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                filter === p
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const charCount = p.body.length;
          const tooLongForX = p.platform === 'X' && charCount > 280;
          const xIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(p.body)}`;
          return (
            <div key={p.id} className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                    p.platform === 'X'        ? 'bg-black/30 text-white'
                    : p.platform === 'LinkedIn' ? 'bg-[#0A66C2]/30 text-blue-300'
                    : 'bg-orange-500/20 text-orange-300'
                  }`}>{p.platform}</span>
                  <span className="text-xs text-white/50">{p.angle}</span>
                </div>
                <span className={`text-xs ${tooLongForX ? 'text-red-400' : 'text-white/30'}`}>
                  {charCount} chars{tooLongForX ? ' — over X limit!' : ''}
                </span>
              </div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-3">
                {p.body}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(p.body, p.id)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white/70 hover:bg-white/5 transition-colors"
                >
                  {copiedId === p.id ? 'Copied' : 'Copy text'}
                </button>
                {p.platform === 'X' && !tooLongForX && (
                  <a
                    href={xIntent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Open in X
                  </a>
                )}
                <a
                  href={p.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white/70 hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Preview link
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// REPLY DRAFTER — Gio-only outreach assistant.
//
// Gio pastes a public tweet / LinkedIn post / Reddit thread that's asking
// about job-prep / cover letter / interview tools. The endpoint generates
// 3 humanized reply variants Gio can pick from + post manually. We never
// auto-post on his behalf (that violates platform ToS + the user-privacy
// rules in the system prompt).
//
// Backend: api/admin/draft-reply.ts (admin-gated, calls Gemini 2.5 Flash).
// =============================================================================
interface DraftReply {
  tone: 'direct' | 'warm' | 'self-deprecating';
  body: string;
}

function ReplyDrafter() {
  const [tweetText, setTweetText] = useState('');
  const [platform, setPlatform] = useState<'X' | 'LinkedIn' | 'Reddit'>('X');
  const [extraContext, setExtraContext] = useState('');
  const [replies, setReplies] = useState<DraftReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!tweetText.trim()) {
      setError('Paste the post you want to reply to.');
      return;
    }
    setError('');
    setLoading(true);
    setReplies([]);
    try {
      const { data: { session } } = await (await import('../lib/supabase')).supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/admin/draft-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tweetText: tweetText.trim(),
          platform,
          extraContext: extraContext.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to generate replies');
      } else {
        setReplies(data.replies || []);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async (body: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch { /* clipboard unavailable */ }
  };

  // Curated lists of search URLs across X / LinkedIn / Reddit that surface
  // posts asking for tools Vantage solves. Each opens the platform with a
  // pre-filled query — Gio scrolls, finds a real ask, copies it into the
  // drafter below. Refreshed: 2026-05-07.
  const X_SEARCH_QUERIES: { label: string; query: string }[] = [
    { label: 'AI cover letter rec',         query: '"AI cover letter" (recommend OR recommendation OR "any tool" OR "what should I use") -is:retweet min_replies:1' },
    { label: 'Interview prep tool',         query: '("interview prep" OR "mock interview") (tool OR app OR AI) (recommend OR "looking for") -is:retweet' },
    { label: 'Cover letter help',           query: '"cover letter" (struggling OR "writers block" OR "hate writing" OR "any tips") -is:retweet min_replies:1' },
    { label: 'Just laid off',               query: '("just got laid off" OR "just laid off" OR "lost my job") (resume OR cv OR interview) -is:retweet' },
    { label: 'ATS rejected',                query: '("ATS rejected" OR "got rejected" OR "automated rejection") (resume OR cv OR application) -is:retweet' },
    { label: 'Job application volume',      query: '("100 applications" OR "200 applications" OR "no callbacks" OR "no responses") (job OR jobs) -is:retweet' },
    { label: 'Anthropic / OpenAI prep',     query: '("Anthropic interview" OR "OpenAI interview" OR "Stripe interview") (prep OR preparing OR tips) -is:retweet' },
    { label: 'Career transition',           query: '("career change" OR "career pivot" OR "switching jobs") (resume OR cv OR "cover letter") -is:retweet min_replies:1' },
    // UK-specific — Vantage is UK-hosted, GBP-priced, EU-friendly. UK
    // job-seekers respond better to a UK indie tool than they do to a
    // US one with .com pricing.
    { label: '🇬🇧 UK job-search 2026',       query: '("UK job search" OR "UK job market" OR "UK job hunt") 2026 (advice OR tools OR tips) -is:retweet' },
    { label: '🇬🇧 UK CV / cover letter',     query: 'UK ("CV" OR "cover letter") (help OR advice OR "any tool") -is:retweet' },
    { label: '🇬🇧 UK ATS / Workday',          query: 'UK (ATS OR "Workday" OR "iCIMS" OR "Greenhouse") (rejected OR "no callbacks" OR struggling) -is:retweet' },
  ];

  // Reddit subreddits where job-prep tool questions are common. Each opens
  // a subreddit search with the relevant query.
  const REDDIT_SEARCH_QUERIES: { label: string; subreddit: string; query: string }[] = [
    { label: 'r/jobs — AI tool',          subreddit: 'jobs', query: 'AI cover letter tool' },
    { label: 'r/cscareerquestions — prep', subreddit: 'cscareerquestions', query: 'interview prep tool recommendation' },
    { label: 'r/recruitinghell — ATS',    subreddit: 'recruitinghell', query: 'ATS rejected resume' },
    { label: 'r/Layoffs — fresh',         subreddit: 'Layoffs', query: 'cover letter resume help' },
    { label: 'r/resumes — review',        subreddit: 'resumes', query: 'AI tool review' },
    { label: 'r/jobsearch — overwhelm',   subreddit: 'jobsearch', query: '100 applications no responses' },
    // UK-specific subreddits — better fit for a UK indie tool
    { label: '🇬🇧 r/UKJobs',                subreddit: 'UKJobs', query: 'cover letter help' },
    { label: '🇬🇧 r/UKPersonalFinance',     subreddit: 'UKPersonalFinance', query: 'job search career change' },
    { label: '🇬🇧 r/cscareerquestionsEU',  subreddit: 'cscareerquestionsEU', query: 'interview prep tool' },
  ];

  // LinkedIn doesn't have a deep-search URL the same way X does, but
  // /search/results/content/?keywords=… filters by post body. Power users
  // post their job-prep struggles publicly all the time.
  const LINKEDIN_SEARCH_QUERIES: { label: string; query: string }[] = [
    { label: 'AI cover letter',            query: 'AI cover letter recommendation' },
    { label: 'Interview prep struggling',  query: 'interview prep struggling' },
    { label: 'Just laid off + tools',      query: 'just laid off tools resume' },
    { label: 'Tailored cover letter',      query: 'tailored cover letter AI tool' },
  ];

  return (
    <div className="space-y-6">
      {/* Where to find posts — X / Reddit / LinkedIn search banks */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-bold">Where to find posts</h3>
        </div>
        <p className="text-white/50 text-sm mb-4">
          Curated search queries across X / Reddit / LinkedIn for posts Vantage
          can plausibly help with. Open one, scroll, copy a real ask, paste it
          into the drafter below.
        </p>

        <div className="text-[11px] uppercase tracking-widest font-bold text-white/40 mb-2">X (Twitter)</div>
        <div className="grid sm:grid-cols-2 gap-2 mb-5">
          {X_SEARCH_QUERIES.map((q) => (
            <a
              key={q.label}
              href={`https://twitter.com/search?q=${encodeURIComponent(q.query)}&f=live`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold">{q.label}</div>
                <div className="text-white/40 text-xs font-mono truncate">{q.query.slice(0, 60)}…</div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-[11px] uppercase tracking-widest font-bold text-white/40 mb-2">Reddit</div>
        <div className="grid sm:grid-cols-2 gap-2 mb-5">
          {REDDIT_SEARCH_QUERIES.map((q) => (
            <a
              key={q.label}
              href={`https://www.reddit.com/r/${q.subreddit}/search/?q=${encodeURIComponent(q.query)}&restrict_sr=1&sort=new`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold">{q.label}</div>
                <div className="text-white/40 text-xs font-mono truncate">{q.query}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-[11px] uppercase tracking-widest font-bold text-white/40 mb-2">LinkedIn</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {LINKEDIN_SEARCH_QUERIES.map((q) => (
            <a
              key={q.label}
              href={`https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(q.query)}&sortBy=%22date_posted%22`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#0A66C2] flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold">{q.label}</div>
                <div className="text-white/40 text-xs font-mono truncate">{q.query}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-bold">Reply drafter</h3>
        </div>
        <p className="text-white/50 text-sm mb-5">
          Paste a public post asking about job-prep / cover letter / interview tools.
          The endpoint generates 3 humanised reply variants — you pick + post manually.
          Nothing auto-posts.
        </p>

        <div className="flex gap-2 mb-4">
          {(['X', 'LinkedIn', 'Reddit'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                platform === p
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
          Original post (verbatim)
        </label>
        <textarea
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="anyone got a recommendation for an AI tool that writes cover letters but actually personalises them per company..."
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors mb-4"
        />

        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
          Extra context (optional — what angle to land)
        </label>
        <input
          type="text"
          value={extraContext}
          onChange={(e) => setExtraContext(e.target.value)}
          maxLength={1000}
          placeholder="e.g. they sound junior — emphasise the free tier"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-colors mb-4"
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !tweetText.trim()}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
        >
          {loading ? 'Drafting…' : 'Draft 3 reply options'}
        </button>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div className="space-y-3">
          {replies.map((r, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-widest font-bold text-violet-400">
                  Variant {idx + 1} — {r.tone}
                </span>
                <span className="text-xs text-white/30">{r.body.length} chars</span>
              </div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-3">
                {r.body}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyReply(r.body, idx)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white/70 hover:bg-white/5 transition-colors"
                >
                  {copiedIdx === idx ? 'Copied' : 'Copy'}
                </button>
                {platform === 'X' && (
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(r.body)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Open in X
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
