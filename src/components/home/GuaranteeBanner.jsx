import { Link } from 'react-router-dom'
import { FileSignature, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/aceternity/GridBackground'
import { Reveal } from '@/components/aceternity/Reveal'
import { useLanguage } from '@/hooks/useLanguage'

// The 14-month stamp-paper guarantee is the academy's own claim — it is always
// labelled as such and points visitors to the academy for full conditions.
export function GuaranteeBanner({ compact = false }) {
  const { t } = useLanguage()
  return (
    <section className={compact ? '' : 'container-page py-4'} aria-labelledby="guarantee-heading">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-navy-950 via-navy-900 to-forest p-6 shadow-2xl sm:p-10">
          <GridBackground />
          <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
            <div className="mx-auto flex size-32 shrink-0 flex-col items-center justify-center rounded-full border-4 border-dashed border-gold/70 bg-gold/10 text-center sm:size-36">
              <FileSignature aria-hidden="true" className="mb-1 size-7 text-gold" />
              <span className="font-heading text-2xl leading-none font-extrabold text-white">{t('guarantee.months')}</span>
            </div>
            <div className="text-center lg:text-left">
              <Badge className="mb-3 bg-gold text-navy-950">{t('guarantee.badge')}</Badge>
              <h2 id="guarantee-heading" className="text-2xl font-bold text-white sm:text-3xl">
                {t('guarantee.title')}
              </h2>
              <p className="mt-3 text-white/80">{t('guarantee.description')}</p>
              <p className="mt-3 inline-flex items-start gap-2 text-left text-sm font-semibold text-gold">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                {t('guarantee.conditions')}
              </p>
              <p className="mt-1 text-xs text-white/55">{t('guarantee.disclaimer')}</p>
            </div>
            <Button asChild variant="gold" size="xl" className="mx-auto">
              <Link to="/contact">{t('guarantee.cta')}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
