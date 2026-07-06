import { useId } from 'react';
import type { ReactNode } from 'react';

type ResumeFormSectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function ResumeFormSection({
  title,
  children,
  action,
  className,
}: ResumeFormSectionProps) {
  const titleId = useId();

  return (
    <section
      className={['resume-form-section', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <div className="resume-form-section-header">
        <h3 id={titleId}>{title}</h3>
        {action}
      </div>

      {children}
    </section>
  );
}
