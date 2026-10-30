import { useEffect, useState } from 'react'
import { Check, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { Empty, Loaded, Page, Panel, Select, inputCls, todayStr, useAction, useLoad } from '../ui'
import { cn } from '@/lib/utils'

const OPTIONS = [
  ['P', 'Present', 'bg-leaf text-white'],
  ['A', 'Absent', 'bg-red-600 text-white'],
  ['L', 'Leave', 'bg-gold text-navy-950'],
]

export default function Attendance() {
  const [date, setDate] = useState(todayStr())
  const [course, setCourse] = useState('')
  const courses = useLoad('/admin/courses')
  const state = useLoad(`/admin/attendance?date=${date}&course=${encodeURIComponent(course)}`)
  const [marks, setMarks] = useState({})
  const [busy, run] = useAction()

  useEffect(() => {
    if (state.data) setMarks(Object.fromEntries(state.data.students.map((s) => [s.id, s.status])))
  }, [state.data])

  const setAll = (status) => setMarks(Object.fromEntries((state.data?.students ?? []).map((s) => [s.id, status])))
  const counts = Object.values(marks).reduce((a, v) => ({ ...a, [v ?? '-']: (a[v ?? '-'] ?? 0) + 1 }), {})

  const save = async () => {
    const records = Object.entries(marks).map(([studentId, status]) => ({ studentId: Number(studentId), status }))
    await run(() => api.put('/admin/attendance', { date, records }), 'Attendance saved.')
    state.reload()
  }

  return (
    <Page title="Attendance" subtitle="Mark the day's attendance for a course or the whole academy"
      actions={<Button onClick={save} disabled={busy || !state.data?.students.length}><Save /> {busy ? 'Saving…' : 'Save attendance'}</Button>}>
      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-xs font-semibold text-slate-700">Date
          <input type="date" className={`${inputCls} w-auto`} value={date} max={todayStr()} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </label>
        <label className="space-y-1 text-xs font-semibold text-slate-700">Course
          <Select value={course} onChange={(e) => setCourse(e.target.value)} className="min-w-48">
            <option value="">All students</option>
            {courses.data?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAll('P')}><Check /> All present</Button>
          <Button variant="outline" size="sm" onClick={() => setAll(null)}>Clear</Button>
        </div>
      </div>

      <Panel flush title={`Present ${counts.P ?? 0} · Absent ${counts.A ?? 0} · Leave ${counts.L ?? 0} · Unmarked ${counts['-'] ?? 0}`}>
        <Loaded state={state}>
          {(d) =>
            d.students.length === 0 ? (
              <Empty>No active students in this selection.</Empty>
            ) : (
              <ul className="divide-y">
                {d.students.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.login_id}{s.batch ? ` · ${s.batch}` : ''}</p>
                    </div>
                    <div className="flex gap-1.5" role="group" aria-label={`Attendance for ${s.name}`}>
                      {OPTIONS.map(([key, label, on]) => (
                        <button key={key} type="button" aria-pressed={marks[s.id] === key}
                          onClick={() => setMarks((m) => ({ ...m, [s.id]: m[s.id] === key ? null : key }))}
                          className={cn('h-8 rounded-md border px-3 text-xs font-semibold', marks[s.id] === key ? on : 'bg-white text-slate-600 hover:bg-slate-50')}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )
          }
        </Loaded>
      </Panel>
    </Page>
  )
}
