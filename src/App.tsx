import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { supabase, signUp, signIn, signOut, signInWithGoogle, getCurrentUser, fetchProfile, Profile, subscribeToAuthChanges } from './lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import ThemeProvider, { useTheme } from './contexts/ThemeContext';

const stripePromise = loadStripe('pk_test_placeholder');

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
    getCurrentUser().then(async (user) => {
      setUser(user);
      if (user) {
        const profile = await fetchProfile(user.id);
        setProfile(profile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = subscribeToAuthChanges(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
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
            <Route path="/pricing" element={<PricingWrapper />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
  
  return <LandingPage onStart={() => navigate('/register')} />;
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