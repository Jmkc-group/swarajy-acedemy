import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { DATA_DIR } from './config.js'

fs.mkdirSync(DATA_DIR, { recursive: true })

export const db = new DatabaseSync(path.join(DATA_DIR, 'academy.db'))
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK (role IN ('admin','student')),
  login_id TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS students (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT, parent_phone TEXT, address TEXT, batch TEXT, dob TEXT,
  joined_on TEXT NOT NULL DEFAULT (date('now')),
  remarks TEXT
);
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS enrollments (
  student_id INTEGER NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, course_id)
);
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject TEXT, title TEXT NOT NULL, description TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('file','link')),
  url TEXT NOT NULL, file_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject TEXT NOT NULL DEFAULT 'General',
  text TEXT NOT NULL,
  options TEXT NOT NULL,
  answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 30,
  marks_per_q REAL NOT NULL DEFAULT 1,
  negative REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS test_questions (
  test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  pos INTEGER NOT NULL,
  PRIMARY KEY (test_id, question_id)
);
CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  started_at TEXT NOT NULL,
  submitted_at TEXT,
  answers TEXT,
  score REAL, total REAL, correct INTEGER, wrong INTEGER, skipped INTEGER,
  UNIQUE (test_id, student_id)
);
CREATE TABLE IF NOT EXISTS attendance (
  student_id INTEGER NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('P','A','L')),
  PRIMARY KEY (student_id, date)
);
CREATE TABLE IF NOT EXISTS fees (
  student_id INTEGER PRIMARY KEY REFERENCES students(user_id) ON DELETE CASCADE,
  total REAL NOT NULL DEFAULT 0,
  note TEXT
);
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  paid_on TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'Cash',
  note TEXT,
  receipt_no TEXT
);
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, body TEXT NOT NULL,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`)

// Course catalogue mirrors the public website; admin can add more later.
const SEED_COURSES = [
  ['police', 'Police Bharti'],
  ['army', 'Indian Army (Agniveer)'],
  ['navy', 'Indian Navy'],
  ['airforce', 'Indian Air Force'],
  ['saralseva', 'Saralseva / Talathi'],
  ['mpsc-foundation', 'MPSC Foundation'],
  ['class8-pathway', 'Class 8 Pathway'],
]
const addCourse = db.prepare('INSERT OR IGNORE INTO courses (id, title) VALUES (?, ?)')
for (const [id, title] of SEED_COURSES) addCourse.run(id, title)

export function tx(fn) {
  db.exec('BEGIN')
  try {
    const out = fn()
    db.exec('COMMIT')
    return out
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}
