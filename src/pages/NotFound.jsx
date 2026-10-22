import { Link } from 'react-router-dom'
import { House } from 'lucide-react'
import logoBadge from '@/assets/logo-badge.webp'
import { Button } from '@/components/ui/button'
import { Seo } from '@/components/common/Seo'
import { GridBackground } from '@/components/aceternity/GridBackground'
import { Spotlight } from '@/components/aceternity/Spotlight'
import { useLanguage } from '@/hooks/useLanguage'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <>
      <Seo page="notFound" />
      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-navy-950 bg-camo">
        <GridBackground />
        <Spotlight className="-top-40 left-0 md:left-40" fill="#d4a537" />
        <div className="container-page relative z-10 py-16 text-center">
          <img src={logoBadge} alt="" width="96" height="96" className="mx-auto size-24 rounded-full ring-4 ring-gold/50" />
          <p className="mt-6 font-heading text-6xl font-extrabold text-gradient-gold sm:text-7xl">{t('notFound.code')}</p>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{t('notFound.title')}</h1>
          <p className="mx-auto mt-3 max-w-md text-white/75">{t('notFound.description')}</p>
          <Button asChild variant="cta" size="xl" className="mt-8">
            <Link to="/">
              <House aria-hidden="true" />
              {t('notFound.home')}
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
