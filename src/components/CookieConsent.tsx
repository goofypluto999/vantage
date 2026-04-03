import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Shield } from 'lucide-react';

interface CookieConsentProps {
  onAccept?: () => void;
  onReject?: () => void;
}

export default function CookieConsent({ onAccept, onReject }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

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

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-[#1a1635]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-display font-bold text-white">We value your privacy</h3>
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  We use cookies to improve your experience and analyze traffic. By clicking "Accept", you consent to our use of cookies. You can manage your preferences at any time in your account settings.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAccept}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:from-violet-500 hover:to-purple-500 transition-all"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/10 transition-all"
                  >
                    Reject Non-Essential
                  </button>
                  <a
                    href="/privacy"
                    className="px-5 py-2.5 rounded-xl text-white/50 font-semibold text-sm hover:text-white transition-colors flex items-center gap-2"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
              <button
                onClick={handleReject}
                className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}