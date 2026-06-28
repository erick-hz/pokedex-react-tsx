import {
  fetchPokemonDetails,
  fetchPokemonList,
  fetchPokemonListWithNames,
} from '@features/pokemon/api/pokemonApi';

type MockResponseData = {
  ok: boolean;
  status: number;
  body: unknown;
};

function createMockResponse({ ok, status, body }: MockResponseData): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('pokemonApi', () => {
  const fetchMock = vi.fn<(input: RequestInfo | URL) => Promise<Response>>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchPokemonList calls pokemon endpoint with limit', async () => {
    const listResponse = {
      results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' }],
    };

    fetchMock.mockResolvedValueOnce(
      createMockResponse({ ok: true, status: 200, body: listResponse }),
    );

    const result = await fetchPokemonList(1);

    expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=1');
    expect(result).toEqual(listResponse);
  });

  it('fetchPokemonListWithNames localizes names and falls back to english', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: {
            results: [
              { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' },
              { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon/133' },
            ],
          },
        }),
      )
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: {
            names: [
              { language: { name: 'es' }, name: 'Pikachu' },
              { language: { name: 'en' }, name: 'Pikachu' },
            ],
          },
        }),
      )
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: {
            names: [{ language: { name: 'en' }, name: 'Eevee' }],
          },
        }),
      );

    const result = await fetchPokemonListWithNames(2, 'es-MX');

    expect(result.results).toEqual([
      {
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25',
        displayName: 'Pikachu',
      },
      {
        name: 'eevee',
        url: 'https://pokeapi.co/api/v2/pokemon/133',
        displayName: 'Eevee',
      },
    ]);
  });

  it('fetchPokemonDetails returns localized displayName', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: {
            id: 25,
            name: 'pikachu',
            species: {
              name: 'pikachu',
              url: 'https://pokeapi.co/api/v2/pokemon-species/25/',
            },
            sprites: { front_default: null },
            types: [{ type: { name: 'electric' } }],
            height: 4,
            weight: 60,
            stats: [{ stat: { name: 'speed' }, base_stat: 90 }],
          },
        }),
      )
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: {
            names: [
              { language: { name: 'ja' }, name: 'Pikachu JP' },
              { language: { name: 'en' }, name: 'Pikachu' },
            ],
          },
        }),
      );

    const details = await fetchPokemonDetails('pikachu', 'ja');

    expect(details.displayName).toBe('Pikachu JP');
  });

  it('fetchPokemonDetails uses canonical species url for alternate forms', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: {
            id: 641,
            name: 'tornadus-incarnate',
            species: {
              name: 'tornadus',
              url: 'https://pokeapi.co/api/v2/pokemon-species/641/',
            },
            sprites: { front_default: null },
            types: [{ type: { name: 'flying' } }],
            height: 15,
            weight: 630,
            stats: [{ stat: { name: 'speed' }, base_stat: 111 }],
          },
        }),
      )
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: {
            names: [{ language: { name: 'en' }, name: 'Tornadus' }],
          },
        }),
      );

    const details = await fetchPokemonDetails('tornadus-incarnate', 'en');

    expect(details.displayName).toBe('Tornadus');
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://pokeapi.co/api/v2/pokemon/tornadus-incarnate',
    );
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://pokeapi.co/api/v2/pokemon-species/641/');
  });

  it('throws when fetch returns a non-ok status', async () => {
    fetchMock.mockResolvedValueOnce(createMockResponse({ ok: false, status: 500, body: {} }));

    await expect(fetchPokemonList()).rejects.toThrow('Request failed: 500');
  });
});
