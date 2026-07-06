import { useTranslation } from 'react-i18next';

import { PokemonDetail } from '@features/pokemon';
import { PublicApisDashboard } from '@features/public-apis';
import { ActionGroup, RouteActionLink } from '@shared/ui';
import { useParams } from '@tanstack/react-router';

export function PokemonSpotlightPage() {
  const { t } = useTranslation();
  const { pokemonName } = useParams({ from: '/pokedex/$pokemonName' });

  return (
    <section className="section-stack route-spotlight-stack">
      <ActionGroup>
        <RouteActionLink to="/pokedex" search={{ pokemon: pokemonName }}>
          {t('routes.actions.backToList')}
        </RouteActionLink>
        <RouteActionLink to="/intel" search={{ pokemon: pokemonName }}>
          {t('routes.actions.openIntel')}
        </RouteActionLink>
      </ActionGroup>

      <PokemonDetail selectedPokemon={pokemonName} />
      <PublicApisDashboard selectedPokemon={pokemonName} />
    </section>
  );
}
