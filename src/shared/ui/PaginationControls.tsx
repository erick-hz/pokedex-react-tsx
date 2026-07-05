import type { ReactNode } from 'react';

type PaginationControlsProps = {
  ariaLabel: string;
  previousLabel: ReactNode;
  nextLabel: ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  status: ReactNode;
  className?: string;
  previousButtonClassName?: string;
  nextButtonClassName?: string;
  statusClassName?: string;
  statusAs?: 'p' | 'span';
};

export default function PaginationControls({
  ariaLabel,
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  status,
  className,
  previousButtonClassName,
  nextButtonClassName,
  statusClassName,
  statusAs = 'p',
}: PaginationControlsProps) {
  const StatusTag = statusAs;

  return (
    <div className={className} aria-label={ariaLabel}>
      <button
        type="button"
        className={previousButtonClassName}
        onClick={onPrevious}
        disabled={isPreviousDisabled}
      >
        {previousLabel}
      </button>

      <StatusTag className={statusClassName}>{status}</StatusTag>

      <button
        type="button"
        className={nextButtonClassName}
        onClick={onNext}
        disabled={isNextDisabled}
      >
        {nextLabel}
      </button>
    </div>
  );
}
