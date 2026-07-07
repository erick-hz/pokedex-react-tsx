import { LanguageSwitcher } from '@features/language-switcher';
import { ThemeToggle } from '@features/theme-toggle';

type HeaderActionsProps = {
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export function HeaderActions({ isDarkMode, onToggleTheme }: HeaderActionsProps) {
  return (
    <div className="header-actions">
      <LanguageSwitcher />
      <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
    </div>
  );
}
