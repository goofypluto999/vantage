import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';
import { initClarity } from './lib/clarity';

// Microsoft Clarity — env-gated. No-op until VITE_CLARITY_PROJECT_ID is set
// in Vercel env vars. See src/lib/clarity.ts for activation instructions.
initClarity(import.meta.env.VITE_CLARITY_PROJECT_ID);

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
    <Analytics />
  </HelmetProvider>
);
