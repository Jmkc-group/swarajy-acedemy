import { useState } from 'react'
import { FileUp, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { Empty, Field, Loaded, Modal, Page, Panel, Pill, Select, confirmAction, inputCls, useAction, useLoad } from '../ui'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function Questions() {
  const [course, setCourse] = useState('')
  const [subject, setSubject] = useState('')
  const [term, setTerm] = useState('')
  const [editing, setEditing] = useState(null) // question | {} (new)
  const [importing, setImporting] = useState(false)
  const courses = useLoad('/admin/courses')
  const subjects = useLoad('/admin/subjects')
  const state = useLoad(`/admin/questions?course=${encodeURIComponent(course)}&subject=${encodeURIComponent(subject)}&q=${encodeURIComponent(term)}`)
  const [busy, run] = useAction()
  const refresh = () => { state.reload(); subjects.reload() }

  return (
    <Page title="Question bank" subtitle="MCQs used for student practice and for building tests"
      actions={<>
        <Button variant="outline" onClick={() => setImporting(true)} disabled={!courses.data}><FileUp /> Bulk import</Button>
        <Button onClick={() => setEditing({})} disabled={!courses.data}><Plus /> Add question</Button>
      </>}>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input className={`${inputCls} pl-9`} placeholder="Search question text" value={term} onChange={(e) => setTerm(e.target.value)} aria-label="Search questions" />
        </div>
        <Select value={course} onChange={(e) => setCourse(e.target.value)} className="w-auto min-w-44" aria-label="Course">
          <option value="">All courses</option>
          {courses.data?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </Select>
        <Select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-auto min-w-36" aria-label="Subject">
          <option value="">All subjects</option>
          {subjects.data?.map((s) => <option key={s}>{s}</option>)}
        </Select>
      </div>

      <Loaded state={state}>
        {(rows) =>
          rows.length === 0 ? <Panel><Empty>No questions found.</Empty></Panel> : (
            <ul className="space-y-3">
              {rows.map((x, i) => (
                <li key={x.id} className="rounded-xl border bg-card p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium"><span className="mr-1.5 text-muted-foreground">{i + 1}.</span>{x.text}</p>
                    <div className="flex shrink-0 gap-3">
                      <button type="button" aria-label="Edit question" onClick={() => setEditing(x)} className="text-slate-500 hover:text-navy"><Pencil className="size-4" /></button>
                      <button type="button" aria-label="Delete question" disabled={busy} className="text-red-600"
                        onClick={async () => {
                          if (!confirmAction('Delete this question? It is also removed from any test.')) return
                          await run(() => api.del(`/admin/questions/${x.id}`), 'Deleted.')
                          refresh()
                        }}><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                  <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {x.options.map((o, k) => (
                      <li key={k} className={cn('rounded-md border px-2.5 py-1.5 text-sm', k === x.answer ? 'border-leaf bg-leaf/10 font-semibold text-leaf' : 'text-slate-600')}>
                        <span className="mr-1.5 font-bold">{LETTERS[k]}.</span>{o}
                      </li>
                    ))}
                  </ol>
                  {x.explanation && <p className="mt-2 text-xs text-muted-foreground">💡 {x.explanation}</p>}
                  <div className="mt-2 flex gap-1.5"><Pill tone="navy">{x.course_title}</Pill><Pill tone="gold">{x.subject}</Pill></div>
                </li>
              ))}
            </ul>
          )
        }
      </Loaded>

      {editing && <QuestionModal courses={courses.data} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh() }} />}
      {importing && <ImportModal courses={courses.data} onClose={() => setImporting(false)} onSaved={() => { setImporting(false); refresh() }} />}
    </Page>
  )
}

