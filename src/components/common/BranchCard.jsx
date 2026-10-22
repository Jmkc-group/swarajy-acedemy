import { MapPin, Navigation, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/aceternity/SpotlightCard'
import { mapsDirectionsUrl, mapsSearchUrl } from '@/utils/contact'
import { useLanguage } from '@/hooks/useLanguage'

export function BranchCard({ branch, index, headingLevel = 'h3' }) {
  const { t, pick } = useLanguage()
  const Heading = headingLevel
  return (
    <SpotlightCard className="flex h-full flex-col rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative bg-gradient-to-br from-forest to-navy-950 p-6 text-white">
        <div aria-hidden="true" className="absolute inset-0 bg-grid-light opacity-60" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold text-navy-950 shadow-lg">
            <MapPin aria-hidden="true" className="size-6" />
          </span>
          <div>
            <Badge className="mb-2 bg-white/15 text-gold">
              {t('branches.branchLabel')} {index + 1}
            </Badge>
            <Heading className="text-xl font-bold text-white">{pick(branch.name)}</Heading>
            <p className="text-sm text-white/70">{pick(branch.area)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <address className="text-base not-italic text-ink">{pick(branch.address)}</address>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="default" className="h-11 flex-1">
            <a href={mapsDirectionsUrl(branch.mapQuery)} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden="true" />
              {t('common.getDirections')}
              <span className="sr-only">{t('common.opensNewTab')}</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1">
            <a href={mapsSearchUrl(branch.mapQuery)} target="_blank" rel="noopener noreferrer">
              <Search aria-hidden="true" />
              {t('common.openInMaps')}
              <span className="sr-only">{t('common.opensNewTab')}</span>
            </a>
          </Button>
        </div>
      </div>
    </SpotlightCard>
  )
}
