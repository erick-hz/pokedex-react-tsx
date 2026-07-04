import { fireEvent, render } from '@testing-library/react';

import PokemonHoloCard from './PokemonHoloCard';

describe('PokemonHoloCard', () => {
  it('updates --front CSS variable after fallback image resolves', () => {
    const { container } = render(
      <PokemonHoloCard image="/primary.png" name="Pikachu" className="custom" />,
    );

    const card = container.querySelector('.pokemon-image-card') as HTMLDivElement;
    const image = container.querySelector('.pokemon-image-card__image') as HTMLImageElement;

    expect(card).toBeTruthy();
    expect(image).toBeTruthy();
    expect(card.style.getPropertyValue('--front')).toBe('url("/primary.png")');

    fireEvent.error(image);

    expect(card.style.getPropertyValue('--front')).toBe('url("/200w.gif")');
  });
});
