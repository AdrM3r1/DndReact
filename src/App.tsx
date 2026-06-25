import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FontProvider } from './context/FontContext'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Info from './pages/Info'
import HowToPlay from './pages/HowToPlay'
import Utilities from './pages/Utilities'
import RecoverPass from './pages/RecoverPass'
import UserPanel from './pages/UserPanel'
import CharacterForm from './pages/CharacterForm'
import AdminPanel from './pages/AdminPanel'
import RegisterForm from './pages/RegisterForm'
import CharacterSheet from './pages/CharacterSheet'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FontProvider>
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
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
        </FontProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
