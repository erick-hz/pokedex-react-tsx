import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationControls, SectionCard, StatusMessage } from '@shared/ui';
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
          <StatusMessage className="pokemon-loading-text">{t('loadingPokemon')}</StatusMessage>
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
        <PaginationControls
          ariaLabel={t('pokemonPagination.label')}
          className="pokemon-pagination"
          previousButtonClassName="pokemon-pagination-button"
          nextButtonClassName="pokemon-pagination-button"
          statusClassName="pokemon-pagination-text"
          previousLabel={t('pokemonPagination.prev')}
          nextLabel={t('pokemonPagination.next')}
          onPrevious={() => setPage((current) => Math.max(1, Math.min(current, totalPages) - 1))}
          onNext={() =>
            setPage((current) => Math.min(totalPages, Math.min(current, totalPages) + 1))
          }
          isPreviousDisabled={effectivePage === 1}
          isNextDisabled={effectivePage === totalPages}
          status={t('pokemonPagination.page', { current: effectivePage, total: totalPages })}
        />
      ) : null}
    </SectionCard>
  );
}
