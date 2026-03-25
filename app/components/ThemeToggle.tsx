'use client';

import { useState } from 'react';
import {
  THEME_ATTRIBUTE,
  THEME_MODES,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from '@/app/lib/theme.constants';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function getResolvedTheme(): ThemeMode {
  if (typeof document !== 'undefined') {
    const documentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE);

    if (isThemeMode(documentTheme)) {
      return documentTheme;
    }
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function getButtonClassName(isActive: boolean) {
  return [
    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isActive
      ? 'bg-accent text-accent-foreground'
      : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
  ].join(' ');
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(getResolvedTheme);

  function handleThemeChange(nextTheme: ThemeMode) {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1"
      role="group"
      aria-label="Select site theme"
    >
      {THEME_MODES.map((mode: ThemeMode) => {
        const isActive = theme === mode;
        const label = mode === 'light' ? 'Light' : 'Dark';

        return (
          <button
            key={mode}
            type="button"
            onClick={() => handleThemeChange(mode)}
            className={getButtonClassName(isActive)}
            aria-pressed={isActive}
            aria-label={`Switch to ${label.toLowerCase()} theme`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}