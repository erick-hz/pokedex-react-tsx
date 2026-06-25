export const publicApisKeys = {
  all: ['pokedex-companion'] as const,
  companion: (name: string, language: string) =>
    [...publicApisKeys.all, 'companion', name, language] as const,
  battle: (name: string, language: string) =>
    [...publicApisKeys.all, 'battle', name, language] as const,
};
