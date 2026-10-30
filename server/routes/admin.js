import express, { Router } from 'express'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { db, tx } from '../db.js'
import { UPLOAD_DIR } from '../config.js'
import { HttpError, hashPassword, randomPassword } from '../auth.js'
import { str, num, id, isDate, today, found, parseOptions } from '../util.js'

const r = Router()
const q = (sql) => db.prepare(sql)

// ======================================================================
// Dashboard
// ======================================================================
r.get('/stats', (_req, res) => {
  const one = (sql, ...p) => q(sql).get(...p)
  const day = today()
  const fees = one(`SELECT COALESCE(SUM(f.total),0) total FROM fees f JOIN users u ON u.id=f.student_id WHERE u.active=1`)
  const collected = one(`SELECT COALESCE(SUM(amount),0) v FROM payments`).v
  const att = one(`SELECT COUNT(*) marked, COALESCE(SUM(status='P'),0) present FROM attendance WHERE date = ?`, day)
  res.json({
    counts: {
      students: one(`SELECT COUNT(*) v FROM users WHERE role='student' AND active=1`).v,
      inactive: one(`SELECT COUNT(*) v FROM users WHERE role='student' AND active=0`).v,
      notes: one(`SELECT COUNT(*) v FROM notes`).v,
      questions: one(`SELECT COUNT(*) v FROM questions`).v,
      tests: one(`SELECT COUNT(*) v FROM tests WHERE status='published'`).v,
      attempts: one(`SELECT COUNT(*) v FROM attempts WHERE submitted_at IS NOT NULL`).v,
    },
    fees: { total: fees.total, collected, pending: Math.max(0, fees.total - collected) },
    attendanceToday: att,
    enrolment: q(`SELECT c.title, COUNT(e.student_id) students FROM courses c LEFT JOIN enrollments e ON e.course_id=c.id
      WHERE c.active=1 GROUP BY c.id ORDER BY students DESC`).all(),
    attendanceWeek: q(`SELECT date, COUNT(*) marked, SUM(status='P') present FROM attendance
      WHERE date >= date('now','-6 day') GROUP BY date ORDER BY date`).all(),
    collectionByMonth: q(`SELECT substr(paid_on,1,7) month, SUM(amount) amount FROM payments
      WHERE paid_on >= date('now','start of month','-5 month') GROUP BY month ORDER BY month`).all(),
    recentPayments: q(`SELECT p.id, p.amount, p.paid_on, u.name, u.login_id FROM payments p JOIN users u ON u.id=p.student_id
      ORDER BY p.id DESC LIMIT 5`).all(),
    recentResults: q(`SELECT a.id, a.score, a.total, a.submitted_at, u.name, t.title FROM attempts a
      JOIN users u ON u.id=a.student_id JOIN tests t ON t.id=a.test_id WHERE a.submitted_at IS NOT NULL
      ORDER BY a.submitted_at DESC LIMIT 5`).all(),
    dueSoon: q(`SELECT u.id, u.name, u.login_id, s.parent_phone, s.phone, f.total,
        COALESCE((SELECT SUM(amount) FROM payments p WHERE p.student_id=u.id),0) paid
      FROM fees f JOIN users u ON u.id=f.student_id JOIN students s ON s.user_id=u.id
      WHERE u.active=1 AND f.total > COALESCE((SELECT SUM(amount) FROM payments p WHERE p.student_id=u.id),0)
      ORDER BY (f.total - COALESCE((SELECT SUM(amount) FROM payments p WHERE p.student_id=u.id),0)) DESC LIMIT 6`).all(),
  })
})

// ======================================================================
// Courses
// ======================================================================
r.get('/courses', (_req, res) => {
  res.json(q(`SELECT c.*, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) students,
    (SELECT COUNT(*) FROM notes n WHERE n.course_id=c.id) notes,
    (SELECT COUNT(*) FROM questions x WHERE x.course_id=c.id) questions,
    (SELECT COUNT(*) FROM tests t WHERE t.course_id=c.id) tests FROM courses c ORDER BY c.title`).all())
})

