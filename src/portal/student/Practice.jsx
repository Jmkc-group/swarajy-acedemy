import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { Empty, Loaded, Page, Panel, Select, useLoad } from '../ui'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function Practice() {
  const [subject, setSubject] = useState('')
  const state = useLoad(`/student/practice?subject=${encodeURIComponent(subject)}`)
  // Results keyed by question id: { choice, correct, answer, explanation }
  const [checked, setChecked] = useState({})

  const pick = async (qid, choice) => {
    if (checked[qid]) return
    try {
      const res = await api.post('/student/practice/check', { questionId: qid, choice })
      setChecked((c) => ({ ...c, [qid]: { choice, ...res } }))
    } catch { /* leave unanswered so they can retry */ }
  }
  const reshuffle = () => { setChecked({}); state.reload() }
  const done = Object.values(checked)
  const score = done.filter((c) => c.correct).length

  return (
    <Page title="Practice" subtitle="20 random MCQs with instant answers — not graded"
      actions={<Button variant="outline" size="sm" onClick={reshuffle}><RefreshCw /> New set</Button>}>
      <Loaded state={state}>
        {(d) => (
          <>
            <div className="flex flex-wrap items-center gap-3">
              {d.subjects.length > 1 && (
                <Select value={subject} onChange={(e) => { setSubject(e.target.value); setChecked({}) }} className="w-auto min-w-44" aria-label="Subject">
                  <option value="">All subjects</option>
                  {d.subjects.map((s) => <option key={s}>{s}</option>)}
                </Select>
              )}
              {d.questions.length > 0 && <p className="text-sm font-medium">Score: <b>{score}</b> / {done.length} answered of {d.questions.length}</p>}
            </div>
            {d.questions.length === 0 ? <Panel><Empty>No practice questions yet for your courses.</Empty></Panel> : (
              <ol className="space-y-3">
                {d.questions.map((x, i) => {
                  const r = checked[x.id]
                  return (
                    <li key={x.id} className="rounded-xl border bg-card p-4 shadow-xs">
                      <p className="text-sm font-medium"><span className="mr-1.5 text-muted-foreground">{i + 1}.</span>{x.text}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {x.options.map((o, k) => (
                          <button key={k} type="button" disabled={Boolean(r)} onClick={() => pick(x.id, k)}
                            className={cn('rounded-lg border px-3 py-2 text-left text-sm transition',
                              !r && 'hover:border-leaf hover:bg-leaf/5',
                              r && k === r.answer && 'border-leaf bg-leaf/10 font-semibold text-leaf',
                              r && k === r.choice && !r.correct && 'border-red-500 bg-red-50 text-red-700')}>
                            <b className="mr-1.5">{LETTERS[k]}.</b>{o}
                          </button>
                        ))}
                      </div>
                      {r && (
                        <p className={cn('mt-3 text-sm', r.correct ? 'text-leaf' : 'text-red-600')}>
                          {r.correct ? '✔ Correct!' : `✘ Wrong — correct answer is ${LETTERS[r.answer]}.`} {r.explanation && <span className="text-slate-600">{r.explanation}</span>}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </>
        )}
      </Loaded>
    </Page>
  )
}
