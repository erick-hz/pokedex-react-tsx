export interface PokemonListItem {
  name: string;
  url: string;
  displayName?: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
}

export interface PokemonSpeciesName {
  language: {
    name: string;
  };
  name: string;
}

export interface PokemonSpeciesData {
  names: PokemonSpeciesName[];
}

export interface PokemonTypeEntry {
  type: {
    name: string;
  };
}

export interface PokemonStatEntry {
  stat: {
    name: string;
  };
  base_stat: number;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  displayName?: string;
  species?: {
    name: string;
    url: string;
  };
  base_experience?: number;
  sprites: PokemonSprites;
  types: PokemonTypeEntry[];
  height: number;
  weight: number;
  stats: PokemonStatEntry[];
}
