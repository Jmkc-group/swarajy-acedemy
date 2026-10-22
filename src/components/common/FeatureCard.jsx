import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { IconBadge } from './IconBadge'
import { getAccent } from '@/utils/accents'
import { cn } from '@/lib/utils'

// Reusable card for facilities, training blocks and "why choose us" items.
export function FeatureCard({ icon, accent = 'forest', title, description, children, headingLevel = 'h3', image, imageAlt, className }) {
  const Heading = headingLevel
  const theme = getAccent(accent)
  return (
    <SpotlightCard
      glow={theme.glow}
      className={cn(
        'flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        theme.border,
        className,
      )}
    >
      <div aria-hidden="true" className={cn('h-1 w-full bg-gradient-to-r', theme.bar)} />
      {image && (
        <img src={image} alt={imageAlt} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
      )}
      <div className="relative flex flex-1 flex-col gap-3 p-6">
        {icon && <IconBadge icon={icon} accent={accent} />}
        <Heading className="text-lg font-semibold">{title}</Heading>
        {description && <p className="text-sm text-muted-ink sm:text-base">{description}</p>}
        {children}
      </div>
    </SpotlightCard>
  )
}
