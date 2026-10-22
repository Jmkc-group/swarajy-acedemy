import {
  BedDouble,
  CalendarCheck,
  Clock,
  Dumbbell,
  GraduationCap,
  LandPlot,
  Library,
  MapPin,
  Mic,
  MonitorPlay,
  Mountain,
  Users,
} from 'lucide-react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { AnimatedCounter } from '@/components/aceternity/AnimatedCounter'
import { Reveal } from '@/components/aceternity/Reveal'
import { useLanguage } from '@/hooks/useLanguage'

// Academy figures (as supplied by the academy). `count` marks figures that animate.
const STATS = [
  { key: 'branches', icon: MapPin, count: 3 },
  { key: 'campus', icon: LandPlot, count: 50000 },
  { key: 'library', icon: Library, count: 24 },
  { key: 'study', icon: Clock },
  { key: 'tests', icon: CalendarCheck },
  { key: 'hostel', icon: Users },
]

// Feature cards from `why.items`; library and tests are already covered by STATS.
const FEATURE_ICONS = {
  residential: BedDouble,
  physical: Dumbbell,
  personality: Mic,
  lectures: MonitorPlay,
  trekking: Mountain,
  pathway: GraduationCap,
}

const NUMBER_LOCALE = { en: 'en-IN', mr: 'mr-IN', hi: 'en-IN' }

export function WhyChooseUs() {
  const { t, lang } = useLanguage()

  const cards = [
    ...STATS.map(({ key, icon, count }) => ({
      id: key,
      icon,
      stat: {
        value: count ? <AnimatedCounter value={count} locale={NUMBER_LOCALE[lang]} /> : t(`highlights.${key}.value`),
        unit: t(`highlights.${key}.unit`),
      },
      title: t(`highlights.${key}.label`),
      desc: t(`highlights.${key}.desc`),
    })),
    ...t('why.items')
      .filter((item) => FEATURE_ICONS[item.id])
      .map((item) => ({ id: item.id, icon: FEATURE_ICONS[item.id], title: item.title, desc: item.desc })),
  ]

  return (
    <section className="section-y relative overflow-hidden bg-surface" aria-labelledby="why-heading">
      <div className="container-page">
        <SectionHeading id="why-heading" eyebrow={t('why.eyebrow')} title={t('why.title')} subtitle={t('why.subtitle')} />

        <ul className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ id, icon: Icon, stat, title, desc }, index) => (
            <Reveal as="li" key={id} delay={(index % 4) * 0.06} className="h-full">
              <SpotlightCard className="flex h-full flex-col rounded-2xl border bg-gradient-to-b from-white to-sand-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-forest text-gold shadow-md">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                {stat && (
                  <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
                    <span className="font-heading text-3xl font-extrabold text-forest">{stat.value}</span>
                    <span className="font-heading text-sm font-semibold text-khaki-deep">{stat.unit}</span>
                  </p>
                )}
                <h3 className={stat ? 'mt-1 text-lg font-bold' : 'mt-5 text-lg font-bold'}>{title}</h3>
                <p className="mt-1 text-sm text-muted-ink">{desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
