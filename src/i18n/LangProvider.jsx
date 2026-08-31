import { useEffect, useState } from 'react'
import { LangContext } from './context'
import { dict } from './dict'

const STORAGE_KEY = 'braytech-lang'

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh'
    } catch {
      return 'zh'
    }
  })
 
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch { 
    }
  }, [lang])
 
  const t = (key) => dict[lang][key] ?? dict.zh[key] ?? key
 
  const pick = (field) => {
    if (field == null) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.zh || field.en || ''
  }

  return <LangContext.Provider value={{ lang, setLang, t, pick }}>{children}</LangContext.Provider>
}
