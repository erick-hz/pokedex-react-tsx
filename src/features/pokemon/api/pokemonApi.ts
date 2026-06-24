import type {
  PokemonDetails,
  PokemonListResponse,
  PokemonSpeciesData,
} from '@features/pokemon/model/types'

const BASE_URL = 'https://pokeapi.co/api/v2'

function getLanguageCode(language: string): string {
  if (language.startsWith('es')) return 'es'
  if (language.startsWith('ja')) return 'ja'

  return 'en'
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchPokemonList(
  limit = 100,
): Promise<PokemonListResponse> {
  return fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}`,
  )
}

export async function fetchPokemonSpecies(
  name: string,
): Promise<PokemonSpeciesData> {
  return fetchJson<PokemonSpeciesData>(
    `${BASE_URL}/pokemon-species/${name}`,
  )
}

export async function fetchPokemonListWithNames(
  limit = 100,
  language = 'en',
): Promise<PokemonListResponse> {
  const list = await fetchPokemonList(limit)
  const lang = getLanguageCode(language)

  const results = await Promise.all(
    list.results.map(async (item) => {
      const species = await fetchPokemonSpecies(item.name)

      const localizedName =
        species.names.find((entry) => entry.language.name === lang)?.name ??
        species.names.find((entry) => entry.language.name === 'en')?.name ??
        item.name

      return {
        ...item,
        displayName: localizedName,
      }
    }),
  )

  return {
    ...list,
    results,
  }
}

export async function fetchPokemonDetails(
  name: string,
  language = 'en',
): Promise<PokemonDetails> {
  const [pokemon, species] = await Promise.all([
    fetchJson<PokemonDetails>(`${BASE_URL}/pokemon/${name}`),
    fetchJson<PokemonSpeciesData>(`${BASE_URL}/pokemon-species/${name}`),
  ])

  const lang = getLanguageCode(language)

  const localizedName =
    species.names.find((entry) => entry.language.name === lang)?.name ??
    species.names.find((entry) => entry.language.name === 'en')?.name ??
    pokemon.name

  return {
    ...pokemon,
    displayName: localizedName,
  }
}