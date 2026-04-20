import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'gbp' | 'usd';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'gbp',
  setCurrency: () => {},
  symbol: '\u00A3',
  format: (amount) => `\u00A3${amount}`,
});

const STORAGE_KEY = 'vantage-currency';
const GEO_COOKIE = 'vantage-geo';

function readGeoCountry(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|; )' + GEO_COOKIE + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]).toUpperCase() : '';
}

function detectDefaultCurrency(): Currency {
  if (typeof window === 'undefined') return 'gbp';
  // Manual override (user clicked toggle) always wins
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'usd' || stored === 'gbp') return stored;
  } catch { /* ignore */ }
  // Edge middleware sets vantage-geo cookie with ISO country code from the user's real IP
  const country = readGeoCountry();
  if (country === 'US') return 'usd';
  if (country) return 'gbp'; // Any other detected country → GBP
  // Fallback if cookie not set yet (first request before middleware runs, or static cache)
  const locale = (navigator.language || '').toLowerCase();
  if (locale.endsWith('-us') || locale === 'en-us') return 'usd';
  return 'gbp';
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('gbp');

  useEffect(() => {
    setCurrencyState(detectDefaultCurrency());
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try { window.localStorage.setItem(STORAGE_KEY, c); } catch { /* ignore */ }
  };

  const symbol = currency === 'usd' ? '$' : '\u00A3';
  const format = (amount: number) => `${symbol}${amount}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
