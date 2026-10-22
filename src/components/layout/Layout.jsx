import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { useLanguage } from '@/hooks/useLanguage'

function PageLoader() {
  const { t } = useLanguage()
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center gap-2 text-forest">
      <Loader2 aria-hidden="true" className="size-6 animate-spin" />
      <span>{t('common.loading')}</span>
    </div>
  )
}

export function Layout() {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-gold px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t('common.skipToContent')}
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
