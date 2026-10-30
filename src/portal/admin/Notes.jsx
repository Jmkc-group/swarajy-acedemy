import { useState } from 'react'
import { ExternalLink, FileText, Link2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, fileUrl } from '../api'
import { Empty, Field, Loaded, Modal, Page, Panel, Pill, Select, confirmAction, fmtDate, inputCls, useAction, useLoad } from '../ui'

export default function Notes() {
  const [course, setCourse] = useState('')
  const [adding, setAdding] = useState(false)
  const courses = useLoad('/admin/courses')
  const state = useLoad(`/admin/notes?course=${encodeURIComponent(course)}`)
  const [busy, run] = useAction()

  return (
    <Page title="Notes & study material" subtitle="Upload PDFs/images or share a link — only enrolled students can open them"
      actions={<Button onClick={() => setAdding(true)} disabled={!courses.data}><Plus /> Add notes</Button>}>
      <Select value={course} onChange={(e) => setCourse(e.target.value)} className="w-auto min-w-48" aria-label="Filter by course">
        <option value="">All courses</option>
        {courses.data?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </Select>

      <Loaded state={state}>
        {(rows) =>
          rows.length === 0 ? (
            <Panel><Empty>No notes yet. Add the first one.</Empty></Panel>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((n) => (
                <article key={n.id} className="flex flex-col rounded-xl border bg-card p-4 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-saffron/10 text-saffron-deep">
                      {n.kind === 'file' ? <FileText className="size-5" /> : <Link2 className="size-5" />}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-heading text-sm font-semibold">{n.title}</h3>
                      <p className="text-xs text-muted-foreground">{fmtDate(n.created_at)}</p>
                    </div>
                  </div>
                  {n.description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{n.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5"><Pill tone="navy">{n.course_title}</Pill>{n.subject && <Pill tone="gold">{n.subject}</Pill>}</div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <a href={n.kind === 'file' ? fileUrl(n.url) : n.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:underline">
                      Open <ExternalLink className="size-3.5" />
                    </a>
                    <button type="button" aria-label={`Delete ${n.title}`} className="text-red-600" disabled={busy}
                      onClick={async () => {
                        if (!confirmAction(`Delete “${n.title}”?`)) return
                        await run(() => api.del(`/admin/notes/${n.id}`), 'Deleted.')
                        state.reload()
                      }}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        }
      </Loaded>

      {adding && <AddNote courses={courses.data} onClose={() => setAdding(false)} onSaved={() => { setAdding(false); state.reload() }} />}
    </Page>
  )
}

function AddNote({ courses, onClose, onSaved }) {
  const [mode, setMode] = useState('file')
  const [form, setForm] = useState({ courseId: courses[0]?.id ?? '', title: '', subject: '', description: '', url: '' })
  const [file, setFile] = useState(null)
  const [busy, run] = useAction()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const ok = await run(async () => {
      if (mode === 'link') return api.post('/admin/notes', form)
      if (!file) throw new Error('Choose a file first.')
      if (file.size > 25 * 1024 * 1024) throw new Error('File must be under 25 MB.')
      const qs = new URLSearchParams({ courseId: form.courseId, title: form.title, subject: form.subject, description: form.description })
      return api.upload(`/admin/notes/upload?${qs}`, file)
    }, 'Notes added.')
    if (ok) onSaved()
  }

  return (
    <Modal open onClose={onClose} title="Add notes" description="Choose a course, then upload a file or paste a link.">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Course *">
          <Select value={form.courseId} onChange={set('courseId')} required>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</Select>
        </Field>
        <Field label="Title *"><input className={inputCls} value={form.title} onChange={set('title')} required maxLength={120} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Subject" hint="e.g. Maths, GK"><input className={inputCls} value={form.subject} onChange={set('subject')} maxLength={60} /></Field>
          <Field label="Short description"><input className={inputCls} value={form.description} onChange={set('description')} maxLength={400} /></Field>
        </div>
        <div className="flex gap-2">
          {[['file', 'Upload file'], ['link', 'Paste link']].map(([k, label]) => (
            <button key={k} type="button" onClick={() => setMode(k)} aria-pressed={mode === k}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${mode === k ? 'border-leaf bg-leaf/10 text-leaf' : 'text-slate-600'}`}>{label}</button>
          ))}
        </div>
        {mode === 'file' ? (
          <Field label="File (PDF, image, Word, PowerPoint, Excel — max 25 MB)">
            <input type="file" className={inputCls} onChange={(e) => setFile(e.target.files?.[0] ?? null)} accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" />
          </Field>
        ) : (
          <Field label="Link (Google Drive, YouTube, etc.)"><input className={inputCls} type="url" value={form.url} onChange={set('url')} placeholder="https://" required /></Field>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Uploading…' : 'Add notes'}</Button>
        </div>
      </form>
    </Modal>
  )
}
