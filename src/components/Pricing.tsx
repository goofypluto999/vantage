import React, { useState } from 'react';
import { Check, Zap, Star, Crown, ArrowRight, Lock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { track } from '../lib/track';

const PRICING_FAQ = [
  {
    q: 'What if Vantage doesn\'t work for me?',
    a: 'You start with 10 free prep packs — no card. If those don\'t convince you Vantage is worth £5, you don\'t pay. For paid plans, you can cancel from the Stripe billing portal in one click — no retention emails, no friction. Tokens you already paid for never expire.',
  },
  {
    q: 'Why subscription vs. one-time top-up?',
    a: 'Top-up (£5 for 20 packs) is for occasional users — applying to a handful of roles, never expires. Subscription (Pro/Premium) is for active job hunters running 60-120 prep packs a month, which works out cheaper per pack. Pick the one that matches your apply rate.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Card (Visa, Mastercard, Amex), Apple Pay, Google Pay, Link, and bank transfer where Stripe supports it. All processed by Stripe — Vantage never sees or stores your card details.',
  },
  {
    q: 'Can I switch between plans?',
    a: 'Yes. Upgrade or downgrade any time from your account billing portal. Stripe handles proration automatically.',
  },
  {
    q: 'Do tokens roll over month to month?',
    a: 'Subscription tokens (Pro/Premium) refresh each billing cycle and don\'t roll over — use them or lose them. Top-up tokens (Starter) never expire — pay £5 once, use them whenever you apply.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'If a generation fails on our end, the token is automatically refunded to your balance — no need to ask. For other refund requests, email us within 14 days of purchase and we\'ll handle it case by case (statutory UK consumer rights apply).',
  },
];

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQPage JSON-LD — emit pricing-specific FAQ structured data so Google
  // can show rich-result FAQ snippets on /pricing search results and AI
  // crawlers can ingest the answers. Mirrors the pattern on / and /roast.
  const pricingFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PRICING_FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 50%, #2d2654 100%)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }} />
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" aria-hidden="true" />
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
              <Link to="/dashboard" className="text-white/70 hover:text-white font-semibold">
                Dashboard
              </Link>
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

          {/* Trust strip — added 2026-05-08. /pricing visitors are deeper in
              the funnel than landing visitors but still bounce at this gate.
              Common buyer hesitations: 'is this safe?', 'can I cancel?',
              'will I be locked in?'. Surface the 4 strongest answers in one
              row before they scroll past the cards. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-white/65">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Stripe-secured checkout
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Cancel any time
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Top-up tokens never expire
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> 14-day refund window
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> No hidden fees
            </span>
          </div>
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
                    <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                    <p className="text-white/50 text-sm">
                      {plan.packs} prep pack{plan.packs === 1 ? '' : 's'}
                      <span className="text-white/55"> · {plan.tokens} tokens</span>
                    </p>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">{symbol}{currency === 'usd' ? plan.usd : plan.gbp}</span>
                  <span className="text-white/50">{plan.isTopup ? ' one-time' : '/month'}</span>
                </div>
                <p className="text-xs text-white/60 mb-6">
                  ~{symbol}{(((currency === 'usd' ? plan.usd : plan.gbp) / plan.packs)).toFixed(2)} per prep pack
                  {plan.isTopup ? ' — never expires.' : ' (vs Jobscan $49.95/mo).'}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
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
                    : 'Start free first'} <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/60 text-sm">
            All plans include access to our demo walkthrough and starter features.
            <br />
            No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing FAQ — added 2026-05-08. Conversion research: /pricing
            visitors who don't convert often have one of 6 specific objections
            (refund? plan switch? rollover? payment methods? subscription vs
            top-up? what if AI fails?). Answer them inline so they don't have
            to navigate away. JSON-LD schema above emits the same content for
            Google rich-result FAQ snippets on /pricing SERPs. */}
        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-10">
            Pricing questions
          </h2>
          <div className="space-y-3">
            {PRICING_FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              const panelId = `pricing-faq-panel-${i}`;
              return (
                <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-violet-500"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="text-white font-semibold text-sm md:text-base pr-4">{item.q}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-5 h-5 text-white/50 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div id={panelId} className="px-5 pb-4 text-white/70 text-sm leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-white/60 mt-8">
            Still have questions? Email{' '}
            <a href="mailto:hello@aimvantage.uk" className="underline hover:text-white/60">hello@aimvantage.uk</a>{' '}
            — we reply within 24 hours.
          </p>
        </section>
      </main>
    </div>
  );
}