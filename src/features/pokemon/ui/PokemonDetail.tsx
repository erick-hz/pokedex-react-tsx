import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePokemonDetails } from '@features/pokemon/model/hooks';
import { PokemonHoloCard, SectionCard } from '@shared/ui';
import { StatCard } from '@shared/ui';

type PokemonDetailProps = {
  selectedPokemon: string;
};

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP. ATK',
  'special-defense': 'SP. DEF',
  speed: 'SPD',
};

const getStatColor = (value: number) => {
  if (value < 50) return '#ef4444';
  if (value < 80) return '#f59e0b';
  if (value < 120) return '#eab308';

  return '#22c55e';
};

export function PokemonDetail({ selectedPokemon }: PokemonDetailProps) {
  const { t } = useTranslation();
  const { data, isLoading } = usePokemonDetails(selectedPokemon);

  const stats = useMemo(() => {
    if (!data) return [];

    return [
      { label: t('height'), value: `${data.height / 10} m` },
      { label: t('weight'), value: `${data.weight / 10} kg` },
      {
        label: t('types'),
        value: data.types.map(({ type }) => type.name).join(', '),
      },
      { label: t('baseXp'), value: String(data.base_experience ?? '—') },
    ];
  }, [data, t]);

  const pokemonImage =
    data?.sprites.other?.['official-artwork']?.front_default ?? data?.sprites.front_default ?? '';

  return (
    <SectionCard eyebrow={t('profile')} title={data?.displayName ?? 'Pokémon'}>
      {isLoading ? (
        <p>{t('loadingDetails')}</p>
      ) : data ? (
        <>
          <div>
            <div className="pokemon-card-visual">
              {pokemonImage ? (
                <PokemonHoloCard image={pokemonImage} name={data.displayName ?? data.name} />
              ) : (
                <div className="pokemon-image placeholder">{t('noImage')}</div>
              )}
            </div>

            <div className="stats-row pokemon-stats">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>

          <div className="stats-panel">
            {data.stats.map((entry) => (
              <div key={entry.stat.name} className="stat-bar-row">
                <span className="stat-name">{statLabels[entry.stat.name] ?? entry.stat.name}</span>

                <div className="stat-bar">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${Math.min((entry.base_stat / 255) * 100, 100)}%`,
                      background: getStatColor(entry.base_stat),
                    }}
                  />
                </div>

                <strong className="stat-value">{entry.base_stat}</strong>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </SectionCard>
  );
}
