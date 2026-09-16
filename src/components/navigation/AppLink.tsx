import React, { MouseEvent, ReactNode } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';

interface AppLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  current?: boolean;
}

const PRIMARY_POINTER_BUTTON = 0; // Standard left-click; modified clicks keep native new-tab behavior.

export const AppLink: React.FC<AppLinkProps> = ({ to, children, className, ariaLabel, current }) => {
  const navigate = useNavigationStore(state => state.navigate);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== PRIMARY_POINTER_BUTTON) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} aria-label={ariaLabel} aria-current={current ? 'page' : undefined}>
      {children}
    </a>
  );
};
