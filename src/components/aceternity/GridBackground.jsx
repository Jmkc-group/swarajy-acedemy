import { cn } from '@/lib/utils'

// Adapted from Aceternity UI "Grid and Dot Backgrounds".
// Purely decorative: sits behind content and never captures pointer events.
export function GridBackground({ variant = 'light', className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 mask-radial-fade',
        variant === 'light' ? 'bg-grid-light' : 'bg-grid-dark',
        className,
      )}
    />
  )
}
