export type PokemonSearch = {
  pokemon?: string;
};

export type BattleLabSearch = {
  pokemon?: string;
  rival?: string;
};

const sanitizePokemonName = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const cleanValue = value.trim().toLowerCase();

  return cleanValue.length > 0 ? cleanValue : undefined;
};

export const pokemonSearchValidator = (search: Record<string, unknown>): PokemonSearch => ({
  pokemon: sanitizePokemonName(search.pokemon),
});

export const battleLabSearchValidator = (search: Record<string, unknown>): BattleLabSearch => ({
  pokemon: sanitizePokemonName(search.pokemon),
  rival: sanitizePokemonName(search.rival),
});
