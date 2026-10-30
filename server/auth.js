import crypto from 'node:crypto'
import { SECRET, TOKEN_TTL_MS } from './config.js'
import { db } from './db.js'

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// ---- passwords (scrypt) ----------------------------------------------
export function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
  return crypto.timingSafeEqual(actual, expected)
}

// Readable random password without look-alike characters.
const ALPHABET = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function randomPassword(len = 8) {
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHABET[crypto.randomInt(ALPHABET.length)]
  return out
}

// ---- signed tokens ---------------------------------------------------
const b64 = (buf) => Buffer.from(buf).toString('base64url')
const sign = (body) => crypto.createHmac('sha256', SECRET).update(body).digest('base64url')

export function issueToken(user) {
  const body = b64(JSON.stringify({ uid: user.id, role: user.role, exp: Date.now() + TOKEN_TTL_MS }))
  return `${body}.${sign(body)}`
}

function readToken(token) {
  const [body, sig] = String(token || '').split('.')
  if (!body || !sig) return null
  const good = sign(body)
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  return payload.exp > Date.now() ? payload : null
}

const findUser = db.prepare('SELECT id, role, login_id, name, active FROM users WHERE id = ?')

export function authenticate(req, _res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.query.t
  let payload = null
  try {
    payload = readToken(token)
  } catch {
    payload = null
  }
  const user = payload && findUser.get(payload.uid)
  if (!user || !user.active) throw new HttpError(401, 'Please log in again.')
  req.user = user
  next()
}

export const requireRole = (role) => (req, _res, next) => {
  if (req.user.role !== role) throw new HttpError(403, 'Not allowed.')
  next()
}

// ---- brute-force guard (in memory, per login id + IP) ------------------
const failures = new Map()
const LIMIT = 6
const LOCK_MS = 5 * 60 * 1000

export function checkLock(key) {
  const f = failures.get(key)
  if (f && f.count >= LIMIT && Date.now() - f.last < LOCK_MS) {
    throw new HttpError(429, 'Too many wrong attempts. Try again in 5 minutes.')
  }
}
export function recordFailure(key) {
  const f = failures.get(key)
  const fresh = !f || Date.now() - f.last >= LOCK_MS
  failures.set(key, { count: fresh ? 1 : f.count + 1, last: Date.now() })
}
export const clearFailures = (key) => failures.delete(key)
