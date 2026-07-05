import { useRef, type CSSProperties } from 'react';

import FallbackImage from '@shared/ui/FallbackImage';

type PokemonHoloCardProps = {
  image: string;
  name: string;
  className?: string;
};

type HoloCardStyle = CSSProperties & {
  '--front': string;
};

export default function PokemonHoloCard({ image, name, className }: PokemonHoloCardProps) {
  const imageCardRef = useRef<HTMLDivElement>(null);

  const cardStyle: HoloCardStyle = {
    '--front': `url("${image}")`,
  };

  return (
    <div className={`pokemon-card-shell ${className ?? ''}`.trim()}>
      <div ref={imageCardRef} className="pokemon-image-card" style={cardStyle}>
        <FallbackImage
          src={image}
          alt={name}
          className="pokemon-image-card__image"
          loading="lazy"
          decoding="async"
          draggable={false}
          onResolvedSrcChange={(resolvedSrc) => {
            imageCardRef.current?.style.setProperty('--front', `url("${resolvedSrc}")`);
          }}
        />
      </div>
    </div>
  );
}
