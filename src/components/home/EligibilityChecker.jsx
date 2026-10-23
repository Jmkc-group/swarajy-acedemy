import { useState } from 'react'
import { CircleAlert, CircleCheck, CircleHelp, ExternalLink, GraduationCap, Info, RotateCcw, Sprout } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CATEGORIES, ELIGIBILITY_RULES, checkEligibility } from '@/data/eligibility'
import { isValidAge } from '@/utils/validation'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

const STATUS_STYLE = {
  within: { icon: CircleCheck, box: 'border-leaf/40 bg-leaf/5', iconColor: 'text-leaf' },
  relaxation: { icon: CircleHelp, box: 'border-gold/50 bg-gold/10', iconColor: 'text-gold-deep' },
  below: { icon: Sprout, box: 'border-airforce/40 bg-airforce/5', iconColor: 'text-blue-700' },
  above: { icon: CircleAlert, box: 'border-saffron/40 bg-saffron/5', iconColor: 'text-saffron-deep' },
}

const EMPTY = { age: '', exam: '', category: '' }

export function EligibilityChecker() {
  const { t, pick } = useLanguage()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const rule = ELIGIBILITY_RULES.find((r) => r.id === values.exam)
  const categoryNeeded = Boolean(rule?.categoryRelevant)

  const update = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setResult(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (values.age === '') next.age = 'eligibility.errors.ageRequired'
    else if (!isValidAge(values.age)) next.age = 'eligibility.errors.ageInvalid'
    if (!values.exam) next.exam = 'eligibility.errors.examRequired'
    if (categoryNeeded && !values.category) next.category = 'eligibility.errors.categoryRequired'
    setErrors(next)
    if (Object.keys(next).length) return
    setResult(checkEligibility({ examId: values.exam, age: Number(values.age), category: values.category }))
  }

  const reset = () => {
    setValues(EMPTY)
    setErrors({})
    setResult(null)
  }

  const status = result && STATUS_STYLE[result.status]

  return (
    <section className="section-y bg-white" aria-labelledby="eligibility-heading">
      <div className="container-page">
        <SectionHeading
          id="eligibility-heading"
          eyebrow={t('eligibility.eyebrow')}
          title={t('eligibility.title')}
          subtitle={t('eligibility.subtitle')}
        />

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            noValidate
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-gradient-to-b from-white to-sand-50 p-5 shadow-sm sm:p-7"
          >
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="elig-age">{t('eligibility.age')}</Label>
                <Input
                  id="elig-age"
                  type="number"
                  inputMode="decimal"
                  min="10"
                  max="60"
                  step="0.5"
                  value={values.age}
                  placeholder={t('eligibility.agePlaceholder')}
                  onChange={(e) => update('age', e.target.value)}
                  aria-invalid={Boolean(errors.age)}
                  aria-describedby={errors.age ? 'elig-age-error' : undefined}
                  className="h-11 bg-white text-base"
                />
                {errors.age && (
                  <p id="elig-age-error" className="text-sm font-medium text-destructive">{t(errors.age)}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="elig-exam">{t('eligibility.exam')}</Label>
                <Select value={values.exam} onValueChange={(v) => update('exam', v)}>
                  <SelectTrigger
                    id="elig-exam"
                    className="h-11 w-full bg-white text-base"
                    aria-invalid={Boolean(errors.exam)}
                    aria-describedby={errors.exam ? 'elig-exam-error' : undefined}
                  >
                    <SelectValue placeholder={t('eligibility.examPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {ELIGIBILITY_RULES.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="py-2 text-base">
                        {pick(r.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.exam && (
                  <p id="elig-exam-error" className="text-sm font-medium text-destructive">{t(errors.exam)}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="elig-category">{t('eligibility.category')}</Label>
                <Select
                  value={values.category}
                  onValueChange={(v) => update('category', v)}
                  disabled={Boolean(rule) && !categoryNeeded}
                >
                  <SelectTrigger
                    id="elig-category"
                    className="h-11 w-full bg-white text-base [&>span]:truncate"
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby="elig-category-hint"
                  >
                    <SelectValue placeholder={t('eligibility.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="py-2 text-base whitespace-normal">
                        {t(`eligibility.categories.${c}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p id="elig-category-hint" className={cn('text-sm', errors.category ? 'font-medium text-destructive' : 'text-muted-ink')}>
                  {errors.category
                    ? t(errors.category)
                    : rule && !categoryNeeded
                      ? t('eligibility.categoryNotNeeded')
                      : t('eligibility.categoryHint')}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" size="xl" className="flex-1">
                  {t('eligibility.check')}
                </Button>
                <Button type="button" variant="outline" size="xl" onClick={reset}>
                  <RotateCcw aria-hidden="true" />
                  {t('eligibility.reset')}
                </Button>
              </div>
            </div>
          </form>

          <div aria-live="polite" className="flex flex-col gap-4">
            {result ? (
              <div className={cn('rounded-2xl border-2 p-5 sm:p-6', status.box)}>
                <p className="text-xs font-bold tracking-[0.16em] text-muted-ink uppercase">{t('eligibility.resultTitle')}</p>
                <h3 className="mt-2 text-lg font-bold">{pick(result.rule.name)}</h3>
                <p className="mt-3 flex gap-3 text-base font-semibold">
                  <status.icon aria-hidden="true" className={cn('mt-0.5 size-6 shrink-0', status.iconColor)} />
                  <span>{t(`eligibility.status.${result.status}`)}</span>
                </p>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div>
                    <dt className="flex items-center gap-1.5 font-semibold text-forest">
                      {t('eligibility.ageRange')}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-deep"
                          >
                            <Info aria-hidden="true" className="size-3.5" />
                            {t('common.indicative')}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">{t('common.verifyNotice')}</TooltipContent>
                      </Tooltip>
                    </dt>
                    <dd>
                      {t('eligibility.ageRangeValue', { min: result.rule.minAge, max: result.rule.openMax })}
                      {result.rule.reservedMax && <> · {t('eligibility.reservedUpTo', { max: result.rule.reservedMax })}</>}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 font-semibold text-forest">
                      <GraduationCap aria-hidden="true" className="size-4" />
                      {t('eligibility.education')}
                    </dt>
                    <dd>{pick(result.rule.education)}</dd>
                  </div>
                  {result.rule.officialSite && (
                    <div>
                      <dt className="font-semibold text-forest">{t('eligibility.officialSite')}</dt>
                      <dd>
                        <a
                          href={`https://${result.rule.officialSite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-navy underline underline-offset-2 hover:text-saffron-deep"
                        >
                          {result.rule.officialSite}
                          <ExternalLink aria-hidden="true" className="size-3.5" />
                          <span className="sr-only">{t('common.opensNewTab')}</span>
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand bg-sand-50/60 p-8 text-center">
                <GraduationCap aria-hidden="true" className="size-12 text-khaki" />
                <p className="mt-3 font-semibold text-muted-ink">{t('eligibility.subtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
