import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from './FormField'
import { COURSES } from '@/data/courses'
import { BRANCHES } from '@/data/branches'
import { PHONE_NUMBERS } from '@/data/site'
import { formatPhone } from '@/utils/contact'
import { validateEnquiry } from '@/utils/validation'
import { useLanguage } from '@/hooks/useLanguage'

const RESIDENCE_OPTIONS = ['residential', 'nonResidential', 'undecided']
const FIELD_ORDER = ['name', 'age', 'phone', 'course', 'branch', 'residence', 'message']

function initialValues(courseParam) {
  return {
    name: '',
    age: '',
    phone: '',
    course: COURSES.some((c) => c.id === courseParam) ? courseParam : '',
    branch: '',
    residence: '',
    message: '',
  }
}

// Frontend-only admission enquiry. Nothing is sent anywhere — on success the
// visitor is told clearly that this was a demo and is asked to call instead.
export function EnquiryForm() {
  const { t, pick } = useLanguage()
  const [searchParams] = useSearchParams()
  const [values, setValues] = useState(() => initialValues(searchParams.get('course')))
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)

  const update = (field) => (value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validateEnquiry(values)
    setErrors(found)

    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      formRef.current?.querySelector(`#enquiry-${firstInvalid}`)?.focus()
      return
    }

    toast.success(t('contact.success.title', { name: values.name.trim() }), {
      description: t('contact.success.description', { phone: formatPhone(PHONE_NUMBERS[0]) }),
    })
    setValues(initialValues(null))
    setErrors({})
  }

  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="grid gap-5" aria-labelledby="enquiry-form-title">
      {hasErrors && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
          {t('contact.errors.summary')}
        </p>
      )}

      <FormField id="enquiry-name" label={t('contact.fields.name')} required error={errors.name}>
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

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="enquiry-age" label={t('contact.fields.age')} required error={errors.age}>
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

        <FormField
          id="enquiry-phone"
          label={t('contact.fields.phone')}
          required
          hint={t('contact.phoneHint')}
          error={errors.phone}
        >
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
      </div>

      <FormField id="enquiry-course" label={t('contact.fields.course')} required error={errors.course}>
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

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="enquiry-branch" label={t('contact.fields.branch')} required error={errors.branch}>
          {(aria) => (
            <Select value={values.branch} onValueChange={update('branch')}>
              <SelectTrigger {...aria} className="h-11 w-full bg-white text-base">
                <SelectValue placeholder={t('contact.placeholders.branch')} />
              </SelectTrigger>
              <SelectContent position="popper">
                {BRANCHES.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id} className="py-2 text-base">
                    {pick(branch.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <FormField id="enquiry-residence" label={t('contact.fields.residence')} required error={errors.residence}>
          {(aria) => (
            <Select value={values.residence} onValueChange={update('residence')}>
              <SelectTrigger {...aria} className="h-11 w-full bg-white text-base">
                <SelectValue placeholder={t('contact.placeholders.residence')} />
              </SelectTrigger>
              <SelectContent position="popper">
                {RESIDENCE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option} className="py-2 text-base">
                    {t(`contact.residenceOptions.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </div>

      <FormField id="enquiry-message" label={t('contact.fields.message')} optional error={errors.message}>
        {(aria) => (
          <Textarea
            {...aria}
            rows={4}
            maxLength={600}
            value={values.message}
            placeholder={t('contact.placeholders.message')}
            onChange={(e) => update('message')(e.target.value)}
            className="bg-white text-base"
          />
        )}
      </FormField>

      <Button type="submit" variant="cta" size="xl" className="w-full sm:w-auto sm:justify-self-start">
        <Send aria-hidden="true" />
        {t('contact.submit')}
      </Button>
    </form>
  )
}
