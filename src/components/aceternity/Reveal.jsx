import { motion, useReducedMotion } from 'motion/react'

const ELEMENTS = { div: motion.div, li: motion.li, section: motion.section }

// Subtle fade-up when content scrolls into view (once). Visitors who prefer
// reduced motion get the content immediately, with no fade at all.
export function Reveal({ as = 'div', delay = 0, y = 18, className, children }) {
  const reduce = useReducedMotion()
  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  const Component = ELEMENTS[as] ?? motion.div
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </Component>
  )
}
