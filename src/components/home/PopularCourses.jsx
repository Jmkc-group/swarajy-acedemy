import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/aceternity/Reveal'
import { CourseCard } from '@/components/courses/CourseCard'
import { CourseDetailDialog } from '@/components/courses/CourseDetailDialog'
import { COURSES } from '@/data/courses'
import { useLanguage } from '@/hooks/useLanguage'

export function PopularCourses() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState(null)
  const popular = COURSES.filter((c) => c.popular)

  return (
    <section className="section-y bg-surface" aria-labelledby="home-courses-heading">
      <div className="container-page">
        <SectionHeading
          id="home-courses-heading"
          eyebrow={t('homeCourses.eyebrow')}
          title={t('homeCourses.title')}
          subtitle={t('homeCourses.subtitle')}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((course, index) => (
            <Reveal as="li" key={course.id} delay={(index % 3) * 0.08}>
              <CourseCard course={course} onOpen={setSelected} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="xl" className="border-forest/30 text-forest hover:border-gold">
            <Link to="/academics#courses">
              {t('common.viewAll')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
      <CourseDetailDialog course={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    </section>
  )
}
