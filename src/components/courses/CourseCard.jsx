import { ArrowRight, BookOpenCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { IconBadge } from '@/components/common/IconBadge'
import { getIcon } from '@/utils/icons'
import { getAccent } from '@/utils/accents'
import { getCourseImage } from '@/data/courseImages'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

export function CourseCard({ course, onOpen, headingLevel = 'h3' }) {
  const { t, pick } = useLanguage()
  const Heading = headingLevel
  const accent = getAccent(course.accent)
  const image = getCourseImage(course.id)

  return (
    <SpotlightCard
      as="article"
      glow={accent.glow}
      className={cn(
        'group/card flex h-full flex-col rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        image ? 'bg-navy-950 text-white' : 'bg-card',
        accent.border,
      )}
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
          {/* Dark shade, heavier at the bottom where the text sits */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/85" />
        </>
      )}
      <div aria-hidden="true" className={cn('relative h-1.5 bg-gradient-to-r', accent.bar)} />
      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <IconBadge
            icon={getIcon(course.icon)}
            accent={course.accent}
            size="lg"
            className={image ? 'bg-white/90 backdrop-blur-sm' : undefined}
          />
          <Badge
            variant="outline"
            className={image ? 'border-gold/60 bg-black/40 text-gold' : 'border-sand bg-sand-50 text-khaki-deep'}
          >
            {t(`coursesPage.tabs.${course.category}`)}
          </Badge>
        </div>
        <Heading className={cn('mt-5 text-xl font-bold', image && 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]')}>
          {pick(course.title)}
        </Heading>
        <p className={cn('mt-1 text-sm font-semibold', image ? 'text-gold' : 'text-khaki-deep')}>
          {pick(course.tagline)}
        </p>
        <p className={cn('mt-3 line-clamp-3 text-sm', image ? 'text-white/85' : 'text-muted-ink')}>
          {pick(course.summary)}
        </p>
        <p
          className={cn(
            'mt-4 inline-flex items-center gap-1.5 text-xs font-semibold',
            image ? 'text-white/90' : 'text-forest',
          )}
        >
          <BookOpenCheck aria-hidden="true" className="size-4" />
          {t('coursesPage.topics', { count: course.syllabus.length })}
        </p>
        <div className="mt-auto pt-5">
          <Button
            variant="default"
            className="h-11 w-full justify-between"
            onClick={() => onOpen(course)}
            aria-haspopup="dialog"
            aria-label={`${t('common.viewDetails')}: ${pick(course.title)}`}
          >
            <span>{t('common.viewDetails')}</span>
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </SpotlightCard>
  )
}
