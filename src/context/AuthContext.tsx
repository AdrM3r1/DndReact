import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthContextType {
  user: string | null
  loading: boolean
  login: (username: string, token?: string) => void
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

  function login(username: string, token?: string) {
    setUser(username)
    localStorage.setItem('dnd_user', username)
    document.cookie = `dnd_user=${username}; path=/; max-age=86400`
    if (token) {
      localStorage.setItem('dnd_jwt_token', token)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('dnd_user')
    localStorage.removeItem('dnd_jwt_token')
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