r.post('/courses', (req, res) => {
  const title = str(req.body.title, { required: true, name: 'Title', max: 80 })
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || crypto.randomUUID().slice(0, 8)
  if (q('SELECT 1 FROM courses WHERE id=?').get(slug)) throw new HttpError(409, 'A course with this name exists.')
  q('INSERT INTO courses (id, title) VALUES (?,?)').run(slug, title)
  res.status(201).json({ id: slug })
})

r.patch('/courses/:id', (req, res) => {
  const c = found(q('SELECT * FROM courses WHERE id=?').get(req.params.id), 'Course')
  q('UPDATE courses SET title=?, active=? WHERE id=?').run(
    str(req.body.title ?? c.title, { required: true, max: 80, name: 'Title' }),
    req.body.active === undefined ? c.active : req.body.active ? 1 : 0,
    c.id,
  )
  res.json({ ok: true })
})

// ======================================================================
// Students
// ======================================================================
const STUDENT_SELECT = `SELECT u.id, u.login_id, u.name, u.active, u.created_at, s.phone, s.parent_phone, s.address,
  s.batch, s.dob, s.joined_on, s.remarks FROM users u JOIN students s ON s.user_id=u.id`

function nextLoginId() {
  const yy = String(new Date().getFullYear()).slice(2)
  let seq = q(`SELECT COUNT(*) v FROM users WHERE role='student'`).get().v + 1
  for (;;) {
    const candidate = `SWA${yy}-${String(seq).padStart(4, '0')}`
    if (!q('SELECT 1 FROM users WHERE login_id=?').get(candidate)) return candidate
    seq++
  }
}

function studentFields(b) {
  return {
    name: str(b.name, { required: true, name: 'Name', max: 80 }),
    phone: str(b.phone, { max: 20 }),
    parent_phone: str(b.parentPhone, { max: 20 }),
    address: str(b.address, { max: 300 }),
    batch: str(b.batch, { max: 40 }),
    dob: b.dob && isDate(b.dob) ? b.dob : null,
    remarks: str(b.remarks, { max: 500 }),
  }
}

function setEnrollments(studentId, courseIds) {
  q('DELETE FROM enrollments WHERE student_id=?').run(studentId)
  const add = q('INSERT OR IGNORE INTO enrollments (student_id, course_id) VALUES (?,?)')
  for (const cid of Array.isArray(courseIds) ? courseIds : []) {
    if (q('SELECT 1 FROM courses WHERE id=?').get(cid)) add.run(studentId, cid)
  }
}

r.get('/students', (req, res) => {
  const term = `%${str(req.query.q, { max: 60 })}%`
  const course = str(req.query.course, { max: 60 })
  const rows = q(`${STUDENT_SELECT}
    WHERE (u.name LIKE ? OR u.login_id LIKE ? OR s.phone LIKE ?)
      AND (? = '' OR EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id=u.id AND e.course_id=?))
    ORDER BY u.id DESC`).all(term, term, term, course, course)
  const courses = q('SELECT e.student_id, e.course_id FROM enrollments e').all()
  const fees = q(`SELECT f.student_id, f.total, COALESCE((SELECT SUM(amount) FROM payments p WHERE p.student_id=f.student_id),0) paid FROM fees f`).all()
  const att = q(`SELECT student_id, COUNT(*) marked, SUM(status='P') present FROM attendance GROUP BY student_id`).all()
  const by = (list) => new Map(list.map((x) => [x.student_id, x]))
  const feeMap = by(fees)
  const attMap = by(att)
  res.json(rows.map((s) => ({
    ...s,
    courseIds: courses.filter((c) => c.student_id === s.id).map((c) => c.course_id),
    feeTotal: feeMap.get(s.id)?.total ?? 0,
    feePaid: feeMap.get(s.id)?.paid ?? 0,
    attendancePct: attMap.get(s.id) ? Math.round((attMap.get(s.id).present / attMap.get(s.id).marked) * 100) : null,
  })))
})

