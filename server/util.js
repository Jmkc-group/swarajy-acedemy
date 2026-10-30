import { HttpError } from './auth.js'

export function str(value, { max = 500, required = false, name = 'Field' } = {}) {
  const s = value == null ? '' : String(value).trim()
  if (required && !s) throw new HttpError(400, `${name} is required.`)
  if (s.length > max) throw new HttpError(400, `${name} is too long.`)
  return s
}

export function num(value, { min = -Infinity, max = Infinity, name = 'Value', fallback } = {}) {
  if ((value === undefined || value === null || value === '') && fallback !== undefined) return fallback
  const n = Number(value)
  if (!Number.isFinite(n) || n < min || n > max) throw new HttpError(400, `${name} is invalid.`)
  return n
}

export function id(value) {
  return num(value, { min: 1, name: 'Id' })
}

export const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !Number.isNaN(Date.parse(s))

export const today = () => new Date().toISOString().slice(0, 10)

export function found(row, what = 'Record') {
  if (!row) throw new HttpError(404, `${what} not found.`)
  return row
}

// SQLite "datetime('now')" is UTC without a zone marker — make it ISO for the browser.
export const iso = (s) => (s ? `${String(s).replace(' ', 'T')}${String(s).includes('Z') ? '' : 'Z'}` : s)

export function parseOptions(raw) {
  const options = Array.isArray(raw) ? raw.map((o) => String(o).trim()).filter(Boolean) : []
  if (options.length < 2 || options.length > 6) throw new HttpError(400, 'Give 2 to 6 options.')
  return options
}
