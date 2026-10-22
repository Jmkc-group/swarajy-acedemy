import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/common/Logo'
import { PhoneList } from '@/components/common/PhoneList'
import { NAV_ITEMS } from '@/data/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

// Hamburger menu (shadcn Sheet) for screens below 1280px.
export function MobileNavigation() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="size-10 border-forest/20 text-forest xl:hidden" aria-label={t('common.openMenu')}>
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel={t('common.close')} className="w-[86vw] max-w-sm gap-0 overflow-y-auto p-0">
        <SheetHeader className="border-b p-4 pr-12">
          <SheetTitle className="sr-only">{t('common.menu')}</SheetTitle>
          <SheetDescription className="sr-only">{t('nav.mainLabel')}</SheetDescription>
          <Logo onClick={close} />
        </SheetHeader>

        <nav aria-label={t('nav.mainLabel')} className="p-3">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold transition-colors',
                      isActive ? 'bg-forest text-white' : 'text-ink hover:bg-sand-50 hover:text-forest',
                    )
                  }
                >
                  {t(`nav.${item.key}`)}
                  <ArrowRight aria-hidden="true" className="size-4 opacity-60" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Separator />
        <div className="flex flex-col gap-4 p-4">
          <Button asChild variant="cta" size="xl" className="w-full">
            <Link to="/contact" onClick={close}>
              {t('common.admissionEnquiry')}
            </Link>
          </Button>
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-ink">{t('common.callNow')}</p>
            <PhoneList />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
