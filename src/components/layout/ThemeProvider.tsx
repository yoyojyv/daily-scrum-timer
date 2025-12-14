'use client';

import { useEffect } from 'react';
import { useScrumStore } from '@/stores/useScrumStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useScrumStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
