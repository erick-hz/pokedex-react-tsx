import { useId } from 'react';
import type { ElementType, ReactNode } from 'react';

type SectionCardProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  headingLevel?: Extract<ElementType, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
};

export default function SectionCard({
  eyebrow,
  title,
  children,
  action,
  className,
  headingLevel = 'h2',
}: SectionCardProps) {
  const headingId = useId();
  const Heading = headingLevel;

  return (
    <section aria-labelledby={headingId} className={['panel', className].filter(Boolean).join(' ')}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>

          <Heading id={headingId}>{title}</Heading>
        </div>

        {action && <div className="panel-action">{action}</div>}
      </div>

      {children}
    </section>
  );
}
