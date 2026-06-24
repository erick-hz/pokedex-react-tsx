import type { ReactNode } from 'react'

type CopyBlockProps = {
  children: ReactNode
  className?: string
}

export default function CopyBlock({ children, className }: CopyBlockProps) {
  return <p className={className}>{children}</p>
}