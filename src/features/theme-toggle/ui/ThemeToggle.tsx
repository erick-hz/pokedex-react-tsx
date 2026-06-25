import { useId } from 'react';
import { useTranslation } from 'react-i18next';

type ThemeToggleProps = {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
};

export default function ThemeToggle({ isDarkMode, onToggle, className }: ThemeToggleProps) {
  const { t } = useTranslation();

  const labelId = useId();

  const label = isDarkMode ? t('theme.lightMode', 'Light mode') : t('theme.darkMode', 'Dark mode');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      aria-labelledby={labelId}
      onClick={onToggle}
      className={['theme-toggle-btn', isDarkMode && 'theme-toggle-btn--dark', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="theme-toggle-btn__icon">
        {isDarkMode ? '🌞' : '🌙'}
      </span>

      <span id={labelId} className="theme-toggle-btn__label">
        {label}
      </span>
    </button>
  );
}
