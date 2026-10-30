import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from './api'
import { useAuth } from './AuthContext'
import { Field, Page, Panel, inputCls, useAction } from './ui'

export default function SettingsPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [busy, run] = useAction()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const mismatch = form.confirm && form.confirm !== form.newPassword

  const submit = async (e) => {
    e.preventDefault()
    if (mismatch) return
    const ok = await run(() => api.post('/auth/change-password', form), 'Password changed.')
    if (ok) setForm({ oldPassword: '', newPassword: '', confirm: '' })
  }

  return (
    <Page title="Settings" subtitle={`${user.name} · ${user.loginId}`}>
      <Panel title="Change password" className="max-w-md">
        <form onSubmit={submit} className="space-y-3">
          <Field label="Current password"><input className={inputCls} type="password" autoComplete="current-password" value={form.oldPassword} onChange={set('oldPassword')} required /></Field>
          <Field label="New password" hint="At least 6 characters"><input className={inputCls} type="password" autoComplete="new-password" minLength={6} value={form.newPassword} onChange={set('newPassword')} required /></Field>
          <Field label="Confirm new password" hint={mismatch ? 'Passwords do not match' : undefined}><input className={inputCls} type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required /></Field>
          <Button type="submit" disabled={busy || mismatch}>{busy ? 'Saving…' : 'Update password'}</Button>
        </form>
      </Panel>
    </Page>
  )
}
