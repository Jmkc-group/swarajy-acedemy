import { Router } from 'express'
import { db, tx } from '../db.js'
import { HttpError } from '../auth.js'
import { str, id, found } from '../util.js'

const r = Router()
const q = (sql) => db.prepare(sql)

// Every student route works on the logged-in student's own data only.
const inCourse = (sid) => `EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id=${sid} AND e.course_id=`

r.get('/dashboard', (req, res) => {
  const sid = req.user.id
  const profile = q(`SELECT u.name, u.login_id, s.batch, s.joined_on, s.phone FROM users u JOIN students s ON s.user_id=u.id WHERE u.id=?`).get(sid)
  const att = q(`SELECT COUNT(*) marked, COALESCE(SUM(status='P'),0) present FROM attendance WHERE student_id=?`).get(sid)
  const fee = q(`SELECT COALESCE((SELECT total FROM fees WHERE student_id=?),0) total,
    COALESCE((SELECT SUM(amount) FROM payments WHERE student_id=?),0) paid`).get(sid, sid)
  res.json({
    profile,
    courses: q(`SELECT c.id, c.title FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.student_id=? AND c.active=1`).all(sid),
    attendance: att,
    fee,
    pendingTests: q(`SELECT t.id, t.title, t.duration_min, c.title course_title,
        (SELECT COUNT(*) FROM test_questions tq WHERE tq.test_id=t.id) question_count
      FROM tests t JOIN courses c ON c.id=t.course_id
      WHERE t.status='published' AND ${inCourse(sid)}t.course_id)
        AND NOT EXISTS (SELECT 1 FROM attempts a WHERE a.test_id=t.id AND a.student_id=? AND a.submitted_at IS NOT NULL)
      ORDER BY t.id DESC LIMIT 5`).all(sid),
    recentResults: q(`SELECT a.id, a.score, a.total, a.submitted_at, t.title FROM attempts a JOIN tests t ON t.id=a.test_id
      WHERE a.student_id=? AND a.submitted_at IS NOT NULL ORDER BY a.submitted_at DESC LIMIT 5`).all(sid),
    announcements: q(`SELECT a.id, a.title, a.body, a.created_at FROM announcements a
      WHERE a.course_id IS NULL OR ${inCourse(sid)}a.course_id) ORDER BY a.id DESC LIMIT 5`).all(),
    counts: {
      notes: q(`SELECT COUNT(*) v FROM notes n WHERE ${inCourse(sid)}n.course_id)`).get().v,
      questions: q(`SELECT COUNT(*) v FROM questions x WHERE ${inCourse(sid)}x.course_id)`).get().v,
    },
  })
})

r.get('/notes', (req, res) => {
  const sid = req.user.id
  res.json(q(`SELECT n.id, n.subject, n.title, n.description, n.kind, n.url, n.file_name, n.created_at, c.title course_title, c.id course_id
    FROM notes n JOIN courses c ON c.id=n.course_id WHERE ${inCourse(sid)}n.course_id) ORDER BY n.id DESC`).all())
})

// ---- practice (instant feedback, never graded) --------------------------
r.get('/practice', (req, res) => {
  const sid = req.user.id
  const course = str(req.query.course, { max: 60 })
  const subject = str(req.query.subject, { max: 60 })
  const rows = q(`SELECT x.id, x.course_id, x.subject, x.text, x.options FROM questions x
    WHERE ${inCourse(sid)}x.course_id) AND (? = '' OR x.course_id=?) AND (? = '' OR x.subject=?)
    ORDER BY RANDOM() LIMIT 20`).all(course, course, subject, subject)
  const subjects = q(`SELECT DISTINCT x.subject FROM questions x WHERE ${inCourse(sid)}x.course_id) ORDER BY x.subject`).all().map((x) => x.subject)
  res.json({ subjects, questions: rows.map((x) => ({ ...x, options: JSON.parse(x.options) })) })
})

r.post('/practice/check', (req, res) => {
  const sid = req.user.id
  const row = found(q(`SELECT x.answer, x.explanation FROM questions x WHERE x.id=? AND ${inCourse(sid)}x.course_id)`).get(id(req.body.questionId)), 'Question')
  res.json({ correct: Number(req.body.choice) === row.answer, answer: row.answer, explanation: row.explanation })
})

