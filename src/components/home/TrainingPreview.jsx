import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/common/SectionHeading'
import { FeatureCard } from '@/components/common/FeatureCard'
import { Reveal } from '@/components/aceternity/Reveal'
import { TRAINING_GROUPS } from '@/data/training'
import { FACILITIES } from '@/data/facilities'
import { getIcon } from '@/utils/icons'
import { useLanguage } from '@/hooks/useLanguage'

const PREVIEW_TRAINING = ['academic', 'physical', 'tests']
const PREVIEW_FACILITIES = ['library', 'hostel', 'trekking']

export function TrainingPreview() {
  const { t, pick } = useLanguage()
  const items = [
    ...TRAINING_GROUPS.filter((g) => PREVIEW_TRAINING.includes(g.id)).map((g) => ({ ...g, key: `t-${g.id}` })),
    ...FACILITIES.filter((f) => PREVIEW_FACILITIES.includes(f.id)).map((f) => ({ ...f, key: `f-${f.id}` })),
  ]

  return (
    <section className="section-y relative overflow-hidden bg-white" aria-labelledby="home-training-heading">
      <div className="container-page">
        <SectionHeading
          id="home-training-heading"
          eyebrow={t('homeTraining.eyebrow')}
          title={t('homeTraining.title')}
          subtitle={t('homeTraining.subtitle')}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item.key} delay={(index % 3) * 0.08}>
              <FeatureCard
                icon={getIcon(item.icon)}
                accent={item.accent}
                title={pick(item.title)}
                description={pick(item.description)}
              />
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="xl">
            <Link to="/training">
              {t('homeTraining.trainingCta')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="border-forest/30 text-forest hover:border-gold">
            <Link to="/facilities">{t('homeTraining.facilitiesCta')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
