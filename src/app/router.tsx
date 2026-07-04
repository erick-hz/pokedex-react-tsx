import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { BattleLabPage } from '@app/routes/BattleLabPage';
import { HomePage } from '@app/routes/HomePage';
import { NotFoundPage } from '@app/routes/NotFoundPage';
import { PokedexPage } from '@app/routes/PokedexPage';
import { PokemonIntelPage } from '@app/routes/PokemonIntelPage';
import { PokemonSpotlightPage } from '@app/routes/PokemonSpotlightPage';
import { RootLayout } from '@app/routes/RootLayout';
import { battleLabSearchValidator, pokemonSearchValidator } from '@app/routes/searchValidators';

const ResumeGeneratorPage = lazyRouteComponent(
  () => import('@app/routes/ResumeGeneratorPage'),
  'ResumeGeneratorPage',
);

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const pokedexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pokedex',
  validateSearch: pokemonSearchValidator,
  component: PokedexPage,
});

const pokemonSpotlightRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pokedex/$pokemonName',
  component: PokemonSpotlightPage,
});

const intelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/intel',
  validateSearch: pokemonSearchValidator,
  component: PokemonIntelPage,
});

const battleLabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battle-lab',
  validateSearch: battleLabSearchValidator,
  component: BattleLabPage,
});

const resumeGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resume-generator',
  component: ResumeGeneratorPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  pokedexRoute,
  pokemonSpotlightRoute,
  intelRoute,
  battleLabRoute,
  resumeGeneratorRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