// ---- tests ----------------------------------------------------------------
function grade(attempt, test) {
  const rows = q(`SELECT x.id, x.answer FROM test_questions tq JOIN questions x ON x.id=tq.question_id WHERE tq.test_id=?`).all(test.id)
  const given = attempt.answers ? JSON.parse(attempt.answers) : {}
  let correct = 0
  let wrong = 0
  for (const row of rows) {
    const choice = given[row.id]
    if (choice === undefined || choice === null) continue
    if (Number(choice) === row.answer) correct++
    else wrong++
  }
  const score = Math.round((correct * test.marks_per_q - wrong * test.negative) * 100) / 100
  return { score, total: rows.length * test.marks_per_q, correct, wrong, skipped: rows.length - correct - wrong }
}

function finalise(attempt, test, answers) {
  const withAnswers = { ...attempt, answers: JSON.stringify(answers ?? {}) }
  const g = grade(withAnswers, test)
  q(`UPDATE attempts SET answers=?, submitted_at=datetime('now'), score=?, total=?, correct=?, wrong=?, skipped=? WHERE id=?`)
    .run(withAnswers.answers, g.score, g.total, g.correct, g.wrong, g.skipped, attempt.id)
  return g
}

const deadline = (attempt, test) => Date.parse(`${attempt.started_at.replace(' ', 'T')}Z`) + test.duration_min * 60_000

r.get('/tests', (req, res) => {
  const sid = req.user.id
  res.json(q(`SELECT t.id, t.title, t.duration_min, t.marks_per_q, t.negative, c.title course_title,
      (SELECT COUNT(*) FROM test_questions tq WHERE tq.test_id=t.id) question_count,
      a.id attempt_id, a.submitted_at, a.score, a.total
    FROM tests t JOIN courses c ON c.id=t.course_id LEFT JOIN attempts a ON a.test_id=t.id AND a.student_id=?
    WHERE t.status='published' AND ${inCourse(sid)}t.course_id) ORDER BY t.id DESC`).all(sid))
})

r.post('/tests/:id/start', (req, res) => {
  const sid = req.user.id
  const test = found(q(`SELECT * FROM tests t WHERE t.id=? AND t.status='published' AND ${inCourse(sid)}t.course_id)`).get(id(req.params.id)), 'Test')
  let attempt = q('SELECT * FROM attempts WHERE test_id=? AND student_id=?').get(test.id, sid)
  if (attempt?.submitted_at) throw new HttpError(409, 'You have already submitted this test.')
  if (!attempt) {
    const started = new Date().toISOString().slice(0, 19).replace('T', ' ')
    q('INSERT INTO attempts (test_id, student_id, started_at) VALUES (?,?,?)').run(test.id, sid, started)
    attempt = q('SELECT * FROM attempts WHERE test_id=? AND student_id=?').get(test.id, sid)
  }
  const end = deadline(attempt, test)
  if (Date.now() > end + 5000) {
    finalise(attempt, test, attempt.answers ? JSON.parse(attempt.answers) : {})
    throw new HttpError(409, 'Time is over for this test. It was submitted automatically.')
  }
  const questions = q(`SELECT x.id, x.subject, x.text, x.options FROM test_questions tq JOIN questions x ON x.id=tq.question_id
    WHERE tq.test_id=? ORDER BY tq.pos`).all(test.id).map((x) => ({ ...x, options: JSON.parse(x.options) }))
  res.json({
    test: { id: test.id, title: test.title, marksPerQ: test.marks_per_q, negative: test.negative },
    questions,
    savedAnswers: attempt.answers ? JSON.parse(attempt.answers) : {},
    endsAt: end,
    now: Date.now(),
  })
})

// Progress save so a refresh or dropped connection doesn't lose answers.
r.put('/tests/:id/answers', (req, res) => {
  const attempt = found(q('SELECT * FROM attempts WHERE test_id=? AND student_id=? AND submitted_at IS NULL').get(id(req.params.id), req.user.id), 'Attempt')
  q('UPDATE attempts SET answers=? WHERE id=?').run(JSON.stringify(req.body.answers ?? {}), attempt.id)
  res.json({ ok: true })
})

r.post('/tests/:id/submit', (req, res) => {
  const sid = req.user.id
  const test = found(q('SELECT * FROM tests WHERE id=?').get(id(req.params.id)), 'Test')
  const attempt = found(q('SELECT * FROM attempts WHERE test_id=? AND student_id=?').get(test.id, sid), 'Attempt')
  if (attempt.submitted_at) throw new HttpError(409, 'Already submitted.')
  const result = tx(() => finalise(attempt, test, req.body.answers))
  res.json({ attemptId: attempt.id, ...result })
})

