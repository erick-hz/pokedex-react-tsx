import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type LanguageCode = 'en' | 'es' | 'ja'

type LanguageOption = {
  code: LanguageCode
  labelKey: 'english' | 'spanish' | 'japanese'
  flag: string
}

const LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', labelKey: 'english', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'es', labelKey: 'spanish', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'ja', labelKey: 'japanese', flag: 'https://flagcdn.com/w40/jp.png' },
] as const

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const menuId = useId()

  const currentCode = (i18n.resolvedLanguage?.split('-')[0] ??
    'en') as LanguageCode

  const currentLanguage = useMemo(
    () =>
      LANGUAGES.find((language) => language.code === currentCode) ??
      LANGUAGES[0],
    [currentCode]
  )

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const changeLanguage = useCallback(
    async (language: LanguageCode) => {
      if (language === currentCode) {
        closeMenu()
        return
      }

      await i18n.changeLanguage(language)
      window.localStorage.setItem('language', language)
      closeMenu()

      buttonRef.current?.focus()
    },
    [closeMenu, currentCode, i18n]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeMenu()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu])

  return (
    <div ref={dropdownRef} className="language-dropdown">
      <button
        ref={buttonRef}
        type="button"
        className="language-dropdown-toggle"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={t('language.select', 'Select language')}
      >
        <img
          src={currentLanguage.flag}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={24}
          height={24}
          className="language-dropdown-flag"
        />

        <span className="language-dropdown-text">
          {t(currentLanguage.labelKey)}
        </span>
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('language.options', 'Language options')}
          className="language-dropdown-menu"
        >
          {LANGUAGES.map((language) => {
            const isSelected = currentCode === language.code

            return (
              <button
                key={language.code}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                className={`language-dropdown-option ${
                  isSelected ? 'active' : ''
                }`}
                onClick={() => void changeLanguage(language.code)}
              >
                <img
                  src={language.flag}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={24}
                  height={24}
                  className="language-option-flag"
                />

                <span>{t(language.labelKey)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}