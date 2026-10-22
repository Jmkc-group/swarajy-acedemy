import { Toaster } from '@/components/ui/sonner'

// App-wide toast outlet (shadcn Sonner). Trigger with `toast.success(...)` from 'sonner'.
export function Toast() {
  return <Toaster position="top-center" richColors closeButton duration={7000} toastOptions={{ className: 'font-sans' }} />
}
