import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './language-context'
import { DEFAULT_LANGUAGE, LANGUAGES, SUPPORTED_LANGUAGES, dictionaries } from '@/locales'

const STORAGE_KEY = 'sca-language'

function readStoredLanguage() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_LANGUAGES.includes(value) ? value : null
  } catch {
    return null
  }
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict)
}

export function LanguageProvider({ children }) {
  // null => no valid saved preference yet, so the selection modal is shown
  const [stored, setStored] = useState(readStoredLanguage)
  const lang = stored ?? DEFAULT_LANGUAGE

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLanguage = useCallback((next) => {
    if (!SUPPORTED_LANGUAGES.includes(next)) return
    setStored(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
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
      needsSelection: stored === null,
      setLanguage,
      t,
      pick,
    }
  }, [lang, stored, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
