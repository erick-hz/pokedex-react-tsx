import { useId } from 'react';
import type { ReactNode } from 'react';

type ResumeFormSectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export default function ResumeFormSection({
  title,
  children,
  action,
  className,
  ariaLabel,
}: ResumeFormSectionProps) {
  const titleId = useId();
  const normalizedAriaLabel = ariaLabel?.trim() || undefined;

  return (
    <section
      className={['resume-form-section', className].filter(Boolean).join(' ')}
      aria-label={normalizedAriaLabel}
      aria-labelledby={normalizedAriaLabel ? undefined : titleId}
    >
      <div className="resume-form-section-header">
        <h3 id={titleId}>{title}</h3>
        {action}
      </div>

      {children}
    </section>
  );
}
