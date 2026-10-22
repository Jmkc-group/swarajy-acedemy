import { Check, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

export function LanguageSelector({ className, showLabel = true }) {
  const { lang, languages, setLanguage, t } = useLanguage()
  const current = languages.find((l) => l.code === lang)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-10 gap-1.5 border-forest/20 font-semibold text-forest hover:border-gold', className)}
          aria-label={`${t('common.changeLanguage')}: ${current.native}`}
        >
          <Languages aria-hidden="true" className="size-4" />
          {showLabel && <span>{current.native}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            lang={language.code}
            onSelect={() => setLanguage(language.code)}
            className="justify-between text-base"
          >
            <span>{language.native}</span>
            {language.code === lang && <Check aria-hidden="true" className="size-4 text-leaf" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
