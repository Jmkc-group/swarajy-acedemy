import { BedDouble, Camera, House } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { FeatureCard } from '@/components/common/FeatureCard'
import { Notice } from '@/components/common/Notice'
import { CTASection } from '@/components/common/CTASection'
import { Reveal } from '@/components/aceternity/Reveal'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { FACILITIES } from '@/data/facilities'
import { getIcon } from '@/utils/icons'
import { useLanguage } from '@/hooks/useLanguage'

export default function FacilitiesPage() {
  const { t, pick } = useLanguage()
  const modes = [
    { key: 'residential', icon: BedDouble, gradient: 'from-forest to-army' },
    { key: 'nonResidential', icon: House, gradient: 'from-navy-950 to-navy' },
  ]

  return (
    <>
      <Seo page="facilities" />
      <PageHero eyebrow={t('facilities.eyebrow')} title={t('facilities.title')} subtitle={t('facilities.subtitle')} />

      <section className="section-y bg-white" aria-labelledby="facilities-heading">
        <div className="container-page">
          <SectionHeading id="facilities-heading" title={t('facilities.gridTitle')} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((facility, index) => (
              <Reveal as="li" key={facility.id} delay={(index % 3) * 0.07}>
                <FeatureCard
                  icon={getIcon(facility.icon)}
                  accent={facility.accent}
                  title={pick(facility.title)}
                  description={pick(facility.description)}
                  image={facility.image}
                  imageAlt={pick(facility.title)}
                />
              </Reveal>
            ))}
          </ul>
          <Notice className="mx-auto mt-10 max-w-3xl">
            <span className="inline-flex items-start gap-2">
              <Camera aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-khaki-deep" />
              {t('facilities.photoNote')}
            </span>
          </Notice>
        </div>
      </section>

      <section className="section-y bg-surface" aria-labelledby="modes-heading">
        <div className="container-page">
          <SectionHeading id="modes-heading" title={t('facilities.modesTitle')} />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {modes.map(({ key, icon: Icon, gradient }, index) => (
              <Reveal as="li" key={key} delay={index * 0.1}>
                <SpotlightCard className={`h-full rounded-2xl bg-gradient-to-br ${gradient} p-8 text-white shadow-xl`}>
                  <Icon aria-hidden="true" className="size-10 text-gold" />
                  <h3 className="mt-4 text-2xl font-bold text-white">{t(`facilities.${key}.title`)}</h3>
                  <p className="mt-2 text-white/80">{t(`facilities.${key}.desc`)}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-muted-ink">{t('facilities.modesNote')}</p>
        </div>
      </section>

      <CTASection />
    </>
  )
}
