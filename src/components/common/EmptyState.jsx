import { cn } from '@/lib/utils'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'relative mx-auto flex max-w-xl flex-col items-center overflow-hidden rounded-3xl border border-dashed border-khaki/50 bg-white px-6 py-14 text-center shadow-sm',
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-tricolor" />
      {Icon && (
        <span className="mb-5 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-forest to-leaf text-gold shadow-lg ring-4 ring-gold/20">
          <Icon aria-hidden="true" className="size-8" />
        </span>
      )}
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="mt-2 text-muted-ink">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
