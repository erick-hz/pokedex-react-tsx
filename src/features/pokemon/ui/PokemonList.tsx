import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@shared/ui';
import { usePokemonList } from '@features/pokemon/model/hooks';

type PokemonListProps = {
  selectedPokemon: string;
  onSelectPokemon: (name: string) => void;
};

const POKEMON_PAGE_SIZE = 18;

export function PokemonList({ selectedPokemon, onSelectPokemon }: PokemonListProps) {
  const { t } = useTranslation();
  const { data, isLoading } = usePokemonList();
  const [page, setPage] = useState(1);

  const items = useMemo(() => data?.results ?? [], [data?.results]);
  const totalPages = Math.max(1, Math.ceil(items.length / POKEMON_PAGE_SIZE));
  const effectivePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (effectivePage - 1) * POKEMON_PAGE_SIZE;

    return items.slice(startIndex, startIndex + POKEMON_PAGE_SIZE);
  }, [effectivePage, items]);

  return (
    <SectionCard eyebrow={t('pokedex')} title={t('selectPokemon')} className="panel-large">
      <div className="pokemon-list">
        {isLoading ? (
          <p>{t('loadingPokemon')}</p>
        ) : (
          paginatedItems.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`pokemon-item ${selectedPokemon === item.name ? 'active' : ''}`}
              onClick={() => onSelectPokemon(item.name)}
            >
              {item.displayName ?? item.name}
            </button>
          ))
        )}
      </div>

      {!isLoading && items.length > 0 ? (
        <div className="pokemon-pagination" aria-label={t('pokemonPagination.label')}>
          <button
            type="button"
            className="pokemon-pagination-button"
            disabled={effectivePage === 1}
            onClick={() => setPage((current) => Math.max(1, Math.min(current, totalPages) - 1))}
          >
            {t('pokemonPagination.prev')}
          </button>

          <p className="pokemon-pagination-text">
            {t('pokemonPagination.page', { current: effectivePage, total: totalPages })}
          </p>

          <button
            type="button"
            className="pokemon-pagination-button"
            disabled={effectivePage === totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, Math.min(current, totalPages) + 1))
            }
          >
            {t('pokemonPagination.next')}
          </button>
        </div>
      ) : null}
    </SectionCard>
  );
}
