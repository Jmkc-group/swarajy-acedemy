import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { DataTable, Empty, Loaded, Page, Panel, Pill, Stat, Td, confirmAction, fmtDate, pct, useAction, useLoad } from '../ui'

export default function TestResults() {
  const { id } = useParams()
  const state = useLoad(`/admin/tests/${id}/results`)
  const [busy, run] = useAction()

  const exportCsv = (d) => {
    const rows = [['Rank', 'Name', 'Login ID', 'Score', 'Total', 'Correct', 'Wrong', 'Skipped', 'Submitted']]
    d.attempts.filter((a) => a.submitted_at).forEach((a, i) => rows.push([i + 1, a.name, a.login_id, a.score, a.total, a.correct, a.wrong, a.skipped, a.submitted_at]))
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv' }))
    a.download = `${d.test.title}-results.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <Page title={state.data ? `Results — ${state.data.test.title}` : 'Results'} subtitle={state.data?.test.course_title}
      actions={<>
        <Button asChild variant="ghost" size="sm"><Link to="/admin/tests"><ArrowLeft /> Tests</Link></Button>
        {state.data && <Button variant="outline" size="sm" onClick={() => exportCsv(state.data)}><Download /> Export CSV</Button>}
      </>}>
      <Loaded state={state}>
        {(d) => {
          const done = d.attempts.filter((a) => a.submitted_at)
          const avg = done.length ? done.reduce((s, a) => s + a.score, 0) / done.length : 0
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat icon={Trophy} tone="gold" label="Top score" value={done.length ? `${done[0].score}/${done[0].total}` : '—'} hint={done[0]?.name} />
                <Stat label="Average" value={done.length ? avg.toFixed(1) : '—'} tone="navy" />
                <Stat label="Submitted" value={done.length} hint={`${d.notAttempted.length} yet to attempt`} />
              </div>
              <Panel title="Leaderboard" flush>
                {d.attempts.length === 0 ? <Empty>No one has attempted this test yet.</Empty> : (
                  <DataTable head={['#', 'Student', 'Score', 'Correct / Wrong / Skipped', 'Submitted', '']}>
                    {d.attempts.map((a, i) => (
                      <tr key={a.id}>
                        <Td className="font-bold">{a.submitted_at ? i + 1 : '—'}</Td>
                        <Td><Link to={`/admin/students/${a.student_id}`} className="font-medium text-navy hover:underline">{a.name}</Link><div className="text-xs text-muted-foreground">{a.login_id}</div></Td>
                        <Td className="tabular-nums">{a.submitted_at ? <><b>{a.score}</b>/{a.total} <span className="text-xs text-muted-foreground">({pct(a.score, a.total)}%)</span></> : <Pill tone="gold">In progress</Pill>}</Td>
                        <Td className="tabular-nums text-xs">{a.submitted_at ? `${a.correct} / ${a.wrong} / ${a.skipped}` : '—'}</Td>
                        <Td>{fmtDate(a.submitted_at)}</Td>
                        <Td className="text-right">
                          <button type="button" disabled={busy} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                            onClick={async () => {
                              if (!confirmAction(`Let ${a.name} attempt this test again? Their current result is deleted.`)) return
                              await run(() => api.del(`/admin/attempts/${a.id}`), 'Attempt reset.')
                              state.reload()
                            }}><RotateCcw className="size-3" /> Allow retake</button>
                        </Td>
                      </tr>
                    ))}
                  </DataTable>
                )}
              </Panel>
              {d.notAttempted.length > 0 && (
                <Panel title={`Not attempted yet (${d.notAttempted.length})`}>
                  <div className="flex flex-wrap gap-1.5">{d.notAttempted.map((s) => <Pill key={s.id}>{s.name}</Pill>)}</div>
                </Panel>
              )}
            </>
          )
        }}
      </Loaded>
    </Page>
  )
}