r.post('/students', (req, res) => {
  const f = studentFields(req.body)
  const password = str(req.body.password, { max: 60 }) || randomPassword()
  if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters.')
  const feeTotal = num(req.body.feeTotal, { min: 0, fallback: 0, name: 'Fee' })
  const out = tx(() => {
    const loginId = nextLoginId()
    const { lastInsertRowid } = q(`INSERT INTO users (role, login_id, name, password_hash) VALUES ('student',?,?,?)`)
      .run(loginId, f.name, hashPassword(password))
    const uid = Number(lastInsertRowid)
    q(`INSERT INTO students (user_id, phone, parent_phone, address, batch, dob, remarks) VALUES (?,?,?,?,?,?,?)`)
      .run(uid, f.phone, f.parent_phone, f.address, f.batch, f.dob, f.remarks)
    q('INSERT INTO fees (student_id, total) VALUES (?,?)').run(uid, feeTotal)
    setEnrollments(uid, req.body.courseIds)
    return { id: uid, loginId, password }
  })
  res.status(201).json(out)
})

r.get('/students/:id', (req, res) => {
  const sid = id(req.params.id)
  const student = found(q(`${STUDENT_SELECT} WHERE u.id=?`).get(sid), 'Student')
  res.json({
    student,
    courseIds: q('SELECT course_id FROM enrollments WHERE student_id=?').all(sid).map((x) => x.course_id),
    attendance: q('SELECT date, status FROM attendance WHERE student_id=? ORDER BY date DESC LIMIT 90').all(sid),
    attendanceSummary: q(`SELECT COUNT(*) marked, COALESCE(SUM(status='P'),0) present, COALESCE(SUM(status='A'),0) absent,
      COALESCE(SUM(status='L'),0) leave FROM attendance WHERE student_id=?`).get(sid),
    fee: q('SELECT total, note FROM fees WHERE student_id=?').get(sid) ?? { total: 0, note: '' },
    payments: q('SELECT * FROM payments WHERE student_id=? ORDER BY paid_on DESC, id DESC').all(sid),
    results: q(`SELECT a.id, a.score, a.total, a.correct, a.wrong, a.skipped, a.submitted_at, t.title, t.id test_id
      FROM attempts a JOIN tests t ON t.id=a.test_id WHERE a.student_id=? AND a.submitted_at IS NOT NULL ORDER BY a.submitted_at DESC`).all(sid),
  })
})

r.patch('/students/:id', (req, res) => {
  const sid = id(req.params.id)
  found(q(`SELECT 1 FROM users WHERE id=? AND role='student'`).get(sid), 'Student')
  const f = studentFields(req.body)
  tx(() => {
    q('UPDATE users SET name=?, active=? WHERE id=?').run(f.name, req.body.active === false ? 0 : 1, sid)
    q(`UPDATE students SET phone=?, parent_phone=?, address=?, batch=?, dob=?, remarks=? WHERE user_id=?`)
      .run(f.phone, f.parent_phone, f.address, f.batch, f.dob, f.remarks, sid)
    if (Array.isArray(req.body.courseIds)) setEnrollments(sid, req.body.courseIds)
  })
  res.json({ ok: true })
})

r.post('/students/:id/reset-password', (req, res) => {
  const sid = id(req.params.id)
  found(q(`SELECT 1 FROM users WHERE id=? AND role='student'`).get(sid), 'Student')
  const password = str(req.body.password, { max: 60 }) || randomPassword()
  if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters.')
  q('UPDATE users SET password_hash=? WHERE id=?').run(hashPassword(password), sid)
  res.json({ password })
})

r.delete('/students/:id', (req, res) => {
  const sid = id(req.params.id)
  found(q(`SELECT 1 FROM users WHERE id=? AND role='student'`).get(sid), 'Student')
  q('DELETE FROM users WHERE id=?').run(sid)
  res.json({ ok: true })
})

