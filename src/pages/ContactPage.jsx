import { Link } from 'react-router-dom'
import { MapPin, PhoneCall } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { PhoneList } from '@/components/common/PhoneList'
import { SocialLinks } from '@/components/common/SocialLinks'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { BRANCHES } from '@/data/branches'
import { useLanguage } from '@/hooks/useLanguage'

export default function ContactPage() {
  const { t, pick } = useLanguage()
  return (
    <>
      <Seo page="contact" />
      <PageHero eyebrow={t('contact.eyebrow')} title={t('contact.title')} subtitle={t('contact.subtitle')} />

      <section className="section-y bg-surface">
        <div className="container-page grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
            <h2 id="enquiry-form-title" className="mb-5 text-2xl font-bold">
              {t('contact.formTitle')}
            </h2>
            <EnquiryForm />
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-forest to-navy-950 p-6 text-white shadow-xl">
              <PhoneCall aria-hidden="true" className="size-8 text-gold" />
              <h2 className="mt-3 text-xl font-bold text-white">{t('contact.callTitle')}</h2>
              <p className="mt-1 text-sm text-white/75">{t('contact.callDesc')}</p>
              <PhoneList tone="light" className="mt-4" />
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">{t('contact.branchesTitle')}</h2>
              <ul className="mt-4 space-y-4">
                {BRANCHES.map((branch) => (
                  <li key={branch.id} className="flex gap-3">
                    <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-saffron" />
                    <div>
                      <p className="font-semibold text-forest">{pick(branch.name)}</p>
                      <address className="text-sm not-italic text-muted-ink">{pick(branch.address)}</address>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/branches" className="mt-4 inline-block text-sm font-semibold text-navy underline underline-offset-2 hover:text-saffron-deep">
                {t('common.getDirections')}
              </Link>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-bold">{t('contact.socialTitle')}</h2>
              <SocialLinks tone="dark" />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
