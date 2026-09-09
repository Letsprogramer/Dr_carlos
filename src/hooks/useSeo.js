import { useEffect } from 'react'

export const SITE_URL = 'https://souzacamposadvise.com.br'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-final.png`

function setMetaTag(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinkTag(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo({ title, description, path = '/', image, type = 'website', jsonLd }) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    document.title = title
    setMetaTag('name', 'description', description)

    const url = `${SITE_URL}${path}`
    const ogImage = image || DEFAULT_OG_IMAGE

    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:url', url)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:locale', 'pt_BR')
    setMetaTag('property', 'og:site_name', 'Souza Campos Advocacia')
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)

    setLinkTag('canonical', url)

    let scriptEl
    if (jsonLdString) {
      scriptEl = document.createElement('script')
      scriptEl.type = 'application/ld+json'
      scriptEl.text = jsonLdString
      document.head.appendChild(scriptEl)
    }

    return () => {
      if (scriptEl) scriptEl.remove()
    }
  }, [title, description, path, image, type, jsonLdString])
}
