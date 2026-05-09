import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Share2, Copy, Check, Gift, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import { useAuth } from '../App';

const SITE_URL = 'https://aimvantage.uk';

/**
 * /refer — UTM-tagged share mechanism for existing users.
 *
 * Generates a personalised share link with utm_source=referral and a per-user
 * UTM tag. Tracks attribution back to the user. Lightweight PLG primitive.
 */
export default function ReferPage() {
  const { t } = useTheme();
  const { user } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);

  const userTag = user?.id ? user.id.slice(0, 8) : 'anon';

  const links = [
    {
      label: 'Vantage AI (full prep tool)',
      url: `${SITE_URL}/?utm_source=referral&utm_medium=user&utm_campaign=share&ref=${userTag}`,
    },
    {
      label: 'CV Mirror (free ATS scanner)',
      url: `https://cv-mirror-web.vercel.app/?utm_source=vantage-referral&utm_medium=user&ref=${userTag}`,
    },
    {
      label: '"Just laid off?" cohort page',
      url: `${SITE_URL}/laid-off?utm_source=referral&utm_medium=user&utm_campaign=laid-off&ref=${userTag}`,
    },
  ];

  const copy = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('clipboard failed', err);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: t.pageBg }}>
      <SEO title="Refer a friend" description="Share your personal Vantage referral link with friends and contacts who could use job-prep help." path="/refer" noindex />

      <nav className={`${t.nav} border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className={`text-xl font-bold ${t.text}`}>Vantage</Link>
          <Link to="/dashboard" className={`text-sm ${t.textSub} hover:${t.text}`}>Dashboard</Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <Gift className="w-12 h-12 text-[#4F46E5] mx-auto mb-4" />
        <h1 className={`text-4xl font-bold tracking-tight ${t.text} mb-4`}>Share with a friend</h1>
        <p className={`text-lg ${t.textSub} max-w-2xl mx-auto mb-3`}>
          If Vantage helped you, send the link to someone job-hunting. The links below
          carry a tag so we can see traffic from your share — useful for us, no profile
          tracking on the recipient.
        </p>
        <p className={`text-sm ${t.textMuted} max-w-2xl mx-auto`}>
          Manual rewards for now: if a friend signs up via your link, email{' '}
          <a href="mailto:hello@aimvantage.uk?subject=Referral%20%2B%205%20tokens" className="text-[#4F46E5] hover:underline">
            hello@aimvantage.uk
          </a>{' '}
          with their email and we'll add 5 free tokens to your account. Automated rewards
          coming once we have steady traffic.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {links.map((l) => {
            // One-click share helpers per link. Tweet text is short and
            // doesn't claim things Vantage doesn't deliver — describes the
            // tool and links the personalised URL.
            const shareText = l.label.includes('CV Mirror')
              ? 'Free, fully client-side ATS scanner — see how 5 major parsers actually read your CV. No signup, nothing uploads:'
              : l.label.includes('laid off')
              ? 'Just laid off? Cohort-specific layoff playbook + AI prep tool from a UK indie dev:'
              : 'AI job-prep tool — upload CV, paste job link, get full company intel + tailored cover letter + mock interview pack in 90 seconds:';
            const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(l.url)}`;
            const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(l.url)}`;
            return (
              <div key={l.label} className={`${t.glass} rounded-xl p-5`}>
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <h2 className={`font-semibold ${t.text}`}>{l.label}</h2>
                    <p className={`text-xs ${t.textMuted} mt-1 break-all font-mono`}>{l.url}</p>
                  </div>
                  <button
                    onClick={() => copy(l.url, l.label)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-[#4F46E5] text-white rounded-md text-sm font-semibold hover:bg-[#3F36D5] flex-shrink-0"
                  >
                    {copied === l.label ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    <Twitter className="w-3.5 h-3.5" /> Share on X
                  </a>
                  <a
                    href={liUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    <Linkedin className="w-3.5 h-3.5" /> Share on LinkedIn
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8">
        <div className={`${t.glass} rounded-2xl p-6`}>
          <Share2 className="w-6 h-6 text-[#4F46E5] mb-3" />
          <h2 className={`font-bold ${t.text} mb-2`}>How tracking works today</h2>
          <p className={`text-sm ${t.textSub} leading-relaxed`}>
            Each link includes a <code className={`${t.cardInner} px-1 rounded`}>?ref={userTag}</code> parameter
            that lets us see clicks and visits from your share via standard web traffic logs. We do not
            currently auto-attribute signups to your account in the database — that's the next iteration
            once we have steady volume. Until then, email us when a friend signs up and we'll credit you
            manually.
          </p>
        </div>
      </section>
    </div>
  );
}
