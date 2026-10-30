import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { api } from './api'

// ---- formatting ------------------------------------------------------------
export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export const fmtDate = (s) => {
  if (!s) return '—'
  const d = new Date(String(s).length <= 10 ? `${s}T00:00:00` : `${String(s).replace(' ', 'T')}Z`)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const waLink = (phone, text) => {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}?text=${encodeURIComponent(text)}`
}

// ---- data hooks ------------------------------------------------------------
export function useLoad(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (path === null) return undefined
    let live = true
    api
      .get(path)
      .then((data) => live && setState({ data, error: null, loading: false }))
      .catch((e) => live && setState({ data: null, error: e.message, loading: false }))
    return () => {
      live = false
    }
  }, [path, tick])
  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}

// Runs an async action with a busy flag and toast feedback.
export function useAction() {
  const [busy, setBusy] = useState(false)
  const run = useCallback(async (fn, success) => {
    setBusy(true)
    try {
      const out = await fn()
      if (success) toast.success(success)
      return out
    } catch (e) {
      toast.error(e.message || 'Something went wrong.')
      return undefined
    } finally {
      setBusy(false)
    }
  }, [])
  return [busy, run]
}

// ---- layout bits ------------------------------------------------------------
export function Page({ title, subtitle, actions, children }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold text-ink sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

export function Panel({ title, action, children, className, flush }) {
  return (
    <section className={cn('rounded-xl border bg-card shadow-xs', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <h2 className="font-heading text-sm font-semibold text-ink">{title}</h2>
          {action}
        </header>
      )}
      <div className={flush ? '' : 'p-4'}>{children}</div>
    </section>
  )
}

const TONES = {
  green: 'bg-leaf/10 text-leaf',
  navy: 'bg-navy/10 text-navy',
  gold: 'bg-gold/20 text-gold-deep',
  saffron: 'bg-saffron/10 text-saffron-deep',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
}

export function Stat({ label, value, hint, icon: Icon, tone = 'green' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-xs">
      {Icon && (
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-lg', TONES[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
        <p className="font-heading text-xl font-bold leading-tight text-ink tabular-nums">{value}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}

export function Pill({ tone = 'slate', children }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', TONES[tone])}>{children}</span>
}

export function Bar({ value, tone = 'bg-leaf', className }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)} role="presentation">
      <div className={cn('h-full rounded-full transition-all', tone)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" /> {label}
    </div>
  )
}

export function Empty({ children }) {
  return <p className="px-4 py-10 text-center text-sm text-muted-foreground">{children}</p>
}

// Wraps a useLoad result: spinner → error → children(data).
export function Loaded({ state, children }) {
  if (state.loading && !state.data) return <Spinner />
  if (state.error) return <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{state.error}</p>
  return children(state.data)
}

// ---- forms ------------------------------------------------------------------
export const inputCls =
  'h-10 w-full rounded-md border border-input bg-white px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:opacity-60'

export function Field({ label, hint, className, children }) {
  return (
    <label className={cn('block space-y-1', className)}>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(inputCls, 'pr-8', className)} {...props}>
      {children}
    </select>
  )
}

export function Modal({ open, onClose, title, description, wide, children }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn('max-h-[90vh] gap-4 overflow-y-auto', wide ? 'sm:max-w-3xl' : 'sm:max-w-lg')}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={description ? '' : 'sr-only'}>{description || title}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function CourseChecks({ courses, value, onChange }) {
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {courses.map((c) => (
        <label key={c.id} className={cn('flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm', value.includes(c.id) && 'border-leaf bg-leaf/5')}>
          <input type="checkbox" className="size-4 accent-[#1f6b35]" checked={value.includes(c.id)} onChange={() => toggle(c.id)} />
          {c.title}
        </label>
      ))}
    </div>
  )
}

// Table wrapper that scrolls sideways on phones.
export function DataTable({ head, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  )
}
export const Td = ({ className, ...p }) => <td className={cn('px-4 py-2.5 align-middle', className)} {...p} />

export function confirmAction(message) {
  return window.confirm(message)
}
