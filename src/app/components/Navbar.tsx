import { HeaderBrand } from './navbar/HeaderBrand';
import { NavigationLinks } from './navbar/NavigationLinks';
import { HeaderActions } from './navbar/HeaderActions';

type NavbarProps = {
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export function Navbar({ isDarkMode, onToggleTheme }: NavbarProps) {
  return (
    <header className="gateway-header gateway-header--router">
      <HeaderBrand isDarkMode={isDarkMode} />
      <NavigationLinks />
      <HeaderActions isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
    </header>
  );
}
