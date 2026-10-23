import { useState } from 'react'
import { ArrowRight, BedDouble, House, Images } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { FeatureCard } from '@/components/common/FeatureCard'
import { CTASection } from '@/components/common/CTASection'
import { Reveal } from '@/components/aceternity/Reveal'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { FacilityGallery } from '@/components/facilities/FacilityGallery'
import { FACILITIES } from '@/data/facilities'
import { getFacilityPhotos } from '@/data/facilityPhotos'
import { getIcon } from '@/utils/icons'
import { useLanguage } from '@/hooks/useLanguage'

export default function FacilitiesPage() {
  const { t, pick } = useLanguage()
  // The facility stays set while the panel closes so its slide-out animation keeps its content.
  const [galleryFacility, setGalleryFacility] = useState(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const openGallery = (facility) => {
    setGalleryFacility(facility)
    setGalleryOpen(true)
  }
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
            {FACILITIES.map((facility, index) => {
              const photoCount = getFacilityPhotos(facility.id).length
              return (
                <Reveal as="li" key={facility.id} delay={(index % 3) * 0.07}>
                  {/* Whole card opens the gallery; the button gives keyboard users the same action */}
                  <FeatureCard
                    icon={getIcon(facility.icon)}
                    accent={facility.accent}
                    title={pick(facility.title)}
                    description={pick(facility.description)}
                    image={facility.image}
                    imageAlt={pick(facility.title)}
                    onClick={() => openGallery(facility)}
                    className="cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openGallery(facility)
                      }}
                      className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-sm font-semibold text-forest hover:text-leaf focus-visible:underline focus-visible:outline-none"
                    >
                      <Images aria-hidden="true" className="size-4" />
                      {t('facilities.gallery.viewPhotos')}
                      {photoCount > 0 && <span className="text-muted-ink">({photoCount})</span>}
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover/spot:translate-x-0.5" />
                    </button>
                  </FeatureCard>
                </Reveal>
              )
            })}
          </ul>
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

      <FacilityGallery facility={galleryFacility} open={galleryOpen} onOpenChange={setGalleryOpen} />
      <CTASection />
    </>
  )
}
