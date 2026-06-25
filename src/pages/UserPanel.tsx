import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Table, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { getCharactersAPI, deleteCharacterAPI } from '../services/api'
import Skeleton, { SkeletonTable } from '../components/Skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faDownload, faUpload, faEye, faEdit, faTrash, faUser, faSkull } from '@fortawesome/free-solid-svg-icons'
import DMSection from '../components/DMSection'

interface Character {
  id: number | undefined
  nombre: string
  clase: string
  raza: string
  subraza?: string
  nivel: number
  classList?: { name: string; level: number }[]
  fuerza?: number
  destreza?: number
  constitucion?: number
  inteligencia?: number
  sabiduria?: number
  carisma?: number
  armorClass?: number
  hitPoints?: number
  hitDice?: string
  speed?: number
  spells?: string
  invent?: string
  alineamiento?: string
  monedas_oro?: number
}

export default function UserPanel() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [chars, setChars] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mainTab, setMainTab] = useState<'jugador' | 'dm'>('jugador')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/principal')
      return
    }

    async function load() {
      if (!user) return
      setLoading(true)

      const apiChars = await getCharactersAPI(user)
      if (apiChars) {
        setChars(apiChars as Character[])
        localStorage.setItem(`dnd_chars_${user}`, JSON.stringify(apiChars))
        setLoading(false)
        return
      }

      const stored = localStorage.getItem(`dnd_chars_${user}`)
      if (stored) {
        setChars(JSON.parse(stored))
      }
      setLoading(false)
    }

    load()
  }, [isLoggedIn, user, navigate])

  const filtered = useMemo(() => {
    if (!query) return chars
    const q = query.toLowerCase()
    return chars.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.clase.toLowerCase().includes(q) ||
      (c.classList?.some(e => e.name.toLowerCase().includes(q)) ?? false) ||
      c.raza.toLowerCase().includes(q)
    )
  }, [chars, query])

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

    await deleteCharacterAPI(id)

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

  function exportChars() {
    if (chars.length === 0) {
      Swal.fire('Sin personajes', 'No hay personajes para exportar', 'info')
      return
    }
    const blob = new Blob([JSON.stringify(chars, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dnd_personajes_${user}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importChars() {
    fileInputRef.current?.click()
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as Character[]
        if (!Array.isArray(imported)) throw new Error('Formato invalido')
        Swal.fire({
          title: 'Importar personajes?',
          text: `Se importaran ${imported.length} personajes. Los IDs existentes se sobrescribiran.`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Importar',
          cancelButtonText: 'Cancelar',
        }).then((res) => {
          if (!res.isConfirmed) return
          const existingIds = new Set(chars.map(c => c.id))
          const merged = [...chars]
          imported.forEach(c => {
            if (c.id && existingIds.has(c.id)) {
              const idx = merged.findIndex(x => x.id === c.id)
              if (idx !== -1) merged[idx] = c
            } else {
              merged.push({ ...c, id: c.id || Date.now() + Math.random() })
            }
          })
          setChars(merged)
          if (user) localStorage.setItem(`dnd_chars_${user}`, JSON.stringify(merged))
          Swal.fire('Importado', `${imported.length} personajes importados`, 'success')
        })
      } catch {
        Swal.fire('Error', 'El archivo no tiene un formato valido', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (!isLoggedIn) return null

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-start">
        <Col md={12}>
          <div className="user-main-tabs">
            <button
              className={`dm-tab ${mainTab === 'jugador' ? 'dm-tab-active' : ''}`}
              onClick={() => setMainTab('jugador')}
            >
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '6px' }} />
              Jugador
            </button>
            {isAdmin && (
              <button
                className={`dm-tab ${mainTab === 'dm' ? 'dm-tab-active' : ''}`}
                onClick={() => setMainTab('dm')}
              >
                <FontAwesomeIcon icon={faSkull} style={{ marginRight: '6px' }} />
                DM
              </button>
            )}
          </div>

          {mainTab === 'jugador' ? (
            <>
              <h3>Lista de Personajes</h3>
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <a
                  className="itemNav"
                  style={{ cursor: 'pointer', color: '#d4af37' }}
                  onClick={() => navigate('/usuario/crear')}
                >
                  Crear nuevo personaje
                </a>
                <span style={{ color: 'rgba(255,254,189,0.3)' }}>|</span>
                <a
                  className="itemNav"
                  style={{ cursor: 'pointer', color: '#d4af37' }}
                  onClick={exportChars}
                >
                  <FontAwesomeIcon icon={faDownload} style={{ marginRight: '6px' }} />
                  Exportar JSON
                </a>
                <a
                  className="itemNav"
                  style={{ cursor: 'pointer', color: '#d4af37' }}
                  onClick={importChars}
                >
                  <FontAwesomeIcon icon={faUpload} style={{ marginRight: '6px' }} />
                  Importar JSON
                </a>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>

              {loading ? (
                <div style={{ marginTop: '1rem' }}>
                  <SkeletonTable rows={3} cols={6} />
                </div>
              ) : chars.length === 0 ? (
                <p className="textcont">No tienes personajes creados aun.</p>
              ) : (
                <>
                  <div className="search-bar" style={{ maxWidth: '320px', marginBottom: '1rem' }}>
                    <FontAwesomeIcon icon={faSearch} className="search-icon" style={{ color: '#d4af37' }} />
                    <Form.Control
                      type="text"
                      placeholder="Buscar por nombre, clase o raza..."
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      className="dnd-input search-input"
                    />
                  </div>

                  <Table className="table table-hover" variant="dark" responsive>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Clase</th>
                        <th>Raza</th>
                        <th>Nivel</th>
                        <th>FUE</th>
                        <th>DES</th>
                        <th>CON</th>
                        <th>INT</th>
                        <th>SAB</th>
                        <th>CAR</th>
                        <th>PG</th>
                        <th>CA</th>
                        <th>Alineamiento</th>
                        <th>Oro</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(c => (
                        <tr className="character" key={c.id}>
                          <td>
                            <Link to={`/usuario/ver/${c.id}`} style={{ color: '#d4af37' }}>
                              {c.nombre}
                            </Link>
                          </td>
                          <td>
                            {c.classList && c.classList.length > 1
                              ? c.classList.map(e => `${e.name} ${e.level}`).join(' / ')
                              : c.clase}
                          </td>
                          <td>{c.raza}{c.subraza ? ` (${c.subraza})` : ''}</td>
                          <td>{c.classList && c.classList.length > 1 ? c.classList.reduce((s, e) => s + e.level, 0) : c.nivel}</td>
                          <td>{c.fuerza ?? '—'}</td>
                          <td>{c.destreza ?? '—'}</td>
                          <td>{c.constitucion ?? '—'}</td>
                          <td>{c.inteligencia ?? '—'}</td>
                          <td>{c.sabiduria ?? '—'}</td>
                          <td>{c.carisma ?? '—'}</td>
                          <td>{c.hitPoints ?? '—'}</td>
                          <td>{c.armorClass ?? '—'}</td>
                          <td style={{ fontSize: '0.8rem' }}>{c.alineamiento || '—'}</td>
                          <td>{c.monedas_oro ?? '—'}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link to={`/usuario/ver/${c.id}`} style={{ color: '#d4af37' }} title="Ver ficha">
                                <FontAwesomeIcon icon={faEye} />
                              </Link>
                              <a style={{ cursor: 'pointer' }} onClick={() => navigate(`/usuario/editar/${c.id}`)} title="Editar">
                                <FontAwesomeIcon icon={faEdit} />
                              </a>
                              <a style={{ cursor: 'pointer', color: 'red' }} onClick={() => deleteChar(c.id)} title="Borrar">
                                <FontAwesomeIcon icon={faTrash} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {filtered.length !== chars.length && (
                    <p className="textcont" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                      Mostrando {filtered.length} de {chars.length} personajes
                    </p>
                  )}
                </>
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
            </>
          ) : (
            <DMSection />
          )}

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
