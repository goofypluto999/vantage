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

function detectDefaultCurrency(): Currency {
  if (typeof window === 'undefined') return 'gbp';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'usd' || stored === 'gbp') return stored;
  } catch { /* ignore */ }
  // Detect from browser locale — en-US, es-US, etc. default to USD
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
