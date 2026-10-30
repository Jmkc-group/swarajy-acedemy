import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Eye, EyeOff, Pencil, Plus, Shuffle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { Empty, Field, Loaded, Modal, Page, Panel, Pill, Select, confirmAction, fmtDate, inputCls, useAction, useLoad } from '../ui'

export default function Tests() {
  const state = useLoad('/admin/tests')
  const courses = useLoad('/admin/courses')
  const [editing, setEditing] = useState(null)
  const [busy, run] = useAction()

  const openEditor = async (t) => {
    if (!t) return setEditing({})
    const d = await run(() => api.get(`/admin/tests/${t.id}`))
    if (d) setEditing({ ...d.test, questionIds: d.questions.map((x) => x.id), locked: t.attempts > 0 })
  }

  return (
    <Page title="Tests" subtitle="Build mock tests from the question bank and publish them to students"
      actions={<Button onClick={() => openEditor(null)} disabled={!courses.data}><Plus /> Create test</Button>}>
      <Loaded state={state}>
        {(rows) =>
          rows.length === 0 ? <Panel><Empty>No tests yet. Add questions first, then create a test.</Empty></Panel> : (
            <div className="grid gap-3 md:grid-cols-2">
              {rows.map((t) => (
                <article key={t.id} className="rounded-xl border bg-card p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-heading font-semibold">{t.title}</h3>
                      <p className="text-xs text-muted-foreground">{t.course_title} · {fmtDate(t.created_at)}</p>
                    </div>
                    <Pill tone={t.status === 'published' ? 'green' : 'slate'}>{t.status === 'published' ? 'Live' : 'Draft'}</Pill>
                  </div>
                  <dl className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                    {[['Questions', t.question_count], ['Minutes', t.duration_min], ['Attempts', t.attempts], ['Avg score', t.avg_score ?? '—']].map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-slate-50 p-2"><dd className="text-base font-bold tabular-nums">{v}</dd><dt className="text-muted-foreground">{k}</dt></div>
                    ))}
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline"><Link to={`/admin/tests/${t.id}/results`}><BarChart3 /> Results</Link></Button>
                    <Button size="sm" variant="outline" onClick={() => openEditor(t)} disabled={busy}><Pencil /> Edit</Button>
                    <Button size="sm" variant="outline" disabled={busy}
                      onClick={async () => { await run(() => api.patch(`/admin/tests/${t.id}/status`, { status: t.status === 'published' ? 'draft' : 'published' })); state.reload() }}>
                      {t.status === 'published' ? <><EyeOff /> Unpublish</> : <><Eye /> Publish</>}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600" disabled={busy} aria-label={`Delete ${t.title}`}
                      onClick={async () => {
                        if (!confirmAction(`Delete test “${t.title}” and all its results?`)) return
                        await run(() => api.del(`/admin/tests/${t.id}`), 'Test deleted.')
                        state.reload()
                      }}><Trash2 /></Button>
                  </div>
                </article>
              ))}
            </div>
          )
        }
      </Loaded>
      {editing && <TestModal courses={courses.data} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); state.reload() }} />}
    </Page>
  )
}

function TestModal({ courses, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial.id)
  const [form, setForm] = useState({
    courseId: initial.course_id ?? courses[0]?.id ?? '',
    title: initial.title ?? '',
    durationMin: initial.duration_min ?? 30,
    marksPerQ: initial.marks_per_q ?? 1,
    negative: initial.negative ?? 0,
    status: initial.status ?? 'draft',
  })
  const [picked, setPicked] = useState(initial.questionIds ?? [])
  const [subject, setSubject] = useState('')
  const bank = useLoad(`/admin/questions?course=${encodeURIComponent(form.courseId)}`)
  const [busy, run] = useAction()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const subjects = useMemo(() => [...new Set((bank.data ?? []).map((x) => x.subject))], [bank.data])
  const visible = (bank.data ?? []).filter((x) => !subject || x.subject === subject)
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const randomPick = () => {
    const n = Number(window.prompt(`How many random questions? (available: ${visible.length})`, Math.min(20, visible.length)))
    if (!n || n < 1) return
    setPicked([...visible].sort(() => Math.random() - 0.5).slice(0, n).map((x) => x.id))
  }

  const submit = async (e) => {
    e.preventDefault()
    const body = { ...form, questionIds: picked }
    const ok = await run(() => (isEdit ? api.put(`/admin/tests/${initial.id}`, body) : api.post('/admin/tests', body)), 'Test saved.')
    if (ok) onSaved()
  }

  return (
    <Modal open onClose={onClose} wide title={isEdit ? 'Edit test' : 'Create test'} description="Choose settings, then tick the questions to include.">
      <form onSubmit={submit} className="space-y-3">
        {initial.locked && <p className="rounded-lg bg-gold/20 p-2.5 text-xs text-gold-deep">Students have already attempted this test, so only the title and status can change.</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Test title *" className="sm:col-span-2"><input className={inputCls} value={form.title} onChange={set('title')} required maxLength={120} /></Field>
          <Field label="Course *"><Select value={form.courseId} onChange={(e) => { set('courseId')(e); setPicked([]) }} disabled={initial.locked}>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</Select></Field>
          <Field label="Status"><Select value={form.status} onChange={set('status')}><option value="draft">Draft (hidden)</option><option value="published">Published (live)</option></Select></Field>
          <Field label="Duration (minutes)"><input className={inputCls} type="number" min="1" value={form.durationMin} onChange={set('durationMin')} disabled={initial.locked} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Marks / question"><input className={inputCls} type="number" min="0.25" step="0.25" value={form.marksPerQ} onChange={set('marksPerQ')} disabled={initial.locked} /></Field>
            <Field label="Negative marks"><input className={inputCls} type="number" min="0" step="0.25" value={form.negative} onChange={set('negative')} disabled={initial.locked} /></Field>
          </div>
        </div>

        {!initial.locked && (
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-700">Questions — {picked.length} selected</p>
              <div className="flex gap-2">
                <Select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-8 w-auto text-xs" aria-label="Subject filter"><option value="">All subjects</option>{subjects.map((s) => <option key={s}>{s}</option>)}</Select>
                <Button type="button" size="sm" variant="outline" onClick={() => setPicked([...new Set([...picked, ...visible.map((x) => x.id)])])}>Select all</Button>
                <Button type="button" size="sm" variant="outline" onClick={randomPick}><Shuffle /> Random</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setPicked([])}>Clear</Button>
              </div>
            </div>
            <Loaded state={bank}>
              {() => visible.length === 0 ? <Empty>No questions in this course yet — add them in the Question bank.</Empty> : (
                <ul className="max-h-64 divide-y overflow-y-auto rounded-lg border">
                  {visible.map((x) => (
                    <li key={x.id}>
                      <label className="flex cursor-pointer items-start gap-2.5 px-3 py-2 text-sm hover:bg-slate-50">
                        <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[#1f6b35]" checked={picked.includes(x.id)} onChange={() => toggle(x.id)} />
                        <span>{x.text} <span className="text-xs text-muted-foreground">· {x.subject}</span></span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </Loaded>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy || (!initial.locked && picked.length === 0)}>{busy ? 'Saving…' : 'Save test'}</Button>
        </div>
      </form>
    </Modal>
  )
}
