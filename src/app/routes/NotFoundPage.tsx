import { useTranslation } from 'react-i18next';

import { RouteActionLink, SectionCard } from '@shared/ui';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="section-stack">
      <SectionCard eyebrow="404" title={t('routes.notFound.title')}>
        <img
          src="/200w.gif"
          alt="Not found"
          loading="lazy"
          style={{
            maxWidth: '520px',
            width: '100%',
            height: 'auto',
            margin: '0 auto 1rem',
            display: 'block',
          }}
        />
        <p className="route-home-copy">{t('routes.notFound.description')}</p>
        <div className="route-home-actions">
          <RouteActionLink to="/" tone="primary">
            {t('routes.notFound.backHome')}
          </RouteActionLink>
          <RouteActionLink to="/pokedex">{t('routes.notFound.openPokedex')}</RouteActionLink>
        </div>
      </SectionCard>
    </section>
  );
}
