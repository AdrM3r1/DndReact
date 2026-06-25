import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { classes } from '../data/classes'
import { races } from '../data/races'
import { createCharacterAPI, updateCharacterAPI } from '../services/api'
import SpellManager from '../components/SpellManager'
import { spells as ALL_SPELLS, SPELL_SLOTS_BY_CLASS } from '../data/spells'
import { XP_THRESHOLDS, getHitDice, getMaxHPForLevel } from '../data/leveling'

export default function CharacterForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()

  const [nombre, setNombre] = useState('')
  const [clase, setClase] = useState('')
  const [raza, setRaza] = useState('')
  const [nivel, setNivel] = useState(1)
  const [fuerza, setFuerza] = useState(10)
  const [destreza, setDestreza] = useState(10)
  const [constitucion, setConstitucion] = useState(10)
  const [inteligencia, setInteligencia] = useState(10)
  const [sabiduria, setSabiduria] = useState(10)
  const [carisma, setCarisma] = useState(10)
  const [armorClass, setArmorClass] = useState(10)
  const [hitPoints, setHitPoints] = useState(10)
  const [hitDice, setHitDice] = useState('')
  const [speed, setSpeed] = useState(30)
  const [spells, setSpells] = useState('')
  const [invent, setInvent] = useState('')
  const [trasfondo, setTrasfondo] = useState('')
  const [alineamiento, setAlineamiento] = useState('')
  const [monedasOro, setMonedasOro] = useState(0)
  const [arma, setArma] = useState('')
  const [armadura, setArmadura] = useState('')
  const [xp, setXp] = useState(0)
  const [subraza, setSubraza] = useState('')
  const [preparedSpells, setPreparedSpells] = useState<string[]>([])
  const [usedSlots, setUsedSlots] = useState<number[]>([])
  const [validated, setValidated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [classList, setClassList] = useState<{ name: string; level: number }[]>([{ name: '', level: 1 }])

  const SKILLS_LIST = [
    'Atletismo', 'Acrobacias', 'Juego de Manos', 'Sigilo',
    'Arcanos', 'Historia', 'Investigación', 'Naturaleza', 'Religión',
    'Trato con Animales', 'Perspicacia', 'Medicina', 'Percepción', 'Supervivencia',
    'Engañar', 'Intimidar', 'Interpretación', 'Persuasión',
  ] as const

  const ALIGNMENTS = [
    'Legal Bueno', 'Neutral Bueno', 'Caótico Bueno',
    'Legal Neutral', 'Neutral', 'Caótico Neutral',
    'Legal Maligno', 'Neutral Maligno', 'Caótico Maligno',
  ] as const

  const [competencias, setCompetencias] = useState<string[]>([])

  function toggleSkill(skill: string) {
    setCompetencias(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  function updateClassAt(idx: number, name: string, level: number) {
    setClassList(prev => {
      const next = [...prev]
      next[idx] = { name, level }
      return next
    })
  }

  function addClass() {
    setClassList(prev => [...prev, { name: '', level: 1 }])
  }

  function removeClassAt(idx: number) {
    setClassList(prev => prev.filter((_, i) => i !== idx))
  }

  // Sync clase/nivel from classList (one-way: classList is source of truth)
  useEffect(() => {
    if (classList.length === 0) return
    setClase(classList[0].name)
    const total = classList.reduce((s, c) => s + c.level, 0)
    setNivel(total)
  }, [classList])

  // XP → auto-update total level (adjust primary class level)
  useEffect(() => {
    if (classList.length === 0) return
    let calculatedLevel = 1
    for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= XP_THRESHOLDS[i]) { calculatedLevel = i + 1; break }
    }
    const currentTotal = classList.reduce((s, c) => s + c.level, 0)
    if (currentTotal !== calculatedLevel) {
      const diff = calculatedLevel - currentTotal
      setClassList(prev => {
        const next = [...prev]
        next[0] = { ...next[0], level: Math.max(1, next[0].level + diff) }
        return next
      })
    }
  }, [xp, classList.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto HP from all classes
  useEffect(() => {
    if (classList.length === 0) return
    const conMod = Math.floor((constitucion - 10) / 2)
    let totalHp = 0
    for (const entry of classList) {
      if (entry.name) totalHp += getMaxHPForLevel(entry.name, entry.level, conMod)
    }
    setHitPoints(totalHp || 10)
  }, [classList, constitucion])

  // Auto hit dice
  useEffect(() => {
    if (classList.length === 0) return
    const parts = classList.filter(e => e.name).map(e => `${e.level}${getHitDice(e.name)}`)
    setHitDice(parts.join(' / ') || '')
  }, [classList])

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
          setRaza(c.raza || '')
          setSubraza(c.subraza || '')
          setFuerza(c.fuerza ?? 10)
          setDestreza(c.destreza ?? 10)
          setConstitucion(c.constitucion ?? 10)
          setInteligencia(c.inteligencia ?? 10)
          setSabiduria(c.sabiduria ?? 10)
          setCarisma(c.carisma ?? 10)
          setArmorClass(c.armorClass ?? 10)
          setHitPoints(c.hitPoints ?? 10)
          setHitDice(c.hitDice || '')
          setSpeed(c.speed ?? 30)
          setSpells(c.spells || '')
          setInvent(c.invent || '')
          setPreparedSpells(c.preparedSpells || [])
          setUsedSlots(c.usedSlots || [])
          setXp(c.xp ?? 0)
          setTrasfondo(c.trasfondo || '')
          setAlineamiento(c.alineamiento || '')
          setCompetencias(c.competencias ? c.competencias.split(', ') : [])
          setMonedasOro(c.monedas_oro ?? 0)
          setArma(c.arma || '')
          setArmadura(c.armadura || '')
          setClase(c.clase || '')
          setNivel(c.nivel ?? 1)
          setClassList(c.classList || [{ name: c.clase || '', level: c.nivel ?? 1 }])
        }
      }
    }
  }, [isLoggedIn, isEditing, id, user, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidated(true)

    if (!nombre || !raza || classList.length === 0 || !classList[0]?.name) return

    setSubmitting(true)

    const key = `dnd_chars_${user}`
    const stored = localStorage.getItem(key)
    const chars = stored ? JSON.parse(stored) : []

    const newChar = {
      id: isEditing ? Number(id) : Date.now(),
      nombre,
      clase,
      raza,
      subraza,
      nivel,
      fuerza,
      destreza,
      constitucion,
      inteligencia,
      sabiduria,
      carisma,
      armorClass,
      hitPoints,
      hitDice,
      speed,
      spells,
      invent,
      trasfondo,
      alineamiento,
      competencias: competencias.join(', '),
      monedas_oro: monedasOro,
      arma,
      armadura,
      preparedSpells,
      usedSlots,
      xp,
      classList,
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
    }).then(() => { setSubmitting(false); navigate('/usuario') })
  }

  if (!isLoggedIn) return null

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h3>{isEditing ? 'Editar Personaje' : 'Crear Personaje'}</h3>
          <Form onSubmit={handleSubmit} noValidate>
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
                        isInvalid={validated && !nombre}
                        required
                      />
                      <Form.Control.Feedback type="invalid">El nombre es obligatorio</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Clase(s)</Form.Label>
                      {classList.map((entry, idx) => (
                        <Row key={idx} className="g-1 mb-1">
                          <Col xs={7} md={6}>
                            <Form.Select
                              className="dnd-input"
                              value={entry.name}
                              onChange={e => updateClassAt(idx, e.target.value, entry.level)}
                              isInvalid={validated && !entry.name}
                              required
                            >
                              <option value="">—</option>
                              {classes.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </Form.Select>
                          </Col>
                          <Col xs={3} md={3}>
                            <Form.Control
                              className="dnd-input text-center"
                              type="number"
                              min={1}
                              max={20}
                              value={entry.level}
                              onChange={e => updateClassAt(idx, entry.name, Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                            />
                          </Col>
                          <Col xs={2} md={3} className="d-flex align-items-center gap-1" style={{ paddingLeft: 0 }}>
                            {idx === classList.length - 1 && (
                              <button className="init-btn-sm" type="button" onClick={addClass} title="Añadir clase" style={{ opacity: 1 }}>
                                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
                              </button>
                            )}
                            {idx > 0 && (
                              <button className="init-btn-sm init-btn-remove" type="button" onClick={() => removeClassAt(idx)} title="Quitar clase" style={{ opacity: 1 }}>
                                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>✕</span>
                              </button>
                            )}
                          </Col>
                        </Row>
                      ))}
                      {classList.length === 0 && (
                        <button className="dnd-btn-sm-outline" type="button" onClick={addClass}>
                          + Añadir clase
                        </button>
                      )}
                      <Form.Control.Feedback type="invalid">Selecciona al menos una clase</Form.Control.Feedback>
                      <div className="text-end mt-1" style={{ fontSize: '0.85rem', color: 'var(--color-gold)', lineHeight: 1.4 }}>
                        Nivel total: <strong>{nivel}</strong>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Raza</Form.Label>
                      <Form.Select className="dnd-input" value={raza} onChange={e => { setRaza(e.target.value); setSubraza('') }} isInvalid={validated && !raza} required>
                        <option value="">Selecciona una raza</option>
                        {races.map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">Selecciona una raza</Form.Control.Feedback>
                    </Form.Group>
                    {(() => {
                      const raceInfo = races.find(r => r.name === raza)
                      if (raceInfo?.subraces?.length) {
                        return (
                          <Form.Group style={{ marginTop: '8px' }}>
                            <Form.Label>Subraza</Form.Label>
                            <Form.Select className="dnd-input" value={subraza} onChange={e => setSubraza(e.target.value)}>
                              <option value="">—</option>
                              {raceInfo.subraces.map(s => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        )
                      }
                      return null
                    })()}
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
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Alineamiento</Form.Label>
                      <Form.Select className="dnd-input" value={alineamiento} onChange={e => setAlineamiento(e.target.value)}>
                        <option value="">—</option>
                        {ALIGNMENTS.map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Puntos de Golpe (auto)</Form.Label>
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
                      <Form.Label>XP</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="number"
                        min={0}
                        value={xp}
                        onChange={e => setXp(Number(e.target.value))}
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
                  <Col md={3}>
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
                <Row className="g-3 mt-2">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Trasfondo</Form.Label>
                      <Form.Control
                        as="textarea"
                        className="dnd-input"
                        rows={3}
                        value={trasfondo}
                        onChange={e => setTrasfondo(e.target.value)}
                        placeholder="Historia, motivaciones, origen del personaje..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="dnd-card">
              <div className="dnd-card-header">Características</div>
              <div className="dnd-card-body">
                <Row className="g-3">
                  {[
                    { label: 'FUE', key: 'fuerza', val: fuerza, set: setFuerza },
                    { label: 'DES', key: 'destreza', val: destreza, set: setDestreza },
                    { label: 'CON', key: 'constitucion', val: constitucion, set: setConstitucion },
                    { label: 'INT', key: 'inteligencia', val: inteligencia, set: setInteligencia },
                    { label: 'SAB', key: 'sabiduria', val: sabiduria, set: setSabiduria },
                    { label: 'CAR', key: 'carisma', val: carisma, set: setCarisma },
                  ].map(stat => (
                    <Col xs={4} md={2} key={stat.key}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.8rem', textAlign: 'center', display: 'block' }}>{stat.label}</Form.Label>
                        <Form.Control
                          className="dnd-input text-center"
                          type="number"
                          min={1}
                          max={30}
                          value={stat.val}
                          onChange={e => stat.set(Number(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>

            <div className="dnd-card">
              <div className="dnd-card-header">Competencias / Habilidades</div>
              <div className="dnd-card-body">
                <Row className="g-2">
                  {SKILLS_LIST.map(skill => (
                    <Col xs={6} md={4} lg={3} key={skill}>
                      <Form.Check
                        type="checkbox"
                        id={`skill-${skill}`}
                        label={skill}
                        checked={competencias.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="skill-check"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </div>

            <div className="dnd-card">
              <div className="dnd-card-header">Inventario y Equipo</div>
              <div className="dnd-card-body">
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Monedas de Oro</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="number"
                        min={0}
                        value={monedasOro}
                        onChange={e => setMonedasOro(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Arma principal</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="text"
                        value={arma}
                        onChange={e => setArma(e.target.value)}
                        placeholder="ej: Espada larga +1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Armadura</Form.Label>
                      <Form.Control
                        className="dnd-input"
                        type="text"
                        value={armadura}
                        onChange={e => setArmadura(e.target.value)}
                        placeholder="ej: Cota de mallas"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3 mt-2">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Inventario adicional</Form.Label>
                      <Form.Control
                        as="textarea"
                        className="dnd-input"
                        rows={3}
                        value={invent}
                        onChange={e => setInvent(e.target.value)}
                        placeholder="Otros objetos, equipo de aventura, herramientas..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>

            {classList.some(e => SPELL_SLOTS_BY_CLASS[e.name]) && (
            <div className="dnd-card">
              <div className="dnd-card-header">Conjuros</div>
              <div className="dnd-card-body">
                <SpellManager
                  className={clase}
                  level={nivel}
                  stats={{ fuerza, destreza, constitucion, inteligencia, sabiduria, carisma }}
                  proficiencyBonus={2 + Math.floor((nivel - 1) / 4)}
                  selectedSpells={preparedSpells}
                  onSpellsChange={setPreparedSpells}
                  usedSlots={usedSlots}
                  onSlotsChange={setUsedSlots}
                  editable={true}
                  spellsList={ALL_SPELLS}
                  classList={classList.filter(e => e.name)}
                />
              </div>
            </div>
            )}

            <div className="d-flex gap-3 mb-5">
              <button className="dnd-btn" type="submit" disabled={submitting}>
                {submitting && <span className="btn-spinner" />}
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
