import { cn } from '@/lib/utils'

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', tone = 'dark', as: Heading = 'h2', id, className }) {
  const light = tone === 'light'
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase',
            light ? 'text-gold' : 'text-khaki-deep',
          )}
        >
          <span aria-hidden="true" className="h-0.5 w-6 rounded bg-current" />
          {eyebrow}
          <span aria-hidden="true" className={cn('h-0.5 w-6 rounded bg-current', align !== 'center' && 'hidden')} />
        </p>
      )}
      <Heading
        id={id}
        className={cn('text-2xl font-bold sm:text-3xl lg:text-4xl', light ? 'text-white' : 'text-ink')}
      >
        {title}
      </Heading>
      {subtitle && (
        <p className={cn('mt-3 text-base sm:text-lg', light ? 'text-white/75' : 'text-muted-ink')}>{subtitle}</p>
      )}
    </div>
  )
}
