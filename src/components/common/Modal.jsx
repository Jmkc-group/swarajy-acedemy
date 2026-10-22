import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

// Thin wrapper over shadcn Dialog with a scrollable body and translated close label.
export function Modal({ open, onOpenChange, title, description, header, children, className }) {
  const { t } = useLanguage()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={t('common.close')}
        className={cn('flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl', className)}
      >
        <DialogHeader className="shrink-0 border-b p-5 pr-12 text-left sm:p-6 sm:pr-12">
          {header}
          <DialogTitle className="font-heading text-xl sm:text-2xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
