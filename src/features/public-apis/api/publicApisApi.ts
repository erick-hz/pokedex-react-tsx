import { fetchPokemonDetails } from '@features/pokemon/api/pokemonApi'

import type {
  PokemonBattleIntelResponse,
  PokemonCompanionDataResponse,
  PokemonEvolutionChainResponse,
  PokemonSpeciesResponse,
} from '../model/types'

type LocalizedNameResponse = {
  names: Array<{
    name: string
    language: {
      name: string
    }
  }>
}

type TypeDetailResponse = {
  names: Array<{
    name: string
    language: {
      name: string
    }
  }>
  damage_relations: {
    double_damage_from: Array<{ name: string }>
    half_damage_from: Array<{ name: string }>
    no_damage_from: Array<{ name: string }>
  }
}

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

function getLocalizedName(
  names: LocalizedNameResponse['names'],
  language: string,
  fallback: string,
) {
  const lang = getLanguageCode(language)

  return (
    names.find((entry) => entry.language.name === lang)?.name ??
    names.find((entry) => entry.language.name === 'en')?.name ??
    fallback
  )
}

async function fetchLocalizedResourceName(
  url: string | undefined,
  language: string,
  fallback: string,
) {
  if (!url) {
    return fallback
  }

  const resource = await fetchJson<LocalizedNameResponse>(url)

  return getLocalizedName(resource.names, language, fallback)
}

async function localizeTypeNames(names: string[], language: string) {
  if (names.length === 0) {
    return []
  }

  const localizedEntries = await Promise.all(
    names.map(async (typeName) => {
      const detail = await fetchJson<TypeDetailResponse>(`https://pokeapi.co/api/v2/type/${typeName}`)

      return getLocalizedName(detail.names, language, titleCasePokemonName(typeName))
    }),
  )

  return localizedEntries
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

export async function fetchPokemonCompanionData(
  name: string,
  language = 'en',
): Promise<PokemonCompanionDataResponse> {
  const species = await fetchPokemonSpeciesData(name)
  const evolutionChain = await fetchJson<PokemonEvolutionChainResponse>(species.evolution_chain.url)
  const lang = getLanguageCode(language)

  const [habitatLabel, generationLabel, colorLabel] = await Promise.all([
    fetchLocalizedResourceName(
      species.habitat?.url,
      language,
      species.habitat?.name ?? 'Unknown',
    ),
    fetchLocalizedResourceName(species.generation.url, language, species.generation.name),
    fetchLocalizedResourceName(species.color.url, language, species.color.name),
  ])

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
    habitatLabel,
    generationLabel,
    colorLabel,
  }
}

export async function fetchPokemonBattleIntel(
  name: string,
  language = 'en',
): Promise<PokemonBattleIntelResponse> {
  const pokemon = await fetchPokemonDetails(name, language)

  const damageRelationsList = await Promise.all(
    pokemon.types.map(async (typeEntry) => {
      const response = await fetchJson<TypeDetailResponse>(`https://pokeapi.co/api/v2/type/${typeEntry.type.name}`)

      return {
        damageRelations: response.damage_relations,
        localizedName: getLocalizedName(
          response.names,
          language,
          titleCasePokemonName(typeEntry.type.name),
        ),
      }
    }),
  )

  const weaknesses = new Set<string>()
  const resistances = new Set<string>()
  const immunities = new Set<string>()

  for (const relation of damageRelationsList) {
    relation.damageRelations.double_damage_from.forEach((entry) => weaknesses.add(entry.name))
    relation.damageRelations.half_damage_from.forEach((entry) => resistances.add(entry.name))
    relation.damageRelations.no_damage_from.forEach((entry) => immunities.add(entry.name))
  }

  const [weaknessesLocalized, resistancesLocalized, immunitiesLocalized] = await Promise.all([
    localizeTypeNames(Array.from(weaknesses), language),
    localizeTypeNames(Array.from(resistances), language),
    localizeTypeNames(Array.from(immunities), language),
  ])

  return {
    types: damageRelationsList.map((entry) => entry.localizedName),
    weaknesses: weaknessesLocalized,
    resistances: resistancesLocalized,
    immunities: immunitiesLocalized,
  }
}