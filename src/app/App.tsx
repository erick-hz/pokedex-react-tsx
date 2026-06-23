import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './styles/App.css'
import { LanguageSwitcher } from '@features/language-switcher'
import { PokemonDetail, PokemonList } from '@features/pokemon'
import { ThemeToggle } from '@features/theme-toggle'

function App() {
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
  const [selectedPokemon, setSelectedPokemon] = useState('pikachu')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <main className="pokedex-shell">
      <header className="gateway-header">
        <div>
          <p className="eyebrow">{t('pokedex')}</p>
          <h1>{t('appTitle')}</h1>
        </div>
        <div className="header-actions">
          <LanguageSwitcher />
          <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode((prev) => !prev)} />
        </div>
      </header>

      <section className="pokedex-grid">
        <PokemonList selectedPokemon={selectedPokemon} onSelectPokemon={setSelectedPokemon} />
        <PokemonDetail selectedPokemon={selectedPokemon} />
      </section>
    </main>
  )
}

export default App