function QuestionModal({ courses, initial, onClose, onSaved }) {
  const isEdit = Boolean(initial.id)
  const [form, setForm] = useState({
    courseId: initial.course_id ?? courses[0]?.id ?? '',
    subject: initial.subject ?? '',
    text: initial.text ?? '',
    options: initial.options ?? ['', '', '', ''],
    answer: initial.answer ?? 0,
    explanation: initial.explanation ?? '',
  })
  const [busy, run] = useAction()
  const setOpt = (i, v) => setForm((f) => ({ ...f, options: f.options.map((o, k) => (k === i ? v : o)) }))

  const submit = async (e) => {
    e.preventDefault()
    // Drop empty trailing options but keep the right answer index.
    const filled = form.options.map((text, i) => ({ text: text.trim(), i })).filter((o) => o.text)
    const answer = filled.findIndex((o) => o.i === form.answer)
    if (answer < 0) return run(() => Promise.reject(new Error('The correct answer option cannot be empty.')))
    const body = { ...form, options: filled.map((o) => o.text), answer }
    const ok = await run(() => (isEdit ? api.put(`/admin/questions/${initial.id}`, body) : api.post('/admin/questions', body)), 'Question saved.')
    if (ok) onSaved()
  }

  return (
    <Modal open onClose={onClose} wide title={isEdit ? 'Edit question' : 'Add question'} description="Pick the correct option with the radio button.">
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Course *"><Select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</Select></Field>
          <Field label="Subject" hint="e.g. Maths, GK, Reasoning"><input className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={60} /></Field>
        </div>
        <Field label="Question *"><textarea className={`${inputCls} h-24 py-2`} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required maxLength={800} /></Field>
        <fieldset className="space-y-2">
          <legend className="mb-1 text-xs font-semibold text-slate-700">Options (select the correct one)</legend>
          {form.options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name="answer" className="size-4 accent-[#1f6b35]" checked={form.answer === i} onChange={() => setForm({ ...form, answer: i })} aria-label={`Option ${LETTERS[i]} is correct`} />
              <span className="w-5 text-sm font-bold">{LETTERS[i]}</span>
              <input className={inputCls} value={o} onChange={(e) => setOpt(i, e.target.value)} placeholder={`Option ${LETTERS[i]}`} required={i < 2} />
            </div>
          ))}
        </fieldset>
        <Field label="Explanation (shown after the answer)"><input className={inputCls} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} maxLength={600} /></Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save question'}</Button>
        </div>
      </form>
    </Modal>
  )
}

// One question per line:  Question | A | B | C | D | correct (A-D or 1-4) | explanation (optional)
function parseLines(text) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line, idx) => {
    const parts = line.split('|').map((p) => p.trim())
    if (parts.length < 4) throw new Error(`Line ${idx + 1}: need question, options and the correct answer.`)
    // The answer is the last single-letter/digit cell after the question and first option.
    let ansIdx = parts.findLastIndex((p, i) => i >= 3 && /^([A-F]|[1-6])$/i.test(p))
    if (ansIdx < 0) throw new Error(`Line ${idx + 1}: correct answer must be A–F or 1–6.`)
    const raw = parts[ansIdx].toUpperCase()
    const answer = /\d/.test(raw) ? Number(raw) - 1 : raw.charCodeAt(0) - 65
    const options = parts.slice(1, ansIdx)
    if (answer >= options.length) throw new Error(`Line ${idx + 1}: correct answer points to a missing option.`)
    return { text: parts[0], options, answer, explanation: parts.slice(ansIdx + 1).join(' | ') }
  })
}

function ImportModal({ courses, onClose, onSaved }) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? '')
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [busy, run] = useAction()

  const submit = async (e) => {
    e.preventDefault()
    const ok = await run(async () => {
      const questions = parseLines(text).map((q) => ({ ...q, subject }))
      return api.post('/admin/questions/bulk', { courseId, questions })
    }, 'Questions imported.')
    if (ok) onSaved()
  }

  return (
    <Modal open onClose={onClose} wide title="Bulk import questions" description="Paste many questions at once — one per line.">
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Course *"><Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</Select></Field>
          <Field label="Subject for all"><input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={60} /></Field>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          Format: <code>Question | Option A | Option B | Option C | Option D | Correct (A-D) | Explanation</code>
          <br />Example: <code>Capital of Maharashtra? | Pune | Mumbai | Nagpur | Nashik | B | Mumbai is the capital</code>
        </div>
        <textarea className={`${inputCls} h-56 py-2 font-mono text-xs`} value={text} onChange={(e) => setText(e.target.value)} required aria-label="Questions" />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Importing…' : 'Import'}</Button>
        </div>
      </form>
    </Modal>
  )
}
