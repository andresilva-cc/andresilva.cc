import clsx from 'clsx';

export interface StatusDotProps {
  /** Accessible label describing what the dot indicates (required for screen readers). */
  ariaLabel: string;
  className?: string;
}

/*
 * StatusDot — small lime square with a static glow ring.
 *
 * Used as a "current role" marker on the career page.
 */
export function StatusDot({ ariaLabel, className }: StatusDotProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={clsx(
        'inline-block size-1.5 align-middle shrink-0 bg-accent shadow-status-dot',
        className,
      )}
    />
  );
}
