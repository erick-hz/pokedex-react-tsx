import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: ReactNode;
  trend?: ReactNode;
  className?: string;
};

export default function StatCard({ label, value, trend, className }: StatCardProps) {
  return (
    <article className={['stat-card', className].filter(Boolean).join(' ')} aria-label={label}>
      <span className="stat-card__label">{label}</span>

      <strong className="stat-card__value">{value}</strong>

      {trend && <small className="stat-card__trend">{trend}</small>}
    </article>
  );
}
