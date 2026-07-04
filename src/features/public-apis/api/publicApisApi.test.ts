import { fetchPokemonDetails } from '@features/pokemon/api/pokemonApi';
import { requestJson } from '@shared/logging/httpClient';

import { fetchPokemonBattleIntel, fetchPokemonCompanionData } from './publicApisApi';

vi.mock('@shared/logging/httpClient', () => ({
  requestJson: vi.fn(),
}));

vi.mock('@features/pokemon/api/pokemonApi', () => ({
  fetchPokemonDetails: vi.fn(),
}));

describe('publicApisApi', () => {
  const requestJsonMock = vi.mocked(requestJson);
  const fetchPokemonDetailsMock = vi.mocked(fetchPokemonDetails);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('builds evolution line using localized species names instead of genera labels', async () => {
    fetchPokemonDetailsMock.mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      species: {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
      },
      sprites: { front_default: null },
      types: [{ type: { name: 'grass' } }],
      height: 7,
      weight: 69,
      stats: [],
    });

    requestJsonMock.mockImplementation(async (url) => {
      if (url === 'https://pokeapi.co/api/v2/pokemon-species/1/') {
        return {
          capture_rate: 45,
          color: { name: 'green', url: 'https://pokeapi.co/api/v2/pokemon-color/5/' },
          evolution_chain: {
            url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
          },
          flavor_text_entries: [
            {
              flavor_text: 'A strange seed was planted on its back at birth.',
              language: { name: 'en' },
              version: { name: 'red' },
            },
          ],
          names: [{ language: { name: 'en' }, name: 'Bulbasaur' }],
          genera: [{ language: { name: 'en' }, genus: 'Seed Pokemon' }],
          habitat: {
            name: 'grassland',
            url: 'https://pokeapi.co/api/v2/pokemon-habitat/3/',
          },
          is_legendary: false,
          is_mythical: false,
          generation: {
            name: 'generation-i',
            url: 'https://pokeapi.co/api/v2/generation/1/',
          },
        };
      }

      if (url === 'https://pokeapi.co/api/v2/evolution-chain/1/') {
        return {
          chain: {
            species: { name: 'bulbasaur' },
            evolves_to: [
              {
                species: { name: 'ivysaur' },
                evolves_to: [],
              },
            ],
          },
        };
      }

      if (url === 'https://pokeapi.co/api/v2/pokemon-habitat/3/') {
        return { names: [{ language: { name: 'en' }, name: 'Grassland' }] };
      }

      if (url === 'https://pokeapi.co/api/v2/generation/1/') {
        return { names: [{ language: { name: 'en' }, name: 'Generation I' }] };
      }

      if (url === 'https://pokeapi.co/api/v2/pokemon-color/5/') {
        return { names: [{ language: { name: 'en' }, name: 'Green' }] };
      }

      if (url === 'https://pokeapi.co/api/v2/pokemon-species/bulbasaur') {
        return {
          names: [{ language: { name: 'en' }, name: 'Bulbasaur' }],
          genera: [{ language: { name: 'en' }, genus: 'Seed Pokemon' }],
        };
      }

      if (url === 'https://pokeapi.co/api/v2/pokemon-species/ivysaur') {
        return {
          names: [{ language: { name: 'en' }, name: 'Ivysaur' }],
          genera: [{ language: { name: 'en' }, genus: 'Seed Pokemon' }],
        };
      }

      throw new Error(`Unexpected request URL in test: ${url}`);
    });

    const result = await fetchPokemonCompanionData('bulbasaur', 'en');

    expect(result.evolutionLine).toEqual(['Bulbasaur', 'Ivysaur']);
  });

  it('computes dual-type weaknesses/resistances/immunities with multiplier neutralization', async () => {
    fetchPokemonDetailsMock.mockResolvedValue({
      id: 6,
      name: 'charizard',
      species: {
        name: 'charizard',
        url: 'https://pokeapi.co/api/v2/pokemon-species/6/',
      },
      sprites: { front_default: null },
      types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
      height: 17,
      weight: 905,
      stats: [],
    });

    requestJsonMock.mockImplementation(async (url) => {
      if (url === 'https://pokeapi.co/api/v2/type/fire') {
        return {
          names: [{ language: { name: 'en' }, name: 'Fire' }],
          damage_relations: {
            double_damage_from: [{ name: 'water' }, { name: 'rock' }],
            half_damage_from: [{ name: 'grass' }, { name: 'bug' }],
            no_damage_from: [],
          },
        };
      }

      if (url === 'https://pokeapi.co/api/v2/type/flying') {
        return {
          names: [{ language: { name: 'en' }, name: 'Flying' }],
          damage_relations: {
            double_damage_from: [{ name: 'electric' }, { name: 'ice' }, { name: 'rock' }],
            half_damage_from: [{ name: 'grass' }, { name: 'fighting' }, { name: 'bug' }],
            no_damage_from: [{ name: 'ground' }],
          },
        };
      }

      const localizedTypeNames: Record<string, string> = {
        water: 'Water',
        rock: 'Rock',
        electric: 'Electric',
        ice: 'Ice',
        grass: 'Grass',
        bug: 'Bug',
        fighting: 'Fighting',
        ground: 'Ground',
      };

      const typePrefix = 'https://pokeapi.co/api/v2/type/';
      if (url.startsWith(typePrefix)) {
        const typeName = url.slice(typePrefix.length);
        const localized = localizedTypeNames[typeName];

        if (!localized) {
          throw new Error(`Unexpected type lookup in test: ${typeName}`);
        }

        return {
          names: [{ language: { name: 'en' }, name: localized }],
          damage_relations: {
            double_damage_from: [],
            half_damage_from: [],
            no_damage_from: [],
          },
        };
      }

      throw new Error(`Unexpected request URL in test: ${url}`);
    });

    const result = await fetchPokemonBattleIntel('charizard', 'en');

    expect(result.types).toEqual(['Fire', 'Flying']);
    expect(result.weaknesses).toEqual(['Water', 'Rock', 'Electric', 'Ice']);
    expect(result.resistances).toEqual(['Grass', 'Bug', 'Fighting']);
    expect(result.immunities).toEqual(['Ground']);
  });
});
