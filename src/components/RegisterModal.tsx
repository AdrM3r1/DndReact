import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { registerAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface RegisterModalProps {
  show: boolean
  onHide: () => void
  onShowLogin?: () => void
}

export default function RegisterModal({ show, onHide, onShowLogin }: RegisterModalProps) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [nick, setNick] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [cpass, setCpass] = useState('')

  const allFilled = nick !== '' && email !== '' && pass !== '' && cpass !== ''

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (pass !== cpass) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#d33',
      })
      return
    }

    // Try API first
    const apiResult = await registerAPI(nick, email, pass, cpass)
    if (apiResult?.success) {
      login(apiResult.user)
    } else {
      // Fallback: localStorage mode
      const raw = localStorage.getItem('dnd_users') || '[]'
      const list = JSON.parse(raw)
      if (list.find((u: any) => u.nick === nick)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El nick ya existe',
          confirmButtonColor: '#d33',
        })
        return
      }
      list.push({ id: Date.now(), nick })
      localStorage.setItem('dnd_users', JSON.stringify(list))
      login(nick)
    }

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Bienvenido ${nick}`,
      showConfirmButton: false,
      timer: 2000,
    })

    setNick('')
    setEmail('')
    setPass('')
    setCpass('')
    onHide()
    navigate('/principal')
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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Registro
          <span
            onClick={showInfo}
            style={{ cursor: 'pointer', color: '#d4af37', marginLeft: 6 }}
          >*</span>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nick</Form.Label>
            <Form.Control
              type="text"
              className="dnd-input"
              value={nick}
              onChange={e => setNick(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo Electr&oacute;nico</Form.Label>
            <Form.Control
              type="email"
              className="dnd-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contrase&ntilde;a</Form.Label>
            <Form.Control
              type="password"
              className="dnd-input"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirma Contrase&ntilde;a</Form.Label>
            <Form.Control
              type="password"
              className="dnd-input"
              value={cpass}
              onChange={e => setCpass(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" className="dnd-btn" disabled={!allFilled}>Enviar</Button>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <span
              onClick={() => { onHide(); onShowLogin?.() }}
              style={{ color: '#d4af37', cursor: 'pointer' }}
            >&iquest;Ya estas registrado?</span>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
