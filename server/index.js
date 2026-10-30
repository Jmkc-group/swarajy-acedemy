import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db } from './db.js'
import { PORT, UPLOAD_DIR } from './config.js'
import {
  HttpError, authenticate, requireRole, issueToken, hashPassword, verifyPassword,
  randomPassword, checkLock, recordFailure, clearFailures,
} from './auth.js'
import { str } from './util.js'
import adminRoutes from './routes/admin.js'
import studentRoutes from './routes/student.js'

const app = express()
app.disable('x-powered-by')
app.use((_req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'same-origin' })
  next()
})
app.use(express.json({ limit: '1mb' }))

const api = express.Router()

// ---- auth -------------------------------------------------------------------
api.post('/auth/login', (req, res) => {
  const loginId = str(req.body.loginId, { required: true, name: 'ID', max: 40 })
  const password = str(req.body.password, { required: true, name: 'Password', max: 100 })
  const key = `${loginId.toLowerCase()}|${req.ip}`
  checkLock(key)
  const user = db.prepare('SELECT * FROM users WHERE login_id = ?').get(loginId)
  // Always hash-compare so timing doesn't reveal whether the ID exists.
  const ok = user ? verifyPassword(password, user.password_hash) : (verifyPassword(password, hashPassword('x')), false)
  if (!ok || !user.active) {
    recordFailure(key)
    throw new HttpError(401, user && !user.active ? 'This account is disabled. Contact the academy.' : 'Wrong ID or password.')
  }
  clearFailures(key)
  res.json({ token: issueToken(user), user: { id: user.id, role: user.role, name: user.name, loginId: user.login_id } })
})

api.get('/auth/me', authenticate, (req, res) => {
  const u = req.user
  res.json({ user: { id: u.id, role: u.role, name: u.name, loginId: u.login_id } })
})

api.post('/auth/change-password', authenticate, (req, res) => {
  const next = str(req.body.newPassword, { required: true, name: 'New password', max: 100 })
  if (next.length < 6) throw new HttpError(400, 'New password must be at least 6 characters.')
  const row = db.prepare('SELECT password_hash FROM users WHERE id=?').get(req.user.id)
  if (!verifyPassword(String(req.body.oldPassword ?? ''), row.password_hash)) throw new HttpError(400, 'Current password is wrong.')
  db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hashPassword(next), req.user.id)
  res.json({ ok: true })
})

// ---- note files (token in ?t= so a plain link/open works) -------------------------
api.get('/files/:name', authenticate, (req, res) => {
  const name = path.basename(req.params.name)
  const note = db.prepare(`SELECT * FROM notes WHERE kind='file' AND url=?`).get(name)
  if (!note) throw new HttpError(404, 'File not found.')
  if (req.user.role === 'student') {
    const enrolled = db.prepare('SELECT 1 FROM enrollments WHERE student_id=? AND course_id=?').get(req.user.id, note.course_id)
    if (!enrolled) throw new HttpError(403, 'This file is not part of your courses.')
  }
  res.set('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(note.file_name || name)}`)
  res.sendFile(path.join(UPLOAD_DIR, name))
})

api.get('/courses', authenticate, (_req, res) => {
  res.json(db.prepare('SELECT id, title FROM courses WHERE active=1 ORDER BY title').all())
})

api.use('/admin', authenticate, requireRole('admin'), adminRoutes)
api.use('/student', authenticate, requireRole('student'), studentRoutes)
api.use((_req, _res, next) => next(new HttpError(404, 'Not found.')))

app.use('/api', api)

// Serve the built website when it exists (production: one process does both).
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*splat', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.too.large') err = new HttpError(413, 'File is too large.')
  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({ error: status >= 500 ? 'Something went wrong on the server.' : err.message })
})

// ---- first-run admin ----------------------------------------------------------
if (!db.prepare(`SELECT 1 FROM users WHERE role='admin'`).get()) {
  const password = process.env.ADMIN_PASSWORD || randomPassword(10)
  db.prepare(`INSERT INTO users (role, login_id, name, password_hash) VALUES ('admin','admin','Academy Admin',?)`).run(hashPassword(password))
  console.log('\n=====================================================')
  console.log(' First run: admin account created')
  console.log('   Login ID : admin')
  console.log(`   Password : ${password}`)
  console.log(' Change it after logging in (Settings page).')
  console.log('=====================================================\n')
}

app.listen(PORT, () => console.log(`Swarajya API running on http://localhost:${PORT}`))
