import { SOCIAL_LINKS } from '@/data/site'
import { InstagramIcon, YouTubeIcon } from './SocialIcons'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

const SOCIAL_ICONS = { youtube: YouTubeIcon, instagram: InstagramIcon }

// Verified profiles render as links; unverified ones show the handle as text only.
export function SocialLinks({ tone = 'light', className }) {
  const { t } = useLanguage()
  const base = cn(
    'inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    tone === 'light' ? 'bg-white/5 text-white/85 ring-1 ring-white/15' : 'bg-white text-ink ring-1 ring-border',
  )

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {SOCIAL_LINKS.map((social) => {
        const Icon = SOCIAL_ICONS[social.id]
        const content = (
          <>
            <Icon className={cn('size-5', social.id === 'youtube' ? 'text-red-500' : 'text-pink-500')} />
            <span>
              <span className="sr-only">{social.label}: </span>
              {social.handle}
            </span>
          </>
        )
        return (
          <li key={social.id}>
            {social.verified ? (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(base, tone === 'light' ? 'hover:bg-white/10 hover:text-white' : 'hover:border-gold hover:bg-sand-50')}
              >
                {content}
                <span className="sr-only">{t('common.opensNewTab')}</span>
              </a>
            ) : (
              <span className={base}>{content}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
