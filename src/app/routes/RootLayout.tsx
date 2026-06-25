import { useEffect, useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '@features/language-switcher';
import { ThemeToggle } from '@features/theme-toggle';

export function RootLayout() {
  const { t } = useTranslation();
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
      <header className="gateway-header gateway-header--router">
        <Link to="/" className="header-brand-link" aria-label={t('routes.home')}>
          <div className="header-brand-block">
            <p className="eyebrow">{t('pokedex')}</p>
            <div className="header-brand-title-row">
              {isDarkMode ? (
                <img
                  src="/poke-purple.png"
                  className="pokeball-logo-image"
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <span className="pokeball-logo" aria-hidden="true" />
              )}
              <h1>{t('appTitle')}</h1>
            </div>
          </div>
        </Link>

        <nav className="route-nav" aria-label={t('routes.navigation')}>
          <Link
            to="/pokedex"
            className="route-nav-link"
            activeProps={{ className: 'route-nav-link active' }}
          >
            {t('routes.pokedex')}
          </Link>
          <Link
            to="/intel"
            className="route-nav-link"
            activeProps={{ className: 'route-nav-link active' }}
          >
            {t('routes.intel')}
          </Link>
          <Link
            to="/battle-lab"
            className="route-nav-link"
            activeProps={{ className: 'route-nav-link active' }}
          >
            {t('routes.battleLab')}
          </Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode((prev) => !prev)} />
        </div>
      </header>

      <Outlet />
    </main>
  );
}
