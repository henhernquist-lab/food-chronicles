import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function NavLink({ to, children, className, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'relative px-3 py-2 text-sm font-medium transition-colors',
        'text-muted-foreground hover:text-foreground',
        active && 'text-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
}