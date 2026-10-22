import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

// Adapted from Aceternity UI "Card Hover Effect": a highlight slides between
// cards as the pointer (or keyboard focus) moves across the grid.
export function HoverEffectGrid({ items, renderItem, className, highlightClassName }) {
  const [active, setActive] = useState(null)

  return (
    <ul className={cn('grid', className)}>
      {items.map((item, index) => (
        <li
          key={item.id}
          className="group relative block h-full p-2"
          onPointerEnter={() => setActive(index)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(index)}
          onBlur={() => setActive(null)}
        >
          <AnimatePresence>
            {active === index && (
              <motion.span
                aria-hidden="true"
                className={cn('absolute inset-0 block rounded-2xl bg-gold/15', highlightClassName)}
                layoutId="hover-effect-highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10 h-full">{renderItem(item, index)}</div>
        </li>
      ))}
    </ul>
  )
}
