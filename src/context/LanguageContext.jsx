import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './language-context'
import { DEFAULT_LANGUAGE, LANGUAGES, SUPPORTED_LANGUAGES, dictionaries } from '@/locales'

const STORAGE_KEY = 'sca-language'
// Set once the visitor picks a language in this visit (browser tab session),
// so the selection modal shows again every time the website is opened anew.
const SESSION_KEY = 'sca-language-chosen'

function readStoredLanguage() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_LANGUAGES.includes(value) ? value : null
  } catch {
    return null
  }
}

function readChosenThisVisit() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict)
}

export function LanguageProvider({ children }) {
  // Last saved preference (kept across visits) — used as the current language
  const [stored, setStored] = useState(readStoredLanguage)
  // false => not picked yet in this visit, so the selection modal is shown
  const [chosen, setChosen] = useState(readChosenThisVisit)
  const lang = stored ?? DEFAULT_LANGUAGE

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLanguage = useCallback((next) => {
    if (!SUPPORTED_LANGUAGES.includes(next)) return
    setStored(next)
    setChosen(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // storage blocked (private mode) — preference lasts for this session only
    }
  }, [])

  const value = useMemo(() => {
    const dict = dictionaries[lang]

    /** Translate a UI key, e.g. t('nav.home') or t('courses.results', { count: 3 }) */
    const t = (key, vars) => {
      let text = lookup(dict, key)
      if (text === undefined) text = lookup(dictionaries[DEFAULT_LANGUAGE], key)
      if (text === undefined) return key
      if (typeof text === 'string' && vars) {
        text = text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] ?? match).toString())
      }
      return text
    }

    /** Pick the current language from a data field shaped like { en, mr, hi } */
    const pick = (field) => {
      if (field == null) return ''
      if (typeof field === 'object' && !Array.isArray(field)) return field[lang] ?? field[DEFAULT_LANGUAGE]
      return field
    }

    return {
      lang,
      languages: LANGUAGES,
      needsSelection: !chosen,
      setLanguage,
      t,
      pick,
    }
  }, [lang, chosen, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