// ======================================================================
// Attendance
// ======================================================================
r.get('/attendance', (req, res) => {
  const date = isDate(req.query.date) ? req.query.date : today()
  const course = str(req.query.course, { max: 60 })
  const rows = q(`SELECT u.id, u.name, u.login_id, s.batch, a.status FROM users u JOIN students s ON s.user_id=u.id
    LEFT JOIN attendance a ON a.student_id=u.id AND a.date=?
    WHERE u.active=1 AND (? = '' OR EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id=u.id AND e.course_id=?))
    ORDER BY u.name`).all(date, course, course)
  res.json({ date, students: rows })
})

r.put('/attendance', (req, res) => {
  if (!isDate(req.body.date)) throw new HttpError(400, 'Pick a valid date.')
  const records = Array.isArray(req.body.records) ? req.body.records : []
  const upsert = q(`INSERT INTO attendance (student_id, date, status) VALUES (?,?,?)
    ON CONFLICT(student_id, date) DO UPDATE SET status=excluded.status`)
  const clear = q('DELETE FROM attendance WHERE student_id=? AND date=?')
  tx(() => {
    for (const rec of records) {
      const sid = id(rec.studentId)
      if (['P', 'A', 'L'].includes(rec.status)) upsert.run(sid, req.body.date, rec.status)
      else clear.run(sid, req.body.date)
    }
  })
  res.json({ saved: records.length })
})

// ======================================================================
// Fees
// ======================================================================
r.get('/fees', (_req, res) => {
  res.json(q(`SELECT u.id, u.name, u.login_id, u.active, s.phone, s.parent_phone, s.batch,
      COALESCE(f.total,0) total, COALESCE((SELECT SUM(amount) FROM payments p WHERE p.student_id=u.id),0) paid,
      (SELECT MAX(paid_on) FROM payments p WHERE p.student_id=u.id) last_paid
    FROM users u JOIN students s ON s.user_id=u.id LEFT JOIN fees f ON f.student_id=u.id
    WHERE u.role='student' ORDER BY (COALESCE(f.total,0) - COALESCE((SELECT SUM(amount) FROM payments p WHERE p.student_id=u.id),0)) DESC`).all())
})

r.put('/students/:id/fee', (req, res) => {
  const sid = id(req.params.id)
  found(q(`SELECT 1 FROM users WHERE id=? AND role='student'`).get(sid), 'Student')
  q(`INSERT INTO fees (student_id, total, note) VALUES (?,?,?)
    ON CONFLICT(student_id) DO UPDATE SET total=excluded.total, note=excluded.note`)
    .run(sid, num(req.body.total, { min: 0, name: 'Total fee' }), str(req.body.note, { max: 200 }))
  res.json({ ok: true })
})

r.post('/students/:id/payments', (req, res) => {
  const sid = id(req.params.id)
  found(q(`SELECT 1 FROM users WHERE id=? AND role='student'`).get(sid), 'Student')
  const amount = num(req.body.amount, { min: 1, name: 'Amount' })
  const paidOn = isDate(req.body.paidOn) ? req.body.paidOn : today()
  const mode = ['Cash', 'UPI', 'Bank', 'Cheque', 'Other'].includes(req.body.mode) ? req.body.mode : 'Cash'
  const next = q('SELECT COALESCE(MAX(id),0)+1 v FROM payments').get().v
  const receipt = `RCPT-${new Date().getFullYear()}-${String(next).padStart(5, '0')}`
  const { lastInsertRowid } = q(`INSERT INTO payments (student_id, amount, paid_on, mode, note, receipt_no) VALUES (?,?,?,?,?,?)`)
    .run(sid, amount, paidOn, mode, str(req.body.note, { max: 200 }), receipt)
  res.status(201).json({ id: Number(lastInsertRowid), receiptNo: receipt })
})

r.delete('/payments/:id', (req, res) => {
  q('DELETE FROM payments WHERE id=?').run(id(req.params.id))
  res.json({ ok: true })
})

// ======================================================================
// Notes (study material)
// ======================================================================
const ALLOWED_EXT = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt'])

r.get('/notes', (req, res) => {
  const course = str(req.query.course, { max: 60 })
  res.json(q(`SELECT n.*, c.title course_title FROM notes n JOIN courses c ON c.id=n.course_id
    WHERE (? = '' OR n.course_id = ?) ORDER BY n.id DESC`).all(course, course))
})

