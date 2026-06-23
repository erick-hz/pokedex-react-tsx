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
  color: {
    name: string
  }
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
  habitat: {
    name: string
  } | null
  is_legendary: boolean
  is_mythical: boolean
  generation: {
    name: string
  }
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