import type { ReactNode } from 'react';

type LabeledValueCardProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export default function LabeledValueCard({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: LabeledValueCardProps) {
  return (
    <article className={className}>
      <span className={labelClassName}>{label}</span>
      <strong className={valueClassName}>{value}</strong>
    </article>
  );
}
