import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

// 1) Resets scroll position on route change. 2) Floating "back to top" button.
export function ScrollToTop() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('common.backToTop')}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        'fixed right-4 bottom-4 z-30 inline-flex size-11 items-center justify-center rounded-full bg-forest text-gold shadow-xl ring-2 ring-gold/50 transition-all hover:bg-leaf sm:right-6 sm:bottom-6',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </button>
  )
}
