import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, FileText, AlertTriangle, Mail, MessageSquareOff,
  Building2, CreditCard, Eye, Server, Bug, BookOpen, ArrowRight,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /receipts — GOLDEN GOSPEL Tactic 8 (2026-05-08).
 *
 * Cold visitors who land on Vantage think one of two things:
 *   1. "Is this another scammy tool that'll auto-bill me?"
 *   2. "Is this another tool that secretly sells my CV data to recruiters?"
 *
 * Existing trust signals are scattered: privacy policy buried in footer,
 * sole-trader disclosure on /about, Stripe-only billing on /pricing, etc.
 * /receipts pulls every one of them onto a single page so a paranoid
 * visitor (the right user for £5) can audit Vantage in 30 seconds before
 * uploading anything.
 *
 * Single source of truth for what we DO and DON'T do. If a claim isn't
 * here, we don't make it elsewhere either.
 */
export default function ReceiptsPage() {
  const { t } = useTheme();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Receipts', item: `${SITE_URL}/receipts` },
    ],
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AimVantage',
    alternateName: ['Vantage', 'Vantage AI', 'Aim Vantage'],
    url: SITE_URL,
    description: 'AI job preparation tool operated by Giovanni Sizino Ennes (sole trader, UK).',
    founder: { '@type': 'Person', name: 'Giovanni Sizino Ennes' },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@aimvantage.uk',
      contactType: 'customer support',
      areaServed: 'Worldwide',
      availableLanguage: ['English'],
    },
  };

  const RECEIPTS = [
    {
      icon: CreditCard,
      title: 'Stripe-only billing. No exceptions.',
      body:
        'Every payment goes through Stripe Checkout. No bank transfers, no PayPal, no crypto, no invoicing. If anyone DMs you claiming to bill on behalf of AimVantage, it is a scam — please forward the message to hello@aimvantage.uk.',
      link: { to: '/pricing', label: 'See pricing' },
    },
    {
      icon: AlertTriangle,
      title: 'No auto-renew traps. Top-ups are one-time.',
      body:
        'The £5 Starter pack is a one-time charge for 20 prep packs. It does not renew. The Pro and Premium tiers ARE subscriptions, but you cancel from the Stripe billing portal in your account settings — no email-support gauntlet, no retention scripts.',
      link: { to: '/account', label: 'Cancel from your account →' },
    },
    {
      icon: Lock,
      title: 'Your CV bytes never touch our servers until you click Run.',
      body:
        'CV parsing for the dashboard preview happens entirely in your browser using mammoth (DOCX) or native PDF rendering. Only when you click "Run analysis" does the file get sent to the analysis endpoint, and only for the duration of that single request.',
      link: { to: '/privacy', label: 'Read the privacy policy' },
    },
    {
      icon: FileText,
      title: 'We don\'t sell, share, or train on your data.',
      body:
        'Your CV and analyses are not used to train any model. They are not shared with recruiters or third parties. We do not run ad networks. We do not have a data partner. The only place your data goes is Supabase (encrypted at rest) and Gemini for the duration of the analysis call.',
      link: { to: '/privacy#data-use', label: 'See the data-use clause' },
    },
    {
      icon: MessageSquareOff,
      title: 'No WhatsApp. No Telegram. No DM outreach.',
      body:
        'AimVantage will never WhatsApp you, Telegram you, DM you on LinkedIn, or text your phone. The only outbound email is the signup confirmation and (rarely) a transactional receipt. If anyone contacts you on those channels claiming to be from AimVantage, it is impersonation — please report it.',
    },
    {
      icon: Building2,
      title: 'Operated by a sole trader, not a registered company.',
      body:
        'AimVantage (formerly Vantage AI) is a trading name, operated by Giovanni Sizino Ennes (UK independent founder). We are explicitly NOT a registered limited company. This is on the about page, the press kit, the FAQ, and our signup flow because we think it matters for trust. You are buying from a person, not a corporation.',
      link: { to: '/about', label: 'Operator transparency page' },
    },
    {
      icon: Bug,
      title: 'Public bug history, public changelog, public confessions.',
      body:
        'When something breaks (and things break — the homepage hero animation got stuck at opacity 0.25 for three days last week), it goes in the changelog with a date and the actual cause. We do not retroactively edit history.',
      link: { to: '/changelog', label: 'See the changelog' },
    },
    {
      icon: ShieldCheck,
      title: 'Recruitment is not a revenue line.',
      body:
        'AimVantage will never charge you a recruitment fee, take a percentage of your offer, sell your CV to recruiters, or move you into a "premium recruiter network" tier. Our only revenue is the prep-pack tokens you buy directly. If you don\'t want to pay, the 10 free tokens on signup are real free.',
    },
    {
      icon: Eye,
      title: 'Public token math. £0.25 per prep pack at the £5 top-up.',
      body:
        '20 tokens for £5 = £0.25 per pack. Each pack uses one Gemini 2.5 Flash call (~£0.02 in API cost). The remaining ~£0.23 covers Vercel, Supabase, Stripe fees, sole-trader tax, and the time spent answering hello@aimvantage.uk emails. This is the entire business model.',
      link: { to: '/tools/jobscan-cost-calculator', label: 'Cost calculator' },
    },
    {
      icon: Server,
      title: 'EU-hosted. UK-operated. No US data flow we don\'t disclose.',
      body:
        'Vercel + Supabase, both with EU data residency on our config. Gemini runs in Google Cloud (US for some models — we are evaluating EU regional endpoints). DPIA-style breakdown is in the privacy policy.',
      link: { to: '/privacy#hosting', label: 'Hosting + region disclosure' },
    },
    {
      icon: Mail,
      title: 'One email. One human. Replies within 24h.',
      body:
        'hello@aimvantage.uk is read by Gio personally. There is no support team and there is no help-desk ticketing system. If your email goes to spam (Gmail and Outlook are aggressive with new domains) Gio will manually confirm your account once he sees the bounce.',
      link: { to: 'mailto:hello@aimvantage.uk', label: 'hello@aimvantage.uk', external: true },
    },
    {
      icon: BookOpen,
      title: 'Built in public. Vendor sources documented.',
      body:
        'Every external claim on AimVantage (ATS vendor behaviours, layoff numbers, competitor pricing) links to a primary source. The Vendor Sources page is the index of those citations. If you find a claim that isn\'t cited, email Gio and it gets fixed or removed.',
      link: { to: '/vendor-sources', label: 'Vendor sources index' },
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO
        title="Receipts — every trust claim AimVantage makes, with the evidence"
        description="Single-page audit of AimVantage (formerly Vantage AI): Stripe-only billing, no auto-renew traps, no DM outreach, sole-trader operator transparency, public bug history, public token math, EU hosting. If a claim isn't here, we don't make it elsewhere."
        path="/receipts"
        jsonLd={[breadcrumbSchema, orgSchema]}
      />

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className={`mb-3 text-xs uppercase tracking-wider ${t.textMuted}`}>
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Receipts</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <div className={`text-xs uppercase tracking-wider ${t.textMuted}`}>Trust audit · single source of truth</div>
            <h1 className={`text-3xl md:text-5xl font-bold ${t.text}`}>Receipts.</h1>
          </div>
        </div>

        <p className={`text-base md:text-lg mb-8 ${t.textSub}`}>
          Every trust claim we make, on one page, with the evidence. If you're paranoid about job-prep
          tools — and you should be — read this before uploading anything. If a claim isn't on this page,
          we don't make it elsewhere either.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {RECEIPTS.map((receipt) => {
            const Icon = receipt.icon;
            return (
              <div key={receipt.title} className={`${t.glass} rounded-2xl p-5`}>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className={`text-base font-bold ${t.text} mb-1.5 leading-snug`}>
                      {receipt.title}
                    </h2>
                    <p className={`text-sm leading-relaxed ${t.textSub}`}>
                      {receipt.body}
                    </p>
                    {receipt.link && (
                      receipt.link.external ? (
                        <a
                          href={receipt.link.to}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-2"
                        >
                          {receipt.link.label}
                        </a>
                      ) : (
                        <Link
                          to={receipt.link.to}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-2"
                        >
                          {receipt.link.label} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing — what we don't do */}
        <div className="rounded-2xl p-6 md:p-8 mb-8 bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/30">
          <div className={`text-xs uppercase tracking-wider mb-3 text-rose-300/80`}>What AimVantage explicitly is NOT</div>
          <ul className={`space-y-2 text-sm ${t.text}`}>
            <li>• Not a recruitment agency. We don't place candidates.</li>
            <li>• Not a CV-writing service. We give you the tools; you keep the writing.</li>
            <li>• Not a "guaranteed interview" promise. Anyone making that promise is lying.</li>
            <li>• Not an enterprise sales pipeline. There's no upsell call. There's no enterprise tier.</li>
            <li>• Not a wrapper around free LLMs you could run yourself. The pipeline does company research, fit scoring, tone-switched cover letters, ATS preview against 5 parsers, and mock-interview question generation in one ~90-second pass.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-6 md:p-8 mb-8 bg-gradient-to-br from-violet-600/15 to-purple-600/15 border border-violet-500/30">
          <h2 className={`text-xl md:text-2xl font-bold ${t.text} mb-2`}>Audited. Now try it.</h2>
          <p className={`text-sm mb-4 ${t.textSub}`}>
            10 free prep packs on signup, no card. If anything on this page turns out not to match
            reality, email Gio and he'll fix it or refund you.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold hover:opacity-95 transition-opacity"
          >
            Start with 10 free prep packs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className={`text-xs ${t.textMuted} text-center mt-12 leading-relaxed`}>
          Page last reviewed 2026-05-08 by Giovanni Sizino Ennes. Anything wrong?{' '}
          <a href="mailto:hello@aimvantage.uk" className="underline">hello@aimvantage.uk</a>
        </div>
      </div>
    </div>
  );
}
