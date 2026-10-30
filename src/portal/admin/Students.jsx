import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, Empty, Loaded, Page, Panel, Pill, Select, Td, inputCls, money, useLoad } from '../ui'
import { CredentialsModal, StudentFormModal } from './studentParts'

export default function Students() {
  const [term, setTerm] = useState('')
  const [course, setCourse] = useState('')
  const [adding, setAdding] = useState(false)
  const [creds, setCreds] = useState(null)
  const courses = useLoad('/admin/courses')
  const students = useLoad(`/admin/students?q=${encodeURIComponent(term)}&course=${encodeURIComponent(course)}`)
  const titleOf = (id) => courses.data?.find((c) => c.id === id)?.title ?? id

  return (
    <Page
      title="Students"
      subtitle="Create IDs, assign courses and track every student"
      actions={<Button onClick={() => setAdding(true)} disabled={!courses.data}><Plus /> Add student</Button>}
    >
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input className={`${inputCls} pl-9`} placeholder="Search name, ID or phone" value={term} onChange={(e) => setTerm(e.target.value)} aria-label="Search students" />
        </div>
        <Select value={course} onChange={(e) => setCourse(e.target.value)} className="w-auto min-w-44" aria-label="Filter by course">
          <option value="">All courses</option>
          {courses.data?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </Select>
      </div>

      <Panel flush>
        <Loaded state={students}>
          {(rows) =>
            rows.length === 0 ? (
              <Empty>No students found. Use “Add student” to create the first login.</Empty>
            ) : (
              <DataTable head={['Student', 'Courses', 'Attendance', 'Fees due', 'Status']}>
                {rows.map((s) => {
                  const due = s.feeTotal - s.feePaid
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <Td>
                        <Link to={`/admin/students/${s.id}`} className="font-medium text-navy hover:underline">{s.name}</Link>
                        <div className="text-xs text-muted-foreground tabular-nums">{s.login_id}{s.batch ? ` · ${s.batch}` : ''}</div>
                      </Td>
                      <Td className="max-w-56">
                        <div className="flex flex-wrap gap-1">
                          {s.courseIds.length ? s.courseIds.map((id) => <Pill key={id} tone="navy">{titleOf(id)}</Pill>) : <span className="text-xs text-muted-foreground">None</span>}
                        </div>
                      </Td>
                      <Td className="tabular-nums">{s.attendancePct === null ? '—' : <Pill tone={s.attendancePct >= 75 ? 'green' : 'red'}>{s.attendancePct}%</Pill>}</Td>
                      <Td className="tabular-nums">{due > 0 ? <b className="text-red-600">{money(due)}</b> : <span className="text-leaf">Clear</span>}</Td>
                      <Td>{s.active ? <Pill tone="green">Active</Pill> : <Pill tone="slate">Disabled</Pill>}</Td>
                    </tr>
                  )
                })}
              </DataTable>
            )
          }
        </Loaded>
      </Panel>
      {students.data && <p className="text-xs text-muted-foreground">{students.data.length} student(s)</p>}

      {adding && (
        <StudentFormModal
          open
          courses={courses.data}
          onClose={() => setAdding(false)}
          onSaved={(out) => {
            setAdding(false)
            setCreds(out)
            students.reload()
          }}
        />
      )}
      <CredentialsModal creds={creds} onClose={() => setCreds(null)} />
    </Page>
  )
}
