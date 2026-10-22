import { ArrowRight, CheckCircle2, ListChecks, NotebookPen, Route, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Modal } from '@/components/common/Modal'
import { Notice } from '@/components/common/Notice'
import { IconBadge } from '@/components/common/IconBadge'
import { openQuickEnquiry } from '@/components/home/QuickEnquiryPopup'
import { getIcon } from '@/utils/icons'
import { useLanguage } from '@/hooks/useLanguage'

function DetailBlock({ icon: Icon, title, children }) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-forest">
        <Icon aria-hidden="true" className="size-5 text-saffron" />
        {title}
      </h3>
      {children}
    </section>
  )
}

export function CourseDetailDialog({ course, open, onOpenChange }) {
  const { t, pick } = useLanguage()
  if (!course) return null

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={pick(course.title)}
      description={pick(course.tagline)}
      header={
        <div className="mb-2 flex items-center gap-3">
          <IconBadge icon={getIcon(course.icon)} accent={course.accent} size="sm" />
          <Badge variant="outline" className="border-sand bg-sand-50 text-khaki-deep">
            {t(`coursesPage.tabs.${course.category}`)}
          </Badge>
        </div>
      }
    >
      <DetailBlock icon={NotebookPen} title={t('coursesPage.overview')}>
        <p className="text-muted-ink">{pick(course.summary)}</p>
      </DetailBlock>

      <DetailBlock icon={UserCheck} title={t('coursesPage.eligibility')}>
        <ul className="space-y-2">
          {course.eligibility.map((item) => (
            <li key={item.en} className="flex gap-2 text-sm">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-leaf" />
              <span>{pick(item)}</span>
            </li>
          ))}
        </ul>
        <Notice tone="warning" className="mt-3">
          {t('common.verifyNotice')}
        </Notice>
      </DetailBlock>

      <DetailBlock icon={Route} title={t('coursesPage.selection')}>
        <ol className="relative space-y-3 border-l-2 border-sand pl-5">
          {course.selection.map((step, index) => (
            <li key={step.en} className="relative text-sm">
              <span
                aria-hidden="true"
                className="absolute top-0 -left-[31px] inline-flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-gold"
              >
                {index + 1}
              </span>
              {pick(step)}
            </li>
          ))}
        </ol>
      </DetailBlock>

      <DetailBlock icon={ListChecks} title={t('coursesPage.syllabus')}>
        <ul className="flex flex-wrap gap-2">
          {course.syllabus.map((topic) => (
            <li key={topic.en}>
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium whitespace-normal">
                {pick(topic)}
              </Badge>
            </li>
          ))}
        </ul>
      </DetailBlock>

      <DetailBlock icon={NotebookPen} title={t('coursesPage.practice')}>
        <p className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-ink">
          <Badge className="bg-saffron/10 text-saffron-deep">{t('common.practiceMaterial')}</Badge>
          {t('coursesPage.practiceNote')}
        </p>
        <Accordion type="single" collapsible className="rounded-xl border px-4">
          {course.questions.map((item, index) => (
            <AccordionItem key={item.q.en} value={`q-${index}`}>
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {index + 1}. {pick(item.q)}
              </AccordionTrigger>
              <AccordionContent>
                <p className="rounded-lg bg-sand-50 px-3 py-2 text-sm">
                  <span className="font-semibold text-forest">{t('coursesPage.answer')}: </span>
                  {pick(item.a)}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DetailBlock>

      <div className="mt-6 border-t pt-5">
        <Button
          type="button"
          variant="cta"
          size="xl"
          className="w-full"
          onClick={() => {
            onOpenChange(false)
            openQuickEnquiry(course.id)
          }}
        >
          {t('common.admissionEnquiry')}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </Modal>
  )
}
