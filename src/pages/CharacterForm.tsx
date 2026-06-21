import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { classes } from '../data/classes'
import { races } from '../data/races'
import { createCharacterAPI, updateCharacterAPI } from '../services/api'

export default function CharacterForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()

  const [nombre, setNombre] = useState('')
  const [clase, setClase] = useState('')
  const [raza, setRaza] = useState('')
  const [nivel, setNivel] = useState(1)
  const [armorClass, setArmorClass] = useState(10)
  const [hitPoints, setHitPoints] = useState(10)
  const [hitDice, setHitDice] = useState('')
  const [speed, setSpeed] = useState(30)
  const [spells, setSpells] = useState('')
  const [invent, setInvent] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/principal')
      return
    }

    if (isEditing && user) {
      const stored = localStorage.getItem(`dnd_chars_${user}`)
      if (stored) {
        const chars = JSON.parse(stored)
        const c = chars.find((x: any) => x.id === Number(id))
        if (c) {
          setNombre(c.nombre || '')
          setClase(c.clase || '')
          setRaza(c.raza || '')
          setNivel(c.nivel ?? 1)
          setArmorClass(c.armorClass ?? 10)
          setHitPoints(c.hitPoints ?? 10)
          setHitDice(c.hitDice || '')
          setSpeed(c.speed ?? 30)
          setSpells(c.spells || '')
          setInvent(c.invent || '')
        }
      }
    }
  }, [isLoggedIn, isEditing, id, user, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const key = `dnd_chars_${user}`
    const stored = localStorage.getItem(key)
    const chars = stored ? JSON.parse(stored) : []

    const newChar = {
      id: isEditing ? Number(id) : Date.now(),
      nombre,
      clase,
      raza,
      nivel,
      armorClass,
      hitPoints,
      hitDice,
      speed,
      spells,
      invent,
      asociadoa: user!,
    }

    // Try API first
    if (isEditing) {
      const apiResult = await updateCharacterAPI(newChar)
      if (!apiResult?.success) {
        // Fallback: localStorage only
        const idx = chars.findIndex((c: any) => c.id === Number(id))
        if (idx !== -1) chars[idx] = newChar
      }
    } else {
      const apiResult = await createCharacterAPI(newChar)
      if (apiResult?.success) {
        newChar.id = apiResult.id
      }
      chars.push(newChar)
    }

    // Keep localStorage in sync (offline cache / fallback)
    if (isEditing) {
      const idx = chars.findIndex((c: any) => c.id === Number(id))
      if (idx !== -1) chars[idx] = newChar
    }
    localStorage.setItem(key, JSON.stringify(chars))

    const allKey = 'dnd_all_chars'
    const allStored = localStorage.getItem(allKey)
    let allChars = allStored ? JSON.parse(allStored) : []
    if (isEditing) {
      const idx = allChars.findIndex((c: any) => c.id === Number(id))
      if (idx !== -1) allChars[idx] = newChar
    } else {
      allChars.push({ ...newChar, fecha: new Date().toLocaleDateString() })
    }
    localStorage.setItem(allKey, JSON.stringify(allChars))

    const logKey = 'dnd_char_log'
    const logStored = localStorage.getItem(logKey)
    let log = logStored ? JSON.parse(logStored) : []
    log.push({ ...newChar, fecha: new Date().toLocaleString() })
    localStorage.setItem(logKey, JSON.stringify(log))

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: isEditing ? 'Personaje actualizado' : 'Personaje creado',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => navigate('/usuario'))
  }

  if (!isLoggedIn) return null

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h3>{isEditing ? 'Editar Personaje' : 'Crear Personaje'}</h3>
          <Form onSubmit={handleSubmit}>
            <div className="dnd-card">
              <div className="dnd-card-header">Informacion del Personaje</div>
              <div className="dnd-card-body">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="text"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Clase</Form.Label>
                      <Form.Select className="dnd-input" value={clase} onChange={e => setClase(e.target.value)} required>
                        <option value="">Selecciona una clase</option>
                        {classes.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Raza</Form.Label>
                      <Form.Select className="dnd-input" value={raza} onChange={e => setRaza(e.target.value)} required>
                        <option value="">Selecciona una raza</option>
                        {races.map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Clase de Armadura</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="number"
                        min={0}
                        value={armorClass}
                        onChange={e => setArmorClass(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Nivel</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="number"
                        min={1}
                        max={20}
                        value={nivel}
                        onChange={e => setNivel(Number(e.target.value))}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Puntos de Golpe</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="number"
                        min={0}
                        value={hitPoints}
                        onChange={e => setHitPoints(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Velocidad</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="number"
                        min={0}
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Dados de Golpe</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="text"
                        placeholder="ej: 1d8"
                        value={hitDice}
                        onChange={e => setHitDice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="dnd-card">
              <div className="dnd-card-header">Inventario y Equipo</div>
              <div className="dnd-card-body">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    className="dnd-input"
                    rows={4}
                    value={invent}
                    onChange={e => setInvent(e.target.value)}
                    placeholder="Describe el equipo e inventario de tu personaje..."
                  />
                </Form.Group>
              </div>
            </div>

            <div className="dnd-card">
              <div className="dnd-card-header">Conjuros</div>
              <div className="dnd-card-body">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    className="dnd-input"
                    rows={4}
                    value={spells}
                    onChange={e => setSpells(e.target.value)}
                    placeholder="Describe los conjuros de tu personaje..."
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex gap-3 mb-5">
              <button className="dnd-btn" type="submit">
                {isEditing ? 'Guardar cambios' : 'Crear personaje'}
              </button>
              <button className="dnd-btn" type="button" onClick={() => navigate('/usuario')}>
                Cancelar
              </button>
            </div>
          </Form>

          <div style={{ marginTop: '2rem' }}>
            <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/principal">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/usuario">Usuario</Link></li>
                <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">
                  {isEditing ? 'Editar personaje' : 'Crear personaje'}
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
