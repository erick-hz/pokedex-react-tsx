import type { HomePageModel } from '@app/routes/home/useHomePageModel';
import { CopyBlock, PokemonPreviewLink, RouteActionButton, SectionCard } from '@shared/ui';

type HomeMissionSectionProps = Pick<
  HomePageModel,
  | 't'
  | 'tipKeys'
  | 'tipIndex'
  | 'recentSpotlightItems'
  | 'recommendedRouteKey'
  | 'goToRoute'
  | 'updateRouteActivity'
>;

function RecentSpotlightGrid({
  t,
  recentSpotlightItems,
  updateRouteActivity,
}: Pick<HomeMissionSectionProps, 't' | 'recentSpotlightItems' | 'updateRouteActivity'>) {
  if (recentSpotlightItems.length === 0) {
    return <span className="route-mission-empty">{t('homeDynamic.recentEmpty')}</span>;
  }

  return (
    <div className="route-recent-grid">
      {recentSpotlightItems.map((pokemon) => (
        <PokemonPreviewLink
          key={pokemon.name}
          to="/pokedex/$pokemonName"
          params={{ pokemonName: pokemon.name }}
          className="route-recent-card"
          name={pokemon.displayName ?? pokemon.name}
          image={pokemon.image}
          placeholder={t('noImage')}
          imageClassName="route-recent-card__image"
          labelClassName="route-recent-card__label"
          placeholderClassName="route-recent-card__placeholder"
          onClick={() => updateRouteActivity('spotlight')}
        />
      ))}
    </div>
  );
}

export function HomeMissionSection({
  t,
  tipKeys,
  tipIndex,
  recentSpotlightItems,
  recommendedRouteKey,
  goToRoute,
  updateRouteActivity,
}: HomeMissionSectionProps) {
  return (
    <SectionCard eyebrow={t('homeDynamic.missionEyebrow')} title={t('homeDynamic.missionTitle')}>
      <div className="route-tip-card">
        <CopyBlock>{t(tipKeys[tipIndex])}</CopyBlock>
      </div>

      <div className="route-mission-grid">
        <article>
          <p className="route-mission-label">{t('homeDynamic.recentTitle')}</p>
          <RecentSpotlightGrid
            t={t}
            recentSpotlightItems={recentSpotlightItems}
            updateRouteActivity={updateRouteActivity}
          />
        </article>

        <article>
          <p className="route-mission-label">{t('homeDynamic.nextMove')}</p>
          <RouteActionButton
            type="button"
            tone="primary"
            onClick={() => {
              if (recommendedRouteKey === 'pokedex') {
                goToRoute('/pokedex', 'pokedex');
                return;
              }

              if (recommendedRouteKey === 'intel') {
                goToRoute('/intel', 'intel');
                return;
              }

              goToRoute('/battle-lab', 'battleLab');
            }}
          >
            {t('homeDynamic.followRecommendation')}
          </RouteActionButton>
        </article>
      </div>
    </SectionCard>
  );
}
