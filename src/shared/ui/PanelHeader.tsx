import type { ElementType, ReactNode } from 'react';

type PanelHeaderProps = {
  eyebrow: string;
  title: string;
  titleId?: string;
  action?: ReactNode;
  className?: string;
  headingLevel?: Extract<ElementType, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
};

export default function PanelHeader({
  eyebrow,
  title,
  titleId,
  action,
  className,
  headingLevel = 'h2',
}: PanelHeaderProps) {
  const Heading = headingLevel;

  return (
    <div className={['panel-header', className].filter(Boolean).join(' ')}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <Heading id={titleId}>{title}</Heading>
      </div>

      {action ? <div className="panel-action">{action}</div> : null}
    </div>
  );
}
