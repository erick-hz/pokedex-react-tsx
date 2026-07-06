import type { ReactNode } from 'react';

type ActionGroupProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
};

export default function ActionGroup({ children, className, as = 'div' }: ActionGroupProps) {
  const Component = as;

  return (
    <Component className={['route-inline-actions', className].filter(Boolean).join(' ')}>
      {children}
    </Component>
  );
}
