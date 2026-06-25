import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/api'

interface LoginModalProps {
  show: boolean
  onHide: () => void
  onShowRegister?: () => void
}

export default function LoginModal({ show, onHide, onShowRegister }: LoginModalProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [nick, setNick] = useState('')
  const [pass, setPass] = useState('')
  const [validated, setValidated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setValidated(true)

    if (!nick || !pass) return

    setSubmitting(true)
    // Try API first
    const apiResult = await loginAPI(nick, pass)
    if (apiResult?.success) {
      login(apiResult.user)
    } else {
      // Fallback: localStorage mode
      login(nick)
    }

    setSubmitting(false)
    setNick('')
    setPass('')
    setValidated(false)
    onHide()
    const isRoot = nick === 'root'
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: isRoot ? 'Bienvenido administrador' : `Bienvenido ${nick}`,
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      if (isRoot) navigate('/admin')
    })
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nick</Form.Label>
            <Form.Control
              type="text"
              className="dnd-input"
              value={nick}
              onChange={e => setNick(e.target.value)}
              isInvalid={validated && !nick}
              required
            />
            <Form.Control.Feedback type="invalid">El nick es obligatorio</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className="dnd-input"
              value={pass}
              onChange={e => setPass(e.target.value)}
              isInvalid={validated && !pass}
              required
            />
            <Form.Control.Feedback type="invalid">La contraseña es obligatoria</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" className="dnd-btn" disabled={submitting}>
            {submitting && <span className="btn-spinner" />}
            Login
          </Button>
          <div style={{ marginTop: 8, fontSize: 13, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span
              onClick={() => { onHide(); navigate('/recuperar-pass') }}
              style={{ color: '#d4af37', cursor: 'pointer' }}
            >¿Olvidaste la contraseña?</span>
            <span
              onClick={() => { onHide(); onShowRegister?.() }}
              style={{ color: '#d4af37', cursor: 'pointer' }}
            >¿No tienes cuenta? Regístrate</span>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
