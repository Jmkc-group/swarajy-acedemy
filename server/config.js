import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export const DATA_DIR = path.join(here, 'data')
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
export const PORT = Number(process.env.PORT) || 4000
export const TOKEN_TTL_MS = 12 * 60 * 60 * 1000

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// Signing secret: env var wins; otherwise generated once and kept in data/.
function loadSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET
  const file = path.join(DATA_DIR, '.secret')
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8')
  const secret = crypto.randomBytes(48).toString('hex')
  fs.writeFileSync(file, secret, { mode: 0o600 })
  return secret
}
export const SECRET = loadSecret()
