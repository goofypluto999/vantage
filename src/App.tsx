import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase, signOut, fetchProfile, Profile } from './lib/supabase';
import { createStripeCheckout } from './services/api';
// CRITICAL PATH — eagerly bundled. These render on the most-visited routes
// (homepage, auth flow, dashboard) so we want them in the initial chunk to
// avoid a Suspense flash on first interaction.
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
// Pricing was eager-loaded but isn't on the auth happy path on first
// visit — lazy-load it so it doesn't bloat the home/login chunk.
// LLM-council gap audit P2 fix.
const Pricing = React.lazy(() => import('./components/Pricing'));
import CookieConsent from './components/CookieConsent';
import Account from './components/Account';
import SEO from './components/SEO';

// SECONDARY PATH — lazy-loaded. SEO/marketing/blog/cohort pages aren't on
// the conversion happy path, so paying their JS cost on the homepage hurts
// LCP for nothing. Each becomes its own chunk and only loads when the
// matching route is visited. Suspense fallback below in the route tree.
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./components/TermsOfService'));
const CookiePolicy = React.lazy(() => import('./components/CookiePolicy'));
const Admin = React.lazy(() => import('./components/Admin'));
const Blog = React.lazy(() => import('./components/Blog'));
const BlogPost = React.lazy(() => import('./components/BlogPost'));
const InterviewQuestionsHub = React.lazy(() => import('./components/InterviewQuestionsHub'));
const InterviewQuestionsPage = React.lazy(() => import('./components/InterviewQuestionsPage'));
const ToolsPage = React.lazy(() => import('./components/ToolsPage'));
const StateOf2026Page = React.lazy(() => import('./components/StateOf2026Page'));
const JdDecoderPage = React.lazy(() => import('./components/JdDecoderPage'));
const BulletRewriterPage = React.lazy(() => import('./components/BulletRewriterPage'));
const LayoffPlaybookPage = React.lazy(() => import('./components/LayoffPlaybookPage'));
const CostCalculatorPage = React.lazy(() => import('./components/CostCalculatorPage'));
const ReceiptsPage = React.lazy(() => import('./components/ReceiptsPage'));
const NoInterviewsDiagnostic = React.lazy(() => import('./components/NoInterviewsDiagnostic'));
const SearchPage = React.lazy(() => import('./components/SearchPage'));
const PwaShareTarget = React.lazy(() => import('./components/PwaShareTarget'));
const PwaOpenCv = React.lazy(() => import('./components/PwaOpenCv'));
const PwaHandle = React.lazy(() => import('./components/PwaHandle'));
const ComparePage = React.lazy(() => import('./components/ComparePage'));
const InterviewPrepCompanyHub = React.lazy(() => import('./components/InterviewPrepCompanyHub'));
const InterviewPrepCompanyPage = React.lazy(() => import('./components/InterviewPrepCompanyPage'));
const InterviewPrepCompanySeniorityPage = React.lazy(() => import('./components/InterviewPrepCompanySeniorityPage'));
const LaidOffPage = React.lazy(() => import('./components/LaidOffPage'));
const AtsHubPage = React.lazy(() => import('./components/AtsHubPage'));
const AtsVendorPage = React.lazy(() => import('./components/AtsVendorPage'));
const AtsKeywordScannerPage = React.lazy(() => import('./components/AtsKeywordScannerPage'));
const PressPage = React.lazy(() => import('./components/PressPage'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const PressReleasePage = React.lazy(() => import('./components/PressReleasesPage'));
const PressReleasesHub = React.lazy(() => import('./components/PressReleasesPage').then(m => ({ default: m.PressReleasesHub })));
const LaidOffFromCompanyPage = React.lazy(() => import('./components/LaidOffFromCompanyPage'));
const SkillsPage = React.lazy(() => import('./components/SkillsPage'));
const DocsApiPage = React.lazy(() => import('./components/DocsApiPage'));
const ReferPage = React.lazy(() => import('./components/ReferPage'));
const PlaybookPage = React.lazy(() => import('./components/PlaybookPage'));
const VendorSourcesPage = React.lazy(() => import('./components/VendorSourcesPage'));
const ChangelogPage = React.lazy(() => import('./components/ChangelogPage'));
const RoastPage = React.lazy(() => import('./components/RoastPage'));
const DecodeRejectionPage = React.lazy(() => import('./components/DecodeRejectionPage'));
const GhostJobCheckPage = React.lazy(() => import('./components/GhostJobCheckPage'));
const FaqPage = React.lazy(() => import('./components/FaqPage'));
const AlternativesPage = React.lazy(() => import('./components/AlternativesPage'));
const AlternativesHub = React.lazy(() => import('./components/AlternativesPage').then(m => ({ default: m.AlternativesHub })));
const LinkedinOptimizationPage = React.lazy(() => import('./components/LinkedinOptimizationPage'));
const SalaryHubPage = React.lazy(() => import('./components/SalaryHubPage'));
const SalaryPage = React.lazy(() => import('./components/SalaryPage'));
const CaseStudiesHub = React.lazy(() => import('./components/CaseStudiesHub'));
const CaseStudyPage = React.lazy(() => import('./components/CaseStudyPage'));
const SampleAnalysisPage = React.lazy(() => import('./components/SampleAnalysisPage'));
const DemoPreviewPage = React.lazy(() => import('./components/DemoPreviewPage'));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage'));
import ThemeProvider from './contexts/ThemeContext';
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext';

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #edeaff, #e8f4ff)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-violet-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  };

  // Bookmarklet entry: when ?job=<URL> is present in the landing URL, persist
  // it so the dashboard can pre-fill after signup. No PII; just the job URL the
  // user explicitly requested. Cleared automatically when the dashboard reads.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const job = params.get('job');
      if (job && /^https?:\/\//i.test(job)) {
        sessionStorage.setItem('vantage:pendingJob', job);
        // Clean the URL bar so the param doesn't leak into shares
        const cleaned = window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', cleaned);
      }
    } catch {
      // ignore — feature is opportunistic
    }
  }, []);

  // Auth state listener — only sets user, never awaits DB queries (deadlock risk)
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
        setUser(null);
        setProfile(null);
      }
      clearTimeout(timeout);
      setLoading(false);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // Fetch profile whenever user changes — deferred to next tick so Supabase auth lock is released
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      fetchProfile(user.id).then(p => {
        if (!cancelled) setProfile(p);
      });
    }, 50);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut: handleSignOut, refreshProfile }}>
      <BrowserRouter>
        <CurrencyProvider>
        <ThemeProvider>
          {/* Skip-to-main-content link for keyboard + screen reader users.
              Hidden visually until focused, then jumps the user past the
              navbar/announcement-bar to the page's main content. Pages that
              wrap their primary content in <main id="main"> get the benefit;
              pages without it just won't reveal the link's target — graceful
              degradation. WCAG 2.4.1 (Bypass Blocks). */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg"
          >
            Skip to main content
          </a>
          {/* Suspense boundary for the lazy-loaded marketing/blog/cohort routes
              declared at the top of this file. Critical-path routes (landing,
              auth, dashboard, account, pricing) are eagerly imported and don't
              hit this fallback. The fallback matches the ProtectedRoute spinner
              for visual consistency on slower connections. */}
          <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #edeaff, #e8f4ff)' }}>
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
          <Routes>
            <Route path="/" element={<>
              <SEO
                path="/"
                jsonLd={[
                  {
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: 'Vantage AI',
                    url: 'https://aimvantage.uk/',
                    applicationCategory: 'BusinessApplication',
                    applicationSubCategory: 'JobSearchApplication',
                    operatingSystem: 'Web',
                    description: 'AI job preparation tool. Upload CV, paste job link, get the full prep pack in ~90 seconds: company brief, tailored cover letter, mock interview questions, fit score, 5-minute pitch outline.',
                    offers: [
                      { '@type': 'Offer', name: 'Free trial', price: '0', priceCurrency: 'GBP', description: '10 free prep packs on signup, no card required' },
                      { '@type': 'Offer', name: 'Starter pack', price: '5', priceCurrency: 'GBP', description: '20 prep packs (one analysis each), one-time, never expires' },
                      { '@type': 'Offer', name: 'Pro', price: '12', priceCurrency: 'GBP', description: '60 prep packs per month' },
                      { '@type': 'Offer', name: 'Premium', price: '20', priceCurrency: 'GBP', description: '120 prep packs per month, includes fit score and presentation deck' },
                    ],
                    creator: {
                      '@type': 'Person',
                      name: 'Giovanni Sizino Ennes',
                      alternateName: 'Gio',
                      url: 'https://aimvantage.uk/about',
                      jobTitle: 'Independent founder',
                      nationality: 'United Kingdom',
                      // AEO: sameAs is the strongest non-content E-E-A-T
                      // signal for AI-engine identity resolution. Each link
                      // is verifiable from the landing page (rel='me' on
                      // /about) so AI crawlers can confirm the cross-link.
                      sameAs: [
                        'https://dev.to/goofypluto999',
                        'https://github.com/goofypluto999',
                        'https://cv-mirror-web.vercel.app/',
                        'https://www.youtube.com/channel/UCuZxrV6LaJfGHsEvztsaB4Q',
                        'https://aimvantage.uk/about',
                      ],
                    },
                  },
                  {
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    name: 'AI Job Application Preparation',
                    serviceType: 'Career Services',
                    provider: {
                      '@type': 'Person',
                      name: 'Giovanni Sizino Ennes',
                      alternateName: 'Gio',
                      url: 'https://aimvantage.uk/about',
                      jobTitle: 'Independent founder',
                      nationality: 'United Kingdom',
                      sameAs: [
                        'https://dev.to/goofypluto999',
                        'https://github.com/goofypluto999',
                        'https://cv-mirror-web.vercel.app/',
                        'https://www.youtube.com/channel/UCuZxrV6LaJfGHsEvztsaB4Q',
                        'https://aimvantage.uk/about',
                      ],
                    },
                    areaServed: {
                      '@type': 'Place',
                      name: 'Worldwide',
                    },
                    description: 'AI-powered preparation pack for job applications: company intelligence, tailored cover letter (4 tones), mock interview questions, CV-to-role fit score, and 5-minute pitch outline. Generated in approximately 90 seconds per application.',
                    audience: {
                      '@type': 'Audience',
                      audienceType: 'Job seekers, including those affected by recent layoffs (Oracle, Meta, ASML, Snap, Nike, Cloudflare) in 2026',
                    },
                  },
                  // Organization schema — AI assistants use this to identify
                  // 'who' a brand is when answering 'is Vantage AI a real
                  // company' / 'who runs Vantage AI' style queries. Sole
                  // trader status is honestly disclosed (not a registered
                  // limited company). Brand-disambiguation list explicitly
                  // separates us from Vantage Recruitment / Vantagepoint AI
                  // / etc. — these are confused with us in AI chat.
                  {
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Vantage AI',
                    alternateName: ['Vantage', 'aimvantage.uk'],
                    url: 'https://aimvantage.uk',
                    logo: 'https://aimvantage.uk/logo-512.png',
                    sameAs: [
                      'https://aimvantage.uk/about',
                      'https://aimvantage.uk/press',
                      'https://github.com/goofypluto999',
                      'https://dev.to/goofypluto999',
                      'https://cv-mirror-web.vercel.app/',
                    ],
                    founder: {
                      '@type': 'Person',
                      name: 'Giovanni Sizino Ennes',
                      jobTitle: 'Independent founder',
                      url: 'https://aimvantage.uk/about',
                    },
                    foundingDate: '2026-04-22',
                    description: 'Solo-operated UK indie AI job-prep SaaS. Sole trader, not a registered limited company. Builder-led brand with full operator transparency. Not affiliated with Vantage Recruitment, Vantage Consulting, AI-Vantage Training, Vantagepoint AI, or any similarly named organisation.',
                    contactPoint: {
                      '@type': 'ContactPoint',
                      contactType: 'customer support',
                      email: 'giovanni.sizino.ennes@hotmail.co.uk',
                      areaServed: 'Worldwide',
                      availableLanguage: 'English',
                    },
                  },
                  // HowTo schema — AEO-critical. AI search assistants
                  // (ChatGPT search, Perplexity, Claude search, Google AI
                  // Overviews) cite HowTo steps verbatim when answering
                  // 'how do I use X' or 'how do I prep for an interview
                  // with AI'. This is the cheapest plumbing for citation.
                  {
                    '@context': 'https://schema.org',
                    '@type': 'HowTo',
                    name: 'How to prep for a job interview with AI in 90 seconds using Vantage',
                    description: 'Use Vantage AI to generate a complete interview prep pack — company intelligence, tailored cover letter, mock interview questions, fit score, and pitch outline — in about 90 seconds per application.',
                    totalTime: 'PT2M',
                    estimatedCost: { '@type': 'MonetaryAmount', currency: 'GBP', value: '0' },
                    tool: [
                      { '@type': 'HowToTool', name: 'Your CV (PDF, DOCX, or TXT)' },
                      { '@type': 'HowToTool', name: 'A job listing URL' },
                    ],
                    step: [
                      {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Sign up free',
                        text: 'Create a free account at https://aimvantage.uk/register. No credit card required. You get 10 free prep packs on signup.',
                        url: 'https://aimvantage.uk/register',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Upload your CV',
                        text: 'Drop your CV (PDF, DOCX, or TXT) into the upload zone on the dashboard. The file is processed client-side and not stored.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Paste the job listing URL',
                        text: 'Paste the URL of the job you want to apply for. Vantage scrapes the listing for company name, role requirements, and culture signals.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 4,
                        name: 'Run the analysis',
                        text: 'Click "Run my prep pack". One full analysis costs 1 token (you have 10 free). Vantage runs ~60-90 seconds of company research, fit scoring, and content generation.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 5,
                        name: 'Read your prep pack',
                        text: 'Get back: company intelligence, CV fit score, strategic brief, tailored cover letter (4 tone options), 12 mock interview questions, and a 5-minute pitch outline.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 6,
                        name: 'Download the prep pack',
                        text: 'Click "Download .txt" to save the entire prep pack offline. Print it, paste it into Notes, share it with a coach.',
                      },
                    ],
                  },
                ]}
              />
              <LandingPageWrapper />
            </>} />
            <Route path="/login" element={<><SEO title="Log in" description="Log into Vantage to run a full job prep analysis — company intel, tailored cover letter, mock interview questions, CV fit score." path="/login" /><LoginWrapper /></>} />
            <Route path="/register" element={<><SEO title="Create a free account" description="Sign up free. Upload your CV, paste a job link, get the full prep pack in ~90 seconds." path="/register" /><RegisterWrapper /></>} />
            <Route path="/forgot-password" element={<><SEO title="Reset your password" description="Reset your Vantage account password." path="/forgot-password" noindex /><ForgotPassword /></>} />
            <Route path="/reset-password" element={<><SEO title="Set a new password" path="/reset-password" noindex /><ResetPassword /></>} />
            <Route path="/pricing" element={<>
              <SEO
                title="Pricing"
                description="Starter £5 for 20 prep packs (never expire). Pro £12/mo for 60 prep packs. Premium £20/mo for 120 prep packs including fit score and presentation deck. 1 token = 1 full analysis."
                path="/pricing"
                markdownAlternate="/markdown/pricing.md"
                jsonLd={[
                  // Product schema with multiple Offers — AI assistants cite
                  // this verbatim when asked 'how much does Vantage cost' /
                  // 'is Vantage free' / 'compare Vantage pricing'.
                  {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: 'Vantage AI',
                    description: 'AI job preparation tool. One full analysis (company intel + cover letter + interview pack + fit score + pitch outline) costs 1 token.',
                    brand: { '@type': 'Brand', name: 'Vantage AI' },
                    url: 'https://aimvantage.uk/pricing',
                    offers: {
                      '@type': 'AggregateOffer',
                      priceCurrency: 'GBP',
                      lowPrice: '0',
                      highPrice: '20',
                      offerCount: 4,
                      offers: [
                        { '@type': 'Offer', name: 'Free tier', price: '0', priceCurrency: 'GBP', description: '10 free prep packs on signup. No card required.', url: 'https://aimvantage.uk/register' },
                        { '@type': 'Offer', name: 'Starter pack', price: '5', priceCurrency: 'GBP', description: '20 prep packs. One-time. Tokens never expire.', url: 'https://aimvantage.uk/pricing' },
                        { '@type': 'Offer', name: 'Pro', price: '12', priceCurrency: 'GBP', description: '60 prep packs per month. Includes AI Mock Interview voice mode.', url: 'https://aimvantage.uk/pricing' },
                        { '@type': 'Offer', name: 'Premium', price: '20', priceCurrency: 'GBP', description: '120 prep packs per month. Includes CV Fit Score, Presentation Deck Builder, priority processing.', url: 'https://aimvantage.uk/pricing' },
                      ],
                    },
                  },
                  // FAQPage schema — common pricing questions. ChatGPT /
                  // Perplexity grab these directly when asked.
                  {
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                      {
                        '@type': 'Question',
                        name: 'Is Vantage AI free?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Yes — every account gets 10 free tokens on signup, no credit card required. 1 token = 1 full prep pack, so 10 tokens = 10 free prep packs. After that, Starter pack is £5 for 20 more (never expires).',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Do Vantage tokens expire?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Starter pack tokens never expire — pay £5 once, use them whenever. Pro and Premium tokens refresh monthly with the subscription, so unused tokens roll over only while the subscription is active.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Can I cancel my Vantage subscription?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Yes, any time. Pro and Premium are monthly subscriptions managed via Stripe. Cancel from the /account page — no questions, no retention dark patterns. Already-purchased tokens are kept after cancellation.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'How does Vantage compare to Jobscan or Final Round AI?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Vantage Pro at £12/month is dramatically cheaper than Jobscan ($49.95/mo) or Final Round AI ($148/mo). Vantage covers the full prep pack (company intel + cover letter + interview pack + fit score + pitch) in 90 seconds; Jobscan focuses only on ATS keyword matching. See aimvantage.uk/alternatives for full comparisons.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Where is Vantage AI hosted?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'EU-hosted on Vercel and Supabase. Operated from the UK by an independent founder (sole trader). All payments via Stripe. No CV data stored after analysis is complete.',
                        },
                      },
                    ],
                  },
                ]}
              />
              <PricingWrapper />
            </>} />
            <Route path="/privacy" element={<><SEO title="Privacy Policy" description="How Vantage collects, uses, and protects your data." path="/privacy" /><PrivacyPolicy /></>} />
            <Route path="/terms" element={<><SEO title="Terms of Service" description="The terms governing your use of Vantage." path="/terms" /><TermsOfService /></>} />
            <Route path="/cookies" element={<><SEO title="Cookie Policy" description="How Vantage uses cookies and similar technologies." path="/cookies" /><CookiePolicy /></>} />
            <Route path="/blog" element={<><SEO title="Blog" description="Deep guides on AI job prep, interview strategy, ATS-friendly CVs, cover letters, and job fit analysis." path="/blog" /><Blog /></>} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/interview-questions" element={<InterviewQuestionsHub />} />
            <Route path="/interview-questions/:role" element={<InterviewQuestionsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/state-of-2026" element={<StateOf2026Page />} />
            <Route path="/tools/jd-decoder" element={<JdDecoderPage />} />
            <Route path="/tools/bullet-rewriter" element={<BulletRewriterPage />} />
            <Route path="/tools/layoff-playbook" element={<LayoffPlaybookPage />} />
            <Route path="/tools/jobscan-cost-calculator" element={<CostCalculatorPage />} />
            <Route path="/jobscan-cost-calculator" element={<Navigate to="/tools/jobscan-cost-calculator" replace />} />
            <Route path="/job-tool-cost-calculator" element={<Navigate to="/tools/jobscan-cost-calculator" replace />} />
            <Route path="/receipts" element={<ReceiptsPage />} />
            <Route path="/trust" element={<Navigate to="/receipts" replace />} />
            <Route path="/transparency" element={<Navigate to="/receipts" replace />} />
            <Route path="/tools/no-interviews-diagnostic" element={<NoInterviewsDiagnostic />} />
            <Route path="/no-interviews" element={<Navigate to="/tools/no-interviews-diagnostic" replace />} />
            <Route path="/why-no-interviews" element={<Navigate to="/tools/no-interviews-diagnostic" replace />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/share-target" element={<PwaShareTarget />} />
            <Route path="/open-cv" element={<PwaOpenCv />} />
            <Route path="/handle" element={<PwaHandle />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/interview-prep" element={<InterviewPrepCompanyHub />} />
            <Route path="/interview-prep/:company" element={<InterviewPrepCompanyPage />} />
            <Route path="/interview-prep/:company/:seniority" element={<InterviewPrepCompanySeniorityPage />} />
            <Route path="/laid-off" element={<LaidOffPage />} />
            <Route path="/just-laid-off" element={<Navigate to="/laid-off" replace />} />
            <Route path="/laid-off-2026" element={<Navigate to="/laid-off" replace />} />
            <Route path="/laid-off/from/:company" element={<LaidOffFromCompanyPage />} />
            <Route path="/ats" element={<AtsHubPage />} />
            <Route path="/ats/scanner" element={<AtsKeywordScannerPage />} />
            <Route path="/ats/:vendor" element={<AtsVendorPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/press-releases" element={<PressReleasesHub />} />
            <Route path="/press-releases/:slug" element={<PressReleasePage />} />
            <Route path="/news" element={<Navigate to="/press-releases" replace />} />
            <Route path="/announcements" element={<Navigate to="/press-releases" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/who-we-are" element={<Navigate to="/about" replace />} />
            <Route path="/founder" element={<Navigate to="/about" replace />} />
            <Route path="/operator" element={<Navigate to="/about" replace />} />
            <Route path="/media" element={<Navigate to="/press" replace />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/playbook" element={<PlaybookPage />} />
            <Route path="/layoff-playbook" element={<Navigate to="/playbook" replace />} />
            <Route path="/vendor-sources" element={<VendorSourcesPage />} />
            <Route path="/sources" element={<Navigate to="/vendor-sources" replace />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/whats-new" element={<Navigate to="/changelog" replace />} />
            <Route path="/release-notes" element={<Navigate to="/changelog" replace />} />
            <Route path="/roast" element={<RoastPage />} />
            <Route path="/cover-letter-roast" element={<Navigate to="/roast" replace />} />
            <Route path="/roast-my-cover-letter" element={<Navigate to="/roast" replace />} />
            <Route path="/decode-rejection" element={<DecodeRejectionPage />} />
            <Route path="/decode" element={<Navigate to="/decode-rejection" replace />} />
            <Route path="/rejection-decoder" element={<Navigate to="/decode-rejection" replace />} />
            <Route path="/decode-my-rejection" element={<Navigate to="/decode-rejection" replace />} />
            <Route path="/ghost-job-check" element={<GhostJobCheckPage />} />
            <Route path="/ghost-job" element={<Navigate to="/ghost-job-check" replace />} />
            <Route path="/is-this-a-ghost-job" element={<Navigate to="/ghost-job-check" replace />} />
            <Route path="/ghost-job-detector" element={<Navigate to="/ghost-job-check" replace />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/help" element={<Navigate to="/faq" replace />} />
            <Route path="/questions" element={<Navigate to="/faq" replace />} />
            <Route path="/alternatives" element={<AlternativesHub />} />
            <Route path="/alternatives/:competitor" element={<AlternativesPage />} />
            <Route path="/jobscan-alternative" element={<Navigate to="/alternatives/jobscan" replace />} />
            <Route path="/teal-alternative" element={<Navigate to="/alternatives/teal" replace />} />
            <Route path="/final-round-ai-alternative" element={<Navigate to="/alternatives/final-round-ai" replace />} />
            <Route path="/resume-worded-alternative" element={<Navigate to="/alternatives/resume-worded" replace />} />
            <Route path="/vs/jobscan" element={<Navigate to="/alternatives/jobscan" replace />} />
            <Route path="/vs/teal" element={<Navigate to="/alternatives/teal" replace />} />
            <Route path="/vs/final-round-ai" element={<Navigate to="/alternatives/final-round-ai" replace />} />
            <Route path="/vs/resume-worded" element={<Navigate to="/alternatives/resume-worded" replace />} />
            <Route path="/kickresume-alternative" element={<Navigate to="/alternatives/kickresume" replace />} />
            <Route path="/enhancv-alternative" element={<Navigate to="/alternatives/enhancv" replace />} />
            <Route path="/yoodli-alternative" element={<Navigate to="/alternatives/yoodli" replace />} />
            <Route path="/huntr-alternative" element={<Navigate to="/alternatives/huntr" replace />} />
            <Route path="/big-interview-alternative" element={<Navigate to="/alternatives/big-interview" replace />} />
            <Route path="/vs/kickresume" element={<Navigate to="/alternatives/kickresume" replace />} />
            <Route path="/vs/enhancv" element={<Navigate to="/alternatives/enhancv" replace />} />
            <Route path="/vs/yoodli" element={<Navigate to="/alternatives/yoodli" replace />} />
            <Route path="/vs/huntr" element={<Navigate to="/alternatives/huntr" replace />} />
            <Route path="/vs/big-interview" element={<Navigate to="/alternatives/big-interview" replace />} />
            <Route path="/vs/resume-io" element={<Navigate to="/compare" replace />} />
            <Route path="/vs" element={<Navigate to="/alternatives" replace />} />
            <Route path="/linkedin-optimization" element={<LinkedinOptimizationPage />} />
            <Route path="/linkedin" element={<Navigate to="/linkedin-optimization" replace />} />
            <Route path="/linkedin-profile" element={<Navigate to="/linkedin-optimization" replace />} />
            <Route path="/salary" element={<SalaryHubPage />} />
            <Route path="/salaries" element={<Navigate to="/salary" replace />} />
            <Route path="/salary/:role" element={<SalaryPage />} />
            <Route path="/case-studies" element={<CaseStudiesHub />} />
            <Route path="/case-study" element={<Navigate to="/case-studies" replace />} />
            <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
            <Route path="/sample/:slug" element={<SampleAnalysisPage />} />
            <Route path="/example" element={<Navigate to="/sample/anthropic-senior-pm" replace />} />
            <Route path="/example/anthropic" element={<Navigate to="/sample/anthropic-senior-pm" replace />} />
            <Route path="/demo-preview" element={<DemoPreviewPage />} />
            <Route path="/docs/api" element={<DocsApiPage />} />
            <Route path="/api-docs" element={<Navigate to="/docs/api" replace />} />
            <Route path="/refer" element={
              <ProtectedRoute>
                <ReferPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <SEO title="Dashboard" noindex />
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <SEO title="Account" noindex />
                <Account />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <SEO title="Admin" noindex />
                <Admin />
              </ProtectedRoute>
            } />
            {/* Catch-all 404 — replaces the silent <Navigate to="/"> redirect.
                A real noindex page tells crawlers the URL doesn't exist (clean
                drop from index instead of soft-404 dilution) and gives users
                4-5 destination links instead of dumping them on home. */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </React.Suspense>
          <CookieConsent />
        </ThemeProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

function LandingPageWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <LandingPage onStart={() => navigate('/register')} showLogin={() => navigate('/login')} />;
}

function LoginWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <Login />;
}

function RegisterWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <Register />;
}

function PricingWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const handleCheckout = async (plan: string) => {
    try {
      const { url } = await createStripeCheckout(plan, currency);
      window.location.href = url;
    } catch (err: any) {
      console.error('Checkout failed:', err.message);
      navigate('/dashboard?checkout_error=true');
    }
  };

  return (
    <Pricing
      onLogin={() => navigate('/login')}
      onRegister={() => navigate('/register')}
      onCheckout={user ? handleCheckout : undefined}
      isAuthenticated={!!user}
    />
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0b1e', color: '#fff', fontFamily: 'sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
            <p style={{ color: '#a0a0b0', marginBottom: '1rem' }}>Please refresh the page to try again.</p>
            <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return <ErrorBoundary><AppContent /></ErrorBoundary>;
}