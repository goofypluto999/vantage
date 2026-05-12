// DashboardSideNav — iOS / macOS-Dock-style proximity-magnify side nav.
//
// v2 (2026-05-13): user feedback 'BEAUTIFUL, BUT way too small and narrow
// and short, needs to be more present, easier to see, bigger, easier to
// see, know it's there, maybe a lil thicker and more depth'.
//
// What changed from v1:
//   * Resting dot size bumped 10 → 22px (44 hit-target friendly)
//   * Magnified size bumped 36 → 56px (much more dramatic dock effect)
//   * Wider max pill: 168 → 220px so labels never truncate
//   * Each dot now lives inside a SOLID pill with deeper background,
//     not a flat circle — gives the chrome more substance
//   * Multi-layer shadow + outer ring for visual depth
//   * Breathing intro: the whole nav gently pulses scale 1 → 1.06 → 1
//     three times over the first 4.5 seconds after mount, then settles,
//     so the user notices the nav exists. Pulse disabled once user
//     hovers (it's served its purpose).
//   * Always-visible labels at rest? No — still hidden until proximity
//     (otherwise the resting nav takes too much horizontal real estate
//     and intrudes on the page). The dots themselves are now big
//     enough at rest to be unmissable, with icon visible.
//   * Subtle perpetual glow on each dot via box-shadow so the nav
//     feels 'alive' even at rest.

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import {
  Briefcase, Bookmark, Sparkles, FileText, ArrowUp,
  type LucideIcon,
} from 'lucide-react';

export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
}

const DEFAULT_SECTIONS: NavSection[] = [
  { id: '__top', label: 'Top', icon: ArrowUp },
  { id: 'dashboard-jobsearch-panel', label: 'AI Job Search', icon: Sparkles },
  { id: 'application-tracker', label: 'Tracker', icon: Bookmark },
  { id: 'run-analysis', label: 'Run Analysis', icon: Briefcase },
  { id: 'past-analyses', label: 'Past Analyses', icon: FileText },
];

interface Props {
  sections?: NavSection[];
}

export default function DashboardSideNav({ sections = DEFAULT_SECTIONS }: Props) {
  const mouseY = useMotionValue<number>(Infinity);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Breathing intro animation. Pulses the entire nav scale 1 → 1.06 → 1
  // three cycles over ~4.5s so the user notices the nav exists. Stops
  // immediately on first hover (the cue worked).
  const containerAnimate = hasInteracted
    ? { scale: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.15)' }
    : {
        scale: [1, 1.06, 1, 1.06, 1, 1.06, 1],
        boxShadow: [
          '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.15)',
          '0 12px 48px rgba(124,58,237,0.45), 0 0 0 2px rgba(167,139,250,0.5)',
          '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.15)',
          '0 12px 48px rgba(124,58,237,0.45), 0 0 0 2px rgba(167,139,250,0.5)',
          '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.15)',
          '0 12px 48px rgba(124,58,237,0.45), 0 0 0 2px rgba(167,139,250,0.5)',
          '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.15)',
        ],
      };

  // After 4.5s the breathing stops even if the user never hovers — they've
  // had enough time to register the nav.
  useEffect(() => {
    const t = setTimeout(() => setHasInteracted(true), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.nav
      aria-label="Dashboard sections"
      onMouseMove={(e) => { mouseY.set(e.clientY); if (!hasInteracted) setHasInteracted(true); }}
      onMouseLeave={() => mouseY.set(Infinity)}
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, ...containerAnimate }}
      transition={{ duration: 0.6, ease: 'easeOut', scale: { duration: 4.5, ease: 'easeInOut' }, boxShadow: { duration: 4.5, ease: 'easeInOut' } }}
      style={{ transformOrigin: 'center right' }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3 p-3 rounded-3xl bg-gradient-to-br from-[#181530]/85 via-[#1a1635]/85 to-[#0d0b1e]/85 backdrop-blur-2xl border border-violet-400/25"
    >
      {sections.map((s) => (
        <NavItem key={s.id} section={s} mouseY={mouseY} />
      ))}
    </motion.nav>
  );
}

function NavItem({ section, mouseY }: { section: NavSection; mouseY: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement>(null);

  // Distance from this item's centre to the cursor's Y.
  const distance = useTransform(mouseY, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 } as DOMRect;
    return val - rect.y - rect.height / 2;
  });

  // Much more dramatic magnify range than v1.
  const dotSize = useTransform(distance, [-160, 0, 160], [22, 56, 22]);
  const pillWidth = useTransform(distance, [-160, 0, 160], [22, 220, 22]);
  const labelOpacity = useTransform(distance, [-90, 0, 90], [0, 1, 0]);

  // Snappy but settled springs — dock physics.
  const dotSizeSpring = useSpring(dotSize, { mass: 0.08, stiffness: 200, damping: 16 });
  const pillWidthSpring = useSpring(pillWidth, { mass: 0.08, stiffness: 200, damping: 16 });
  const labelOpacitySpring = useSpring(labelOpacity, { mass: 0.05, stiffness: 260, damping: 22 });

  const onClick = () => {
    if (section.id === '__top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(section.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const Icon = section.icon;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={section.label}
      title={section.label}
      style={{ width: pillWidthSpring, height: dotSizeSpring }}
      className="relative flex items-center justify-end gap-2 rounded-full bg-gradient-to-r from-violet-600/70 to-purple-600/70 hover:from-violet-500 hover:to-purple-500 border border-violet-400/50 text-white shadow-[0_2px_8px_rgba(124,58,237,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] transition-shadow focus:outline-none focus:ring-2 focus:ring-violet-300"
    >
      <motion.span
        style={{ opacity: labelOpacitySpring }}
        className="text-sm font-bold whitespace-nowrap pl-4 pointer-events-none tracking-wide"
      >
        {section.label}
      </motion.span>
      <motion.span
        style={{ width: dotSizeSpring, height: dotSizeSpring }}
        className="flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]"
      >
        <Icon className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
      </motion.span>
    </motion.button>
  );
}
