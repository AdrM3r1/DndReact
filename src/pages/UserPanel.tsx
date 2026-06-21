import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { getCharactersAPI, deleteCharacterAPI } from '../services/api'

interface Character {
  id: number | undefined
  nombre: string
  clase: string
  raza: string
  nivel: number
  armorClass?: number
  hitPoints?: number
  hitDice?: string
  speed?: number
  spells?: string
  invent?: string
}

export default function UserPanel() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [chars, setChars] = useState<Character[]>([])

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/principal')
      return
    }

    async function load() {
      if (!user) return

      // Try API first
      const apiChars = await getCharactersAPI(user)
      if (apiChars) {
        setChars(apiChars as Character[])
        localStorage.setItem(`dnd_chars_${user}`, JSON.stringify(apiChars))
        return
      }

      // Fallback: localStorage
      const stored = localStorage.getItem(`dnd_chars_${user}`)
      if (stored) {
        setChars(JSON.parse(stored))
      }
    }

    load()
  }, [isLoggedIn, user, navigate])

  async function deleteChar(id: number | undefined) {
    if (id === undefined) return
    const result = await Swal.fire({
      title: 'Borrar personaje?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    // Try API first
    const apiResult = await deleteCharacterAPI(id)
    if (!apiResult?.success) {
      // Fallback: localStorage only
    }

    const updated = chars.filter(c => c.id !== id)
    setChars(updated)
    if (user) {
      localStorage.setItem(`dnd_chars_${user}`, JSON.stringify(updated))

      const allKey = 'dnd_all_chars'
      const allStored = localStorage.getItem(allKey)
      if (allStored) {
        const allChars = JSON.parse(allStored).filter((c: any) => c.id !== id)
        localStorage.setItem(allKey, JSON.stringify(allChars))
      }
    }
    Swal.fire('Borrado', 'Personaje eliminado', 'success')
  }

  if (!isLoggedIn) return null

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-start">
        <Col md={12}>
          <h3>Lista de Personajes</h3>
          <p>
            <a
              className="itemNav"
              style={{ cursor: 'pointer', color: '#d4af37' }}
              onClick={() => navigate('/usuario/crear')}
            >
              Crear nuevo personaje
            </a>
          </p>
          {chars.length === 0 ? (
            <p className="textcont">No tienes personajes creados aun.</p>
          ) : (
            <Table className="table table-hover" variant="dark">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Clase</th>
                  <th>Raza</th>
                  <th>Nivel</th>
                  <th>PG</th>
                  <th>CA</th>
                  <th>Editar</th>
                  <th>Borrar</th>
                </tr>
              </thead>
              <tbody>
                {chars.map(c => (
                  <tr className="character" key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.clase}</td>
                    <td>{c.raza}</td>
                    <td>{c.nivel}</td>
                    <td>{c.hitPoints ?? '—'}</td>
                    <td>{c.armorClass ?? '—'}</td>
                    <td>
                      <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/usuario/editar/${c.id}`)}
                      >
                        Edit
                      </a>
                    </td>
                    <td>
                      <a
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => deleteChar(c.id)}
                      >
                        Borrar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <hr />
          <div className="d-flex gap-3 mt-4" style={{ alignItems: 'center' }}>
            <a
              style={{ cursor: 'pointer', color: '#d4af37' }}
              onClick={() => {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: user === 'root' ? 'Nos vemos mas tarde Admin' : 'Hasta pronto!',
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  logout()
                  navigate('/principal')
                })
              }}
            >
              Cerrar sesion
            </a>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/principal">Home</Link></li>
                <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">Usuario</li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
