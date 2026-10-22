import { CalendarCheck, Clock, LandPlot, Library } from 'lucide-react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { AnimatedCounter } from '@/components/aceternity/AnimatedCounter'
import { Reveal } from '@/components/aceternity/Reveal'
import { useLanguage } from '@/hooks/useLanguage'

// `count` marks figures that animate (numbers supplied by the academy only).
const ITEMS = [
  { key: 'campus', icon: LandPlot, count: 14000 },
  { key: 'library', icon: Library, count: 24 },
  { key: 'study', icon: Clock },
  { key: 'tuesday', icon: CalendarCheck },
]

const NUMBER_LOCALE = { en: 'en-IN', mr: 'mr-IN', hi: 'en-IN' }

export function HighlightsSection() {
  const { t, lang } = useLanguage()
  return (
    <section className="section-y relative bg-white" aria-labelledby="highlights-heading">
      <div className="container-page">
        <SectionHeading
          id="highlights-heading"
          eyebrow={t('highlights.eyebrow')}
          title={t('highlights.title')}
          subtitle={t('highlights.subtitle')}
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ key, icon: Icon, count }, index) => (
            <Reveal as="li" key={key} delay={index * 0.08} className="h-full">
                <SpotlightCard className="h-full rounded-2xl border bg-gradient-to-b from-white to-sand-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-forest text-gold shadow-md">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <p className="mt-5 flex items-baseline gap-2">
                    <span className="font-heading text-4xl font-extrabold text-forest">
                      {count ? <AnimatedCounter value={count} locale={NUMBER_LOCALE[lang]} /> : t(`highlights.${key}.value`)}
                    </span>
                    <span className="font-heading text-base font-semibold text-khaki-deep">{t(`highlights.${key}.unit`)}</span>
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{t(`highlights.${key}.label`)}</h3>
                  <p className="mt-1 text-sm text-muted-ink">{t(`highlights.${key}.desc`)}</p>
                </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
