import { useState } from 'react'
import { Megaphone, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { Empty, Field, Loaded, Page, Panel, Pill, Select, confirmAction, fmtDate, inputCls, useAction, useLoad } from '../ui'

export default function Announcements() {
  const state = useLoad('/admin/announcements')
  const courses = useLoad('/admin/courses')
  const [form, setForm] = useState({ title: '', body: '', courseId: '' })
  const [busy, run] = useAction()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const ok = await run(() => api.post('/admin/announcements', form), 'Announcement posted.')
    if (ok) { setForm({ title: '', body: '', courseId: '' }); state.reload() }
  }

  return (
    <Page title="Announcements" subtitle="Notices students see on their dashboard — exam dates, holidays, schedule changes">
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="New announcement" className="lg:col-span-2">
          <form onSubmit={submit} className="space-y-3">
            <Field label="Title *"><input className={inputCls} value={form.title} onChange={set('title')} required maxLength={120} /></Field>
            <Field label="Message *"><textarea className={`${inputCls} h-28 py-2`} value={form.body} onChange={set('body')} required maxLength={1000} /></Field>
            <Field label="Send to">
              <Select value={form.courseId} onChange={set('courseId')}>
                <option value="">All students</option>
                {courses.data?.map((c) => <option key={c.id} value={c.id}>{c.title} students only</option>)}
              </Select>
            </Field>
            <Button type="submit" disabled={busy} className="w-full"><Send /> Post</Button>
          </form>
        </Panel>
        <div className="space-y-3 lg:col-span-3">
          <Loaded state={state}>
            {(rows) => rows.length === 0 ? <Panel><Empty>No announcements yet.</Empty></Panel> : rows.map((a) => (
              <article key={a.id} className="rounded-xl border bg-card p-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 font-heading text-sm font-semibold"><Megaphone className="size-4 text-saffron" aria-hidden="true" />{a.title}</h3>
                  <button type="button" aria-label="Delete announcement" className="text-red-600" disabled={busy}
                    onClick={async () => { if (!confirmAction('Delete this announcement?')) return; await run(() => api.del(`/admin/announcements/${a.id}`), 'Deleted.'); state.reload() }}><Trash2 className="size-4" /></button>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-600">{a.body}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Pill tone={a.course_title ? 'navy' : 'green'}>{a.course_title ?? 'Everyone'}</Pill>{fmtDate(a.created_at)}</div>
              </article>
            ))}
          </Loaded>
        </div>
      </div>
    </Page>
  )
}
