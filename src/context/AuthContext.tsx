import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthContextType {
  user: string | null
  loading: boolean
  login: (username: string) => void
  logout: () => void
  isLoggedIn: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('dnd_user')
    if (stored) setUser(stored)
    setLoading(false)
  }, [])

  function login(username: string) {
    setUser(username)
    localStorage.setItem('dnd_user', username)
    document.cookie = `dnd_user=${username}; path=/; max-age=86400`
    if (!localStorage.getItem('dnd_users')) {
      localStorage.setItem('dnd_users', JSON.stringify([{ id: 0, nick: 'root' }]))
    }
    const raw = localStorage.getItem('dnd_users') || '[]'
    const list = JSON.parse(raw)
    if (!list.find((u: any) => u.nick === username)) {
      list.push({ id: Date.now(), nick: username })
      localStorage.setItem('dnd_users', JSON.stringify(list))
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('dnd_user')
    document.cookie = 'dnd_user=; path=/; max-age=0'
  }

  const isAdmin = user === 'root'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn: !!user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
