import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Table, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faDiceD20, faCalendarDay, faDatabase, faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { getAllCharactersAPI, getUsersAPI, deleteUserAPI } from '../services/api'

interface Character {
  id: number | undefined
  nombre: string
  clase: string
  raza: string
  nivel: number
  asociadoa: string
  fecha?: string
}

interface AppUser {
  id: number
  nick: string
}

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [allChars, setAllChars] = useState<Character[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [charLog, setCharLog] = useState<Character[]>([])
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'local'>('checking')
  const [selectedLog, setSelectedLog] = useState<Set<number>>(new Set())
  const [cleanAmount, setCleanAmount] = useState(30)
  const [cleanUnit, setCleanUnit] = useState<'dias' | 'meses' | 'anyos'>('dias')

  useEffect(() => {
    if (user !== 'root') {
      navigate('/principal')
      return
    }

    async function load() {
      // Try API first for all chars
      const apiChars = await getAllCharactersAPI()
      if (apiChars) {
        setAllChars(apiChars as Character[])
        localStorage.setItem('dnd_all_chars', JSON.stringify(apiChars))
      } else {
        const storedChars = localStorage.getItem('dnd_all_chars')
        if (storedChars) {
          setAllChars(JSON.parse(storedChars))
        }
      }

      // Try API first for users
      const apiUsers = await getUsersAPI()
      if (apiUsers) {
        setUsers(apiUsers)
      } else {
        const storedUsers = localStorage.getItem('dnd_users')
        if (storedUsers) {
          const parsed: AppUser[] = JSON.parse(storedUsers)
          setUsers(parsed.filter(u => u.nick !== 'root'))
        }
      }

      // charLog always from localStorage (API doesn't expose reg_uspj directly)
      const storedLog = localStorage.getItem('dnd_char_log')
      if (storedLog) {
        setCharLog(JSON.parse(storedLog))
      }
    }

    load()

    fetch('/api/config.php', { method: 'HEAD', signal: AbortSignal.timeout(3000) })
      .then(() => setDbStatus('online'))
      .catch(() => setDbStatus('local'))
  }, [user, navigate])

  const todayCount = charLog.filter(c =>
    c.fecha && new Date(c.fecha).toDateString() === new Date().toDateString()
  ).length

  const sortedLog = [...charLog].sort((a, b) => {
    if (!a.fecha) return 1
    if (!b.fecha) return -1
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  })

  async function deleteUser(id: number, nick: string) {
    const result = await Swal.fire({
      title: `Borrar a ${nick}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    // Try API first
    const apiResult = await deleteUserAPI(id)
    if (!apiResult?.success) {
      // Fallback: localStorage only
    }

    const updated = users.filter(u => u.id !== id)
    setUsers(updated)
    localStorage.setItem('dnd_users', JSON.stringify([{ id: 0, nick: 'root' }, ...updated]))
    localStorage.removeItem(`dnd_chars_${nick}`)
    Swal.fire('Borrado', `Usuario ${nick} eliminado`, 'success')
  }

  if (user !== 'root') return null

  return (
    <Container className="mt-4">
      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="dnd-card h-100">
            <Card.Body className="d-flex align-items-center gap-3">
              <FontAwesomeIcon icon={faUsers} size="2x" style={{ color: '#d4af37' }} />
              <div style={{ color: '#FFFEBD' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', lineHeight: 1, color: '#d4af37' }}>{users.length}</div>
                <small>Usuarios</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dnd-card h-100">
            <Card.Body className="d-flex align-items-center gap-3">
              <FontAwesomeIcon icon={faDiceD20} size="2x" style={{ color: '#d4af37' }} />
              <div style={{ color: '#FFFEBD' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', lineHeight: 1, color: '#d4af37' }}>{allChars.length}</div>
                <small>Personajes</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dnd-card h-100">
            <Card.Body className="d-flex align-items-center gap-3">
              <FontAwesomeIcon icon={faCalendarDay} size="2x" style={{ color: '#d4af37' }} />
              <div style={{ color: '#FFFEBD' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', lineHeight: 1, color: '#d4af37' }}>{todayCount}</div>
                <small>Creados hoy</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dnd-card h-100">
            <Card.Body className="d-flex align-items-center gap-3">
              <FontAwesomeIcon icon={faDatabase} size="2x" style={{ color: dbStatus === 'online' ? '#4caf50' : '#d4af37' }} />
              <div style={{ color: '#FFFEBD' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1 }}>
                  {dbStatus === 'checking' ? 'Verificando...' : dbStatus === 'online' ? 'Conectado a BD' : 'Local Storage'}
                </div>
                <small>{dbStatus === 'online' ? 'MySQL Online' : 'Almacenamiento local'}</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-start">
        <Col md={12}>
          <h3>Lista de Personajes almacenados por usuario</h3>
          <Table className="table table-hover" variant="dark">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Clase</th>
                <th>Raza</th>
                <th>Nivel</th>
                <th>Propietario</th>
                <th>Editar</th>
                <th>Borrar</th>
              </tr>
            </thead>
            <tbody>
              {allChars.length === 0 ? (
                <tr>
                  <td colSpan={7} className="textcont">No hay personajes registrados.</td>
                </tr>
              ) : (
                allChars.map(c => (
                  <tr className="character" key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.clase}</td>
                    <td>{c.raza}</td>
                    <td>{c.nivel}</td>
                    <td>{c.asociadoa}</td>
                    <td>
                      <a style={{ cursor: 'pointer' }} onClick={() => navigate(`/usuario/editar/${c.id}`)}>
                        Edit
                      </a>
                    </td>
                    <td>
                      <a style={{ cursor: 'pointer', color: 'red' }} onClick={() => {
                        const updated = allChars.filter(x => x.id !== c.id)
                        setAllChars(updated)
                        localStorage.setItem('dnd_all_chars', JSON.stringify(updated))
                      }}>
                        Borrar
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <h3 className="mb-0">Registro de todos los personajes creados en total</h3>
            <button
              className="dnd-btn"
              style={{ fontSize: '14px', padding: '4px 12px' }}
              onClick={() => {
                setSelectedLog(new Set())
                setCleanAmount(30)
                setCleanUnit('dias')
              }}
            >
              Limpiar historial
            </button>
          </div>

          {/* Clean controls */}
          <div className="d-flex align-items-center gap-2 flex-wrap" style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#FFFEBD', fontSize: '14px' }}>Borrar anteriores a</span>
            <input
              type="number"
              min={1}
              value={cleanAmount}
              onChange={e => setCleanAmount(Number(e.target.value) || 1)}
              className="dnd-input"
              style={{ width: '70px', padding: '2px 6px', fontSize: '14px' }}
            />
            <select
              value={cleanUnit}
              onChange={e => setCleanUnit(e.target.value as 'dias' | 'meses' | 'anyos')}
              className="dnd-input"
              style={{ width: '90px', padding: '2px 6px', fontSize: '14px' }}
            >
              <option value="dias">días</option>
              <option value="meses">meses</option>
              <option value="anyos">años</option>
            </select>
            <button
              className="dnd-btn"
              style={{ fontSize: '14px', padding: '4px 12px' }}
              onClick={() => {
                const cutoff = new Date()
                if (cleanUnit === 'dias') cutoff.setDate(cutoff.getDate() - cleanAmount)
                else if (cleanUnit === 'meses') cutoff.setMonth(cutoff.getMonth() - cleanAmount)
                else cutoff.setFullYear(cutoff.getFullYear() - cleanAmount)

                const filtered = charLog.filter(c => {
                  if (!c.fecha) return true
                  return new Date(c.fecha) >= cutoff
                })
                const removed = charLog.length - filtered.length
                if (removed === 0) {
                  Swal.fire('Sin cambios', 'No hay registros anteriores a ese periodo.', 'info')
                  return
                }
                Swal.fire({
                  title: `Borrar ${removed} registro(s)?`,
                  text: `Se eliminaran los registros anteriores a ${cleanAmount} ${cleanUnit}.`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Borrar',
                  cancelButtonText: 'Cancelar',
                }).then(result => {
                  if (result.isConfirmed) {
                    setCharLog(filtered)
                    localStorage.setItem('dnd_char_log', JSON.stringify(filtered))
                    setSelectedLog(new Set())
                    Swal.fire('Borrados', `${removed} registro(s) eliminados.`, 'success')
                  }
                })
              }}
            >
              Borrar
            </button>
            <span style={{ color: '#aaa', fontSize: '13px', marginLeft: '8px' }}>
              ({selectedLog.size} seleccionados)
            </span>
          </div>

          <Table className="table table-hover" variant="dark">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={sortedLog.length > 0 && selectedLog.size === sortedLog.length}
                    onChange={() => {
                      if (selectedLog.size === sortedLog.length) setSelectedLog(new Set())
                      else setSelectedLog(new Set(sortedLog.map((_, i) => i)))
                    }}
                  />
                </th>
                <th>Propietario</th>
                <th>Nombre</th>
                <th>Clase</th>
                <th>Raza</th>
                <th>Nivel</th>
                <th>Creado / Modificado</th>
              </tr>
            </thead>
            <tbody>
              {sortedLog.length === 0 ? (
                <tr>
                  <td colSpan={7} className="textcont">Sin registros.</td>
                </tr>
              ) : (
                sortedLog.map((c, i) => (
                  <tr
                    className="character"
                    key={i}
                    style={selectedLog.has(i) ? { backgroundColor: 'rgba(212, 175, 55, 0.15)' } : undefined}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedLog.has(i)}
                        onChange={() => {
                          const next = new Set(selectedLog)
                          if (next.has(i)) next.delete(i)
                          else next.add(i)
                          setSelectedLog(next)
                        }}
                      />
                    </td>
                    <td>{c.asociadoa}</td>
                    <td>{c.nombre}</td>
                    <td>{c.clase}</td>
                    <td>{c.raza}</td>
                    <td>{c.nivel}</td>
                    <td>{c.fecha || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {selectedLog.size > 0 && (
            <div className="d-flex justify-content-end" style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>
              <button
                className="dnd-btn"
                style={{ fontSize: '14px', padding: '4px 12px' }}
                onClick={() => {
                  Swal.fire({
                    title: `Borrar ${selectedLog.size} registro(s) seleccionados?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Borrar',
                    cancelButtonText: 'Cancelar',
                  }).then(result => {
                    if (result.isConfirmed) {
                      const filtered = sortedLog.filter((_, i) => !selectedLog.has(i))
                      setCharLog(filtered)
                      localStorage.setItem('dnd_char_log', JSON.stringify(filtered))
                      setSelectedLog(new Set())
                      Swal.fire('Borrados', `${selectedLog.size} registro(s) eliminados.`, 'success')
                    }
                  })
                }}
              >
                Borrar seleccionados
              </button>
            </div>
          )}

          <h3>Usuarios registrados</h3>
          <Table className="table table-hover" variant="dark">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Borrar</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={2} className="textcont">No hay usuarios registrados.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr className="usuario" key={u.id}>
                    <td>{u.nick}</td>
                    <td>
                      <a
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => deleteUser(u.id, u.nick)}
                      >
                        Borrar
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex gap-3 mt-4">
            <Link to="/usuario" className="dnd-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <FontAwesomeIcon icon={faArrowLeft} /> Volver a Mi cuenta
            </Link>
            <a
              style={{ cursor: 'pointer', color: '#d4af37', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '1rem' }}
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
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesion
            </a>
          </div>

          {/* Breadcrumbs */}
          <div style={{ marginTop: '2rem' }}>
            <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/principal">Home</Link></li>
                <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">Admin</li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
