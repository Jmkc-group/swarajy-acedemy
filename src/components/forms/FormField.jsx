import { Label } from '@/components/ui/label'
import { useLanguage } from '@/hooks/useLanguage'

// Label + control + hint/inline error, wired with aria-describedby.
// `children` is a render function receiving the aria props for the control.
export function FormField({ id, label, required, optional, hint, error, children }) {
  const { t } = useLanguage()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only">({t('contact.required')})</span>}
        {optional && <span className="font-normal text-muted-ink">({t('contact.optional')})</span>}
      </Label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy, 'aria-required': required || undefined })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-ink">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {t(error)}
        </p>
      )}
    </div>
  )
}
