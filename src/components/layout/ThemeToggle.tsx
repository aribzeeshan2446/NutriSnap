
'use client';

import { Icons } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "bg-background/30 backdrop-blur-lg border border-border/40" 
      )}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Thumb */}
      <span
        className={`absolute flex h-6 w-6 transform items-center justify-center rounded-full bg-card shadow-md transition-transform duration-300 ease-in-out
                    ${theme === 'light' ? 'translate-x-0' : 'translate-x-6'}`}
      >
        {theme === 'light' ? (
          <Icons.Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Icons.Moon className="h-4 w-4 text-primary" />
        )}
      </span>
    </button>
  );
}
