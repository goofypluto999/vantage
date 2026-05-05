import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase, signOut, fetchProfile, Profile } from './lib/supabase';
import { createStripeCheckout } from './services/api';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import Account from './components/Account';
import Admin from './components/Admin';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import InterviewQuestionsHub from './components/InterviewQuestionsHub';
import InterviewQuestionsPage from './components/InterviewQuestionsPage';
import ToolsPage from './components/ToolsPage';
import ComparePage from './components/ComparePage';
import InterviewPrepCompanyHub from './components/InterviewPrepCompanyHub';
import InterviewPrepCompanyPage from './components/InterviewPrepCompanyPage';
import InterviewPrepCompanySeniorityPage from './components/InterviewPrepCompanySeniorityPage';
import LaidOffPage from './components/LaidOffPage';
import AtsHubPage from './components/AtsHubPage';
import AtsVendorPage from './components/AtsVendorPage';
import PressPage from './components/PressPage';
import LaidOffFromCompanyPage from './components/LaidOffFromCompanyPage';
import SkillsPage from './components/SkillsPage';
import DocsApiPage from './components/DocsApiPage';
import ReferPage from './components/ReferPage';
import PlaybookPage from './components/PlaybookPage';
import VendorSourcesPage from './components/VendorSourcesPage';
import ChangelogPage from './components/ChangelogPage';
import RoastPage from './components/RoastPage';
import FaqPage from './components/FaqPage';
import AlternativesPage, { AlternativesHub } from './components/AlternativesPage';
import LinkedinOptimizationPage from './components/LinkedinOptimizationPage';
import SalaryHubPage from './components/SalaryHubPage';
import SalaryPage from './components/SalaryPage';
import CaseStudiesHub from './components/CaseStudiesHub';
import CaseStudyPage from './components/CaseStudyPage';
import SampleAnalysisPage from './components/SampleAnalysisPage';
import DemoPreviewPage from './components/DemoPreviewPage';
import SEO from './components/SEO';
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
                      { '@type': 'Offer', name: 'Free trial', price: '0', priceCurrency: 'GBP', description: '3 free analyses on signup, no card required' },
                      { '@type': 'Offer', name: 'Starter pack', price: '5', priceCurrency: 'GBP', description: '20 tokens (~6 analyses), one-time, never expires' },
                      { '@type': 'Offer', name: 'Pro', price: '12', priceCurrency: 'GBP', description: '60 tokens per month' },
                      { '@type': 'Offer', name: 'Premium', price: '20', priceCurrency: 'GBP', description: '120 tokens per month, includes fit score and presentation deck' },
                    ],
                    creator: {
                      '@type': 'Organization',
                      name: 'Vantage Labs',
                      url: 'https://aimvantage.uk',
                    },
                  },
                  {
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    name: 'AI Job Application Preparation',
                    serviceType: 'Career Services',
                    provider: {
                      '@type': 'Organization',
                      name: 'Vantage Labs',
                      url: 'https://aimvantage.uk',
                    },
                    areaServed: {
                      '@type': 'Place',
                      name: 'Worldwide',
                    },
                    description: 'AI-powered preparation pack for job applications: company intelligence, tailored cover letter (4 tones), mock interview questions, CV-to-role fit score, and 5-minute pitch outline. Generated in approximately 90 seconds per application.',
                    audience: {
                      '@type': 'Audience',
                      audienceType: 'Job seekers, including those affected by recent layoffs (Oracle, Meta, ASML, Snap, Nike) in 2026',
                    },
                  },
                ]}
              />
              <LandingPageWrapper />
            </>} />
            <Route path="/login" element={<><SEO title="Log in" description="Log into Vantage to run a full job prep analysis — company intel, tailored cover letter, mock interview questions, CV fit score." path="/login" /><LoginWrapper /></>} />
            <Route path="/register" element={<><SEO title="Create a free account" description="Sign up free. Upload your CV, paste a job link, get the full prep pack in ~90 seconds." path="/register" /><RegisterWrapper /></>} />
            <Route path="/forgot-password" element={<><SEO title="Reset your password" description="Reset your Vantage account password." path="/forgot-password" noindex /><ForgotPassword /></>} />
            <Route path="/reset-password" element={<><SEO title="Set a new password" path="/reset-password" noindex /><ResetPassword /></>} />
            <Route path="/pricing" element={<><SEO title="Pricing" description="Starter £5 for 20 tokens (never expire). Pro £12/mo for 60 tokens. Premium £20/mo for 120 tokens including fit score and presentation deck. One full analysis = 3 tokens." path="/pricing" /><PricingWrapper /></>} />
            <Route path="/privacy" element={<><SEO title="Privacy Policy" description="How Vantage collects, uses, and protects your data." path="/privacy" /><PrivacyPolicy /></>} />
            <Route path="/terms" element={<><SEO title="Terms of Service" description="The terms governing your use of Vantage." path="/terms" /><TermsOfService /></>} />
            <Route path="/cookies" element={<><SEO title="Cookie Policy" description="How Vantage uses cookies and similar technologies." path="/cookies" /><CookiePolicy /></>} />
            <Route path="/blog" element={<><SEO title="Blog" description="Deep guides on AI job prep, interview strategy, ATS-friendly CVs, cover letters, and job fit analysis." path="/blog" /><Blog /></>} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/interview-questions" element={<InterviewQuestionsHub />} />
            <Route path="/interview-questions/:role" element={<InterviewQuestionsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/interview-prep" element={<InterviewPrepCompanyHub />} />
            <Route path="/interview-prep/:company" element={<InterviewPrepCompanyPage />} />
            <Route path="/interview-prep/:company/:seniority" element={<InterviewPrepCompanySeniorityPage />} />
            <Route path="/laid-off" element={<LaidOffPage />} />
            <Route path="/just-laid-off" element={<Navigate to="/laid-off" replace />} />
            <Route path="/laid-off-2026" element={<Navigate to="/laid-off" replace />} />
            <Route path="/laid-off/from/:company" element={<LaidOffFromCompanyPage />} />
            <Route path="/ats" element={<AtsHubPage />} />
            <Route path="/ats/:vendor" element={<AtsVendorPage />} />
            <Route path="/press" element={<PressPage />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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