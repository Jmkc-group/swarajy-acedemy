import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/common/SectionHeading'
import { EmptyState } from '@/components/common/EmptyState'
import { AchievementCard } from '@/components/common/AchievementCard'
import { ACHIEVEMENTS } from '@/data/achievements'
import { useLanguage } from '@/hooks/useLanguage'

export function AchievementsPreview() {
  const { t } = useLanguage()
  const latest = [...ACHIEVEMENTS].sort((a, b) => b.year - a.year).slice(0, 4)

  return (
    <section className="section-y bg-surface" aria-labelledby="home-achievements-heading">
      <div className="container-page">
        <SectionHeading
          id="home-achievements-heading"
          eyebrow={t('homeAchievements.eyebrow')}
          title={t('homeAchievements.title')}
          subtitle={t('homeAchievements.subtitle')}
        />
        <div className="mt-12">
          {latest.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((record) => (
                <li key={record.id}>
                  <AchievementCard record={record} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Trophy} title={t('achievements.emptyTitle')} description={t('achievements.emptyDesc')} />
          )}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="xl" className="border-forest/30 text-forest hover:border-gold">
            <Link to="/achievements">
              {t('homeAchievements.cta')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
