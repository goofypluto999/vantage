import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Shield } from 'lucide-react';

interface CookieConsentProps {
  onAccept?: () => void;
  onReject?: () => void;
}

// Auth + critical-conversion routes where the banner should NOT
// overlay form submit buttons. On these routes we show a tiny
// top-bar notice instead of the full-width bottom card.
//
// Audit 2026-05-08 found the previous bottom-fixed full-width banner
// intercepted pointer-events on the /login Sign In button at
// 1366x900. The fresh visitor saw the form, clicked submit, and
// got nothing. P0 conversion blocker.
const COMPACT_ROUTES = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/pricing',
]);

export default function CookieConsent({ onAccept, onReject }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();
  const compact = COMPACT_ROUTES.has(location.pathname);

  useEffect(() => {
    const hasConsented = localStorage.getItem('vantage-cookie-consent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vantage-cookie-consent', 'accepted');
    setShowBanner(false);
    onAccept?.();
  };

  const handleReject = () => {
    localStorage.setItem('vantage-cookie-consent', 'rejected');
    setShowBanner(false);
    onReject?.();
  };

  // Compact variant for auth + pricing pages: a thin top notice that
  // never overlaps form fields or submit buttons. Pointer-events on
  // the parent container only on the inner row, so even if the user
  // never dismisses, they can still interact with the page below.
  if (compact) {
    return (
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
            role="dialog"
            aria-label="Cookie preferences"
          >
            <div className="bg-[#0d0b1e]/95 backdrop-blur-xl border-b border-white/10 pointer-events-auto">
              <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Cookie className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <span className="text-white/70 truncate">
                    Cookies for analytics + auth.{' '}
                    <Link to="/privacy" className="underline hover:text-white">Privacy policy</Link>
                  </span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleReject}
                    className="px-2.5 py-1 rounded-md text-white/50 hover:text-white text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-3 py-1 rounded-md bg-violet-600 text-white text-xs font-bold hover:bg-violet-500"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Standard variant — bottom-RIGHT floating card, NOT full-width.
  // The previous full-width fixed bottom card overlayed mobile bottom
  // CTAs. Floating to the right with a max width keeps the bottom
  // edge of the page clear for primary actions.
  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          // pointer-events-none on the wrapper so even before dismiss,
          // the rest of the page underneath stays clickable.
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[60] pointer-events-none"
          role="dialog"
          aria-label="Cookie preferences"
        >
          <div className="bg-[#1a1635]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-display font-bold text-white">We value your privacy</h3>
                  <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-white/60 leading-relaxed mb-3">
                  Cookies improve experience and traffic analysis.{' '}
                  <Link to="/privacy" className="text-white/80 hover:text-white underline">
                    Privacy policy
                  </Link>.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAccept}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs hover:from-violet-500 hover:to-purple-500 transition-all"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 font-semibold text-xs hover:bg-white/10 transition-all"
                  >
                    Reject Non-Essential
                  </button>
                </div>
              </div>
              <button
                onClick={handleReject}
                aria-label="Dismiss cookie banner"
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
