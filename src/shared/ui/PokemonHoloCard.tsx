import { useEffect, useState, type CSSProperties } from 'react';

import FallbackImage from './FallbackImage';

type PokemonHoloCardProps = {
  image: string;
  name: string;
  className?: string;
};

type HoloCardStyle = CSSProperties & {
  '--front': string;
};

export default function PokemonHoloCard({ image, name, className }: PokemonHoloCardProps) {
  const [activeImage, setActiveImage] = useState(image);

  useEffect(() => {
    setActiveImage(image);
  }, [image]);

  const cardStyle: HoloCardStyle = {
    '--front': `url("${activeImage}")`,
  };

  return (
    <div className={`pokemon-card-shell ${className ?? ''}`.trim()}>
      <div className="pokemon-image-card" style={cardStyle}>
        <FallbackImage
          src={activeImage}
          alt={name}
          className="pokemon-image-card__image"
          loading="lazy"
          decoding="async"
          draggable={false}
          onResolvedSrcChange={setActiveImage}
        />
      </div>
    </div>
  );
}
