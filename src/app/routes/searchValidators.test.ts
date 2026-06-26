import { battleLabSearchValidator, pokemonSearchValidator } from '@app/routes/searchValidators';

describe('search validators', () => {
  it('sanitizes pokemon search names', () => {
    expect(pokemonSearchValidator({ pokemon: '  Pikachu  ' })).toEqual({
      pokemon: 'pikachu',
    });
  });

  it('returns undefined when pokemon search is invalid', () => {
    expect(pokemonSearchValidator({ pokemon: '   ' })).toEqual({
      pokemon: undefined,
    });
    expect(pokemonSearchValidator({ pokemon: 123 })).toEqual({
      pokemon: undefined,
    });
  });

  it('sanitizes both battle lab fields', () => {
    expect(battleLabSearchValidator({ pokemon: '  Eevee', rival: '  CHARIZARD ' })).toEqual({
      pokemon: 'eevee',
      rival: 'charizard',
    });
  });
});
