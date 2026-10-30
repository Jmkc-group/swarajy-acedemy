import { Link } from 'react-router-dom'
import { CalendarCheck, FileText, IndianRupee, ListChecks, Megaphone, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Bar, Empty, Loaded, Page, Panel, Pill, Stat, fmtDate, money, pct, useLoad } from '../ui'

export default function StudentDashboard() {
  const state = useLoad('/student/dashboard')
  return (
    <Loaded state={state}>
      {(d) => {
        const att = pct(d.attendance.present, d.attendance.marked)
        const due = Math.max(0, d.fee.total - d.fee.paid)
        return (
          <Page title={`Welcome, ${d.profile.name.split(' ')[0]}!`} subtitle={`${d.profile.login_id}${d.profile.batch ? ` · ${d.profile.batch}` : ''}`}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Stat icon={CalendarCheck} tone={att >= 75 || !d.attendance.marked ? 'green' : 'red'} label="Attendance" value={d.attendance.marked ? `${att}%` : '—'} hint={d.attendance.marked ? `${d.attendance.present}/${d.attendance.marked} days` : 'Nothing marked yet'} />
              <Stat icon={IndianRupee} tone={due ? 'red' : 'green'} label="Fees due" value={due ? money(due) : 'Clear'} hint={`${money(d.fee.paid)} paid`} />
              <Stat icon={FileText} tone="saffron" label="Notes available" value={d.counts.notes} />
              <Stat icon={ListChecks} tone="navy" label="Practice questions" value={d.counts.questions} />
            </div>

            <Panel title="My courses">
              {d.courses.length === 0 ? <Empty>No course assigned yet. Please contact the academy office.</Empty> : (
                <div className="flex flex-wrap gap-2">{d.courses.map((c) => <Pill key={c.id} tone="green">{c.title}</Pill>)}</div>
              )}
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Tests waiting for you" flush>
                {d.pendingTests.length === 0 ? <Empty>No pending tests right now.</Empty> : (
                  <ul className="divide-y">
                    {d.pendingTests.map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0"><p className="truncate text-sm font-medium">{t.title}</p><p className="text-xs text-muted-foreground">{t.question_count} questions · {t.duration_min} min</p></div>
                        <Button asChild size="sm" variant="cta"><Link to={`/student/tests/${t.id}`}><PlayCircle /> Start</Link></Button>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
              <Panel title="Recent results" action={<Link to="/student/results" className="text-xs font-semibold text-navy hover:underline">All results</Link>} flush>
                {d.recentResults.length === 0 ? <Empty>You have not taken a test yet.</Empty> : (
                  <ul className="divide-y">
                    {d.recentResults.map((r) => (
                      <li key={r.id} className="px-4 py-3">
                        <Link to={`/student/results/${r.id}`} className="flex items-center justify-between gap-3 text-sm hover:underline">
                          <span className="truncate">{r.title}</span><b className="tabular-nums">{r.score}/{r.total}</b>
                        </Link>
                        <Bar value={pct(r.score, r.total)} tone="bg-gold" className="mt-1.5" />
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>

            <Panel title="Notices from the academy" flush>
              {d.announcements.length === 0 ? <Empty>No notices.</Empty> : (
                <ul className="divide-y">
                  {d.announcements.map((a) => (
                    <li key={a.id} className="px-4 py-3">
                      <p className="flex items-center gap-2 text-sm font-semibold"><Megaphone className="size-4 text-saffron" aria-hidden="true" />{a.title}</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{a.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{fmtDate(a.created_at)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </Page>
        )
      }}
    </Loaded>
  )
}
