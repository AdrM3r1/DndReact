import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type ThemeMode = 'dark' | 'light'

interface ThemeContextValue {
  mode: ThemeMode
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('dnd-theme') as ThemeMode) || 'dark'
  })

  const toggle = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    localStorage.setItem('dnd-theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
