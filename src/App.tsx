import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { supabase, signUp, signIn, signOut, signInWithGoogle, getCurrentUser, fetchProfile, Profile, subscribeToAuthChanges } from './lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
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
import ThemeProvider, { useTheme } from './contexts/ThemeContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
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

  useEffect(() => {
    let cancelled = false;

    // Timeout: never let auth check block the app for more than 5 seconds
    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    getCurrentUser().then(async (currentUser) => {
      if (cancelled) return;
      setUser(currentUser);
      if (currentUser) {
        const p = await fetchProfile(currentUser.id);
        if (!cancelled) setProfile(p);
      }
      if (!cancelled) { clearTimeout(timeout); setLoading(false); }
    }).catch(() => {
      if (!cancelled) { clearTimeout(timeout); setLoading(false); }
    });

    const { data: { subscription } } = subscribeToAuthChanges(async (event, session) => {
      if (cancelled) return;
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user.id);
        if (!cancelled) setProfile(p);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut: handleSignOut }}>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<LandingPageWrapper />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/register" element={<RegisterWrapper />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<PricingWrapper />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CookieConsent />
        </ThemeProvider>
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
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Pricing onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />;
}

export default function App() {
  return <AppContent />;
}