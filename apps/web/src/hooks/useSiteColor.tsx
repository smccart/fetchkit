import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SiteColorContextValue {
  color: string;
  setColor: (hex: string) => void;
}

const SiteColorContext = createContext<SiteColorContextValue>({
  color: '#6366f1',
  setColor: () => {},
});

const STORAGE_KEY = 'fetchkit-site-color';

export function SiteColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '#6366f1';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, color);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--ring', color);
  }, [color]);

  return (
    <SiteColorContext.Provider value={{ color, setColor }}>
      {children}
    </SiteColorContext.Provider>
  );
}

export function useSiteColor() {
  return useContext(SiteColorContext);
}
