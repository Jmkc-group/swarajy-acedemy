import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Bar, DataTable, Empty, Loaded, Page, Panel, Pill, Stat, Td, fmtDate, pct, useLoad } from '../ui'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export function ResultsList() {
  const state = useLoad('/student/results')
  return (
    <Page title="My results" subtitle="Your performance across all tests">
      <Loaded state={state}>
        {(rows) => rows.length === 0 ? <Panel><Empty>No results yet — take a test to see your progress here.</Empty></Panel> : (
          <>
            <Panel title="Progress">
              <div className="flex h-32 items-end gap-2">
                {[...rows].reverse().slice(-12).map((r) => (
                  <div key={r.id} className="flex flex-1 flex-col items-center gap-1" title={`${r.title}: ${pct(r.score, r.total)}%`}>
                    <span className="text-[10px] font-semibold tabular-nums">{Math.max(0, pct(r.score, r.total))}%</span>
                    <div className="w-full rounded-t bg-navy" style={{ height: `${Math.max(4, pct(r.score, r.total) * 0.8)}px` }} />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Score percentage of your latest tests (oldest → newest)</p>
            </Panel>
            <Panel flush>
              <DataTable head={['Test', 'Score', 'Rank', 'Date', '']}>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <Td><b>{r.title}</b><div className="text-xs text-muted-foreground">{r.course_title}</div></Td>
                    <Td className="tabular-nums"><b>{r.score}</b>/{r.total} <span className="text-xs text-muted-foreground">({pct(r.score, r.total)}%)</span></Td>
                    <Td className="tabular-nums">#{r.rank} <span className="text-xs text-muted-foreground">of {r.participants}</span></Td>
                    <Td>{fmtDate(r.submitted_at)}</Td>
                    <Td className="text-right"><Link to={`/student/results/${r.id}`} className="text-sm font-semibold text-navy hover:underline">Review</Link></Td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          </>
        )}
      </Loaded>
    </Page>
  )
}

export function ResultDetail() {
  const { id } = useParams()
  const state = useLoad(`/student/results/${id}`)
  const board = useLoad(state.data ? `/student/leaderboard/${state.data.test.id}` : null)
  return (
    <Page title={state.data ? state.data.test.title : 'Result'} actions={<Button asChild variant="ghost" size="sm"><Link to="/student/results"><ArrowLeft /> All results</Link></Button>}>
      <Loaded state={state}>
        {(d) => {
          const a = d.attempt
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                <Stat icon={Trophy} tone="gold" label="Score" value={`${a.score}/${a.total}`} hint={`${pct(a.score, a.total)}%`} />
                <Stat label="Correct" value={a.correct} />
                <Stat tone="red" label="Wrong" value={a.wrong} />
                <Stat tone="navy" label="Skipped" value={a.skipped} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Subject-wise">
                  <ul className="space-y-3">
                    {d.bySubject.map((s) => (
                      <li key={s.subject}>
                        <div className="mb-1 flex justify-between text-sm"><span>{s.subject}</span><b className="tabular-nums">{s.correct}/{s.total}</b></div>
                        <Bar value={pct(s.correct, s.total)} />
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Panel title="Top 10 leaderboard" flush>
                  {board.data ? (
                    <ol className="divide-y">
                      {board.data.rows.map((r) => (
                        <li key={r.rank} className={cn('flex items-center justify-between px-4 py-2 text-sm', r.me && 'bg-gold/15 font-semibold')}>
                          <span>#{r.rank} {r.name}{r.me ? ' (you)' : ''}</span><span className="tabular-nums">{r.score}/{r.total}</span>
                        </li>
                      ))}
                    </ol>
                  ) : <Empty>Loading…</Empty>}
                </Panel>
              </div>
              <Panel title="Answer review">
                <ol className="space-y-5">
                  {d.review.map((x, i) => {
                    const state = x.chosen === null ? 'skipped' : x.chosen === x.answer ? 'right' : 'wrong'
                    return (
                      <li key={x.id}>
                        <p className="flex items-start gap-2 text-sm font-medium"><span>{i + 1}.</span><span>{x.text}</span>
                          <Pill tone={state === 'right' ? 'green' : state === 'wrong' ? 'red' : 'slate'}>{state === 'right' ? 'Correct' : state === 'wrong' ? 'Wrong' : 'Skipped'}</Pill></p>
                        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                          {x.options.map((o, k) => (
                            <li key={k} className={cn('rounded-md border px-2.5 py-1.5 text-sm', k === x.answer && 'border-leaf bg-leaf/10 font-semibold text-leaf', k === x.chosen && k !== x.answer && 'border-red-500 bg-red-50 text-red-700')}>
                              <b className="mr-1.5">{LETTERS[k]}.</b>{o}{k === x.chosen ? '  ← your answer' : ''}
                            </li>
                          ))}
                        </ul>
                        {x.explanation && <p className="mt-1.5 text-xs text-muted-foreground">💡 {x.explanation}</p>}
                      </li>
                    )
                  })}
                </ol>
              </Panel>
            </>
          )
        }}
      </Loaded>
    </Page>
  )
}
