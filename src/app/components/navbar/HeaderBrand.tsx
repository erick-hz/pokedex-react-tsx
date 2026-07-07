import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

type HeaderBrandProps = {
  isDarkMode: boolean;
};

export function HeaderBrand({ isDarkMode }: HeaderBrandProps) {
  const { t } = useTranslation();

  return (
    <Link to="/" className="header-brand-link" aria-label={t('routes.home')}>
      <div className="header-brand-block">
        <div className="header-brand-title-row">
          {isDarkMode ? (
            <img src="/poke-purple.png" className="pokeball-logo-image" alt="" aria-hidden="true" />
          ) : (
            <span className="pokeball-logo" aria-hidden="true" />
          )}
        </div>
        <p className="eyebrow">{t('pokedex')}</p>
      </div>
    </Link>
  );
}
