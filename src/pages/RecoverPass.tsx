import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { recoveryAPI } from '../services/api'
import { COLORS } from '../theme/colors'

export default function RecoverPass() {
  const navigate = useNavigate()
  const [nick, setNick] = useState('')
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nick.trim() || !email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar tu nick y correo electronico',
        confirmButtonColor: COLORS.danger,
      })
      return
    }

    const apiResult = await recoveryAPI(nick, email)
    if (apiResult?.success) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Recuperacion exitosa',
        text: 'Si los datos son correctos, recibiras un enlace de recuperacion en tu correo.',
        confirmButtonColor: COLORS.gold,
      })
    } else {
      // Fallback: mock message
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Recuperacion enviada',
        text: `Si ${nick} existe, recibiras un enlace en ${email}`,
        showConfirmButton: true,
        confirmButtonColor: COLORS.gold,
      })
    }
  }

  return (
    <div className="welcome-page">
      <div id="indexcontent">
        <div id="log">
          <h3 style={{ color: 'var(--color-cream)', textDecoration: 'underline', textDecorationThickness: 2, fontSize: '1.5rem' }}>
            Recupera tu password
          </h3>
          <br />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="logger"
                placeholder="Nick"
                value={nick}
                onChange={e => setNick(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="form-group">
              <input
                type="email"
                className="logger"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <br />
            <button className="submitButton" type="submit">Enviar</button>
            <button className="submitButton" type="button" onClick={() => navigate('/principal')}>
              Volver
            </button>
          </form>
        </div>
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
          <ol className="breadcrumb" style={{ justifyContent: 'center' }}>
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">Recuperar password</li>
          </ol>
        </nav>
      </div>
    </div>
  )
}
