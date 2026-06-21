import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type FontMode = 'vinque' | 'cardo'

interface FontContextValue {
  mode: FontMode
  toggle: () => void
  bodyFont: string
}

const FontContext = createContext<FontContextValue | null>(null)

const FONTS = {
  vinque: { body: '"Vinque", serif' },
  cardo: { body: '"Cardo", serif' },
}

export function FontProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<FontMode>(() => {
    return (localStorage.getItem('font-mode') as FontMode) || 'vinque'
  })

  const toggle = () => {
    setMode(prev => prev === 'vinque' ? 'cardo' : 'vinque')
  }

  useEffect(() => {
    localStorage.setItem('font-mode', mode)
    document.documentElement.style.setProperty('--font-body', FONTS[mode].body)
  }, [mode])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-body', FONTS[mode].body)
    document.documentElement.style.setProperty('--font-heading', '"Cinzel Decorative", serif')
  }, [])

  return (
    <FontContext.Provider value={{ mode, toggle, bodyFont: FONTS[mode].body }}>
      {children}
    </FontContext.Provider>
  )
}

export function useFont() {
  const ctx = useContext(FontContext)
  if (!ctx) throw new Error('useFont must be used within FontProvider')
  return ctx
}
