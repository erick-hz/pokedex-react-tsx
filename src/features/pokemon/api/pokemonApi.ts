import type {
  PokemonDetails,
  PokemonListResponse,
  PokemonSpeciesData,
} from '@features/pokemon/model/types';
import { requestJson } from '@shared/logging/httpClient';

const BASE_URL = 'https://pokeapi.co/api/v2';

function getLanguageCode(language: string): string {
  if (language.startsWith('es')) return 'es';
  if (language.startsWith('ja')) return 'ja';

  return 'en';
}

export async function fetchPokemonList(limit = 100): Promise<PokemonListResponse> {
  return requestJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}`,
    undefined,
    'pokemonApi',
  );
}

export async function fetchPokemonSpecies(name: string): Promise<PokemonSpeciesData> {
  return requestJson<PokemonSpeciesData>(
    `${BASE_URL}/pokemon-species/${name}`,
    undefined,
    'pokemonApi',
  );
}

export async function fetchPokemonListWithNames(
  limit = 100,
  language = 'en',
): Promise<PokemonListResponse> {
  const list = await fetchPokemonList(limit);
  const lang = getLanguageCode(language);

  const results = await Promise.all(
    list.results.map(async (item) => {
      const species = await fetchPokemonSpecies(item.name);

      const localizedName =
        species.names.find((entry) => entry.language.name === lang)?.name ??
        species.names.find((entry) => entry.language.name === 'en')?.name ??
        item.name;

      return {
        ...item,
        displayName: localizedName,
      };
    }),
  );

  return {
    ...list,
    results,
  };
}

export async function fetchPokemonDetails(name: string, language = 'en'): Promise<PokemonDetails> {
  const pokemon = await requestJson<PokemonDetails>(
    `${BASE_URL}/pokemon/${name}`,
    undefined,
    'pokemonApi',
  );
  const speciesUrl = pokemon.species?.url ?? `${BASE_URL}/pokemon-species/${name}`;
  const species = await requestJson<PokemonSpeciesData>(speciesUrl, undefined, 'pokemonApi');

  const lang = getLanguageCode(language);

  const localizedName =
    species.names.find((entry) => entry.language.name === lang)?.name ??
    species.names.find((entry) => entry.language.name === 'en')?.name ??
    pokemon.name;

  return {
    ...pokemon,
    displayName: localizedName,
  };
}