function noteBase(b) {
  found(q('SELECT 1 FROM courses WHERE id=?').get(String(b.courseId)), 'Course')
  return {
    course: String(b.courseId),
    title: str(b.title, { required: true, name: 'Title', max: 120 }),
    subject: str(b.subject, { max: 60 }),
    description: str(b.description, { max: 400 }),
  }
}

r.post('/notes', (req, res) => {
  const n = noteBase(req.body)
  const url = str(req.body.url, { required: true, name: 'Link', max: 500 })
  if (!/^https?:\/\//i.test(url)) throw new HttpError(400, 'Link must start with http:// or https://')
  const { lastInsertRowid } = q(`INSERT INTO notes (course_id, subject, title, description, kind, url) VALUES (?,?,?,?, 'link', ?)`)
    .run(n.course, n.subject, n.title, n.description, url)
  res.status(201).json({ id: Number(lastInsertRowid) })
})

// Raw upload: body is the file, metadata travels in query/headers.
r.post('/notes/upload', express.raw({ type: () => true, limit: '25mb' }), (req, res) => {
  const original = decodeURIComponent(String(req.headers['x-file-name'] || 'file'))
  const ext = path.extname(original).toLowerCase()
  if (!ALLOWED_EXT.has(ext)) throw new HttpError(400, 'This file type is not allowed.')
  if (!Buffer.isBuffer(req.body) || !req.body.length) throw new HttpError(400, 'Empty file.')
  const n = noteBase(req.query)
  const stored = `${crypto.randomBytes(16).toString('hex')}${ext}`
  fs.writeFileSync(path.join(UPLOAD_DIR, stored), req.body)
  const { lastInsertRowid } = q(`INSERT INTO notes (course_id, subject, title, description, kind, url, file_name) VALUES (?,?,?,?, 'file', ?, ?)`)
    .run(n.course, n.subject, n.title, n.description, stored, original.slice(0, 120))
  res.status(201).json({ id: Number(lastInsertRowid) })
})

r.delete('/notes/:id', (req, res) => {
  const note = found(q('SELECT * FROM notes WHERE id=?').get(id(req.params.id)), 'Note')
  q('DELETE FROM notes WHERE id=?').run(note.id)
  if (note.kind === 'file') fs.rm(path.join(UPLOAD_DIR, path.basename(note.url)), () => {})
  res.json({ ok: true })
})

// ======================================================================
// Question bank
// ======================================================================
function questionFields(b) {
  const options = parseOptions(b.options)
  const answer = num(b.answer, { min: 0, max: options.length - 1, name: 'Correct answer' })
  found(q('SELECT 1 FROM courses WHERE id=?').get(String(b.courseId)), 'Course')
  return {
    course: String(b.courseId),
    subject: str(b.subject, { max: 60 }) || 'General',
    text: str(b.text, { required: true, name: 'Question', max: 800 }),
    options: JSON.stringify(options),
    answer,
    explanation: str(b.explanation, { max: 600 }),
  }
}

const withOptions = (row) => ({ ...row, options: JSON.parse(row.options) })

r.get('/questions', (req, res) => {
  const course = str(req.query.course, { max: 60 })
  const subject = str(req.query.subject, { max: 60 })
  const term = `%${str(req.query.q, { max: 80 })}%`
  res.json(q(`SELECT x.*, c.title course_title FROM questions x JOIN courses c ON c.id=x.course_id
    WHERE (? = '' OR x.course_id=?) AND (? = '' OR x.subject=?) AND x.text LIKE ? ORDER BY x.id DESC LIMIT 500`)
    .all(course, course, subject, subject, term).map(withOptions))
})

r.get('/subjects', (_req, res) => {
  res.json(q(`SELECT DISTINCT subject FROM questions ORDER BY subject`).all().map((x) => x.subject))
})

r.post('/questions', (req, res) => {
  const f = questionFields(req.body)
  const { lastInsertRowid } = q(`INSERT INTO questions (course_id, subject, text, options, answer, explanation) VALUES (?,?,?,?,?,?)`)
    .run(f.course, f.subject, f.text, f.options, f.answer, f.explanation)
  res.status(201).json({ id: Number(lastInsertRowid) })
})

// Bulk import: [{courseId, subject, text, options[], answer, explanation}]
r.post('/questions/bulk', (req, res) => {
  const list = Array.isArray(req.body.questions) ? req.body.questions : []
  if (!list.length || list.length > 500) throw new HttpError(400, 'Send between 1 and 500 questions.')
  const ins = q(`INSERT INTO questions (course_id, subject, text, options, answer, explanation) VALUES (?,?,?,?,?,?)`)
  tx(() => {
    list.forEach((item, i) => {
      try {
        const f = questionFields({ ...item, courseId: item.courseId ?? req.body.courseId })
        ins.run(f.course, f.subject, f.text, f.options, f.answer, f.explanation)
      } catch (err) {
        throw new HttpError(400, `Question ${i + 1}: ${err.message}`)
      }
    })
  })
  res.status(201).json({ imported: list.length })
})

r.put('/questions/:id', (req, res) => {
  const qid = id(req.params.id)
  found(q('SELECT 1 FROM questions WHERE id=?').get(qid), 'Question')
  const f = questionFields(req.body)
  q(`UPDATE questions SET course_id=?, subject=?, text=?, options=?, answer=?, explanation=? WHERE id=?`)
    .run(f.course, f.subject, f.text, f.options, f.answer, f.explanation, qid)
  res.json({ ok: true })
})

r.delete('/questions/:id', (req, res) => {
  q('DELETE FROM questions WHERE id=?').run(id(req.params.id))
  res.json({ ok: true })
})

// ======================================================================
// Tests
// ======================================================================
function testFields(b) {
  found(q('SELECT 1 FROM courses WHERE id=?').get(String(b.courseId)), 'Course')
  const ids = [...new Set((Array.isArray(b.questionIds) ? b.questionIds : []).map(Number))].filter(Number.isInteger)
  if (!ids.length) throw new HttpError(400, 'Select at least one question.')
  return {
    course: String(b.courseId),
    title: str(b.title, { required: true, name: 'Title', max: 120 }),
    duration: num(b.durationMin, { min: 1, max: 600, name: 'Duration' }),
    marks: num(b.marksPerQ, { min: 0.25, max: 100, fallback: 1, name: 'Marks per question' }),
    negative: num(b.negative, { min: 0, max: 100, fallback: 0, name: 'Negative marking' }),
    status: b.status === 'published' ? 'published' : 'draft',
    ids,
  }
}

function setTestQuestions(testId, ids) {
  q('DELETE FROM test_questions WHERE test_id=?').run(testId)
  const add = q('INSERT INTO test_questions (test_id, question_id, pos) VALUES (?,?,?)')
  ids.forEach((qid, i) => {
    if (q('SELECT 1 FROM questions WHERE id=?').get(qid)) add.run(testId, qid, i)
  })
}

r.get('/tests', (_req, res) => {
  res.json(q(`SELECT t.*, c.title course_title,
    (SELECT COUNT(*) FROM test_questions tq WHERE tq.test_id=t.id) question_count,
    (SELECT COUNT(*) FROM attempts a WHERE a.test_id=t.id AND a.submitted_at IS NOT NULL) attempts,
    (SELECT ROUND(AVG(score),1) FROM attempts a WHERE a.test_id=t.id AND a.submitted_at IS NOT NULL) avg_score
    FROM tests t JOIN courses c ON c.id=t.course_id ORDER BY t.id DESC`).all())
})

r.get('/tests/:id', (req, res) => {
  const test = found(q('SELECT * FROM tests WHERE id=?').get(id(req.params.id)), 'Test')
  const questions = q(`SELECT x.* FROM test_questions tq JOIN questions x ON x.id=tq.question_id WHERE tq.test_id=? ORDER BY tq.pos`)
    .all(test.id).map(withOptions)
  res.json({ test, questions })
})

r.post('/tests', (req, res) => {
  const f = testFields(req.body)
  const out = tx(() => {
    const { lastInsertRowid } = q(`INSERT INTO tests (course_id, title, duration_min, marks_per_q, negative, status) VALUES (?,?,?,?,?,?)`)
      .run(f.course, f.title, f.duration, f.marks, f.negative, f.status)
    setTestQuestions(Number(lastInsertRowid), f.ids)
    return Number(lastInsertRowid)
  })
  res.status(201).json({ id: out })
})

r.put('/tests/:id', (req, res) => {
  const tid = id(req.params.id)
  found(q('SELECT 1 FROM tests WHERE id=?').get(tid), 'Test')
  const f = testFields(req.body)
  if (q('SELECT 1 FROM attempts WHERE test_id=?').get(tid)) {
    // Questions/marking can't change under students who already sat the test.
    q('UPDATE tests SET title=?, status=? WHERE id=?').run(f.title, f.status, tid)
    return res.json({ ok: true, locked: true })
  }
  tx(() => {
    q(`UPDATE tests SET course_id=?, title=?, duration_min=?, marks_per_q=?, negative=?, status=? WHERE id=?`)
      .run(f.course, f.title, f.duration, f.marks, f.negative, f.status, tid)
    setTestQuestions(tid, f.ids)
  })
  res.json({ ok: true })
})

r.patch('/tests/:id/status', (req, res) => {
  q('UPDATE tests SET status=? WHERE id=?').run(req.body.status === 'published' ? 'published' : 'draft', id(req.params.id))
  res.json({ ok: true })
})

r.delete('/tests/:id', (req, res) => {
  q('DELETE FROM tests WHERE id=?').run(id(req.params.id))
  res.json({ ok: true })
})

r.get('/tests/:id/results', (req, res) => {
  const test = found(q('SELECT t.*, c.title course_title FROM tests t JOIN courses c ON c.id=t.course_id WHERE t.id=?').get(id(req.params.id)), 'Test')
  const attempts = q(`SELECT a.id, a.student_id, a.score, a.total, a.correct, a.wrong, a.skipped, a.started_at, a.submitted_at, u.name, u.login_id
    FROM attempts a JOIN users u ON u.id=a.student_id WHERE a.test_id=? ORDER BY a.submitted_at IS NULL, a.score DESC, a.submitted_at`).all(test.id)
  const notAttempted = q(`SELECT u.id, u.name, u.login_id FROM enrollments e JOIN users u ON u.id=e.student_id
    WHERE e.course_id=? AND u.active=1 AND NOT EXISTS (SELECT 1 FROM attempts a WHERE a.test_id=? AND a.student_id=u.id) ORDER BY u.name`)
    .all(test.course_id, test.id)
  res.json({ test, attempts, notAttempted })
})

// Lets a student sit the test again (deletes their attempt).
r.delete('/attempts/:id', (req, res) => {
  q('DELETE FROM attempts WHERE id=?').run(id(req.params.id))
  res.json({ ok: true })
})

// ======================================================================
// Announcements
// ======================================================================
r.get('/announcements', (_req, res) => {
  res.json(q(`SELECT a.*, c.title course_title FROM announcements a LEFT JOIN courses c ON c.id=a.course_id ORDER BY a.id DESC`).all())
})

r.post('/announcements', (req, res) => {
  const course = req.body.courseId ? String(req.body.courseId) : null
  if (course) found(q('SELECT 1 FROM courses WHERE id=?').get(course), 'Course')
  q('INSERT INTO announcements (title, body, course_id) VALUES (?,?,?)').run(
    str(req.body.title, { required: true, name: 'Title', max: 120 }),
    str(req.body.body, { required: true, name: 'Message', max: 1000 }),
    course,
  )
  res.status(201).json({ ok: true })
})

r.delete('/announcements/:id', (req, res) => {
  q('DELETE FROM announcements WHERE id=?').run(id(req.params.id))
  res.json({ ok: true })
})

export default r
