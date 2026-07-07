import { useEffect, useState } from 'react';
import { Outlet } from '@tanstack/react-router';

import { Navbar } from '@app/components';

export function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const savedTheme = window.localStorage.getItem('theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    const favicon = document.querySelector<HTMLLinkElement>('#app-favicon');

    if (favicon) {
      if (isDarkMode) {
        favicon.href = '/poke-purple.png';
        favicon.type = 'image/png';
      } else {
        favicon.href = '/favicon.svg';
        favicon.type = 'image/svg+xml';
      }
    }
  }, [isDarkMode]);

  return (
    <main className="pokedex-shell">
      <Navbar isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((prev) => !prev)} />

      <Outlet />
    </main>
  );
}
