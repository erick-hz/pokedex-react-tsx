import type { ReactNode } from 'react'

import { SectionCard } from '@shared/ui'

type PublicApiCardProps = {
  eyebrow: string
  title: string
  description: string
  loadingLabel: string
  isLoading: boolean
  error: string | null
  children: ReactNode
}

export function PublicApiCard({
  eyebrow,
  title,
  description,
  loadingLabel,
  isLoading,
  error,
  children,
}: PublicApiCardProps) {
  return (
    <SectionCard
      eyebrow={eyebrow}
      title={title}
      className="public-api-card"
    >
      <div className="public-api-card__body">
        <p className="public-api-card__description">{description}</p>

        <div className="public-api-card__content">
          {isLoading ? <p className="api-state">{loadingLabel}</p> : children}
          {error && <p className="api-state api-state--error">{error}</p>}
        </div>
      </div>
    </SectionCard>
  )
}