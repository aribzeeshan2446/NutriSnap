
'use client';

import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './use-local-storage';

type Theme = 'light' | 'dark';

interface UseThemeOutput {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_KEY = 'nutrisnap_theme';

export function useTheme(): UseThemeOutput {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(THEME_KEY, 'dark'); // Default to dark
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark'); // Initial client render state is dark

  useEffect(() => {
    // Sync currentTheme with the value from localStorage (or the default 'dark') after hydration
    setCurrentTheme(storedTheme);
  }, [storedTheme]);

  useEffect(() => {
    // Apply the current theme to the document's root element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); // Clean up previous theme class
    root.classList.add(currentTheme);
  }, [currentTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    // Update the theme in localStorage; currentTheme will update reactively via the useEffect above
    setStoredTheme(newTheme);
  }, [setStoredTheme]);

  const toggleTheme = useCallback(() => {
    // Determine the new theme based on the current one and update localStorage
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setStoredTheme(newTheme);
  }, [currentTheme, setStoredTheme]);

  return { theme: currentTheme, setTheme, toggleTheme };
}
