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
import LaidOffPage from './components/LaidOffPage';
import AtsHubPage from './components/AtsHubPage';
import AtsVendorPage from './components/AtsVendorPage';
import PressPage from './components/PressPage';
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
            <Route path="/" element={<><SEO path="/" /><LandingPageWrapper /></>} />
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
            <Route path="/laid-off" element={<LaidOffPage />} />
            <Route path="/just-laid-off" element={<Navigate to="/laid-off" replace />} />
            <Route path="/laid-off-2026" element={<Navigate to="/laid-off" replace />} />
            <Route path="/ats" element={<AtsHubPage />} />
            <Route path="/ats/:vendor" element={<AtsVendorPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/media" element={<Navigate to="/press" replace />} />
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