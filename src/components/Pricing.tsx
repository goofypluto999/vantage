import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Star, Crown, ArrowRight } from 'lucide-react';

interface PricingProps {
  onLogin?: () => void;
  onRegister?: () => void;
  onCheckout?: (plan: string) => void;
  isAuthenticated?: boolean;
}

const PLANS = [
  {
    name: 'Starter',
    price: 5,
    credits: 10,
    color: '#6B6B8D',
    icon: Zap,
    features: [
      '10 job analyses per month',
      'Company intelligence',
      'Strategic brief',
      'Cover letter generation',
      'Interview pack with flashcards',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: 12,
    credits: 30,
    color: '#4F46E5',
    icon: Star,
    features: [
      '30 job analyses per month',
      'Everything in Starter',
      'AI Mock Interview (voice)',
      'STAR interview stories',
      'Timed practice sessions',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 20,
    credits: 60,
    color: '#7C3AED',
    icon: Crown,
    features: [
      '60 job analyses per month',
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
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-white/50">
            Choose the plan that's right for your job search
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                    <p className="text-white/50 text-sm">{plan.credits} analyses/month</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">£{plan.price}</span>
                  <span className="text-white/50">/month</span>
                </div>

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
                  {isAuthenticated ? 'Subscribe' : 'Get Started'} <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
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