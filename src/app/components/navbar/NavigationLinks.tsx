import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

type NavRoute = {
  path: string;
  labelKey: string;
};

const ROUTES: NavRoute[] = [
  { path: '/pokedex', labelKey: 'routes.pokedex' },
  { path: '/intel', labelKey: 'routes.intel' },
  { path: '/battle-lab', labelKey: 'routes.battleLab' },
  { path: '/resume-generator', labelKey: 'routes.resumeGenerator' },
];

export function NavigationLinks() {
  const { t } = useTranslation();

  return (
    <nav className="route-nav" aria-label={t('routes.navigation')}>
      {ROUTES.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className="route-nav-link"
          activeProps={{ className: 'route-nav-link active' }}
        >
          {t(route.labelKey)}
        </Link>
      ))}
    </nav>
  );
}
