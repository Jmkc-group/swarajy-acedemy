import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

// Counts up to `value` once visible. Used only for numbers supplied by the
// academy (e.g. 14,000 sq. ft.). Falls back to the final value for reduced motion.
export function AnimatedCounter({ value, locale = 'en-IN', className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduce, value])

  const shown = reduce ? value : display
  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString(locale)}
    </span>
  )
}
