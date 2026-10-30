import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, KeyRound, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import {
  Bar, DataTable, Empty, Field, Loaded, Modal, Page, Panel, Pill, Select, Stat, Td, confirmAction, fmtDate, inputCls,
  money, pct, todayStr, useAction, useLoad,
} from '../ui'
import { CredentialsModal, StudentFormModal } from './studentParts'

const STATUS = { P: ['Present', 'green'], A: ['Absent', 'red'], L: ['Leave', 'gold'] }

export default function StudentDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const state = useLoad(`/admin/students/${id}`)
  const courses = useLoad('/admin/courses')
  const [editing, setEditing] = useState(false)
  const [paying, setPaying] = useState(false)
  const [creds, setCreds] = useState(null)
  const [busy, run] = useAction()

  const resetPassword = async () => {
    if (!confirmAction('Generate a new password for this student? The old one stops working.')) return
    const out = await run(() => api.post(`/admin/students/${id}/reset-password`, {}))
    if (out) setCreds({ name: state.data.student.name, loginId: state.data.student.login_id, password: out.password, phone: state.data.student.parent_phone || state.data.student.phone })
  }

  const remove = async () => {
    if (!confirmAction('Delete this student and ALL their data (attendance, fees, results)? This cannot be undone.')) return
    const out = await run(() => api.del(`/admin/students/${id}`), 'Student deleted.')
    if (out) nav('/admin/students')
  }

  return (
    <Page
      title={state.data?.student.name ?? 'Student'}
      subtitle={state.data ? `${state.data.student.login_id}${state.data.student.batch ? ` · ${state.data.student.batch}` : ''}` : undefined}
      actions={
        <>
          <Button asChild variant="ghost" size="sm"><Link to="/admin/students"><ArrowLeft /> All students</Link></Button>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} disabled={!courses.data}><Pencil /> Edit</Button>
          <Button variant="outline" size="sm" onClick={resetPassword} disabled={busy}><KeyRound /> Reset password</Button>
          <Button variant="destructive" size="sm" onClick={remove} disabled={busy}><Trash2 /> Delete</Button>
        </>
      }
    >
      <Loaded state={state}>
        {(d) => {
          const s = d.student
          const due = d.fee.total - d.payments.reduce((a, p) => a + p.amount, 0)
          const paid = d.fee.total - due
          const attPct = pct(d.attendanceSummary.present, d.attendanceSummary.marked)
          const avg = d.results.length ? Math.round(d.results.reduce((a, r) => a + pct(r.score, r.total), 0) / d.results.length) : null
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Attendance" value={d.attendanceSummary.marked ? `${attPct}%` : '—'} hint={`${d.attendanceSummary.present}/${d.attendanceSummary.marked} days`} tone="navy" />
                <Stat label="Fees pending" value={money(Math.max(0, due))} hint={`${money(paid)} paid of ${money(d.fee.total)}`} tone={due > 0 ? 'red' : 'green'} />
                <Stat label="Average test score" value={avg === null ? '—' : `${avg}%`} hint={`${d.results.length} test(s) taken`} tone="gold" />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Panel title="Profile" className="lg:col-span-1">
                  <dl className="space-y-2 text-sm">
                    {[
                      ['Status', s.active ? 'Active' : 'Disabled'],
                      ['Phone', s.phone || '—'],
                      ['Parent phone', s.parent_phone || '—'],
                      ['Date of birth', fmtDate(s.dob)],
                      ['Joined', fmtDate(s.joined_on)],
                      ['Address', s.address || '—'],
                      ['Remarks', s.remarks || '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {(s.phone || s.parent_phone) && (
                    <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                      <a href={`tel:${s.parent_phone || s.phone}`}><Phone /> Call</a>
                    </Button>
                  )}
                  <div className="mt-4 border-t pt-3">
                    <p className="mb-2 text-xs font-semibold text-slate-700">Course access</p>
                    <div className="flex flex-wrap gap-1.5">
                      {d.courseIds.length ? d.courseIds.map((cid) => <Pill key={cid} tone="navy">{courses.data?.find((c) => c.id === cid)?.title ?? cid}</Pill>) : <span className="text-sm text-muted-foreground">No course assigned</span>}
                    </div>
                  </div>
                </Panel>

                <Panel title="Fees" className="lg:col-span-2" action={<Button size="sm" onClick={() => setPaying(true)}><Plus /> Record payment</Button>} flush>
                  <div className="px-4 pt-3"><Bar value={pct(paid, d.fee.total)} tone="bg-gold" /></div>
                  {d.payments.length === 0 ? <Empty>No payments yet.</Empty> : (
                    <DataTable head={['Receipt', 'Date', 'Mode', 'Amount', '']}>
                      {d.payments.map((p) => (
                        <tr key={p.id}>
                          <Td className="font-mono text-xs">{p.receipt_no}</Td>
                          <Td>{fmtDate(p.paid_on)}</Td>
                          <Td>{p.mode}</Td>
                          <Td className="font-semibold tabular-nums">{money(p.amount)}</Td>
                          <Td className="text-right">
                            <button
                              type="button"
                              className="text-xs font-medium text-red-600 hover:underline"
                              onClick={async () => {
                                if (!confirmAction('Delete this payment entry?')) return
                                await run(() => api.del(`/admin/payments/${p.id}`), 'Payment removed.')
                                state.reload()
                              }}
                            >
                              Delete
                            </button>
                          </Td>
                        </tr>
                      ))}
                    </DataTable>
                  )}
                </Panel>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Test results" flush>
                  {d.results.length === 0 ? <Empty>No tests attempted yet.</Empty> : (
                    <DataTable head={['Test', 'Score', 'Date']}>
                      {d.results.map((r) => (
                        <tr key={r.id}>
                          <Td>{r.title}</Td>
                          <Td className="tabular-nums"><b>{r.score}</b>/{r.total} <span className="text-xs text-muted-foreground">({pct(r.score, r.total)}%)</span></Td>
                          <Td>{fmtDate(r.submitted_at)}</Td>
                        </tr>
                      ))}
                    </DataTable>
                  )}
                </Panel>

                <Panel title="Recent attendance">
                  {d.attendance.length === 0 ? <Empty>Not marked yet.</Empty> : (
                    <div className="flex flex-wrap gap-1.5">
                      {d.attendance.slice(0, 45).map((a) => (
                        <span key={a.date} title={`${fmtDate(a.date)} — ${STATUS[a.status][0]}`}
                          className={`grid size-8 place-items-center rounded-md text-xs font-bold ${a.status === 'P' ? 'bg-leaf/15 text-leaf' : a.status === 'A' ? 'bg-red-100 text-red-700' : 'bg-gold/25 text-gold-deep'}`}>
                          {a.date.slice(8)}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">Green = present · Red = absent · Gold = leave (day of month)</p>
                </Panel>
              </div>

              {editing && (
                <StudentFormModal
                  open
                  courses={courses.data}
                  initial={{ ...s, courseIds: d.courseIds }}
                  onClose={() => setEditing(false)}
                  onSaved={() => { setEditing(false); state.reload() }}
                />
              )}
              {paying && (
                <PaymentModal
                  studentId={id}
                  fee={d.fee}
                  onClose={() => setPaying(false)}
                  onSaved={() => { setPaying(false); state.reload() }}
                />
              )}
            </>
          )
        }}
      </Loaded>
      <CredentialsModal creds={creds} onClose={() => setCreds(null)} />
    </Page>
  )
}

function PaymentModal({ studentId, fee, onClose, onSaved }) {
  const [form, setForm] = useState({ amount: '', paidOn: todayStr(), mode: 'Cash', note: '', total: fee.total })
  const [busy, run] = useAction()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    const ok = await run(async () => {
      if (Number(form.total) !== Number(fee.total)) await api.put(`/admin/students/${studentId}/fee`, { total: form.total, note: fee.note })
      if (form.amount) await api.post(`/admin/students/${studentId}/payments`, form)
      return true
    }, 'Saved.')
    if (ok) onSaved()
  }
  return (
    <Modal open onClose={onClose} title="Fees & payment" description="Record a payment, or just change the total fee.">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <Field label="Total course fee (₹)" className="sm:col-span-2">
          <input className={inputCls} type="number" min="0" value={form.total} onChange={set('total')} required />
        </Field>
        <Field label="Amount received now (₹)">
          <input className={inputCls} type="number" min="1" value={form.amount} onChange={set('amount')} autoFocus />
        </Field>
        <Field label="Date">
          <input className={inputCls} type="date" value={form.paidOn} onChange={set('paidOn')} />
        </Field>
        <Field label="Mode">
          <Select value={form.mode} onChange={set('mode')}>
            {['Cash', 'UPI', 'Bank', 'Cheque', 'Other'].map((m) => <option key={m}>{m}</option>)}
          </Select>
        </Field>
        <Field label="Note">
          <input className={inputCls} value={form.note} onChange={set('note')} maxLength={200} />
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  )
}
