import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Clock, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { api } from '../api'
import { Page, Panel, Spinner, confirmAction } from '../ui'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const clock = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function TakeTest() {
  const { id } = useParams()
  const nav = useNavigate()
  const [phase, setPhase] = useState('intro') // intro | loading | running | error
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [left, setLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const endsAt = useRef(0)
  const answersRef = useRef({})
  const submitted = useRef(false)

  const start = async () => {
    setPhase('loading')
    try {
      const d = await api.post(`/student/tests/${id}/start`)
      // Use the server clock so a wrong device clock can't extend the time.
      endsAt.current = Date.now() + (d.endsAt - d.now)
      answersRef.current = d.savedAnswers
      setAnswers(d.savedAnswers)
      setData(d)
      setPhase('running')
    } catch (e) {
      setError(e.message)
      setPhase('error')
    }
  }

  const submit = useCallback(async (auto = false) => {
    if (submitted.current) return
    submitted.current = true
    setSubmitting(true)
    try {
      const res = await api.post(`/student/tests/${id}/submit`, { answers: answersRef.current })
      toast.success(auto ? 'Time is up — test submitted.' : 'Test submitted.')
      nav(`/student/results/${res.attemptId}`, { replace: true })
    } catch (e) {
      submitted.current = false
      setSubmitting(false)
      toast.error(e.message)
    }
  }, [id, nav])

  useEffect(() => {
    if (phase !== 'running') return undefined
    const tick = () => {
      const ms = endsAt.current - Date.now()
      setLeft(ms)
      if (ms <= 0) submit(true)
    }
    tick()
    const t = setInterval(tick, 1000)
    const warn = (e) => { if (!submitted.current) e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => { clearInterval(t); window.removeEventListener('beforeunload', warn) }
  }, [phase, submit])

  const choose = (qid, k) => {
    const next = { ...answersRef.current, [qid]: k }
    answersRef.current = next
    setAnswers(next)
    api.put(`/student/tests/${id}/answers`, { answers: next }).catch(() => {}) // best-effort autosave
  }

  if (phase === 'intro') {
    return (
      <Page title="Ready to begin?">
        <Panel className="max-w-xl space-y-3 text-sm">
          <ul className="list-disc space-y-1.5 pl-5 text-slate-700">
            <li>The timer starts the moment you press <b>Start</b> and cannot be paused.</li>
            <li>You can attempt this test <b>only once</b>. Answers are saved as you go, so you can resume after a refresh.</li>
            <li>The test is submitted automatically when time runs out.</li>
            <li>Correct answers and explanations are shown after you submit.</li>
          </ul>
          <div className="flex gap-2 pt-2">
            <Button variant="cta" size="lg" onClick={start}>Start test</Button>
            <Button asChild variant="outline" size="lg"><Link to="/student/tests">Back</Link></Button>
          </div>
        </Panel>
      </Page>
    )
  }
  if (phase === 'loading') return <Spinner label="Preparing your test…" />
  if (phase === 'error') {
    return (
      <Page title="Cannot start test">
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
        <Button asChild variant="outline"><Link to="/student/results">View my results</Link></Button>
      </Page>
    )
  }

  const qs = data.questions
  const q = qs[current]
  const answered = Object.keys(answers).length
  const low = left < 60_000

  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b bg-white/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="min-w-0"><p className="truncate font-heading font-semibold">{data.test.title}</p><p className="text-xs text-muted-foreground">{answered}/{qs.length} answered</p></div>
        <div className="flex items-center gap-3">
          <span role="timer" className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums', low ? 'animate-pulse bg-red-100 text-red-700' : 'bg-navy/10 text-navy')}>
            <Clock className="size-4" aria-hidden="true" />{clock(left)}
          </span>
          <Button variant="cta" disabled={submitting} onClick={() => confirmAction(`Submit now? ${qs.length - answered} question(s) are unanswered.`) && submit(false)}><Send /> Submit</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <Panel>
          <p className="mb-1 text-xs font-semibold text-muted-foreground">Question {current + 1} of {qs.length}{q.subject ? ` · ${q.subject}` : ''}</p>
          <p className="text-base font-medium leading-relaxed">{q.text}</p>
          <div className="mt-4 space-y-2">
            {q.options.map((o, k) => (
              <button key={k} type="button" onClick={() => choose(q.id, k)} aria-pressed={answers[q.id] === k}
                className={cn('flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition', answers[q.id] === k ? 'border-leaf bg-leaf/10 font-semibold' : 'hover:border-leaf/60 hover:bg-slate-50')}>
                <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold', answers[q.id] === k && 'border-leaf bg-leaf text-white')}>{LETTERS[k]}</span>{o}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Previous</Button>
            {answers[q.id] !== undefined && <button type="button" className="text-xs text-muted-foreground underline" onClick={() => { const n = { ...answersRef.current }; delete n[q.id]; answersRef.current = n; setAnswers(n); api.put(`/student/tests/${id}/answers`, { answers: n }).catch(() => {}) }}>Clear answer</button>}
            <Button disabled={current === qs.length - 1} onClick={() => setCurrent((c) => c + 1)}>Next</Button>
          </div>
        </Panel>
        <Panel title="Questions" className="h-fit">
          <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
            {qs.map((x, i) => (
              <button key={x.id} type="button" onClick={() => setCurrent(i)} aria-label={`Question ${i + 1}${answers[x.id] !== undefined ? ', answered' : ''}`}
                className={cn('grid aspect-square place-items-center rounded-md border text-xs font-semibold', i === current && 'ring-2 ring-gold', answers[x.id] !== undefined ? 'border-leaf bg-leaf text-white' : 'bg-white text-slate-600')}>{i + 1}</button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
