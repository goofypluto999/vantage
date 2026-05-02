/**
 * /demo-preview — temporary review surface for the LiveDemoReel.
 *
 * Mounted at /demo-preview so the user can review the animated walkthrough
 * before it goes anywhere near the landing page. Not linked from anywhere
 * else in the site, marked noindex so it doesn't show up in search.
 *
 * Once approved, this page can stay as a "watch the demo" surface or the
 * reel can be embedded directly in the landing hero.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LiveDemoReel from './LiveDemoReel';
import SEO from './SEO';

export default function DemoPreviewPage() {
  return (
    <div className="min-h-screen bg-[#06040d]">
      <SEO
        title="Demo preview"
        description="Animated walkthrough of the Vantage product. Internal preview page."
        path="/demo-preview"
        noindex
      />

      {/* Top nav strip — minimal so the reel takes the focus */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
        <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">
          Internal preview · noindex
        </span>
      </div>

      {/* Reel + framing */}
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-violet-300/80 mb-2">
            Live demo reel — preview
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            See Vantage do its thing — in 22 seconds.
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto">
            A coded walkthrough of the real product flow. Mirrors the actual
            dashboard markup, brand palette, and pricing. Loops automatically.
          </p>
        </div>

        <LiveDemoReel autoplay aspectRatio="16/10" />

        <div className="max-w-2xl mx-auto mt-12 text-sm text-white/60 space-y-3">
          <p className="text-white/40 text-xs uppercase tracking-wider">What's in here</p>
          <ul className="space-y-2 text-sm">
            <li>· Hook → Upload CV → Paste job URL → Click Analyze</li>
            <li>· Company Intelligence card materializes (real Stripe data)</li>
            <li>· CV Fit Score circular gauge animates 0 → 84</li>
            <li>· Cover Letter writes out, tone switcher pills (Direct active)</li>
            <li>· Mock Interview question + recording mic pulse</li>
            <li>· 5-Minute Pitch Outline staggered slides</li>
            <li>· Done in 1:32 + "Try Vantage free" CTA</li>
          </ul>
          <p className="pt-4 text-xs text-white/40">
            Click the play/pause icon top-right of the reel to control playback.
            Once approved, this same reel can drop into the landing page hero.
          </p>
        </div>
      </div>
    </div>
  );
}
