import { useNavigate, useSearch } from '@tanstack/react-router';

import { PokemonList } from '@features/pokemon';
import { PublicApisDashboard } from '@features/public-apis';

export function PokemonIntelPage() {
  const navigate = useNavigate({ from: '/intel' });
  const search = useSearch({ from: '/intel' });

  const selectedPokemon = search.pokemon ?? 'eevee';

  return (
    <section className="section-stack route-intel-grid">
      <PokemonList
        selectedPokemon={selectedPokemon}
        onSelectPokemon={(pokemonName) =>
          void navigate({
            search: (prev) => ({ ...prev, pokemon: pokemonName }),
            replace: true,
          })
        }
      />

      <PublicApisDashboard selectedPokemon={selectedPokemon} />
    </section>
  );
}
