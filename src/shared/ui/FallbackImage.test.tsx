import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import FallbackImage from './FallbackImage';

describe('FallbackImage', () => {
  it('switches to fallback only once and notifies resolved source change', () => {
    const onResolvedSrcChange = vi.fn();

    render(
      <FallbackImage
        src="/primary.png"
        fallbackSrc="/fallback.png"
        alt="Pokemon"
        onResolvedSrcChange={onResolvedSrcChange}
      />,
    );

    const image = screen.getByAltText('Pokemon') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe('/primary.png');

    fireEvent.error(image);

    expect(image.getAttribute('src')).toBe('/fallback.png');
    expect(onResolvedSrcChange).toHaveBeenCalledWith('/fallback.png');

    fireEvent.error(image);

    expect(image.getAttribute('src')).toBe('/fallback.png');
    expect(onResolvedSrcChange).toHaveBeenCalledTimes(1);
  });

  it('resets fallback state when src prop changes', () => {
    const onResolvedSrcChange = vi.fn();

    const { rerender } = render(
      <FallbackImage
        src="/first.png"
        fallbackSrc="/fallback.png"
        alt="Pokemon"
        onResolvedSrcChange={onResolvedSrcChange}
      />,
    );

    const image = screen.getByAltText('Pokemon') as HTMLImageElement;

    fireEvent.error(image);
    expect(image.getAttribute('src')).toBe('/fallback.png');

    rerender(
      <FallbackImage
        src="/second.png"
        fallbackSrc="/fallback.png"
        alt="Pokemon"
        onResolvedSrcChange={onResolvedSrcChange}
      />,
    );

    expect(image.getAttribute('src')).toBe('/second.png');

    fireEvent.error(image);

    expect(image.getAttribute('src')).toBe('/fallback.png');
    expect(onResolvedSrcChange).toHaveBeenCalledTimes(2);
  });
});
