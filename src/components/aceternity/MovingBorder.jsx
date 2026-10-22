import { cn } from '@/lib/utils'

// Inspired by Aceternity UI "Hover Border Gradient" / "Moving Border":
// a gold-saffron conic gradient rotates around the child (e.g. a CTA button).
// Pure CSS — the animation stops automatically under prefers-reduced-motion.
export function MovingBorder({ className, innerClassName, children }) {
  return (
    <div
      className={cn('relative inline-flex rounded-xl p-[2px] animate-border-spin', className)}
      style={{
        background:
          'conic-gradient(from var(--border-angle), transparent 0%, #d4a537 15%, #ea580c 30%, transparent 45%, transparent 100%)',
      }}
    >
      <div className={cn('relative inline-flex rounded-[10px]', innerClassName)}>{children}</div>
    </div>
  )
}
