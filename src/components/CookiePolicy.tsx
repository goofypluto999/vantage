import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Star } from 'lucide-react';

const sectionClass = 'mb-10';
const headingClass = 'text-xl font-display font-bold text-white mb-4';
const textClass = 'text-white/60 leading-relaxed text-sm';
const listClass = 'list-disc list-inside space-y-2 text-white/60 text-sm leading-relaxed ml-2';

export default function CookiePolicy() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, #0d0b1e 0%, #1a1635 50%, #2d2654 100%)',
      }}
    >
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">
              Vantage
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <Cookie className="w-6 h-6 text-violet-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
              Cookie Policy
            </h1>
          </div>
          <p className="text-white/40 text-sm mb-12">
            Last updated: 9 April 2026
          </p>

          {/* 1. What Are Cookies */}
          <section className={sectionClass}>
            <h2 className={headingClass}>1. What Are Cookies</h2>
            <p className={textClass}>
              Cookies are small text files stored on your device when you visit a
              website. They help the site remember your preferences, keep you
              signed in, and understand how you interact with the service. Some
              cookies are essential for the site to function; others help us
              improve your experience.
            </p>
          </section>

          {/* 2. How We Use Cookies */}
          <section className={sectionClass}>
            <h2 className={headingClass}>2. How We Use Cookies</h2>
            <p className={textClass}>
              Vantage uses cookies to authenticate your sessions, remember your
              preferences, process payments securely, and record your cookie
              consent choice. We do not use cookies for advertising or
              behavioural tracking.
            </p>
          </section>

          {/* 3. Types of Cookies We Use */}
          <section className={sectionClass}>
            <h2 className={headingClass}>3. Types of Cookies We Use</h2>

            <div className="space-y-6">
              {/* Essential */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <h3 className="text-white font-display font-bold mb-2">
                  Essential Cookies
                </h3>
                <p className={`${textClass} mb-3`}>
                  Required for Vantage to function. These cannot be disabled.
                </p>
                <ul className={listClass}>
                  <li>
                    <span className="text-violet-400 font-mono text-xs">
                      sb-*
                    </span>{' '}
                    — Supabase authentication session tokens
                  </li>
                  <li>
                    <span className="text-violet-400 font-mono text-xs">
                      vantage-theme
                    </span>{' '}
                    — Your light/dark theme preference
                  </li>
                  <li>
                    <span className="text-violet-400 font-mono text-xs">
                      vantage-cookie-consent
                    </span>{' '}
                    — Records whether you accepted or rejected non-essential
                    cookies
                  </li>
                </ul>
              </div>

              {/* Functional */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <h3 className="text-white font-display font-bold mb-2">
                  Functional Cookies
                </h3>
                <p className={textClass}>
                  Store user preferences and UI state to provide a smoother
                  experience (e.g. remembered form selections, panel
                  open/closed state). These do not track you across sites.
                </p>
              </div>

              {/* Analytics */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <h3 className="text-white font-display font-bold mb-2">
                  Analytics Cookies
                </h3>
                <p className={textClass}>
                  Vantage does not currently use any analytics cookies. If we
                  introduce analytics in the future, we will update this policy
                  and request your consent before setting any analytics cookies.
                </p>
              </div>

              {/* Third-party */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <h3 className="text-white font-display font-bold mb-2">
                  Third-Party Cookies
                </h3>
                <p className={`${textClass} mb-3`}>
                  The following third-party services may set cookies when you use
                  Vantage:
                </p>
                <ul className={listClass}>
                  <li>
                    <span className="text-white/80 font-semibold">Stripe</span>{' '}
                    — Payment processing. Stripe sets cookies to detect fraud
                    and process transactions securely. See{' '}
                    <a
                      href="https://stripe.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    >
                      Stripe's Privacy Policy
                    </a>
                    .
                  </li>
                  <li>
                    <span className="text-white/80 font-semibold">
                      Supabase
                    </span>{' '}
                    — Authentication. Supabase sets session cookies to keep you
                    signed in. See{' '}
                    <a
                      href="https://supabase.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    >
                      Supabase's Privacy Policy
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Managing Cookies */}
          <section className={sectionClass}>
            <h2 className={headingClass}>4. Managing Your Cookies</h2>
            <p className={`${textClass} mb-4`}>
              You can delete or block cookies through your browser settings.
              Instructions for major browsers:
            </p>
            <ul className={listClass}>
              <li>
                <span className="text-white/80 font-semibold">Chrome:</span>{' '}
                Settings &gt; Privacy and Security &gt; Cookies and other site
                data
              </li>
              <li>
                <span className="text-white/80 font-semibold">Firefox:</span>{' '}
                Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data
              </li>
              <li>
                <span className="text-white/80 font-semibold">Safari:</span>{' '}
                Preferences &gt; Privacy &gt; Manage Website Data
              </li>
              <li>
                <span className="text-white/80 font-semibold">Edge:</span>{' '}
                Settings &gt; Cookies and site permissions &gt; Manage and
                delete cookies
              </li>
            </ul>
          </section>

          {/* 5. What Happens If You Disable Cookies */}
          <section className={sectionClass}>
            <h2 className={headingClass}>
              5. What Happens If You Disable Cookies
            </h2>
            <p className={`${textClass} mb-3`}>
              Disabling cookies will affect your experience on Vantage:
            </p>
            <ul className={listClass}>
              <li>
                You will not be able to sign in or stay authenticated — Supabase
                session cookies are required for login.
              </li>
              <li>
                Theme preference and other UI settings will not be remembered
                between visits.
              </li>
              <li>
                Payment processing through Stripe may not work correctly.
              </li>
            </ul>
          </section>

          {/* 6. Changes to This Policy */}
          <section className={sectionClass}>
            <h2 className={headingClass}>6. Changes to This Policy</h2>
            <p className={textClass}>
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for legal, operational, or regulatory
              reasons. When we make material changes, we will update the "Last
              updated" date at the top of this page. We encourage you to review
              this policy periodically.
            </p>
          </section>

          {/* 7. Contact */}
          <section className={sectionClass}>
            <h2 className={headingClass}>7. Contact</h2>
            <p className={textClass}>
              If you have questions about our use of cookies, contact us at{' '}
              <a
                href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
              >
                giovanni.sizino.ennes@hotmail.co.uk
              </a>
              .
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
