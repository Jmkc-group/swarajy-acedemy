import { useEffect, useState } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { IconBadge } from '@/components/common/IconBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { getFacilityPhotos } from '@/data/facilityPhotos'
import { getIcon } from '@/utils/icons'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

// Left side panel (half the screen on tablet and up) with a facility's photos.
// Clicking a thumbnail opens it full-screen in a lightbox.
export function FacilityGallery({ facility, open, onOpenChange }) {
  const { t, pick } = useLanguage()
  const [active, setActive] = useState(null)
  const photos = facility ? getFacilityPhotos(facility.id) : []

  // Never carry an open lightbox over to the next facility.
  useEffect(() => {
    if (!open) setActive(null)
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        closeLabel={t('common.close')}
        className="w-full gap-0 overflow-y-auto p-0 sm:w-1/2 sm:max-w-none"
      >
        {facility && (
          <>
            <SheetHeader className="sticky top-0 z-10 gap-3 border-b bg-white/95 p-5 pr-12 backdrop-blur-md sm:p-6 sm:pr-14">
              <div className="flex items-center gap-3">
                <IconBadge icon={getIcon(facility.icon)} accent={facility.accent} />
                <div className="min-w-0">
                  <SheetTitle className="text-xl font-bold text-ink sm:text-2xl">{pick(facility.title)}</SheetTitle>
                  {photos.length > 0 && (
                    <p className="text-sm font-medium text-muted-ink">{t('facilities.gallery.photoCount', { count: photos.length })}</p>
                  )}
                </div>
              </div>
              <SheetDescription className="text-sm text-muted-ink sm:text-base">{pick(facility.description)}</SheetDescription>
            </SheetHeader>

            <div className="p-5 sm:p-6">
              {photos.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  {photos.map((photo, index) => (
                    <li key={photo.src}>
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        aria-label={t('facilities.gallery.enlarge', { name: photo.caption })}
                        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-sand-50 ring-offset-2 focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                      >
                        <img
                          src={photo.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2 text-left text-xs font-semibold text-white sm:text-sm">
                          {photo.caption}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={ImageOff}
                  title={t('facilities.gallery.emptyTitle')}
                  description={t('facilities.gallery.emptyDesc')}
                />
              )}
            </div>
          </>
        )}
        {/* Rendered inside the sheet so Radix treats it as a nested layer:
            clicks in the lightbox must not dismiss the panel behind it. */}
        <Lightbox photos={photos} index={active} onIndexChange={setActive} />
      </SheetContent>
    </Sheet>
  )
}

function Lightbox({ photos, index, onIndexChange }) {
  const { t } = useLanguage()
  const open = index !== null && photos.length > 0
  const photo = open ? photos[index] : null
  const many = photos.length > 1

  const step = (delta) => onIndexChange((i) => (i + delta + photos.length) % photos.length)

  const onKeyDown = (event) => {
    if (!many) return
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }

  const navButton =
    'absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none'

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] flex flex-col outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
            <DialogPrimitive.Title className="min-w-0 truncate text-sm font-semibold sm:text-base">{photo?.caption}</DialogPrimitive.Title>
            <div className="flex shrink-0 items-center gap-3">
              {many && (
                <span className="text-sm tabular-nums text-white/70">
                  {t('facilities.gallery.counter', { current: index + 1, total: photos.length })}
                </span>
              )}
              <DialogPrimitive.Close
                aria-label={t('common.close')}
                className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
              >
                <X aria-hidden="true" className="size-5" />
              </DialogPrimitive.Close>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16 sm:pb-8">
            {photo && (
              <img key={photo.src} src={photo.src} alt={photo.caption} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
            )}
            {many && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label={t('facilities.gallery.prev')} className={cn(navButton, 'left-2 sm:left-4')}>
                  <ChevronLeft aria-hidden="true" className="size-6" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={t('facilities.gallery.next')} className={cn(navButton, 'right-2 sm:right-4')}>
                  <ChevronRight aria-hidden="true" className="size-6" />
                </button>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
