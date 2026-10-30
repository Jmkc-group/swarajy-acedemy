import { Link } from 'react-router-dom'
import { BookOpenCheck, CalendarCheck, FileText, GraduationCap, IndianRupee, ListChecks, MessageCircle, Users } from 'lucide-react'
import { Bar, Empty, Loaded, Page, Panel, Stat, fmtDate, money, pct, useLoad, waLink } from '../ui'

export default function Dashboard() {
  const state = useLoad('/admin/stats')
  return (
    <Page title="Dashboard" subtitle="Academy overview at a glance">
      <Loaded state={state}>
        {(d) => {
          const maxEnrol = Math.max(1, ...d.enrolment.map((c) => c.students))
          const maxMonth = Math.max(1, ...d.collectionByMonth.map((m) => m.amount))
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Stat icon={Users} label="Active students" value={d.counts.students} hint={d.counts.inactive ? `${d.counts.inactive} inactive` : undefined} />
                <Stat
                  icon={CalendarCheck}
                  tone="navy"
                  label="Attendance today"
                  value={d.attendanceToday.marked ? `${pct(d.attendanceToday.present, d.attendanceToday.marked)}%` : '—'}
                  hint={d.attendanceToday.marked ? `${d.attendanceToday.present}/${d.attendanceToday.marked} present` : 'Not marked yet'}
                />
                <Stat icon={IndianRupee} tone="gold" label="Fees collected" value={money(d.fees.collected)} hint={`of ${money(d.fees.total)}`} />
                <Stat icon={IndianRupee} tone="red" label="Fees pending" value={money(d.fees.pending)} />
                <Stat icon={FileText} tone="saffron" label="Notes uploaded" value={d.counts.notes} />
                <Stat icon={ListChecks} tone="navy" label="Questions in bank" value={d.counts.questions} />
                <Stat icon={BookOpenCheck} label="Live tests" value={d.counts.tests} />
                <Stat icon={GraduationCap} tone="gold" label="Tests submitted" value={d.counts.attempts} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Students per course">
                  <ul className="space-y-3">
                    {d.enrolment.map((c) => (
                      <li key={c.title}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{c.title}</span>
                          <b className="tabular-nums">{c.students}</b>
                        </div>
                        <Bar value={(c.students / maxEnrol) * 100} />
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel title="Fee collection (last 6 months)">
                  {d.collectionByMonth.length === 0 ? (
                    <Empty>No payments recorded yet.</Empty>
                  ) : (
                    <div className="flex h-44 items-end gap-3">
                      {d.collectionByMonth.map((m) => (
                        <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                          <span className="text-[11px] font-semibold tabular-nums">{money(m.amount)}</span>
                          <div className="w-full rounded-t-md bg-gold" style={{ height: `${Math.max(6, (m.amount / maxMonth) * 120)}px` }} />
                          <span className="text-[11px] text-muted-foreground">{m.month.slice(5)}/{m.month.slice(2, 4)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Attendance — last 7 days">
                  {d.attendanceWeek.length === 0 ? (
                    <Empty>Attendance has not been marked this week.</Empty>
                  ) : (
                    <ul className="space-y-2.5">
                      {d.attendanceWeek.map((a) => (
                        <li key={a.date} className="flex items-center gap-3 text-sm">
                          <span className="w-24 shrink-0 text-muted-foreground">{fmtDate(a.date)}</span>
                          <Bar value={pct(a.present, a.marked)} tone="bg-navy" />
                          <b className="w-12 text-right tabular-nums">{pct(a.present, a.marked)}%</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Pending fees" action={<Link to="/admin/fees" className="text-xs font-semibold text-navy hover:underline">View all</Link>} flush>
                  {d.dueSoon.length === 0 ? (
                    <Empty>No pending fees. 🎉</Empty>
                  ) : (
                    <ul className="divide-y">
                      {d.dueSoon.map((s) => {
                        const due = s.total - s.paid
                        const wa = waLink(
                          s.parent_phone || s.phone,
                          `Namaste, Swarajya Career Academy kadun reminder: ${s.name} (${s.login_id}) yanchi ${money(due)} fee baaki aahe. Krupaya bharna karave. Dhanyavaad.`,
                        )
                        return (
                          <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                            <Link to={`/admin/students/${s.id}`} className="min-w-0 hover:underline">
                              <span className="block truncate font-medium">{s.name}</span>
                              <span className="text-xs text-muted-foreground">{s.login_id}</span>
                            </Link>
                            <span className="flex shrink-0 items-center gap-2">
                              <b className="text-red-600 tabular-nums">{money(due)}</b>
                              {wa && (
                                <a href={wa} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-lg bg-green-100 text-green-700" aria-label={`WhatsApp reminder to ${s.name}`}>
                                  <MessageCircle className="size-4" />
                                </a>
                              )}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </Panel>

                <Panel title="Recent payments" flush>
                  {d.recentPayments.length === 0 ? (
                    <Empty>Nothing yet.</Empty>
                  ) : (
                    <ul className="divide-y">
                      {d.recentPayments.map((p) => (
                        <li key={p.id} className="flex justify-between gap-3 px-4 py-2.5 text-sm">
                          <span>{p.name} <span className="text-xs text-muted-foreground">· {fmtDate(p.paid_on)}</span></span>
                          <b className="tabular-nums text-leaf">{money(p.amount)}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Recent test results" flush>
                  {d.recentResults.length === 0 ? (
                    <Empty>No test has been submitted yet.</Empty>
                  ) : (
                    <ul className="divide-y">
                      {d.recentResults.map((r) => (
                        <li key={r.id} className="flex justify-between gap-3 px-4 py-2.5 text-sm">
                          <span className="min-w-0 truncate">{r.name} <span className="text-xs text-muted-foreground">· {r.title}</span></span>
                          <b className="shrink-0 tabular-nums">{r.score}/{r.total}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
              </div>
            </>
          )
        }}
      </Loaded>
    </Page>
  )
}
