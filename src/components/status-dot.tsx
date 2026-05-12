import clsx from 'clsx';

export interface StatusDotProps {
  /** Accessible label describing what the dot indicates (required for screen readers). */
  ariaLabel: string;
  className?: string;
}

/*
 * StatusDot — small lime square with a pulsing aura.
 *
 * Used as a "live" marker paired with the current role on the home hero
 * and the current job on the career page. The pulse runs forever; the
 * global reduced-motion override in globals.css zeroes the duration for
 * users who prefer no motion.
 */
export function StatusDot({ ariaLabel, className }: StatusDotProps) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={clsx(
        'inline-block size-1.5 align-middle shrink-0 bg-accent shadow-status-dot animate-status-dot-pulse',
        className,
      )}
    />
  );
}
