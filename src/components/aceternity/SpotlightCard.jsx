import { useRef } from 'react'
import { cn } from '@/lib/utils'

// Adapted from Aceternity UI "Card Spotlight": a soft radial glow follows the
// pointer. Uses CSS variables only, so there is no re-render on mouse move.
export function SpotlightCard({ as: Component = 'div', glow = 'rgb(212 165 55 / 0.16)', className, children, ...props }) {
  const ref = useRef(null)

  const handleMove = (event) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  return (
    <Component
      ref={ref}
      onPointerMove={handleMove}
      className={cn('group/spot relative overflow-hidden', className)}
      style={{ '--spot-color': glow }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            'radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--spot-color), transparent 65%)',
        }}
      />
      {children}
    </Component>
  )
}
