import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/common/SectionHeading'
import { AchievementCard } from '@/components/common/AchievementCard'
import { Reveal } from '@/components/aceternity/Reveal'
import { ALUMNI } from '@/data/achievements'
import { useLanguage } from '@/hooks/useLanguage'

// Home page "Our Alumni" strip — the four most recent selections.
export function AchievementsPreview() {
  const { t } = useLanguage()
  const latest = [...ALUMNI].sort((a, b) => b.year - a.year).slice(0, 4)

  return (
    <section className="section-y bg-surface" aria-labelledby="home-achievements-heading">
      <div className="container-page">
        <SectionHeading
          id="home-achievements-heading"
          eyebrow={t('homeAchievements.eyebrow')}
          title={t('homeAchievements.title')}
          subtitle={t('homeAchievements.subtitle')}
        />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {latest.map((record, index) => (
            <Reveal as="li" key={record.id} delay={index * 0.06}>
              <AchievementCard record={record} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="xl" className="border-forest/30 text-forest hover:border-gold">
            <Link to="/alumni">
              {t('homeAchievements.cta')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
