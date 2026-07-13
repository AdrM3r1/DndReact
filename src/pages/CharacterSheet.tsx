import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faArrowLeft, faDiceD20, faStar } from '@fortawesome/free-solid-svg-icons'
import { classes } from '../data/classes'
import { races } from '../data/races'
import SpellManager from '../components/SpellManager'
import { spells as ALL_SPELLS, SPELL_SLOTS_BY_CLASS } from '../data/spells'
import { XP_THRESHOLDS } from '../data/leveling'

interface CharData {
  id?: number
  nombre: string
  clase: string
  raza: string
  subraza?: string
  nivel: number
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
  trasfondo?: string
  alineamiento?: string
  competencias?: string
  monedas_oro?: number
  arma?: string
  armadura?: string
  preparedSpells?: string[]
  usedSlots?: number[]
  xp?: number
  classList?: { name: string; level: number }[]
}

const STAT_LABELS = [
  { key: 'fuerza', label: 'FUE', short: 'Fuerza' },
  { key: 'destreza', label: 'DES', short: 'Destreza' },
  { key: 'constitucion', label: 'CON', short: 'Constitucion' },
  { key: 'inteligencia', label: 'INT', short: 'Inteligencia' },
  { key: 'sabiduria', label: 'SAB', short: 'Sabiduria' },
  { key: 'carisma', label: 'CAR', short: 'Carisma' },
] as const

function mod(score: number | undefined): string {
  if (score == null) return '+0'
  const m = Math.floor((score - 10) / 2)
  return m >= 0 ? `+${m}` : `${m}`
}

