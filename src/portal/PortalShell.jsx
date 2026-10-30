import { useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, ExternalLink } from 'lucide-react'
import logoBadge from '@/assets/logo-badge.webp'
import { cn } from '@/lib/utils'
import { useAuth } from './AuthContext'
import { Spinner } from './ui'

// Shared chrome for both portals: sidebar on desktop, slide-down menu on phones.
export function PortalShell({ role, nav }) {
  const { user, loading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  if (loading) return <Spinner />
  if (!user) return <Navigate replace to="/portal" state={{ from: pathname }} />
  if (user.role !== role) return <Navigate replace to={user.role === 'admin' ? '/admin' : '/student'} />

  const links = nav.map(({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-white/15 text-gold' : 'text-white/80 hover:bg-white/10 hover:text-white',
        )
      }
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </NavLink>
  ))

  const brand = (
    <div className="flex items-center gap-2.5">
      <img src={logoBadge} alt="" width="40" height="40" className="size-10 rounded-full ring-2 ring-gold/60" />
      <div className="leading-tight">
        <p className="font-heading text-sm font-bold text-white">Swarajya Academy</p>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">{role === 'admin' ? 'Admin Panel' : 'Student Portal'}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-950 p-4 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="mb-6 px-1 pt-1">{brand}</div>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Main">
          {links}
        </nav>
        <a href="/" className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:text-white">
          <ExternalLink className="size-3.5" aria-hidden="true" /> View website
        </a>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-white/95 px-4 backdrop-blur">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="hidden truncate text-sm text-muted-foreground lg:block">
            Signed in as <b className="text-ink">{user.name}</b> · <span className="tabular-nums">{user.loginId}</span>
          </p>
          <p className="truncate text-sm font-semibold text-ink lg:hidden">{user.name}</p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="size-4" aria-hidden="true" /> Logout
          </button>
        </header>

        {open && (
          <div className="border-b bg-navy-950 p-3 lg:hidden">
            <nav className="grid gap-1 sm:grid-cols-2" aria-label="Main mobile">
              {links}
            </nav>
          </div>
        )}

        <main className="mx-auto max-w-6xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
