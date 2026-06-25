import { useTranslation } from 'react-i18next';
import { SectionCard } from '@shared/ui';
import { usePokemonList } from '@features/pokemon/model/hooks';

type PokemonListProps = {
  selectedPokemon: string;
  onSelectPokemon: (name: string) => void;
};

export function PokemonList({ selectedPokemon, onSelectPokemon }: PokemonListProps) {
  const { t } = useTranslation();
  const { data, isLoading } = usePokemonList();

  return (
    <SectionCard eyebrow={t('pokedex')} title={t('selectPokemon')} className="panel-large">
      <div className="pokemon-list">
        {isLoading ? (
          <p>{t('loadingPokemon')}</p>
        ) : (
          data?.results.map((item) => (
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
    </SectionCard>
  );
}
