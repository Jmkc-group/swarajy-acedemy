import { ArrowRight, BookOpenCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { IconBadge } from '@/components/common/IconBadge'
import { getIcon } from '@/utils/icons'
import { getAccent } from '@/utils/accents'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

export function CourseCard({ course, onOpen, headingLevel = 'h3' }) {
  const { t, pick } = useLanguage()
  const Heading = headingLevel
  const accent = getAccent(course.accent)

  return (
    <SpotlightCard
      as="article"
      glow={accent.glow}
      className={cn(
        'flex h-full flex-col rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        accent.border,
      )}
    >
      <div aria-hidden="true" className={cn('h-1.5 bg-gradient-to-r', accent.bar)} />
      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <IconBadge icon={getIcon(course.icon)} accent={course.accent} size="lg" />
          <Badge variant="outline" className="border-sand bg-sand-50 text-khaki-deep">
            {t(`coursesPage.tabs.${course.category}`)}
          </Badge>
        </div>
        <Heading className="mt-5 text-xl font-bold">{pick(course.title)}</Heading>
        <p className="mt-1 text-sm font-semibold text-khaki-deep">{pick(course.tagline)}</p>
        <p className="mt-3 line-clamp-3 text-sm text-muted-ink">{pick(course.summary)}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest">
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
