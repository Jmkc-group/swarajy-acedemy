import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

// Adapted from Aceternity UI "Text Generate Effect": words fade in one by one.
// `key` the component on the text so it replays when the language changes.
export function TextGenerateEffect({ words, as: Tag = 'p', className, delay = 0 }) {
  const reduce = useReducedMotion()
  if (reduce) return <Tag className={cn(className)}>{words}</Tag>

  const list = words.split(' ')
  return (
    <Tag className={cn(className)}>
      {list.map((word, index) => (
        <motion.span
          // words can repeat, so index keeps keys unique
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(6px)', y: 6 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.45, delay: delay + index * 0.06, ease: 'easeOut' }}
        >
          {word}
          {index < list.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}
