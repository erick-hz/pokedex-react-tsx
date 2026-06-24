import { useTranslation } from 'react-i18next'

import { PokemonDetail, PokemonList } from '@features/pokemon'
import { RouteActionLink } from '@shared/ui'
import { useNavigate, useSearch } from '@tanstack/react-router'

export function PokedexPage() {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/pokedex' })
  const search = useSearch({ from: '/pokedex' })

  const selectedPokemon = search.pokemon ?? 'pikachu'

  return (
    <>
      <section className="pokedex-grid section-stack">
        <PokemonList
          selectedPokemon={selectedPokemon}
          onSelectPokemon={(pokemonName) =>
            void navigate({
              search: (prev) => ({ ...prev, pokemon: pokemonName }),
              replace: true,
            })
          }
        />

        <PokemonDetail selectedPokemon={selectedPokemon} />
      </section>

      <section className="section-stack route-inline-actions">
        <RouteActionLink
          to="/pokedex/$pokemonName"
          params={{ pokemonName: selectedPokemon }}
          tone="primary"
        >
          {t('routes.actions.openSpotlight')}
        </RouteActionLink>
        <RouteActionLink to="/battle-lab" search={{ pokemon: selectedPokemon }}>
          {t('routes.actions.openBattleLab')}
        </RouteActionLink>
      </section>
    </>
  )
}