r.get('/results', (req, res) => {
  res.json(q(`SELECT a.id, a.score, a.total, a.correct, a.wrong, a.skipped, a.submitted_at, t.title, c.title course_title,
      (SELECT COUNT(*)+1 FROM attempts b WHERE b.test_id=a.test_id AND b.submitted_at IS NOT NULL AND b.score > a.score) rank,
      (SELECT COUNT(*) FROM attempts b WHERE b.test_id=a.test_id AND b.submitted_at IS NOT NULL) participants
    FROM attempts a JOIN tests t ON t.id=a.test_id JOIN courses c ON c.id=t.course_id
    WHERE a.student_id=? AND a.submitted_at IS NOT NULL ORDER BY a.submitted_at DESC`).all(req.user.id))
})

// Full review with correct answers — only after the student has submitted.
r.get('/results/:id', (req, res) => {
  const attempt = found(q('SELECT * FROM attempts WHERE id=? AND student_id=? AND submitted_at IS NOT NULL').get(id(req.params.id), req.user.id), 'Result')
  const test = q('SELECT * FROM tests WHERE id=?').get(attempt.test_id)
  const given = attempt.answers ? JSON.parse(attempt.answers) : {}
  const review = q(`SELECT x.id, x.subject, x.text, x.options, x.answer, x.explanation FROM test_questions tq
    JOIN questions x ON x.id=tq.question_id WHERE tq.test_id=? ORDER BY tq.pos`).all(test.id)
    .map((x) => ({ ...x, options: JSON.parse(x.options), chosen: given[x.id] ?? null }))
  const bySubject = {}
  for (const x of review) {
    const s = (bySubject[x.subject] ??= { subject: x.subject, correct: 0, total: 0 })
    s.total++
    if (x.chosen === x.answer) s.correct++
  }
  res.json({ attempt, test, review, bySubject: Object.values(bySubject) })
})

r.get('/leaderboard/:testId', (req, res) => {
  const sid = req.user.id
  const test = found(q(`SELECT t.id, t.title FROM tests t WHERE t.id=? AND ${inCourse(sid)}t.course_id)`).get(id(req.params.testId)), 'Test')
  if (!q('SELECT 1 FROM attempts WHERE test_id=? AND student_id=? AND submitted_at IS NOT NULL').get(test.id, sid)) {
    throw new HttpError(403, 'Submit the test to see the leaderboard.')
  }
  const rows = q(`SELECT u.name, a.student_id, a.score, a.total FROM attempts a JOIN users u ON u.id=a.student_id
    WHERE a.test_id=? AND a.submitted_at IS NOT NULL ORDER BY a.score DESC, a.submitted_at LIMIT 10`).all(test.id)
  res.json({ test, rows: rows.map((x, i) => ({ rank: i + 1, name: x.name, score: x.score, total: x.total, me: x.student_id === sid })) })
})

// ---- attendance, fees, announcements ----------------------------------------
r.get('/attendance', (req, res) => {
  const sid = req.user.id
  res.json({
    summary: q(`SELECT COUNT(*) marked, COALESCE(SUM(status='P'),0) present, COALESCE(SUM(status='A'),0) absent,
      COALESCE(SUM(status='L'),0) leave FROM attendance WHERE student_id=?`).get(sid),
    records: q('SELECT date, status FROM attendance WHERE student_id=? ORDER BY date DESC LIMIT 180').all(sid),
  })
})

r.get('/fees', (req, res) => {
  const sid = req.user.id
  res.json({
    fee: q('SELECT total, note FROM fees WHERE student_id=?').get(sid) ?? { total: 0, note: '' },
    payments: q('SELECT id, amount, paid_on, mode, receipt_no, note FROM payments WHERE student_id=? ORDER BY paid_on DESC, id DESC').all(sid),
  })
})

r.get('/announcements', (req, res) => {
  const sid = req.user.id
  res.json(q(`SELECT a.id, a.title, a.body, a.created_at, c.title course_title FROM announcements a LEFT JOIN courses c ON c.id=a.course_id
    WHERE a.course_id IS NULL OR ${inCourse(sid)}a.course_id) ORDER BY a.id DESC LIMIT 50`).all())
})

export default r
