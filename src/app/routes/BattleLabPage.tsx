import { useTranslation } from 'react-i18next';

import { PokemonDetail, PokemonList, usePokemonList } from '@features/pokemon';
import { RouteActionLink, RoutePillButton, SectionCard } from '@shared/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';

export function BattleLabPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: '/battle-lab' });
  const search = useSearch({ from: '/battle-lab' });
  const rivalListQuery = usePokemonList();

  const selectedPokemon = search.pokemon ?? 'pikachu';
  const rivalPokemon = search.rival ?? 'charizard';

  const rivalCandidates = rivalListQuery.data?.results.slice(0, 8) ?? [];

  return (
    <section className="section-stack route-battle-stack">
      <SectionCard eyebrow={t('routes.battleLab')} title={t('battleLab.title')}>
        <div className="route-inline-actions">
          <RouteActionLink to="/pokedex" search={{ pokemon: selectedPokemon }}>
            {t('battleLab.editChallenger')}
          </RouteActionLink>

          {rivalCandidates.map((rival) => (
            <RoutePillButton
              key={rival.name}
              className={rivalPokemon === rival.name ? 'active' : ''}
              onClick={() =>
                void navigate({
                  search: (prev) => ({ ...prev, rival: rival.name }),
                  replace: true,
                })
              }
            >
              {rival.displayName ?? rival.name}
            </RoutePillButton>
          ))}
        </div>
      </SectionCard>

      <section className="route-battle-grid">
        <PokemonList
          selectedPokemon={selectedPokemon}
          onSelectPokemon={(pokemonName) =>
            void navigate({
              search: (prev) => ({ ...prev, pokemon: pokemonName }),
              replace: true,
            })
          }
        />

        <div className="route-battle-duel">
          <PokemonDetail selectedPokemon={selectedPokemon} />
          <PokemonDetail selectedPokemon={rivalPokemon} />
        </div>
      </section>
    </section>
  );
}
