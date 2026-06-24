export interface NamedApiResource {
  name: string
  url: string
}

export interface PokemonFlavorTextEntry {
  flavor_text: string
  language: {
    name: string
  }
  version: {
    name: string
  }
}

export interface PokemonSpeciesResponse {
  capture_rate: number
  color: NamedApiResource
  evolution_chain: {
    url: string
  }
  flavor_text_entries: PokemonFlavorTextEntry[]
  genera: Array<{
    genus: string
    language: {
      name: string
    }
  }>
  habitat: NamedApiResource | null
  is_legendary: boolean
  is_mythical: boolean
  generation: NamedApiResource
}

export interface PokemonEvolutionChainNode {
  species: {
    name: string
  }
  evolves_to: PokemonEvolutionChainNode[]
}

export interface PokemonEvolutionChainResponse {
  chain: PokemonEvolutionChainNode
}

export interface PokemonBattleIntelResponse {
  types: string[]
  weaknesses: string[]
  resistances: string[]
  immunities: string[]
}

export interface PokemonCompanionDataResponse {
  flavorText: string
  genus: string
  species: PokemonSpeciesResponse
  evolutionLine: string[]
  habitatLabel: string
  generationLabel: string
  colorLabel: string
}