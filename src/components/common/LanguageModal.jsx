import { ChevronRight } from 'lucide-react'
import logoEmblem from '@/assets/logo-emblem.webp'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLanguage } from '@/hooks/useLanguage'
import { dictionaries } from '@/locales'
import { SITE } from '@/data/site'

// Language picker shown every time the website is opened (once per browser tab
// session). It cannot be dismissed without choosing.
// Title/description appear in all three languages since none is chosen yet.
export function LanguageModal() {
  const { needsSelection, languages, setLanguage } = useLanguage()

  return (
    <Dialog open={needsSelection}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto border-0 p-0 sm:max-w-md"
      >
        <div className="relative overflow-hidden rounded-t-lg bg-navy-950 bg-camo px-6 pt-6 pb-5 text-center">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-tricolor" />
          <img src={logoEmblem} alt={dictionaries.en.brand.logoAlt} width="160" height="143" className="mx-auto h-28 w-auto drop-shadow-xl" />
          <p className="mt-3 font-heading text-sm font-semibold text-gold">{SITE.name.mr}</p>
        </div>
        <div className="px-6 pt-5 pb-6">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="font-heading text-xl">
              {languages.map((l) => dictionaries[l.code].langModal.title).join(' / ')}
            </DialogTitle>
            <DialogDescription className="text-sm">{dictionaries.en.langModal.subtitle}</DialogDescription>
          </DialogHeader>
          <div className="mt-5 grid gap-3" role="group" aria-label="Language / भाषा">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                lang={language.code}
                onClick={() => setLanguage(language.code)}
                className="group flex items-center justify-between rounded-xl border-2 border-border bg-white px-4 py-3.5 text-left transition-all hover:border-gold hover:bg-sand-50 focus-visible:border-gold"
              >
                <span>
                  <span className="block font-heading text-lg font-semibold text-forest">{language.native}</span>
                  <span className="block text-xs text-muted-ink">{language.english}</span>
                </span>
                <ChevronRight aria-hidden="true" className="size-5 text-khaki transition-transform group-hover:translate-x-1 group-hover:text-saffron" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
