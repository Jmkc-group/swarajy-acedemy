import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MovingBorder } from '@/components/aceternity/MovingBorder'
import { GridBackground } from '@/components/aceternity/GridBackground'
import { PHONE_NUMBERS } from '@/data/site'
import { telHref } from '@/utils/contact'
import { useLanguage } from '@/hooks/useLanguage'

// Admission call-to-action band, reused at the bottom of most pages.
export function CTASection({ title, description, eyebrow }) {
  const { t } = useLanguage()
  return (
    <section className="container-page py-16 sm:py-20" aria-labelledby="cta-heading">
      <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-army to-navy-950 px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16">
        <GridBackground />
        <div aria-hidden="true" className="absolute -top-24 -right-24 size-72 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 -left-24 size-72 rounded-full bg-saffron/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">{eyebrow ?? t('cta.eyebrow')}</p>
          <h2 id="cta-heading" className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-white sm:text-4xl">
            {title ?? t('cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80 sm:text-lg">{description ?? t('cta.description')}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MovingBorder>
              <Button asChild variant="cta" size="xl" className="rounded-[10px]">
                <Link to="/contact">
                  {t('common.admissionEnquiry')}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </MovingBorder>
            <Button asChild variant="outline-light" size="xl">
              <a href={telHref(PHONE_NUMBERS[0])}>
                <Phone aria-hidden="true" />
                {t('common.callNow')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
