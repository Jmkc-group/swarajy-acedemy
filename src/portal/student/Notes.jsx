import { useState } from 'react'
import { ExternalLink, FileText, Link2 } from 'lucide-react'
import { fileUrl } from '../api'
import { Empty, Loaded, Page, Panel, Pill, Select, fmtDate, useLoad } from '../ui'

export default function StudentNotes() {
  const state = useLoad('/student/notes')
  const [course, setCourse] = useState('')
  return (
    <Page title="Study notes" subtitle="Material shared by your teachers">
      <Loaded state={state}>
        {(all) => {
          const courses = [...new Map(all.map((n) => [n.course_id, n.course_title])).entries()]
          const rows = all.filter((n) => !course || n.course_id === course)
          return (
            <>
              {courses.length > 1 && (
                <Select value={course} onChange={(e) => setCourse(e.target.value)} className="w-auto min-w-48" aria-label="Course">
                  <option value="">All my courses</option>
                  {courses.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
                </Select>
              )}
              {rows.length === 0 ? <Panel><Empty>No notes have been shared yet.</Empty></Panel> : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((n) => (
                    <a key={n.id} href={n.kind === 'file' ? fileUrl(n.url) : n.url} target="_blank" rel="noreferrer"
                      className="group flex flex-col rounded-xl border bg-card p-4 shadow-xs transition hover:border-leaf hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-saffron/10 text-saffron-deep">{n.kind === 'file' ? <FileText className="size-5" /> : <Link2 className="size-5" />}</span>
                        <div className="min-w-0"><h3 className="font-heading text-sm font-semibold">{n.title}</h3><p className="text-xs text-muted-foreground">{fmtDate(n.created_at)}</p></div>
                      </div>
                      {n.description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{n.description}</p>}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex gap-1.5"><Pill tone="navy">{n.course_title}</Pill>{n.subject && <Pill tone="gold">{n.subject}</Pill>}</span>
                        <ExternalLink className="size-4 text-slate-400 group-hover:text-leaf" aria-hidden="true" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )
        }}
      </Loaded>
    </Page>
  )
}
