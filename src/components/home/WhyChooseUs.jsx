import { BedDouble, ClipboardCheck, Dumbbell, GraduationCap, Library, Mic, MonitorPlay, Mountain } from 'lucide-react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { HoverEffectGrid } from '@/components/aceternity/HoverEffectGrid'
import { useLanguage } from '@/hooks/useLanguage'

const ICONS = {
  residential: BedDouble,
  library: Library,
  tests: ClipboardCheck,
  physical: Dumbbell,
  personality: Mic,
  lectures: MonitorPlay,
  trekking: Mountain,
  pathway: GraduationCap,
}

export function WhyChooseUs() {
  const { t } = useLanguage()
  const items = t('why.items')

  return (
    <section className="section-y relative overflow-hidden bg-surface" aria-labelledby="why-heading">
      <div className="container-page">
        <SectionHeading id="why-heading" eyebrow={t('why.eyebrow')} title={t('why.title')} subtitle={t('why.subtitle')} />
        <HoverEffectGrid
          items={items}
          className="mt-10 sm:grid-cols-2 lg:grid-cols-4"
          renderItem={(item) => {
            const Icon = ICONS[item.id]
            return (
              <div className="flex h-full flex-col gap-3 rounded-2xl border bg-white p-6 shadow-sm">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-forest to-leaf text-gold">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-muted-ink">{item.desc}</p>
              </div>
            )
          }}
        />
      </div>
    </section>
  )
}
