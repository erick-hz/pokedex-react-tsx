import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

type RouteActionTone = 'primary' | 'muted';

type RouteActionLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  tone?: RouteActionTone;
  search?: Record<string, unknown>;
  params?: Record<string, string>;
  onClick?: () => void;
};

type RouteActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: RouteActionTone;
};

type RoutePillButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const toneClassName: Record<RouteActionTone, string> = {
  primary: 'route-cta-primary',
  muted: 'route-cta-muted',
};

export function RouteActionLink({
  to,
  children,
  className,
  tone = 'muted',
  search,
  params,
  onClick,
}: RouteActionLinkProps) {
  return (
    <Link
      to={to}
      search={search}
      params={params}
      onClick={onClick}
      className={['route-cta', toneClassName[tone], className].filter(Boolean).join(' ')}
    >
      {children}
    </Link>
  );
}

export function RouteActionButton({
  children,
  className,
  tone = 'muted',
  ...props
}: RouteActionButtonProps) {
  return (
    <button
      {...props}
      className={['route-cta', toneClassName[tone], className].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  );
}

export function RoutePillButton({ children, className, ...props }: RoutePillButtonProps) {
  return (
    <button {...props} className={['route-pill', className].filter(Boolean).join(' ')}>
      {children}
    </button>
  );
}
