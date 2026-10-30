import { useState } from 'react'
import { Copy, MessageCircle, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { CourseChecks, Field, Modal, inputCls, useAction, waLink } from '../ui'

const EMPTY = { name: '', phone: '', parentPhone: '', address: '', batch: '', dob: '', remarks: '', feeTotal: '', password: '' }

// Add or edit a student. `initial` present → edit mode.
export function StudentFormModal({ open, onClose, courses, initial, onSaved }) {
  const editing = Boolean(initial)
  const [form, setForm] = useState(() =>
    initial
      ? { ...EMPTY, name: initial.name, phone: initial.phone || '', parentPhone: initial.parent_phone || '', address: initial.address || '', batch: initial.batch || '', dob: initial.dob || '', remarks: initial.remarks || '', courseIds: initial.courseIds, active: Boolean(initial.active) }
      : { ...EMPTY, courseIds: [] },
  )
  const [busy, run] = useAction()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const out = await run(
      () => (editing ? api.patch(`/admin/students/${initial.id}`, form) : api.post('/admin/students', form)),
      editing ? 'Student updated.' : undefined,
    )
    if (out) onSaved(editing ? out : { ...out, name: form.name, phone: form.parentPhone || form.phone })
  }

  return (
    <Modal open={open} onClose={onClose} wide title={editing ? 'Edit student' : 'Add new student'} description="Login ID is generated automatically.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name *" className="sm:col-span-2">
            <input className={inputCls} value={form.name} onChange={set('name')} required maxLength={80} />
          </Field>
          <Field label="Student phone">
            <input className={inputCls} value={form.phone} onChange={set('phone')} inputMode="tel" maxLength={20} />
          </Field>
          <Field label="Parent phone">
            <input className={inputCls} value={form.parentPhone} onChange={set('parentPhone')} inputMode="tel" maxLength={20} />
          </Field>
          <Field label="Batch" hint="e.g. Morning 2026">
            <input className={inputCls} value={form.batch} onChange={set('batch')} maxLength={40} />
          </Field>
          <Field label="Date of birth">
            <input className={inputCls} type="date" value={form.dob} onChange={set('dob')} />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <input className={inputCls} value={form.address} onChange={set('address')} maxLength={300} />
          </Field>
          {!editing && (
            <>
              <Field label="Total fee (₹)">
                <input className={inputCls} type="number" min="0" value={form.feeTotal} onChange={set('feeTotal')} />
              </Field>
              <Field label="Password" hint="Leave empty to auto-generate">
                <input className={inputCls} value={form.password} onChange={set('password')} minLength={6} maxLength={60} />
              </Field>
            </>
          )}
          <Field label="Remarks" className="sm:col-span-2">
            <input className={inputCls} value={form.remarks} onChange={set('remarks')} maxLength={500} />
          </Field>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-slate-700">Course access</p>
          <CourseChecks courses={courses} value={form.courseIds} onChange={(courseIds) => setForm((f) => ({ ...f, courseIds }))} />
        </div>

        {editing && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-[#1f6b35]" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Account active (untick to block this student's login)
          </label>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create student'}</Button>
        </div>
      </form>
    </Modal>
  )
}

// Shown once after creating a student or resetting a password.
export function CredentialsModal({ creds, onClose }) {
  if (!creds) return null
  const text = `Swarajya Career Academy\nStudent: ${creds.name}\nLogin ID: ${creds.loginId}\nPassword: ${creds.password}\nLogin: ${window.location.origin}/portal`
  const copy = () => navigator.clipboard?.writeText(text).then(() => toast.success('Copied.'), () => toast.error('Could not copy.'))
  const wa = waLink(creds.phone, text)
  return (
    <Modal open onClose={onClose} title="Student login details" description="Save or share these now — the password is not shown again.">
      <div className="space-y-2 rounded-xl border-2 border-dashed border-gold bg-sand-50 p-4 text-sm print:border-solid" id="credential-card">
        <p className="font-heading font-bold text-forest">Swarajya Career Academy</p>
        <p>Student: <b>{creds.name}</b></p>
        <p>Login ID: <b className="font-mono text-base tracking-wide">{creds.loginId}</b></p>
        <p>Password: <b className="font-mono text-base tracking-wide">{creds.password}</b></p>
        <p className="text-xs text-muted-foreground">Login at {window.location.origin}/portal</p>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={copy}><Copy /> Copy</Button>
        <Button variant="outline" onClick={() => window.print()}><Printer /> Print</Button>
        {wa && (
          <Button asChild variant="outline">
            <a href={wa} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
          </Button>
        )}
        <Button onClick={onClose}>Done</Button>
      </div>
    </Modal>
  )
}
