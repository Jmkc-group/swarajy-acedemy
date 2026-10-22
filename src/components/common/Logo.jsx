import { Link } from 'react-router-dom'
import logoBadge from '@/assets/logo-badge.webp'
import { SITE } from '@/data/site'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

export function Logo({ variant = 'dark', className, onClick }) {
  const { t, pick } = useLanguage()
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn('flex min-w-0 items-center gap-2.5 rounded-lg', className)}
      aria-label={pick(SITE.name)}
    >
      <img
        src={logoBadge}
        alt={t('brand.logoAlt')}
        width="48"
        height="48"
        className="size-11 shrink-0 rounded-full shadow-md ring-2 ring-gold/60 sm:size-12"
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            'truncate font-heading text-sm font-bold sm:text-base',
            variant === 'dark' ? 'text-forest' : 'text-white',
          )}
        >
          {pick(SITE.shortName)}
        </span>
        <span
          className={cn(
            'truncate text-[11px] font-semibold tracking-wide sm:text-xs',
            variant === 'dark' ? 'text-khaki-deep' : 'text-gold',
          )}
        >
          {pick(SITE.subName)}
        </span>
      </span>
    </Link>
  )
}
