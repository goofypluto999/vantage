import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, ArrowLeft, Shield, Mail } from 'lucide-react';

const LAST_UPDATED = '9 April 2026';

const sections = [
  {
    id: 'who-we-are',
    title: '1. Who Operates This Service',
    content: `Vantage ("we", "us", "our") is operated by an individual based in the United Kingdom. This is a personal passion project and is not a registered company. We sell our services worldwide.`,
  },
  {
    id: 'data-we-collect',
    title: '2. What Data We Collect',
    content: null,
    subsections: [
      {
        title: 'Account Information',
        text: 'Your name and email address, collected when you register for an account or join the waitlist.',
      },
      {
        title: 'CV / Resume Content',
        text: 'The text content of CVs and resumes you upload. This content is processed by AI to generate analyses and is not permanently stored in its raw form after processing. Structured results are stored for your continued access.',
      },
      {
        title: 'Job Information',
        text: 'Job URLs and job descriptions you provide for analysis.',
      },
      {
        title: 'Payment Information',
        text: 'Payment transactions are processed entirely by Stripe. We do not receive, store, or have access to your full card details. We receive only a confirmation of payment status and a truncated card identifier from Stripe.',
      },
      {
        title: 'Usage Data',
        text: 'Information about how you interact with the service, including pages visited, features used, and timestamps.',
      },
      {
        title: 'Cookies',
        text: 'We use essential cookies for authentication and session management, and optional analytics cookies with your consent. You can manage cookie preferences at any time via the cookie banner.',
      },
    ],
  },
  {
    id: 'legal-basis',
    title: '3. Legal Basis for Processing',
    content: null,
    subsections: [
      {
        title: 'Contract Performance',
        text: 'Processing your CV and job data is necessary to provide the service you have requested.',
      },
      {
        title: 'Consent',
        text: 'We rely on your consent for optional cookies, marketing communications, and waitlist enrolment. You may withdraw consent at any time.',
      },
      {
        title: 'Legitimate Interests',
        text: 'We process usage data to improve the service, maintain security, and prevent abuse. We balance these interests against your rights and freedoms.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '4. How We Use Your Data',
    content: `We use your data to:\n\n- Provide and operate the Vantage service, including AI-powered job preparation analyses\n- Process payments and manage subscriptions\n- Communicate with you about your account, service updates, and support requests\n- Improve the service through aggregated, anonymised usage analysis\n- Comply with legal obligations`,
  },
  {
    id: 'third-parties',
    title: '5. Third-Party Processors',
    content: 'We share your data with the following third-party service providers who process data on our behalf:',
    subsections: [
      {
        title: 'Supabase (Authentication & Database)',
        text: 'Stores account data, authentication credentials, and analysis results. Servers located in the EU (Ireland) and the US. Privacy policy: https://supabase.com/privacy',
      },
      {
        title: 'Stripe (Payments)',
        text: 'Processes all payment transactions. Headquartered in the US with global infrastructure. We never receive or store your full card details. Privacy policy: https://stripe.com/privacy',
      },
      {
        title: 'Google Gemini AI (Analysis)',
        text: 'CV text content and job descriptions are sent to Google\'s Gemini AI API for analysis and content generation. Processed in the US. See Section 6 for more detail. Privacy policy: https://policies.google.com/privacy',
      },
      {
        title: 'Vercel (Hosting)',
        text: 'Hosts the Vantage web application. Servers located in the US and globally via edge network. Privacy policy: https://vercel.com/legal/privacy-policy',
      },
    ],
  },
  {
    id: 'ai-processing',
    title: '6. AI Processing Disclosure',
    content: `When you use Vantage, the text content of your CV/resume and job descriptions are sent to Google's Gemini AI for analysis. This processing generates your company intelligence, strategic briefs, cover letters, interview preparation materials, and fit scores.\n\nImportant points about AI processing:\n\n- CV text is sent to Google's API servers in the US for processing\n- We do not permanently store the raw CV text after analysis is complete; structured results are retained for your access\n- AI-generated content (cover letters, briefs, interview packs) may contain inaccuracies, and we do not guarantee the accuracy, completeness, or suitability of any AI-generated output\n- You are responsible for reviewing all AI-generated content before using it in job applications or interviews\n- Google's use of data sent via the Gemini API is governed by their API terms of service and privacy policy`,
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    content: null,
    subsections: [
      {
        title: 'Account Data',
        text: 'Your account information and analysis results are retained for as long as your account is active. You may request deletion at any time (see Section 9).',
      },
      {
        title: 'Analysis Results',
        text: 'Structured analysis outputs (briefs, cover letters, interview packs) are stored to allow you continued access through your account.',
      },
      {
        title: 'Waitlist Data',
        text: 'If you joined the waitlist, your name and email are retained until launch or until you request deletion, whichever comes first.',
      },
      {
        title: 'Payment Records',
        text: 'Transaction records are retained as required by applicable tax and financial regulations.',
      },
    ],
  },
  {
    id: 'international-transfers',
    title: '8. International Data Transfers',
    content: `Your data may be processed outside the United Kingdom and European Economic Area, primarily in the United States, by our third-party service providers (Supabase, Stripe, Google, and Vercel).\n\nThese providers maintain appropriate safeguards for international data transfers, including Standard Contractual Clauses (SCCs) approved by the European Commission and the UK Information Commissioner's Office, and compliance with applicable data protection frameworks.\n\nBy using Vantage, you acknowledge that your data may be transferred to and processed in countries outside the UK/EEA.`,
  },
  {
    id: 'your-rights',
    title: '9. Your Rights',
    content: `Under UK GDPR and applicable data protection law, you have the following rights:\n\n- Right of Access: request a copy of the personal data we hold about you\n- Right to Rectification: request correction of inaccurate or incomplete data\n- Right to Erasure: request deletion of your personal data ("right to be forgotten")\n- Right to Data Portability: request your data in a structured, machine-readable format\n- Right to Restrict Processing: request that we limit how we process your data\n- Right to Object: object to processing based on legitimate interests\n- Right to Withdraw Consent: withdraw consent at any time where processing is based on consent\n\nTo exercise any of these rights, contact us at support@usevantage.co.uk. We will respond to your request within one month, as required by law. We may ask you to verify your identity before processing your request.`,
  },
  {
    id: 'children',
    title: '10. Children',
    content: `Vantage is not intended for use by anyone under the age of 16. We do not knowingly collect personal data from children under 16. If you believe we have inadvertently collected data from a child under 16, please contact us immediately at support@usevantage.co.uk and we will delete it promptly.`,
  },
  {
    id: 'security',
    title: '11. Security Measures',
    content: `We implement appropriate technical and organisational measures to protect your personal data, including:\n\n- Encryption of data in transit (TLS/HTTPS)\n- Row Level Security (RLS) policies in our database, ensuring users can only access their own data\n- Secure authentication via Supabase Auth, including support for OAuth providers\n- No storage of raw payment card details (handled entirely by Stripe's PCI-compliant infrastructure)\n- Regular review of access controls and security practices\n\nWhile we take reasonable steps to protect your data, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security.`,
  },
  {
    id: 'changes',
    title: '12. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes, we will update the "Last Updated" date at the top of this page.\n\nWe encourage you to review this policy periodically. Your continued use of Vantage after any changes constitutes acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: '13. Contact',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact us:\n\nEmail: support@usevantage.co.uk`,
  },
  {
    id: 'ico',
    title: '14. Supervisory Authority',
    content: `If you are not satisfied with our response to a privacy concern, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO):\n\nWebsite: https://ico.org.uk\nTelephone: 0303 123 1113\nPost: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #1a1635 50%, #2d2654 100%)' }}
    >
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Vantage</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
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
          {/* Page Title */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">Privacy Policy</h1>
                <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed mt-4">
              This Privacy Policy explains how Vantage collects, uses, stores, and protects your
              personal data when you use our AI-powered job preparation service. We are committed to
              protecting your privacy and handling your data in accordance with the UK General Data
              Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">
              Contents
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.03, duration: 0.4 }}
                className="scroll-mt-8"
              >
                <h2 className="text-xl font-display font-bold text-white mb-4">{section.title}</h2>

                {section.content && (
                  <div className="text-white/60 leading-relaxed whitespace-pre-line text-sm">
                    {section.content}
                  </div>
                )}

                {section.subsections && (
                  <div className="space-y-4 mt-2">
                    {section.subsections.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        className="pl-4 border-l-2 border-violet-500/20"
                      >
                        <h3 className="text-sm font-bold text-white/80 mb-1">{sub.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            ))}
          </div>

          {/* Contact Footer */}
          <div className="mt-16 p-6 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-center">
            <Mail className="w-6 h-6 text-violet-400 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-2">
              Questions about this policy?
            </p>
            <a
              href="mailto:support@usevantage.co.uk"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              support@usevantage.co.uk
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
