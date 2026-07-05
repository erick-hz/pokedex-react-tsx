import type { ReactNode } from 'react';

type StatusMessageProps = {
  children: ReactNode;
  className?: string;
};

export default function StatusMessage({ children, className }: StatusMessageProps) {
  return <p className={className ?? 'route-home-copy'}>{children}</p>;
}
