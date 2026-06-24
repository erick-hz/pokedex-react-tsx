import { useEffect, useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@features/language-switcher'
import { ThemeToggle } from '@features/theme-toggle'

export function RootLayout() {
  const { t } = useTranslation()
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const savedTheme = window.localStorage.getItem('theme')

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme === 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <main className="pokedex-shell">
      <header className="gateway-header gateway-header--router">
        <div className="header-brand-block">
          <p className="eyebrow">{t('pokedex')}</p>
          <h1>{t('appTitle')}</h1>
        </div>

        <nav className="route-nav" aria-label={t('routes.navigation')}>
          <Link to="/" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
            {t('routes.home')}
          </Link>
          <Link to="/pokedex" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
            {t('routes.pokedex')}
          </Link>
          <Link to="/intel" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
            {t('routes.intel')}
          </Link>
          <Link to="/battle-lab" className="route-nav-link" activeProps={{ className: 'route-nav-link active' }}>
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
  )
}
