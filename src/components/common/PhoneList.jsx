import { Phone } from 'lucide-react'
import { PHONE_NUMBERS } from '@/data/site'
import { formatPhone, telHref } from '@/utils/contact'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

// Click-to-call list of the academy-wide numbers.
export function PhoneList({ tone = 'dark', layout = 'stack', className }) {
  const { t } = useLanguage()
  return (
    <ul className={cn(layout === 'stack' ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2', className)}>
      {PHONE_NUMBERS.map((number) => (
        <li key={number}>
          <a
            href={telHref(number)}
            aria-label={t('common.callAria', { number: formatPhone(number) })}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold tabular-nums transition-colors',
              tone === 'dark'
                ? 'bg-white text-forest ring-1 ring-border hover:bg-sand-50 hover:ring-gold'
                : 'bg-white/5 text-white ring-1 ring-white/15 hover:bg-white/10 hover:ring-gold',
            )}
          >
            <Phone aria-hidden="true" className={cn('size-4', tone === 'dark' ? 'text-saffron' : 'text-gold')} />
            {formatPhone(number)}
          </a>
        </li>
      ))}
    </ul>
  )
}
