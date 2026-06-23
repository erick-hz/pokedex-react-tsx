import type { CSSProperties } from 'react'

type PokemonHoloCardProps = {
  image: string
  name: string
  className?: string
}

type HoloCardStyle = CSSProperties & {
  '--front': string
}

export default function PokemonHoloCard({
  image,
  name,
  className,
}: PokemonHoloCardProps) {
  const cardStyle: HoloCardStyle = {
    '--front': `url("${image}")`,
  }

  return (
    <div className={`pokemon-card-shell ${className ?? ''}`.trim()}>
      <div className="pokemon-image-card" style={cardStyle}>
        <img
          src={image}
          alt={name}
          className="pokemon-image-card__image"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  )
}