import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BookOpen, Dumbbell } from 'lucide-react'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { CTASection } from '@/components/common/CTASection'
import { CoursesSection } from '@/components/academics/CoursesSection'
import { TrainingSections } from '@/components/academics/TrainingSections'
import { useLanguage } from '@/hooks/useLanguage'

const JUMP_LINKS = [
  { hash: '#courses', key: 'courses', icon: BookOpen },
  { hash: '#training', key: 'training', icon: Dumbbell },
]

// Courses + Training & Tests on one page. #courses / #training jump to each half.
export default function AcademicsPage() {
  const { t } = useLanguage()
  const { hash } = useLocation()

  // ScrollToTop resets to the top on route change; honour a hash after that.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [hash])

  return (
    <>
      <Seo page="academics" />
      <PageHero eyebrow={t('academicsPage.eyebrow')} title={t('academicsPage.title')} subtitle={t('academicsPage.subtitle')}>
        <nav aria-label={t('academicsPage.jumpLabel')} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {JUMP_LINKS.map(({ hash: target, key, icon: Icon }) => (
            <a
              key={key}
              href={target}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(target.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-navy-950"
            >
              <Icon aria-hidden="true" className="size-4" />
              {t(`nav.${key}`)}
            </a>
          ))}
        </nav>
      </PageHero>

      <CoursesSection />
      <TrainingSections />
      <CTASection />
    </>
  )
}
