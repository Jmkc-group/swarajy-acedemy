import { useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

function setMeta(attr, key, content) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// Page-specific title, description and Open Graph tags, in the active language.
// No canonical URL is set because the production domain is not confirmed yet.
export function Seo({ page }) {
  const { t, lang, languages } = useLanguage()
  const title = t(`seo.${page}.title`)
  const description = t(`seo.${page}.description`)
  const ogLocale = languages.find((l) => l.code === lang)?.ogLocale ?? 'en_IN'

  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:locale', ogLocale)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
  }, [title, description, ogLocale])

  return null
}
