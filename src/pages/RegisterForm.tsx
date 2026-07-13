import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoginModal from '../components/LoginModal'
import { registerAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { COLORS } from '../theme/colors'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [nick, setNick] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [cpass, setCpass] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  const allFilled = nick !== '' && email !== '' && pass !== '' && cpass !== ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (pass !== cpass) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: COLORS.danger,
      })
      return
    }

    try {
      const apiResult = await registerAPI(nick, email, pass, cpass)
      if (apiResult?.success) {
        login(apiResult.user, apiResult.token)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Bienvenido ${nick}`,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate('/principal')
        })
      } else {
        // Fallback: localStorage mode
        const raw = localStorage.getItem('dnd_users') || '[]'
        let list: any[] = []
        try { list = JSON.parse(raw) } catch { list = [] }
        if (list.find((u: any) => u.nick === nick)) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nick ya existe',
            confirmButtonColor: COLORS.danger,
          })
          return
        }
        list.push({ id: Date.now(), nick })
        localStorage.setItem('dnd_users', JSON.stringify(list))
        login(nick)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Bienvenido ${nick}`,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate('/principal')
        })
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al registrar. Intenta de nuevo.',
        confirmButtonColor: COLORS.danger,
      })
    }
  }

  function showInfo() {
    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: 'Enviar se desbloqueara cuando los campos esten rellenos',
      confirmButtonColor: COLORS.gold,
    })
  }

  return (
    <div className="welcome-page">
      <div id="indexcontent">
        <div id="log">
          <h3 style={{ color: 'var(--color-cream)', margin: '0 0 15px', textDecoration: 'underline', textDecorationThickness: 2, fontSize: '1.5rem' }}>
            Registro
            <span
              onClick={showInfo}
              style={{ cursor: 'pointer', color: 'var(--color-gold)' }}
            >*</span>
          </h3>
          <form onSubmit={handleSubmit} id="registro">
            <label className="labInput"><span style={{ textAlign: 'center', display: 'block' }}>Nick</span></label>
            <input className="logger" type="text" value={nick} onChange={e => setNick(e.target.value)} />
            <label className="labInput">Correo Electronico</label>
            <input className="logger" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <label className="labInput">Contrase&ntilde;a</label>
            <input className="logger" type="password" value={pass} onChange={e => setPass(e.target.value)} />
            <label className="labInput">Confirma Contrase&ntilde;a</label>
            <input className="logger" type="password" value={cpass} onChange={e => setCpass(e.target.value)} />
            <button id="Enviar" className="submitButton" type="submit" disabled={!allFilled}>
              Enviar
            </button>
            <button
              id="retorno"
              className="submitButton"
              type="button"
              onClick={() => navigate('/principal')}
            >
              Volver
            </button>
          </form>
          <div style={{ margin: '10px 12px', fontSize: 16, fontFamily: 'Dalelands' }}>
            <br />
            <a style={{ cursor: 'pointer' }} onClick={() => setShowLogin(true)}>
              &iquest;Ya estas registrado?
            </a>
          </div>
        </div>
      </div>
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
    </div>
  )
}