export default function CharacterSheet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [char, setChar] = useState<CharData | null>(null)

  useEffect(() => {
    if (!isLoggedIn || !user || !id) return
    const stored = localStorage.getItem(`dnd_chars_${user}`)
    if (stored) {
      let chars: CharData[] = []
      try { chars = JSON.parse(stored) } catch { return }
      const c = chars.find(x => x.id === Number(id))
      if (c) setChar(c)
    }
  }, [isLoggedIn, user, id])

  if (!isLoggedIn) return null
  if (!char) {
    return (
      <Container className="mt-4">
        <p className="textcont">Personaje no encontrado.</p>
        <Link to="/usuario" style={{ color: 'var(--color-gold)' }}>Volver a mis personajes</Link>
      </Container>
    )
  }

  const classesDisplay = char.classList && char.classList.length > 0
    ? char.classList.map(e => `${e.name} ${e.level}`).join(' / ')
    : `${char.clase} ${char.nivel}`

  const classInfo = classes.find(c => c.name === char.clase)
  const raceInfo = races.find(r => r.name === char.raza)

  return (
    <Container className="mt-4 mb-5">
      <div className="character-sheet">
        <div className="cs-header">
          <div className="cs-title-block">
            <h2 className="cs-name">{char.nombre}</h2>
            <p className="cs-subtitle">
              {char.raza}{char.subraza ? ` (${char.subraza})` : ''} &middot; {classesDisplay}
            </p>
          </div>
          <div className="cs-header-icons">
            {classInfo && <img src={classInfo.icon} alt={classInfo.name} className="cs-icon" />}
            {raceInfo && <img src={raceInfo.icon} alt={raceInfo.name} className="cs-icon" />}
          </div>
        </div>

        <Row className="g-3 mb-4">
          <Col xs={6} md={2}>
            <div className="cs-stat-box">
              <span className="cs-stat-label">PG</span>
              <span className="cs-stat-value">{char.hitPoints ?? '—'}</span>
            </div>
          </Col>
          <Col xs={6} md={2}>
            <div className="cs-stat-box">
              <span className="cs-stat-label">CA</span>
              <span className="cs-stat-value">{char.armorClass ?? '—'}</span>
            </div>
          </Col>
          <Col xs={6} md={2}>
            <div className="cs-stat-box">
              <span className="cs-stat-label">Velocidad</span>
              <span className="cs-stat-value">{char.speed ?? '—'}</span>
            </div>
          </Col>
          <Col xs={6} md={2}>
            <div className="cs-stat-box">
              <span className="cs-stat-label">DG</span>
              <span className="cs-stat-value">{char.hitDice || '—'}</span>
            </div>
          </Col>
          <Col xs={6} md={2}>
            <div className="cs-stat-box">
              <span className="cs-stat-label">Nivel</span>
              <span className="cs-stat-value">{char.nivel}</span>
            </div>
          </Col>
          <Col xs={6} md={2}>
            <div className="cs-stat-box">
              <span className="cs-stat-label">Bono<br/>Proeza</span>
              <span className="cs-stat-value">+{2 + Math.floor((char.nivel - 1) / 4)}</span>
            </div>
          </Col>
          {char.xp != null && (
            <Col xs={6} md={3}>
              <div className="cs-stat-box">
                <span className="cs-stat-label">XP</span>
                <span className="cs-stat-value" style={{ fontSize: '0.9rem' }}>
                  {char.xp.toLocaleString()}
                  {char.nivel < 20 && (
                    <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>
                      {' '}/ {XP_THRESHOLDS[char.nivel]?.toLocaleString()}
                    </span>
                  )}
                </span>
                {char.nivel < 20 && (
                  <div style={{ width: '100%', height: 4, background: 'var(--color-black-30)', borderRadius: 2, marginTop: 4 }}>
                    {(() => {
                      const prevThreshold = XP_THRESHOLDS[Math.max(0, char.nivel - 1)] ?? 0
                      const nextThreshold = XP_THRESHOLDS[Math.min(char.nivel, XP_THRESHOLDS.length - 1)]
                      if (!nextThreshold || nextThreshold === prevThreshold) return null
                      const pct = Math.min(100, Math.max(0, ((char.xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
                      return (
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'var(--color-gold)',
                          borderRadius: 2,
                          transition: 'width 0.3s',
                        }} />
                      )
                    })()}
                  </div>
                )}
              </div>
            </Col>
          )}
        </Row>

        <Row className="g-3 mb-4">
          {STAT_LABELS.map(s => {
            const val = char[s.key as keyof CharData] as number | undefined
            return (
              <Col xs={4} md={2} key={s.key}>
                <div className="cs-ability-box">
                  <span className="cs-ability-label">{s.label}</span>
                  <span className="cs-ability-score">{val ?? '—'}</span>
                  <span className="cs-ability-mod">{mod(val)}</span>
                </div>
              </Col>
            )
          })}
        </Row>

        {char.alineamiento && (
          <div className="cs-section" style={{ textAlign: 'center' }}>
            <span className="cs-stat-label">Alineamiento</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-gold)' }}>
              {char.alineamiento}
            </span>
          </div>
        )}

        {char.trasfondo && (
          <div className="cs-section">
            <h5 className="cs-section-title">
              <FontAwesomeIcon icon={faStar} style={{ marginRight: '8px', color: 'var(--color-gold)' }} />
              Trasfondo
            </h5>
            <p className="cs-section-text">{char.trasfondo}</p>
          </div>
        )}

        {char.competencias && (
          <div className="cs-section">
            <h5 className="cs-section-title">
              <FontAwesomeIcon icon={faDiceD20} style={{ marginRight: '8px', color: 'var(--color-gold)' }} />
              Competencias
            </h5>
            <p className="cs-section-text">{char.competencias}</p>
          </div>
        )}

        {(char.monedas_oro || char.arma || char.armadura || char.invent) && (
          <div className="cs-section">
            <h5 className="cs-section-title">
              <FontAwesomeIcon icon={faStar} style={{ marginRight: '8px', color: 'var(--color-gold)' }} />
              Equipo
            </h5>
            <Row className="g-2">
              {char.monedas_oro != null && (
                <Col xs={12} md={4}>
                  <div className="cs-stat-box">
                    <span className="cs-stat-label">Monedas de Oro</span>
                    <span className="cs-stat-value">{char.monedas_oro}</span>
                  </div>
                </Col>
              )}
              {char.arma && (
                <Col xs={12} md={4}>
                  <div className="cs-stat-box">
                    <span className="cs-stat-label">Arma</span>
                    <span className="cs-section-text">{char.arma}</span>
                  </div>
                </Col>
              )}
              {char.armadura && (
                <Col xs={12} md={4}>
                  <div className="cs-stat-box">
                    <span className="cs-stat-label">Armadura</span>
                    <span className="cs-section-text">{char.armadura}</span>
                  </div>
                </Col>
              )}
            </Row>
            {char.invent && (
              <div style={{ marginTop: '8px' }}>
                <span className="cs-stat-label">Inventario adicional</span>
                <p className="cs-section-text" style={{ marginTop: '4px' }}>{char.invent}</p>
              </div>
            )}
          </div>
        )}

        {(SPELL_SLOTS_BY_CLASS[char.clase] || char.classList?.some(e => SPELL_SLOTS_BY_CLASS[e.name])) && (
          <div className="cs-section">
            <SpellManager
              className={char.clase}
              level={char.nivel}
              stats={{
                fuerza: char.fuerza || 10,
                destreza: char.destreza || 10,
                constitucion: char.constitucion || 10,
                inteligencia: char.inteligencia || 10,
                sabiduria: char.sabiduria || 10,
                carisma: char.carisma || 10,
              }}
              proficiencyBonus={2 + Math.floor((char.nivel - 1) / 4)}
              selectedSpells={char.preparedSpells || []}
              onSpellsChange={() => {}}
              usedSlots={char.usedSlots || []}
              onSlotsChange={() => {}}
              editable={false}
              spellsList={ALL_SPELLS}
              classList={char.classList}
            />
          </div>
        )}

        <div className="cs-actions">
          <button className="dnd-btn" onClick={() => navigate(`/usuario/editar/${char.id}`)}>
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
            Editar personaje
          </button>
          <button className="dnd-btn" onClick={() => navigate('/usuario')}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
            Volver
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/principal">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/usuario">Usuario</Link></li>
              <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">{char.nombre}</li>
            </ol>
          </nav>
        </div>
      </div>
    </Container>
  )
}