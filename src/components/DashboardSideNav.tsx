// DashboardSideNav — iOS / macOS-Dock-style proximity-magnify side navigation.
//
// User requested 2026-05-12: 'have a nav bar on the side of the dashboard,
// like a slick and clear one that has like an iOS effect where like it's
// compact but opens up and magnifies when the user goes over the line
// with dots and the first word brings up more words, which are the
// sections of the dashboard and when clicked on it takes the user to that
// section'.
//
// Behaviour:
//   * Fixed vertical strip on the right side of the viewport, centred.
//   * Each section is represented by a small dot + collapsed icon.
//   * Mouse proximity (Framer Motion useMotionValue + useTransform) makes
//     each item magnify smoothly — the closer the cursor, the larger the
//     item and the more of its label is revealed.
//   * Click smooth-scrolls to the section's anchor regardless of how far
//     the page has expanded.
//   * Hidden on screens narrower than md (768px) — mobile users get the
//     normal top-to-bottom scroll.
//   * Position uses left:4 by default but can be overridden via CSS var.
//
// Implementation deliberately avoids any external library beyond
// motion/react (already in the bundle). No anime.js, no 21st-ui dep.
// The spring physics + useTransform pattern produces exactly the
// dock-magnify effect referenced in the user's brief.

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import {
  Briefcase, Bookmark, Sparkles, FileText, ArrowUp,
  type LucideIcon,
} from 'lucide-react';

export interface NavSection {
  /** DOM id to scroll into view on click. */
  id: string;
  /** Short label displayed when magnified. */
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
  // Tracks the cursor's Y position within the viewport. Infinity = mouse
  // is not over the nav, so all items spring back to their resting size.
  const mouseY = useMotionValue<number>(Infinity);

  return (
    <motion.nav
      aria-label="Dashboard sections"
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3 px-2 py-3 rounded-2xl bg-[#0f0c20]/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
    >
      {sections.map((s) => (
        <NavItem key={s.id} section={s} mouseY={mouseY} />
      ))}
    </motion.nav>
  );
}

function NavItem({ section, mouseY }: { section: NavSection; mouseY: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement>(null);

  // Distance from this item's centre to the cursor's Y position. When the
  // nav isn't being hovered (mouseY === Infinity), distance is Infinity →
  // all useTransforms snap to their resting (closest-to-Infinity) values.
  const distance = useTransform(mouseY, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 } as DOMRect;
    return val - rect.y - rect.height / 2;
  });

  // Dot diameter — small at rest, grows to a full pill near the cursor.
  const dotSize = useTransform(distance, [-140, 0, 140], [10, 36, 10]);
  // Animated width — at rest just the dot, near the cursor expands to fit the label.
  const pillWidth = useTransform(distance, [-140, 0, 140], [10, 168, 10]);
  // Label opacity — fades in only when item is in the magnified zone.
  const labelOpacity = useTransform(distance, [-80, 0, 80], [0, 1, 0]);

  // Spring smoothing for the dock-feel snap.
  const dotSizeSpring = useSpring(dotSize, { mass: 0.08, stiffness: 180, damping: 14 });
  const pillWidthSpring = useSpring(pillWidth, { mass: 0.08, stiffness: 180, damping: 14 });
  const labelOpacitySpring = useSpring(labelOpacity, { mass: 0.05, stiffness: 220, damping: 18 });

  const onClick = () => {
    if (section.id === '__top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(section.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      className="relative flex items-center justify-end gap-2 rounded-full bg-gradient-to-r from-violet-600/40 to-purple-600/40 border border-violet-400/30 hover:from-violet-500/60 hover:to-purple-500/60 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
    >
      <motion.span
        style={{ opacity: labelOpacitySpring }}
        className="text-xs font-semibold whitespace-nowrap pl-3 pointer-events-none"
      >
        {section.label}
      </motion.span>
      <motion.span
        style={{ width: dotSizeSpring, height: dotSizeSpring }}
        className="flex-shrink-0 flex items-center justify-center rounded-full bg-violet-500/80 text-white"
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      </motion.span>
    </motion.button>
  );
}
