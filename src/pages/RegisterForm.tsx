import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoginModal from '../components/LoginModal'

export default function RegisterForm() {
  const navigate = useNavigate()
  const [nick, setNick] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [cpass, setCpass] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  const allFilled = nick !== '' && email !== '' && pass !== '' && cpass !== ''

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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

  function showInfo() {
    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: 'Enviar se desbloqueara cuando los campos esten rellenos',
      confirmButtonColor: '#d4af37',
    })
  }

  return (
    <div className="welcome-page">
      <div id="indexcontent">
        <div id="log">
          <h3 style={{ color: '#FFFEBD', margin: '0 0 15px', textDecoration: 'underline', textDecorationThickness: 2, fontSize: '1.5rem' }}>
            Registro
            <span
              onClick={showInfo}
              style={{ cursor: 'pointer', color: '#d4af37' }}
            >*</span>
          </h3>
          <form onSubmit={handleSubmit} id="registro">
            <label className="labInput"><center>Nick</center></label>
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
