import { CalendarCheck, CalendarDays, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { FeatureCard } from '@/components/common/FeatureCard'
import { Notice } from '@/components/common/Notice'
import { CTASection } from '@/components/common/CTASection'
import { Reveal } from '@/components/aceternity/Reveal'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { TRAINING_GROUPS } from '@/data/training'
import { SAMPLE_SCHEDULE } from '@/data/schedule'
import { getIcon } from '@/utils/icons'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

const TYPE_STYLE = {
  routine: 'bg-slate-100 text-slate-700',
  physical: 'bg-olive/12 text-olive',
  study: 'bg-navy/10 text-navy',
  break: 'bg-sand-50 text-khaki-deep',
}

export default function TrainingPage() {
  const { t, pick } = useLanguage()
  const tests = t('training.tests')

  return (
    <>
      <Seo page="training" />
      <PageHero eyebrow={t('training.eyebrow')} title={t('training.title')} subtitle={t('training.subtitle')} />

      <section className="section-y bg-white" aria-labelledby="program-heading">
        <div className="container-page">
          <SectionHeading id="program-heading" title={t('training.programTitle')} subtitle={t('training.programSubtitle')} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRAINING_GROUPS.map((group, index) => (
              <Reveal as="li" key={group.id} delay={(index % 3) * 0.07}>
                <FeatureCard icon={getIcon(group.icon)} accent={group.accent} title={pick(group.title)} description={pick(group.description)}>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item.en}>
                        <Badge variant="secondary" className="px-2.5 py-1 text-xs font-semibold whitespace-normal">
                          {pick(item)}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </FeatureCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y relative overflow-hidden bg-navy-950 bg-camo" aria-labelledby="tests-heading">
        <div className="container-page">
          <SectionHeading id="tests-heading" tone="light" title={t('training.testsTitle')} />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {tests.map((test, index) => {
              const Icon = index === 0 ? CalendarCheck : CalendarDays
              return (
                <Reveal as="li" key={test.title} delay={index * 0.1}>
                  <SpotlightCard className="h-full rounded-2xl border border-gold/30 bg-white/5 p-7 backdrop-blur-sm">
                    <Icon aria-hidden="true" className="size-9 text-gold" />
                    <h3 className="mt-4 text-xl font-bold text-white">{test.title}</h3>
                    <p className="mt-2 text-white/75">{test.desc}</p>
                  </SpotlightCard>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section-y bg-surface" aria-labelledby="schedule-heading">
        <div className="container-page">
          <SectionHeading id="schedule-heading" title={t('training.scheduleTitle')} />
          <div className="mx-auto mt-4 flex justify-center">
            <Badge className="bg-saffron px-3 py-1 text-sm text-white">{t('training.scheduleLabel')}</Badge>
          </div>

          <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm sm:text-base">
              <caption className="sr-only">{t('training.scheduleLabel')}</caption>
              <thead className="bg-forest text-white">
                <tr>
                  <th scope="col" className="w-32 px-3 py-3 font-semibold sm:w-44 sm:px-5">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden="true" className="size-4 text-gold" />
                      {t('training.time')}
                    </span>
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-5">{t('training.activity')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {SAMPLE_SCHEDULE.map((slot) => (
                  <tr key={slot.time} className="align-top odd:bg-white even:bg-surface">
                    <th scope="row" className="px-3 py-3 font-semibold whitespace-nowrap text-forest tabular-nums sm:px-5">
                      {slot.time}
                    </th>
                    <td className="px-3 py-3 sm:px-5">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <span>{pick(slot.activity)}</span>
                        <span className={cn('w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold', TYPE_STYLE[slot.type])}>
                          {t(`training.types.${slot.type}`)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Notice className="mx-auto mt-5 max-w-4xl">{t('training.scheduleNote')}</Notice>
        </div>
      </section>

      <CTASection />
    </>
  )
}
