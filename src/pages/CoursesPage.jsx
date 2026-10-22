import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Seo } from '@/components/common/Seo'
import { PageHero } from '@/components/common/PageHero'
import { Notice } from '@/components/common/Notice'
import { EmptyState } from '@/components/common/EmptyState'
import { CTASection } from '@/components/common/CTASection'
import { Reveal } from '@/components/aceternity/Reveal'
import { CourseCard } from '@/components/courses/CourseCard'
import { CourseDetailDialog } from '@/components/courses/CourseDetailDialog'
import { COURSES, COURSE_CATEGORIES } from '@/data/courses'
import { useLanguage } from '@/hooks/useLanguage'

// Search across every language so a visitor can type in English, Marathi or Hindi.
function matches(course, query) {
  if (!query) return true
  const haystack = [course.title, course.tagline, course.summary, ...course.syllabus]
    .flatMap((field) => Object.values(field))
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

export default function CoursesPage() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  // ?course=<id> (from footer / other pages) opens that course's details
  const openId = searchParams.get('course')
  const selected = COURSES.find((c) => c.id === openId) ?? null

  const openCourse = (course) => setSearchParams({ course: course.id }, { replace: true })
  const closeCourse = () => setSearchParams({}, { replace: true })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COURSES.filter((c) => (category === 'all' || c.category === category) && matches(c, q))
  }, [query, category])

  const clearFilters = () => {
    setQuery('')
    setCategory('all')
  }

  return (
    <>
      <Seo page="courses" />
      <PageHero eyebrow={t('coursesPage.eyebrow')} title={t('coursesPage.title')} subtitle={t('coursesPage.subtitle')} />

      <section className="section-y bg-surface" aria-label={t('coursesPage.title')}>
        <div className="container-page">
          <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid w-full gap-2 lg:max-w-sm">
              <Label htmlFor="course-search">{t('coursesPage.searchLabel')}</Label>
              <div className="relative">
                <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-ink" />
                <Input
                  id="course-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('coursesPage.searchPlaceholder')}
                  className="h-11 pr-10 pl-9 text-base"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('coursesPage.clearFilters')}
                    className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-ink hover:bg-muted"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                )}
              </div>
            </div>

            <Tabs value={category} onValueChange={setCategory} className="w-full lg:w-auto">
              <TabsList
                aria-label={t('coursesPage.tabsLabel')}
                className="scrollbar-none h-auto w-full justify-start overflow-x-auto bg-sand-50 p-1 group-data-[orientation=horizontal]/tabs:h-auto lg:w-auto"
              >
                {COURSE_CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="h-9 flex-none px-4 text-sm font-semibold data-[state=active]:bg-forest data-[state=active]:text-white"
                  >
                    {t(`coursesPage.tabs.${cat}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {/* One panel reused for every tab; Radix shows it for the active value */}
              {COURSE_CATEGORIES.map((cat) => (
                <TabsContent key={cat} value={cat} className="sr-only">
                  {t('coursesPage.results', { count: filtered.length, total: COURSES.length })}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <p className="mt-5 text-sm font-medium text-muted-ink" aria-live="polite">
            {t('coursesPage.results', { count: filtered.length, total: COURSES.length })}
          </p>

          {filtered.length > 0 ? (
            <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course, index) => (
                <Reveal as="li" key={course.id} delay={(index % 3) * 0.06}>
                  <CourseCard course={course} onOpen={openCourse} headingLevel="h2" />
                </Reveal>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="mt-6"
              icon={SearchX}
              title={t('coursesPage.noResultsTitle')}
              description={t('coursesPage.noResultsDesc')}
              action={
                <Button variant="outline" onClick={clearFilters}>
                  {t('coursesPage.clearFilters')}
                </Button>
              }
            />
          )}

          <Notice tone="warning" className="mx-auto mt-10 max-w-3xl">
            {t('common.verifyNotice')}
          </Notice>
        </div>
      </section>

      <CourseDetailDialog course={selected} open={Boolean(selected)} onOpenChange={(open) => !open && closeCourse()} />
      <CTASection />
    </>
  )
}
