'use client';

import { useTheme as useNextTheme } from 'next-themes';

export { ThemeProvider } from 'next-themes';

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme: theme || 'light', toggleTheme };
}
