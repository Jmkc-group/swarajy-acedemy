import { Award, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { useLanguage } from '@/hooks/useLanguage'

// Renders one verified selection record (see data/achievements.js).
export function AchievementCard({ record }) {
  const { t, pick } = useLanguage()
  const name = pick(record.name)
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <SpotlightCard as="article" className="group flex h-full flex-col rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-forest to-navy-950">
        {record.photo ? (
          <img
            src={record.photo}
            alt={t('achievements.photoAlt', { name })}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span aria-hidden="true" className="flex size-full items-center justify-center font-heading text-5xl font-bold text-gold">
            {initials}
          </span>
        )}
        <Badge className="absolute top-3 right-3 bg-gold text-navy-950">{record.year}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="flex items-center gap-2 text-sm text-muted-ink">
          <MapPin aria-hidden="true" className="size-4 text-khaki-deep" />
          <span className="sr-only">{t('achievements.village')}: </span>
          {pick(record.village)}
        </p>
        <p className="flex items-center gap-2 text-sm font-semibold text-forest">
          <Award aria-hidden="true" className="size-4 text-saffron" />
          <span className="sr-only">{t('achievements.post')}: </span>
          {pick(record.postLabel)}
        </p>
      </div>
    </SpotlightCard>
  )
}
