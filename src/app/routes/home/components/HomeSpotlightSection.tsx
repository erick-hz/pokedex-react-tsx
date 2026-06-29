import type { HomePageModel } from '@app/routes/home/useHomePageModel';
import {
  CopyBlock,
  FallbackImage,
  RouteActionButton,
  RouteActionLink,
  SectionCard,
  StatCard,
} from '@shared/ui';

type HomeSpotlightSectionProps = Pick<
  HomePageModel,
  | 't'
  | 'i18n'
  | 'spotlightCandidates'
  | 'selectedSpotlight'
  | 'effectiveFeaturedPokemon'
  | 'localizedClock'
  | 'greetingKey'
  | 'spotlightImage'
  | 'randomizeSpotlight'
  | 'updateRouteActivity'
  | 'pushRecentSpotlight'
>;

function SpotlightMetricRow({
  t,
  i18n,
  spotlightCandidates,
}: Pick<HomeSpotlightSectionProps, 't' | 'i18n' | 'spotlightCandidates'>) {
  const languageKey = i18n.language.startsWith('es')
    ? 'spanish'
    : i18n.language.startsWith('ja')
      ? 'japanese'
      : 'english';

  return (
    <div className="route-metric-row">
      <StatCard
        label={t('homeDynamic.metrics.loaded')}
        value={spotlightCandidates.length}
        className="route-metric-card"
      />
      <StatCard
        label={t('homeDynamic.metrics.language')}
        value={t(languageKey)}
        className="route-metric-card"
      />
      <StatCard label={t('homeDynamic.metrics.routes')} value="4" className="route-metric-card" />
    </div>
  );
}

export function HomeSpotlightSection({
  t,
  i18n,
  spotlightCandidates,
  selectedSpotlight,
  effectiveFeaturedPokemon,
  localizedClock,
  greetingKey,
  spotlightImage,
  randomizeSpotlight,
  updateRouteActivity,
  pushRecentSpotlight,
}: HomeSpotlightSectionProps) {
  const featuredName = selectedSpotlight?.displayName ?? effectiveFeaturedPokemon;

  return (
    <SectionCard
      eyebrow={t('homeDynamic.eyebrow')}
      title={t('homeDynamic.title', { name: featuredName })}
      className="route-home-live"
    >
      <div className="route-live-header">
        <p className="route-live-greeting">{t(greetingKey)}</p>
        <span className="route-live-clock">{localizedClock}</span>
      </div>

      <div className="route-live-grid">
        <article className="route-live-media">
          {spotlightImage ? (
            <FallbackImage
              src={spotlightImage}
              alt={featuredName}
              className="route-live-image"
              loading="lazy"
            />
          ) : (
            <div className="route-live-placeholder">{t('noImage')}</div>
          )}
        </article>

        <div className="route-live-content">
          <CopyBlock className="route-home-copy">{t('homeDynamic.subtitle')}</CopyBlock>

          <div className="route-home-actions">
            <RouteActionButton type="button" tone="primary" onClick={randomizeSpotlight}>
              {t('homeDynamic.randomize')}
            </RouteActionButton>

            <RouteActionLink
              to="/pokedex/$pokemonName"
              params={{ pokemonName: effectiveFeaturedPokemon }}
              className="route-cta-muted"
              onClick={() => {
                updateRouteActivity('spotlight');
                pushRecentSpotlight(effectiveFeaturedPokemon);
              }}
            >
              {t('homeDynamic.openSpotlight')}
            </RouteActionLink>
          </div>

          <SpotlightMetricRow t={t} i18n={i18n} spotlightCandidates={spotlightCandidates} />
        </div>
      </div>
    </SectionCard>
  );
}
