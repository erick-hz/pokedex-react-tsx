import { useTranslation } from 'react-i18next';

import { PokemonDetail } from '@features/pokemon';
import { PublicApisDashboard } from '@features/public-apis';
import { RouteActionLink } from '@shared/ui';
import { useParams } from '@tanstack/react-router';

export function PokemonSpotlightPage() {
  const { t } = useTranslation();
  const { pokemonName } = useParams({ from: '/pokedex/$pokemonName' });

  return (
    <section className="section-stack route-spotlight-stack">
      <div className="route-inline-actions">
        <RouteActionLink to="/pokedex" search={{ pokemon: pokemonName }}>
          {t('routes.actions.backToList')}
        </RouteActionLink>
        <RouteActionLink to="/intel" search={{ pokemon: pokemonName }}>
          {t('routes.actions.openIntel')}
        </RouteActionLink>
      </div>

      <PokemonDetail selectedPokemon={pokemonName} />
      <PublicApisDashboard selectedPokemon={pokemonName} />
    </section>
  );
}
