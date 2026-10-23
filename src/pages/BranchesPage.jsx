import { PhoneCall } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { BranchCard } from '@/components/common/BranchCard'
import { PhoneList } from '@/components/common/PhoneList'
import { CTASection } from '@/components/common/CTASection'
import { Reveal } from '@/components/aceternity/Reveal'
import { BRANCHES } from '@/data/branches'
import { useLanguage } from '@/hooks/useLanguage'

export default function BranchesPage() {
  const { t } = useLanguage()
  return (
    <>
      <Seo page="branches" />
      <PageHero eyebrow={t('branches.eyebrow')} title={t('branches.title')} subtitle={t('branches.subtitle')} />

      <section className="section-y bg-surface" aria-label={t('branches.title')}>
        <div className="container-page">
          <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {BRANCHES.map((branch, index) => (
              <Reveal as="li" key={branch.id} delay={index * 0.1}>
                <BranchCard branch={branch} index={index} headingLevel="h2" />
              </Reveal>
            ))}
          </ul>

          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-saffron text-white shadow-md">
                  <PhoneCall aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{t('branches.contactTitle')}</h2>
                  <p className="mt-1 text-sm text-muted-ink">{t('branches.contactNote')}</p>
                </div>
              </div>
              <PhoneList className="md:min-w-56" />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
