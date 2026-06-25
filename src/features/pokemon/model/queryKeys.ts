export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  list: (language: string) => [...pokemonKeys.lists(), language] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (name: string, language: string) => [...pokemonKeys.details(), name, language] as const,
};
