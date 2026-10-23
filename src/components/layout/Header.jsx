import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Logo } from '@/components/common/Logo'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { MobileNavigation } from './MobileNavigation'
import { NAV_ITEMS } from '@/data/navigation'
import { PHONE_NUMBERS } from '@/data/site'
import { formatPhone, telHref } from '@/utils/contact'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

export function Header() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40">
      {/* Top strip: tagline + click-to-call numbers (tablet and up) */}
      <div className="hidden bg-navy-950 text-white md:block">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-xs">
          <p className="truncate font-medium text-gold">{t('brand.tagline')}</p>
          <ul className="flex shrink-0 items-center gap-4">
            {PHONE_NUMBERS.map((number) => (
              <li key={number}>
                <a
                  href={telHref(number)}
                  aria-label={t('common.callAria', { number: formatPhone(number) })}
                  className="inline-flex items-center gap-1.5 tabular-nums text-white/85 hover:text-gold"
                >
                  <Phone aria-hidden="true" className="size-3.5" />
                  {formatPhone(number)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="h-1 bg-tricolor" />

      <div
        className={cn(
          'border-b bg-white/95 backdrop-blur-md transition-shadow supports-[backdrop-filter]:bg-white/85',
          scrolled ? 'shadow-md' : 'shadow-none',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-[72px]">
          <Logo className="min-w-0 shrink" />

          <NavigationMenu viewport={false} className="hidden xl:flex" aria-label={t('nav.mainLabel')}>
            <NavigationMenuList className="gap-0.5">
              {NAV_ITEMS.map((item) => (
                <NavigationMenuItem key={item.to}>
                  <NavigationMenuLink
                    asChild
                    active={isActive(item.to)}
                    className={cn(
                      'relative block rounded-md px-2 py-2 text-[15px] font-semibold whitespace-nowrap text-ink/80 transition-colors hover:bg-sand-50 hover:text-forest focus:bg-sand-50',
                      isActive(item.to) &&
                        'text-forest after:absolute after:inset-x-2 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-saffron data-[active=true]:bg-transparent data-[active=true]:text-forest',
                    )}
                  >
                    <Link to={item.to} aria-current={isActive(item.to) ? 'page' : undefined}>
                      {t(`nav.${item.key}`)}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSelector className="hidden sm:inline-flex" />
            <LanguageSelector className="sm:hidden" showLabel={false} />
            {/* hidden at xl where the 7 nav links need the room; back at 2xl */}
            <Button asChild variant="cta" className="hidden h-10 lg:inline-flex xl:hidden 2xl:inline-flex">
              <Link to="/contact">{t('common.admissionEnquiry')}</Link>
            </Button>
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  )
}
