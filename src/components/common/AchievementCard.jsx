import { Anchor, Award, BookOpenCheck, Landmark, MapPin, Plane, Shield, UserRound } from 'lucide-react'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

const POST_STYLE = {
  army: { icon: Shield, badge: 'bg-army text-white' },
  police: { icon: Award, badge: 'bg-navy text-white' },
  navy: { icon: Anchor, badge: 'bg-navy-950 text-white' },
  airforce: { icon: Plane, badge: 'bg-sky-700 text-white' },
  saralseva: { icon: Landmark, badge: 'bg-khaki-deep text-white' },
  mpsc: { icon: BookOpenCheck, badge: 'bg-saffron text-white' },
}

// Poster-style alumni card: photo, name strip, post badge and selection year.
// Sample records (see data/achievements.js) show a placeholder photo and name.
export function AchievementCard({ record }) {
  const { t, pick } = useLanguage()
  const style = POST_STYLE[record.post] ?? POST_STYLE.police
  const PostIcon = style.icon
  const name = record.sample ? t('achievements.sampleName') : pick(record.name)
  const postLabel = record.postLabel ? pick(record.postLabel) : t(`achievements.posts.${record.post}`)

  return (
    <SpotlightCard
      as="article"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-navy/15 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-gold hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-sand-50 to-sand">
        {record.photo ? (
          <img
            src={record.photo}
            alt={t('achievements.photoAlt', { name })}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <UserRound aria-hidden="true" strokeWidth={1.25} className="absolute inset-x-0 bottom-0 mx-auto size-[85%] text-navy/25" />
        )}
        <span className="absolute top-3 right-3 rounded-full bg-gold px-3 py-1 text-sm font-extrabold text-navy-950 tabular-nums shadow">
          <span className="sr-only">{t('achievements.year')}: </span>
          {record.year}
        </span>
      </div>

      <div className="bg-navy-950 px-4 py-2.5 text-center">
        <h3 className={cn('truncate text-base font-bold text-white', record.sample && 'text-white/70 italic')}>{name}</h3>
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 p-4 text-center">
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold', style.badge)}>
          <PostIcon aria-hidden="true" className="size-4" />
          <span className="sr-only">{t('achievements.post')}: </span>
          {postLabel}
        </span>
        {record.village && (
          <p className="flex items-center gap-1.5 text-sm text-muted-ink">
            <MapPin aria-hidden="true" className="size-4 text-khaki-deep" />
            <span className="sr-only">{t('achievements.village')}: </span>
            {pick(record.village)}
          </p>
        )}
      </div>
    </SpotlightCard>
  )
}
