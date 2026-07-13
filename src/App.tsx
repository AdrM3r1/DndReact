import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import { FontProvider } from './context/FontContext'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
const Welcome = lazy(() => import('./pages/Welcome'))
const Home = lazy(() => import('./pages/Home'))
const Info = lazy(() => import('./pages/Info'))
const HowToPlay = lazy(() => import('./pages/HowToPlay'))
const Utilities = lazy(() => import('./pages/Utilities'))
const RecoverPass = lazy(() => import('./pages/RecoverPass'))
const UserPanel = lazy(() => import('./pages/UserPanel'))
const CharacterForm = lazy(() => import('./pages/CharacterForm'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const RegisterForm = lazy(() => import('./pages/RegisterForm'))
const CharacterSheet = lazy(() => import('./pages/CharacterSheet'))

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  if (!isAdmin) return <Navigate to="/principal" replace />
  return <>{children}</>
}

function NotFound() {
  return (
    <div className="welcome-page">
      <div id="indexcontent" style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ color: 'var(--color-cream)', marginBottom: '1.5rem' }}>Pagina no encontrada</p>
        <Link to="/principal" className="dnd-btn" style={{ textDecoration: 'none' }}>Volver al inicio</Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FontProvider>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--color-cream)' }}>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/recuperar-pass" element={<RecoverPass />} />
          <Route path="/registro" element={<RegisterForm />} />
          <Route element={<Layout />}>
            <Route path="principal" element={<Home />} />
            <Route path="info" element={<Info />} />
            <Route path="utilidades" element={<Utilities />} />
            <Route path="como-jugar" element={<HowToPlay />} />
            <Route path="usuario" element={<UserPanel />} />
            <Route path="usuario/crear" element={<CharacterForm />} />
            <Route path="usuario/editar/:id" element={<CharacterForm />} />
            <Route path="usuario/ver/:id" element={<CharacterSheet />} />
            <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </FontProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
