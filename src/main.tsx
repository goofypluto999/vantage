import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';
import { initClarity } from './lib/clarity';
import { initGA4 } from './lib/ga4';

// Microsoft Clarity — env-gated. No-op until VITE_CLARITY_PROJECT_ID is set
// in Vercel env vars. See src/lib/clarity.ts for activation instructions.
initClarity(import.meta.env.VITE_CLARITY_PROJECT_ID);

// Google Analytics 4 — env-gated. No-op until VITE_GA_MEASUREMENT_ID is set
// in Vercel env vars (format: G-XXXXXXXXXX). See src/lib/ga4.ts for setup.
initGA4(import.meta.env.VITE_GA_MEASUREMENT_ID);

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
    <Analytics />
  </HelmetProvider>
);
