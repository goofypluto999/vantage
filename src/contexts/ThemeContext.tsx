import React, { createContext, useContext, useState } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeStyles {
  pageBg: string;           // CSS background (inline style)
  glass: string;            // Tailwind: glass card classes
  glassHeader: string;      // Tailwind: glass card header classes
  nav: string;              // Tailwind: nav bg classes
  text: string;             // primary text
  textSub: string;          // secondary text
  textMuted: string;        // muted/meta text
  cardInner: string;        // inner nested card bg + border
  uploadZone: string;       // upload drop zone bg
  selectorItem: string;     // output selector item bg
  footer: string;           // footer bg + border
  overlayBg: string;        // modal overlay CSS value
  inputBorder: string;      // text input border class
  divider: string;          // divider line class
  blobColors: string[];     // 3 blob colors for background
}

function buildStyles(theme: Theme): ThemeStyles {
  const dark = theme === 'dark';
  return {
    pageBg: dark
      ? 'linear-gradient(135deg, #0d0b1e 0%, #091220 50%, #0a1a10 100%)'
      : 'linear-gradient(135deg, #edeaff 0%, #e8f4ff 50%, #eafdf5 100%)',

    glass: dark
      ? 'bg-[#181530]/75 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
      : 'bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(79,70,229,0.07),0_2px_8px_rgba(0,0,0,0.04)]',

    glassHeader: dark
      ? 'bg-white/[0.04] backdrop-blur-sm px-6 py-4 border-b border-white/[0.07] flex items-center justify-between'
      : 'bg-white/40 backdrop-blur-sm px-6 py-4 border-b border-white/40 flex items-center justify-between',

    nav: dark
      ? 'bg-[#0d0b1e]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_16px_rgba(0,0,0,0.5)]'
      : 'bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_1px_16px_rgba(79,70,229,0.06)]',

    text: dark ? 'text-[#F0EEFF]' : 'text-[#2D2B4E]',
    textSub: dark ? 'text-[#C8C5F2]' : 'text-[#6B6B8D]',
    textMuted: dark ? 'text-[#A09DC8]' : 'text-[#9B99B7]',

    cardInner: dark
      ? 'bg-white/[0.04] border border-white/[0.07]'
      : 'bg-white/40 border border-white/50',

    uploadZone: dark
      ? 'bg-white/[0.05] backdrop-blur-md border-white/[0.10]'
      : 'bg-white/50 backdrop-blur-md border-white/60',

    selectorItem: dark
      ? 'bg-white/[0.05] border-white/[0.10]'
      : 'bg-white/30 border-white/40',

    footer: dark
      ? 'bg-[#0d0b1e]/80 border-white/[0.07]'
      : 'bg-white/40 border-white/40',

    overlayBg: dark
      ? 'rgba(5,4,18,0.80)'
      : 'rgba(45,43,78,0.60)',

    inputBorder: dark ? 'border-white/20' : 'border-white/60',
    divider: dark ? 'border-white/[0.07]' : 'border-white/30',

    blobColors: dark
      ? ['#1e1870', '#4a1d96', '#064e3b']
      : ['#4F46E5', '#7C3AED', '#10B981'],
  };
}

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: ThemeStyles;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'light',
  setTheme: () => {},
  t: buildStyles('light'),
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('vantage-theme') as Theme) || 'light';
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('vantage-theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, t: buildStyles(theme) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export default ThemeProvider;
