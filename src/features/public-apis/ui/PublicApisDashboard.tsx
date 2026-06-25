import { useTranslation } from 'react-i18next';

import { usePokemonBattleIntel, usePokemonCompanionData } from '@features/public-apis/model/hooks';

import { PublicApiCard } from '@features/public-apis/ui/PublicApiCard';

type PublicApisDashboardProps = {
  selectedPokemon: string;
};

function formatList(items: string[]) {
  return items.length > 0 ? items.join(' · ') : '';
}

function formatStatLabel(label: string, value: string | number) {
  return `${label}: ${value}`;
}

export function PublicApisDashboard({ selectedPokemon }: PublicApisDashboardProps) {
  const { t } = useTranslation();

  const companionQuery = usePokemonCompanionData(selectedPokemon);
  const battleQuery = usePokemonBattleIntel(selectedPokemon);

  const species = companionQuery.data?.species;
  const flavorText = companionQuery.data?.flavorText ?? '';
  const genus = companionQuery.data?.genus ?? selectedPokemon;
  const habitat = companionQuery.data?.habitatLabel ?? t('publicApis.unknown');
  const generation = companionQuery.data?.generationLabel ?? t('publicApis.unknown');
  const color = companionQuery.data?.colorLabel ?? t('publicApis.unknown');

  return (
    <section className="public-apis-grid" aria-label={t('publicApis.title')}>
      <PublicApiCard
        eyebrow={t('publicApis.lore.eyebrow')}
        title={t('publicApis.lore.title')}
        description={t('publicApis.lore.description')}
        loadingLabel={t('loading')}
        isLoading={companionQuery.isLoading}
        error={companionQuery.error ? t('publicApis.error') : null}
      >
        <blockquote className="public-api-quote">
          {flavorText.replaceAll(/\s+/g, ' ').trim()}
        </blockquote>
        <p className="public-api-source">{genus}</p>
        <p className="public-api-source">{formatStatLabel(t('publicApis.habitat'), habitat)}</p>
      </PublicApiCard>

      <PublicApiCard
        eyebrow={t('publicApis.evolution.eyebrow')}
        title={t('publicApis.evolution.title')}
        description={t('publicApis.evolution.description')}
        loadingLabel={t('loading')}
        isLoading={companionQuery.isLoading}
        error={companionQuery.error ? t('publicApis.error') : null}
      >
        <p className="public-api-highlight">
          {companionQuery.data?.evolutionLine.join(' → ') ?? t('publicApis.loadingLine')}
        </p>
        <p className="public-api-source">
          {formatStatLabel(t('publicApis.generation'), generation)}
        </p>
      </PublicApiCard>

      <PublicApiCard
        eyebrow={t('publicApis.battle.eyebrow')}
        title={t('publicApis.battle.title')}
        description={t('publicApis.battle.description')}
        loadingLabel={t('loading')}
        isLoading={battleQuery.isLoading}
        error={battleQuery.error ? t('publicApis.error') : null}
      >
        <p className="public-api-highlight">{formatList(battleQuery.data?.types ?? [])}</p>
        <div className="public-api-chip-list">
          <span className="public-api-chip">
            {t('publicApis.weakTo')}:{' '}
            {formatList(battleQuery.data?.weaknesses ?? []) || t('publicApis.none')}
          </span>
          <span className="public-api-chip">
            {t('publicApis.resists')}:{' '}
            {formatList(battleQuery.data?.resistances ?? []) || t('publicApis.none')}
          </span>
          <span className="public-api-chip">
            {t('publicApis.immuneTo')}:{' '}
            {formatList(battleQuery.data?.immunities ?? []) || t('publicApis.none')}
          </span>
        </div>
      </PublicApiCard>

      <PublicApiCard
        eyebrow={t('publicApis.profile.eyebrow')}
        title={t('publicApis.profile.title')}
        description={t('publicApis.profile.description')}
        loadingLabel={t('loading')}
        isLoading={companionQuery.isLoading}
        error={companionQuery.error ? t('publicApis.error') : null}
      >
        <p className="public-api-source">
          {formatStatLabel(
            t('publicApis.captureRate'),
            species?.capture_rate ?? t('publicApis.unknown'),
          )}
        </p>
        <p className="public-api-source">{formatStatLabel(t('publicApis.color'), color)}</p>
        <p className="public-api-source">
          {formatStatLabel(t('publicApis.legendary'), species?.is_legendary ? t('yes') : t('no'))}
        </p>
        <p className="public-api-source">
          {formatStatLabel(t('publicApis.mythical'), species?.is_mythical ? t('yes') : t('no'))}
        </p>
      </PublicApiCard>
    </section>
  );
}
