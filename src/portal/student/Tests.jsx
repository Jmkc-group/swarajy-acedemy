import { Link } from 'react-router-dom'
import { Eye, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, Loaded, Page, Panel, Pill, useLoad } from '../ui'

export default function StudentTests() {
  const state = useLoad('/student/tests')
  return (
    <Page title="Tests" subtitle="Each test can be attempted once — the timer starts when you press Start">
      <Loaded state={state}>
        {(rows) => rows.length === 0 ? <Panel><Empty>No tests are available for your courses yet.</Empty></Panel> : (
          <div className="grid gap-3 md:grid-cols-2">
            {rows.map((t) => {
              const done = Boolean(t.submitted_at)
              return (
                <article key={t.id} className="rounded-xl border bg-card p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><h3 className="font-heading font-semibold">{t.title}</h3><p className="text-xs text-muted-foreground">{t.course_title}</p></div>
                    {done ? <Pill tone="green">Done</Pill> : t.attempt_id ? <Pill tone="gold">In progress</Pill> : <Pill tone="navy">New</Pill>}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{t.question_count} questions · {t.duration_min} min · {t.marks_per_q} mark each{t.negative ? ` · −${t.negative} for wrong` : ''}</p>
                  <div className="mt-3">
                    {done ? (
                      <Button asChild size="sm" variant="outline"><Link to={`/student/results/${t.attempt_id}`}><Eye /> View result ({t.score}/{t.total})</Link></Button>
                    ) : (
                      <Button asChild size="sm" variant="cta"><Link to={`/student/tests/${t.id}`}><PlayCircle /> {t.attempt_id ? 'Resume' : 'Start test'}</Link></Button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </Loaded>
    </Page>
  )
}
