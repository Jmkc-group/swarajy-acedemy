import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Modal } from '@/components/common/Modal'
import { FormField } from '@/components/forms/FormField'
import { COURSES } from '@/data/courses'
import { BRANCHES } from '@/data/branches'
import { PHONE_NUMBERS } from '@/data/site'
import { formatPhone } from '@/utils/contact'
import { isValidAge, isValidIndianMobile } from '@/utils/validation'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

// Mumbai has no published address yet, so it lives only in this picker
// rather than in data/branches.js (which drives the address cards and maps).
const POPUP_BRANCHES = [
  ...BRANCHES,
  { id: 'mumbai', name: { en: 'Mumbai Branch', mr: 'मुंबई शाखा', hi: 'मुंबई शाखा' } },
]

const TRIGGER_ID = 'why-heading'
const SEEN_KEY = 'quick-enquiry-seen'
const EMPTY = { branch: '', name: '', phone: '', age: '', course: '' }

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Storage blocked — the popup may simply show again next visit.
  }
}

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  if (!values.branch) errors.branch = 'contact.errors.branchRequired'
  if (!name) errors.name = 'contact.errors.nameRequired'
  else if (name.length < 2 || name.length > 60) errors.name = 'contact.errors.nameInvalid'
  if (!values.phone.trim()) errors.phone = 'contact.errors.phoneRequired'
  else if (!isValidIndianMobile(values.phone)) errors.phone = 'contact.errors.phoneInvalid'
  if (values.age === '') errors.age = 'contact.errors.ageRequired'
  else if (!isValidAge(values.age) || !Number.isInteger(Number(values.age))) errors.age = 'contact.errors.ageInvalid'
  if (!values.course) errors.course = 'contact.errors.courseRequired'
  return errors
}

const OPEN_EVENT = 'quick-enquiry:open'

// Opens the quick enquiry popup from anywhere, optionally preselecting a course.
export function openQuickEnquiry(courseId) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { courseId } }))
}

// Home page: open the popup once per session when the "Why choose us"
// heading scrolls into view.
export function useQuickEnquiryOnScroll() {
  useEffect(() => {
    const target = document.getElementById(TRIGGER_ID)
    if (!target || alreadySeen()) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        markSeen()
        openQuickEnquiry()
        observer.disconnect()
      },
      { threshold: 1 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])
}

// Frontend-only quick enquiry, mounted once in the layout. Nothing is sent anywhere.
export function QuickEnquiryPopup() {
  const { t, pick } = useLanguage()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const handleOpen = (event) => {
      const courseId = event.detail?.courseId
      if (COURSES.some((c) => c.id === courseId)) setValues((prev) => ({ ...prev, course: courseId }))
      markSeen()
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_EVENT, handleOpen)
  }, [])

  const update = (field) => (value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return

    toast.success(t('contact.success.title', { name: values.name.trim() }), {
      description: t('contact.success.description', { phone: formatPhone(PHONE_NUMBERS[0]) }),
    })
    setValues(EMPTY)
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      className="sm:max-w-lg"
      header={<p className="text-xs font-bold tracking-[0.16em] text-khaki-deep uppercase">{t('quickEnquiry.eyebrow')}</p>}
      title={t('quickEnquiry.title')}
      description={t('quickEnquiry.subtitle')}
    >
      <form noValidate onSubmit={handleSubmit} className="grid gap-4">
        <fieldset
          aria-describedby={errors.branch ? 'quick-branch-error' : undefined}
          className={cn(
            'rounded-xl border-2 bg-gold/10 p-4',
            errors.branch ? 'border-destructive' : 'border-gold',
          )}
        >
          <legend className="flex items-center gap-1.5 px-1 text-sm font-bold text-forest">
            <MapPin aria-hidden="true" className="size-4" />
            {t('quickEnquiry.branch')}
            <span className="text-destructive" aria-hidden="true">*</span>
          </legend>
          <div className="grid gap-2">
            {POPUP_BRANCHES.map((branch) => {
              const checked = values.branch === branch.id
              return (
                <label
                  key={branch.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold',
                    checked ? 'border-forest bg-forest text-white' : 'hover:border-forest/50',
                  )}
                >
                  <input
                    type="radio"
                    name="quick-branch"
                    value={branch.id}
                    checked={checked}
                    onChange={() => update('branch')(branch.id)}
                    className="size-4 accent-gold"
                  />
                  {pick(branch.name)}
                </label>
              )
            })}
          </div>
          {errors.branch && (
            <p id="quick-branch-error" className="mt-2 text-sm font-medium text-destructive">
              {t(errors.branch)}
            </p>
          )}
        </fieldset>

        <FormField id="quick-name" label={t('contact.fields.name')} required error={errors.name}>
          {(aria) => (
            <Input
              {...aria}
              autoComplete="name"
              value={values.name}
              placeholder={t('contact.placeholders.name')}
              onChange={(e) => update('name')(e.target.value)}
              className="h-11 bg-white text-base"
            />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
          <FormField id="quick-phone" label={t('contact.fields.phone')} required error={errors.phone}>
            {(aria) => (
              <Input
                {...aria}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={16}
                value={values.phone}
                placeholder={t('contact.placeholders.phone')}
                onChange={(e) => update('phone')(e.target.value)}
                className="h-11 bg-white text-base"
              />
            )}
          </FormField>
          <FormField id="quick-age" label={t('contact.fields.age')} required error={errors.age}>
            {(aria) => (
              <Input
                {...aria}
                type="number"
                inputMode="numeric"
                min="10"
                max="60"
                value={values.age}
                placeholder={t('contact.placeholders.age')}
                onChange={(e) => update('age')(e.target.value)}
                className="h-11 bg-white text-base"
              />
            )}
          </FormField>
        </div>

        <FormField id="quick-course" label={t('contact.fields.course')} required error={errors.course}>
          {(aria) => (
            <Select value={values.course} onValueChange={update('course')}>
              <SelectTrigger {...aria} className="h-11 w-full bg-white text-base">
                <SelectValue placeholder={t('contact.placeholders.course')} />
              </SelectTrigger>
              <SelectContent position="popper">
                {COURSES.map((course) => (
                  <SelectItem key={course.id} value={course.id} className="py-2 text-base">
                    {pick(course.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="h-11" onClick={() => setOpen(false)}>
            {t('quickEnquiry.later')}
          </Button>
          <Button type="submit" variant="cta" className="h-11">
            <Send aria-hidden="true" />
            {t('quickEnquiry.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
