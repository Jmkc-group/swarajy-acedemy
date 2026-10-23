import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import logoEmblem from '@/assets/logo-emblem.webp'
import { PhoneList } from '@/components/common/PhoneList'
import { SocialLinks } from '@/components/common/SocialLinks'
import { NAV_ITEMS } from '@/data/navigation'
import { COURSES } from '@/data/courses'
import { BRANCHES } from '@/data/branches'
import { SITE, SLOGANS } from '@/data/site'
import { useLanguage } from '@/hooks/useLanguage'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t, pick } = useLanguage()

  return (
    <footer className="relative bg-navy-950 text-white/80">
      <div aria-hidden="true" className="h-1.5 bg-tricolor" />
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <img src={logoEmblem} alt={t('brand.logoAlt')} width="160" height="143" loading="lazy" className="h-28 w-auto" />
          <p className="mt-4 font-heading text-lg font-bold text-white">{pick(SITE.name)}</p>
          <p className="mt-2 text-sm">{t('footer.about')}</p>
          <p lang={SLOGANS[2].lang} className="mt-4 font-heading text-sm font-semibold text-gold">
            {SLOGANS[2].original}
          </p>
        </div>

        <nav aria-labelledby="footer-links" className="lg:col-span-2">
          <h2 id="footer-links" className="mb-4 text-base font-bold text-gold">{t('footer.quickLinks')}</h2>
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-gold">{t(`nav.${item.key}`)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-courses" className="lg:col-span-3">
          <h2 id="footer-courses" className="mb-4 text-base font-bold text-gold">{t('footer.courses')}</h2>
          <ul className="space-y-2 text-sm">
            {COURSES.map((course) => (
              <li key={course.id}>
                <Link to={`/academics?course=${course.id}#courses`} className="hover:text-gold">{pick(course.title)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-3">
          <h2 className="mb-4 text-base font-bold text-gold">{t('footer.contact')}</h2>
          <PhoneList tone="light" />
          <ul className="mt-5 space-y-3 text-sm">
            {BRANCHES.map((branch) => (
              <li key={branch.id} className="flex gap-2">
                <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-khaki" />
                <span>
                  <span className="block font-semibold text-white">{pick(branch.name)}</span>
                  {pick(branch.address)}
                </span>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 mb-3 text-base font-bold text-gold">{t('footer.follow')}</h2>
          <SocialLinks />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {YEAR} {pick(SITE.name)}. {t('footer.rights')}
          </p>
          <p className="max-w-2xl md:text-right">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
