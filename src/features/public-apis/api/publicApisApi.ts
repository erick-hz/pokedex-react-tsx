import { fetchPokemonDetails } from '@features/pokemon/api/pokemonApi'

import type {
  PokemonBattleIntelResponse,
  PokemonEvolutionChainResponse,
  PokemonSpeciesResponse,
} from '../model/types'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

function getLanguageCode(language: string) {
  if (language.startsWith('es')) return 'es'
  if (language.startsWith('ja')) return 'ja'

  return 'en'
}

function normalizePokemonName(name: string) {
  return name.replaceAll('-', ' ')
}

function titleCasePokemonName(name: string) {
  return normalizePokemonName(name)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function fetchPokemonSpeciesData(
  name: string,
): Promise<PokemonSpeciesResponse> {
  return fetchJson<PokemonSpeciesResponse>(
    `https://pokeapi.co/api/v2/pokemon-species/${name}`,
  )
}

async function collectLocalizedEvolutionNames(
  node: PokemonEvolutionChainResponse['chain'],
  language: string,
): Promise<string[]> {
  const localizedSpecies = await fetchPokemonSpeciesData(node.species.name)
  const lang = getLanguageCode(language)

  const currentName =
    localizedSpecies.genera.find((entry) => entry.language.name === lang)?.genus ??
    localizedSpecies.genera.find((entry) => entry.language.name === 'en')?.genus ??
    titleCasePokemonName(node.species.name)

  if (node.evolves_to.length === 0) {
    return [currentName]
  }

  const evolvedNames = await Promise.all(
    node.evolves_to.map((child) => collectLocalizedEvolutionNames(child, language)),
  )

  return [currentName, ...evolvedNames.flat()]
}

export async function fetchPokemonCompanionData(name: string, language = 'en') {
  const species = await fetchPokemonSpeciesData(name)
  const evolutionChain = await fetchJson<PokemonEvolutionChainResponse>(species.evolution_chain.url)
  const lang = getLanguageCode(language)

  return {
    flavorText:
      species.flavor_text_entries.find((entry) => entry.language.name === lang)?.flavor_text ??
      species.flavor_text_entries.find((entry) => entry.language.name === 'en')?.flavor_text ??
      species.flavor_text_entries[0]?.flavor_text ??
      '',
    genus:
      species.genera.find((entry) => entry.language.name === lang)?.genus ??
      species.genera.find((entry) => entry.language.name === 'en')?.genus ??
      titleCasePokemonName(name),
    species,
    evolutionLine: await collectLocalizedEvolutionNames(evolutionChain.chain, language),
  }
}

export async function fetchPokemonBattleIntel(
  name: string,
  language = 'en',
): Promise<PokemonBattleIntelResponse> {
  const pokemon = await fetchPokemonDetails(name, language)

  const damageRelationsList = await Promise.all(
    pokemon.types.map(async (typeEntry) => {
      const response = await fetchJson<{
        damage_relations: {
          double_damage_from: Array<{ name: string }>
          half_damage_from: Array<{ name: string }>
          no_damage_from: Array<{ name: string }>
        }
      }>(`https://pokeapi.co/api/v2/type/${typeEntry.type.name}`)

      return response.damage_relations
    }),
  )

  const weaknesses = new Set<string>()
  const resistances = new Set<string>()
  const immunities = new Set<string>()

  for (const damageRelations of damageRelationsList) {
    damageRelations.double_damage_from.forEach((entry) => weaknesses.add(entry.name))
    damageRelations.half_damage_from.forEach((entry) => resistances.add(entry.name))
    damageRelations.no_damage_from.forEach((entry) => immunities.add(entry.name))
  }

  return {
    types: pokemon.types.map((entry) => titleCasePokemonName(entry.type.name)),
    weaknesses: Array.from(weaknesses).map(titleCasePokemonName),
    resistances: Array.from(resistances).map(titleCasePokemonName),
    immunities: Array.from(immunities).map(titleCasePokemonName),
  }
}