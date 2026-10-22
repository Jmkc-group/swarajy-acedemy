import en from './en'
import mr from './mr'
import hi from './hi'

export const dictionaries = { en, mr, hi }

export const LANGUAGES = [
  { code: 'en', native: 'English', english: 'English', ogLocale: 'en_IN' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', ogLocale: 'mr_IN' },
  { code: 'hi', native: 'हिंदी', english: 'Hindi', ogLocale: 'hi_IN' },
]

export const SUPPORTED_LANGUAGES = LANGUAGES.map((l) => l.code)
export const DEFAULT_LANGUAGE = 'en'
