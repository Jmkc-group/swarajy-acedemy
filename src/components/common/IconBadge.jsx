import { getAccent } from '@/utils/accents'
import { cn } from '@/lib/utils'

export function IconBadge({ icon: Icon, accent = 'forest', size = 'md', className }) {
  const sizes = { sm: 'size-9 [&_svg]:size-4', md: 'size-12 [&_svg]:size-6', lg: 'size-14 [&_svg]:size-7' }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-xl ring-1',
        sizes[size],
        getAccent(accent).icon,
        className,
      )}
    >
      <Icon />
    </span>
  )
}
