import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import FallbackImage from './FallbackImage';

type PokemonPreviewLinkProps = {
  to: string;
  params?: Record<string, string>;
  name: string;
  image: string;
  placeholder: ReactNode;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  labelClassName?: string;
  onClick?: () => void;
};

export default function PokemonPreviewLink({
  to,
  params,
  name,
  image,
  placeholder,
  className,
  imageClassName,
  placeholderClassName,
  labelClassName,
  onClick,
}: PokemonPreviewLinkProps) {
  return (
    <Link to={to} params={params} className={className} onClick={onClick}>
      {image ? (
        <FallbackImage
          src={image}
          alt={name}
          className={imageClassName ?? 'route-photo-card__image'}
          loading="lazy"
        />
      ) : (
        <div className={placeholderClassName ?? 'route-photo-card__placeholder'}>{placeholder}</div>
      )}
      <span className={labelClassName ?? 'route-photo-card__label'}>{name}</span>
    </Link>
  );
}
