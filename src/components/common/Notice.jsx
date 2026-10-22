import { Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

// Small callout for disclaimers ("verify the official notification", demo form, etc.)
export function Notice({ tone = 'info', title, children, className }) {
  const warn = tone === 'warning'
  const Icon = warn ? TriangleAlert : Info
  return (
    <div
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border p-4 text-sm',
        warn ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-sand bg-sand-50 text-ink',
        className,
      )}
    >
      <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', warn ? 'text-amber-600' : 'text-khaki-deep')} />
      <div>
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}
