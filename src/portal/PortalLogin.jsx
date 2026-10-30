import { useState } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react'
import logoBadge from '@/assets/logo-badge.webp'
import { Button } from '@/components/ui/button'
import { useAuth } from './AuthContext'
import { Field, inputCls, Spinner } from './ui'

export default function PortalLogin() {
  const { user, loading, login } = useAuth()
  const { state } = useLocation()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <Spinner />
  if (user) {
    const home = user.role === 'admin' ? '/admin' : '/student'
    return <Navigate replace to={state?.from?.startsWith(home) ? state.from : home} />
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(loginId.trim(), password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy-950 bg-grid-light p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <img src={logoBadge} alt="Swarajya Career Academy" width="72" height="72" className="mx-auto size-[72px] rounded-full ring-4 ring-gold/60" />
          <h1 className="mt-3 font-heading text-xl font-bold text-forest">Swarajya Career Academy</h1>
          <p className="text-sm text-muted-foreground">Student &amp; Admin Login</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Login ID" hint="Students: the ID given by the academy, e.g. SWA26-0001">
            <input
              className={inputCls}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="username"
              autoCapitalize="characters"
              required
              autoFocus
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                className={`${inputCls} pr-10`}
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" variant="cta" size="lg" className="w-full" disabled={busy}>
            <LogIn /> {busy ? 'Signing in…' : 'Login'}
          </Button>
        </form>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> Forgot your password? Ask the academy office to reset it.
        </p>
        <p className="mt-3 text-center text-sm">
          <Link to="/" className="font-medium text-navy hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
