import React from 'react';
import { Check, Zap, Star, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { track } from '../lib/track';

interface PricingProps {
  onLogin?: () => void;
  onRegister?: () => void;
  onCheckout?: (plan: string) => void;
  isAuthenticated?: boolean;
}

// 2026-05-08: pricing migrated to 1 token = 1 full prep pack.
// Tone rewrites + interview question regen cost 1 token each.
//   20 tokens = 20 full prep packs (Starter, never expires)
//   60 tokens = 60 prep packs / month (Pro)
//   120 tokens = 120 prep packs / month (Premium)
const PLANS = [
  {
    name: 'Starter',
    gbp: 5,
    usd: 5,
    tokens: 20,
    packs: 20,
    color: '#6B6B8D',
    icon: Zap,
    isTopup: true,
    features: [
      '20 full prep packs (per upload + job link)',
      'Tokens never expire — pay once, use any time',
      'Company intelligence + strategic brief',
      'Tailored cover letter (4 tone variants)',
      'Mock interview questions with live AI grading',
      'Free ATS preview included on every analysis',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    gbp: 12,
    usd: 15,
    tokens: 60,
    packs: 60,
    color: '#4F46E5',
    icon: Star,
    isTopup: false,
    features: [
      '60 prep packs every month',
      'Everything in Starter',
      'AI Mock Interview (voice mode)',
      'STAR interview stories',
      'Timed practice sessions',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    gbp: 20,
    usd: 25,
    tokens: 120,
    packs: 120,
    color: '#7C3AED',
    icon: Crown,
    isTopup: false,
    features: [
      '120 prep packs every month',
      'Everything in Pro',
      'CV Fit Score Analysis',
      'Presentation Deck Builder',
      'Priority processing',
      'Beta features early access',
    ],
    popular: false,
  },
];

export default function Pricing({ onLogin, onRegister, onCheckout, isAuthenticated }: PricingProps) {
  const { currency, setCurrency, symbol } = useCurrency();
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 50%, #2d2654 100%)' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Vantage</span>
          </a>
          <div className="flex items-center gap-4">
            {/* Currency toggle */}
            <div className="flex items-center rounded-full bg-white/5 border border-white/10 p-0.5" role="group" aria-label="Currency">
              <button
                onClick={() => setCurrency('gbp')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${currency === 'gbp' ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white'}`}
                aria-pressed={currency === 'gbp'}
              >{'\u00A3 GBP'}</button>
              <button
                onClick={() => setCurrency('usd')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${currency === 'usd' ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white'}`}
                aria-pressed={currency === 'usd'}
              >$ USD</button>
            </div>
            {isAuthenticated ? (
              <a href="/dashboard" className="text-white/70 hover:text-white font-semibold">
                Dashboard
              </a>
            ) : (
              <button onClick={onLogin} className="text-white/70 hover:text-white font-semibold">
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Pay once for £5. Or skip even that and try free.
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Every account starts with 10 free prep packs on signup — no card. After that, top up at £5
            for 20 more (never expires) or subscribe for 60 / 120 prep packs every month. Cancel any
            time. No hidden fees.
          </p>
          {/* Pricing-page diagnostic onramp: visitors who land on /pricing
              are commitment-curious but not all of them will benefit from
              Vantage. The diagnostic confirms whether their bottleneck is
              one Vantage actually solves (positioning / proof / mock-prep)
              vs one it can't (ATS / market / overqualified-flag). Saves
              both us and them from a refund. */}
          <p className="text-sm text-white/50 mt-4">
            Not sure Vantage is the right fix for your specific bottleneck?{' '}
            <Link
              to="/tools/no-interviews-diagnostic?source=pricing"
              onClick={() => track('pricing_diagnostic_click', {})}
              className="text-emerald-400 hover:text-emerald-300 underline font-semibold"
            >
              Run the free 60-second diagnostic
            </Link>{' '}
            first — 5 questions, no signup, tells you which of 7 failure modes is yours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              // Static card — previously used motion.div with initial:opacity-0 +
              // animate:opacity-1 entrance. The animation got stuck at opacity
              // ~0.18 in production (verified via Clarity / live DOM check on
              // 2026-05-07), hiding the Pro and Premium cards entirely. Since
              // pricing is the single most important conversion surface, we
              // can't ship an entrance animation that risks invisible cards.
              // Simple div, always visible, no entrance — cards paint with
              // the page.
              <div
                key={plan.name}
                className={`relative p-8 rounded-3xl border ${
                  plan.popular
                    ? 'bg-violet-500/10 border-violet-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-500 text-white text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: plan.color + '20' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-white/50 text-sm">
                      {plan.packs} prep pack{plan.packs === 1 ? '' : 's'}
                      <span className="text-white/30"> · {plan.tokens} tokens</span>
                    </p>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">{symbol}{currency === 'usd' ? plan.usd : plan.gbp}</span>
                  <span className="text-white/50">{plan.isTopup ? ' one-time' : '/month'}</span>
                </div>
                <p className="text-xs text-white/40 mb-6">
                  ~{symbol}{(((currency === 'usd' ? plan.usd : plan.gbp) / plan.packs)).toFixed(2)} per prep pack
                  {plan.isTopup ? ' — never expires.' : ' (vs Jobscan $49.95/mo).'}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => isAuthenticated && onCheckout ? onCheckout(plan.name.toLowerCase()) : onRegister?.()}
                  className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isAuthenticated
                    ? (plan.isTopup ? `Buy ${plan.packs} prep packs` : `Subscribe to ${plan.name}`)
                    : 'Start free first'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            All plans include access to our demo walkthrough and starter features.
            <br />
            No hidden fees. Cancel anytime.
          </p>
        </div>
      </main>
    </div>
  );
}