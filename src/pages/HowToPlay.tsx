import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Nav, Form } from 'react-bootstrap'
import ScrollProgress from '../components/ScrollProgress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie, faUserFriends, faBook, faBookOpen,
  faRocket, faHeart, faTools, faDiceD20, faDesktop,
  faStar, faPlay, faPaintBrush, faSmile, faList,
  faSearch, faFistRaised, faUsers, faShieldAlt,
  faTint, faBrain, faBolt, faFilter,
  faCheck, faHatWizard,
} from '@fortawesome/free-solid-svg-icons'
import { classes } from '../data/classes'
import { races } from '../data/races'
import { COLORS } from '../theme/colors'

const TABS = [
  { key: 'empezar', label: 'Empezar', icon: faRocket },
  { key: 'clases', label: 'Clases', icon: faFistRaised },
  { key: 'razas', label: 'Razas', icon: faUsers },
  { key: 'consejos', label: 'Consejos', icon: faStar },
  { key: 'wizard', label: 'Wizard', icon: faHatWizard },
] as const

type TabKey = typeof TABS[number]['key']

const ACCENT: Record<TabKey, string> = {
  empezar: COLORS.gold,
  clases: COLORS.blue,
  razas: COLORS.green,
  consejos: COLORS.redLight,
  wizard: COLORS.purple,
}

const GUIDE_SECTIONS = [
  { id: 'reunir-grupo', label: 'Re\u00fane a tu grupo' },
  { id: 'reglas', label: 'Las reglas' },
  { id: 'empezar-partida', label: 'C\u00f3mo empezar' },
]

function GuideSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="guide-section" style={{ marginBottom: '2rem' }}>
      <h4>{title}</h4>
      <div className="textcont">{children}</div>
    </div>
  )
}

function SubItem({ icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong>
        <FontAwesomeIcon icon={icon} style={{ width: '20px', marginRight: '8px', color: 'var(--color-gold)' }} />
        {title}
      </strong>
      <div style={{ paddingLeft: '28px' }}>{children}</div>
    </div>
  )
}

function ClassCardCompact({ c, accent }: { c: (typeof classes)[number]; accent: string }) {
  const [expanded, setExpanded] = useState(false)
  const typeLabel = !c.magic ? 'Marrial' : c.magic.includes('Lanzador puro') ? 'Mago' : c.magic.includes('Lanzador medio') ? 'H\u00edbrido' : 'Marrial'
  const typeColor = !c.magic ? COLORS.typeMarrial : c.magic.includes('Lanzador puro') ? COLORS.typeMago : COLORS.typeHibrido
  const descShort = c.description.slice(0, 120).trim()

  return (
    <div className="dnd-card class-card-compact">
      <div className="class-card-header">
        <img src={c.icon} alt={c.name} className="class-card-icon" />
        <div>
          <h5 className="class-card-name">{c.name}</h5>
          <span className="class-type-badge" style={{ background: typeColor }}>{typeLabel}</span>
        </div>
      </div>
      <div className="dnd-card-body">
        <div className="class-stats">
          <StatTooltip label="Dado de Golpe">
            <span className="class-stat">
              <FontAwesomeIcon icon={faDiceD20} style={{ color: accent }} /> {c.hitDice}
            </span>
          </StatTooltip>
          <StatTooltip label="Requisitos">
            <span className="class-stat">
              <FontAwesomeIcon icon={faShieldAlt} style={{ color: accent }} /> {c.requirements}
            </span>
          </StatTooltip>
          {c.magic && (
            <StatTooltip label="Tipo de magia">
              <span className="class-stat">
                <FontAwesomeIcon icon={faBolt} style={{ color: accent }} /> {c.magic.split('|')[0].trim()}
              </span>
            </StatTooltip>
          )}
        </div>
        <p className="class-card-desc">
          {expanded ? c.description : `${descShort}...`}
          {' '}
          <button
            className="desc-toggle"
            onClick={() => setExpanded(!expanded)}
            style={{ color: accent }}
          >
            {expanded ? 'Leer menos' : 'Leer m\u00e1s'}
          </button>
        </p>
      </div>
    </div>
  )
}

function RaceCardCompact({ r, accent }: { r: (typeof races)[number]; accent: string }) {
  const [showSub, setShowSub] = useState(false)

  return (
    <div className="dnd-card race-card-compact">
      <div className="class-card-header">
        <img src={r.icon} alt={r.name} className="class-card-icon" />
        <div>
          <h5 className="class-card-name">{r.name}</h5>
        </div>
      </div>
      <div className="dnd-card-body">
        <div className="race-stats">
          <StatTooltip label="Velocidad">
            <span className="class-stat">
              <FontAwesomeIcon icon={faTint} style={{ color: accent }} /> {r.speed}
            </span>
          </StatTooltip>
          <StatTooltip label="Modificadores">
            <span className="class-stat">
              <FontAwesomeIcon icon={faBrain} style={{ color: accent }} /> {r.modifiers}
            </span>
          </StatTooltip>
        </div>
        <ul className="race-traits">
          {r.traits.split('|').map((t, i) => (
            <li key={i}>{t.trim()}</li>
          ))}
        </ul>
        {r.subraces && r.subraces.length > 0 && (
          <>
            <button
              className="subrace-toggle"
              onClick={() => setShowSub(!showSub)}
              style={{ color: accent }}
            >
              {showSub ? 'Ocultar' : 'Mostrar'} subrazas ({r.subraces.length})
            </button>
            {showSub && r.subraces.map((sr, i) => (
              <div key={i} className="subrace-box">
                <strong>{sr.name}</strong>
                <p>{sr.modifiers}</p>
                <StatTooltip label="Rasgos">
                  <span className="class-stat">
                    <FontAwesomeIcon icon={faStar} style={{ color: accent }} /> {sr.traits.split('|').map(t => t.trim()).join(', ')}
                  </span>
                </StatTooltip>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function isClassVisible(c: (typeof classes)[number], query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
}

function isRaceVisible(r: (typeof races)[number], query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
}

const CLASS_TYPES = ['all', 'marrial', 'mago', 'hibrido'] as const
type ClassTypeFilter = typeof CLASS_TYPES[number]

const RACE_TYPES = ['all', 'comunes', 'exoticas'] as const
type RaceTypeFilter = typeof RACE_TYPES[number]

function getClassType(c: (typeof classes)[number]): ClassTypeFilter {
  if (!c.magic) return 'marrial'
  if (c.magic.includes('Lanzador puro')) return 'mago'
  return 'hibrido'
}

function getRaceType(r: (typeof races)[number]): RaceTypeFilter {
  const exoticas = ['Draco', 'Tief', 'HalfElf', 'HalfOrc']
  return exoticas.includes(r.id) ? 'exoticas' : 'comunes'
}

const TOOLTIPS: Record<string, string> = {
  'Dado de Golpe': 'Determina los puntos de golpe iniciales y por nivel. A mayor dado, m\u00e1s resistencia.',
  'Requisitos': 'Valor m\u00ednimo de caracter\u00edstica necesario para multiclase en esta clase.',
  'Tipo de magia': 'Indica si la clase lanza conjuros y de qu\u00e9 tipo (puro, medio o de pacto).',
  'Velocidad': 'Distancia en pies que puede recorrer el personaje por turno.',
  'Modificadores': 'Bonificadores raciales a las caracter\u00edsticas del personaje.',
  'Rasgos': 'Habilidades especiales que otorga la raza o subraza.',
}

function StatTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const explanation = TOOLTIPS[label]
  if (!explanation) return <>{children}</>

  return (
    <span className="stat-tooltip-wrapper">
      <span className="stat-tooltip-target">{children}</span>
      <span className="stat-tooltip-bubble">{explanation}</span>
    </span>
  )
}

// -------- Wizard ----------
interface WizardAnswers {
  combate: string
  rol: string
  armadura: string
}

const WIZARD_STEPS = [
  {
    key: 'combate',
    question: '\u00bfPrefieres el combate cuerpo a cuerpo o la magia?',
    options: [
      { value: 'melee', label: 'Cuerpo a cuerpo', icon: faFistRaised },
      { value: 'magic', label: 'Magia', icon: faHatWizard },
      { value: 'both', label: 'Ambos', icon: faStar },
    ],
  },
  {
    key: 'rol',
    question: '\u00bfQu\u00e9 rol prefieres en el grupo?',
    options: [
      { value: 'damage', label: 'Hacer da\u00f1o', icon: faBolt },
      { value: 'support', label: 'Apoyar / Curar', icon: faHeart },
      { value: 'tank', label: 'Absorber da\u00f1o', icon: faShieldAlt },
    ],
  },
  {
    key: 'armadura',
    question: '\u00bfQu\u00e9 tipo de armadura prefieres?',
    options: [
      { value: 'heavy', label: 'Pesada', icon: faShieldAlt },
      { value: 'light', label: 'Ligera / Sin armadura', icon: faTint },
      { value: 'none', label: 'No me importa', icon: faStar },
    ],
  },
] as const

const WIZARD_RESULTS: Record<string, string[]> = {
  'melee-damage-heavy': ['Guerrero', 'Paladin', 'Barbaro'],
  'melee-damage-light': ['Picaro', 'Monje', 'Explorador'],
  'melee-damage-none': ['Barbaro', 'Monje', 'Guerrero'],
  'melee-support-heavy': ['Paladin', 'Clerigo'],
  'melee-support-light': ['Bardo', 'Explorador'],
  'melee-support-none': ['Bardo', 'Druida'],
  'melee-tank-heavy': ['Paladin', 'Guerrero', 'Clerigo'],
  'melee-tank-light': ['Explorador', 'Druida'],
  'melee-tank-none': ['Barbaro', 'Druida'],
  'magic-damage-heavy': ['Clerigo'],
  'magic-damage-light': ['Hechicero', 'Brujo', 'Mago'],
  'magic-damage-none': ['Hechicero', 'Brujo', 'Mago'],
  'magic-support-heavy': ['Clerigo', 'Paladin'],
  'magic-support-light': ['Bardo', 'Druida'],
  'magic-support-none': ['Bardo', 'Druida'],
  'magic-tank-heavy': ['Clerigo'],
  'magic-tank-light': ['Druida'],
  'magic-tank-none': ['Druida'],
  'both-damage-heavy': ['Paladin', 'Guerrero'],
  'both-damage-light': ['Picaro', 'Explorador', 'Bardo'],
  'both-damage-none': ['Barbaro', 'Monje', 'Druida'],
  'both-support-heavy': ['Paladin', 'Clerigo'],
  'both-support-light': ['Bardo', 'Explorador', 'Druida'],
  'both-support-none': ['Bardo', 'Druida'],
  'both-tank-heavy': ['Paladin', 'Guerrero', 'Clerigo'],
  'both-tank-light': ['Explorador', 'Druida'],
  'both-tank-none': ['Barbaro', 'Druida'],
}

function ClassWizard({ accent, onSelectClass }: { accent: string; onSelectClass?: (className: string, allNames: string[]) => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({})
  const [showResult, setShowResult] = useState(false)

  const currentStep = WIZARD_STEPS[step]

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentStep.key]: value }
    setAnswers(newAnswers)
    if (step < WIZARD_STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setAnswers(newAnswers as WizardAnswers)
      setShowResult(true)
    }
  }

  function handleReset() {
    setStep(0)
    setAnswers({})
    setShowResult(false)
  }

  if (showResult) {
    const key = `${answers.combate}-${answers.rol}-${answers.armadura}`
    const recommended = WIZARD_RESULTS[key] ?? ['Guerrero', 'Mago', 'Bardo']
    const classData = recommended.map(name => classes.find(c => c.id === name || c.name === name)).filter(Boolean) as typeof classes

    return (
      <div className="wizard-result dnd-card" style={{ borderColor: accent }}>
        <div className="dnd-card-body">
          <h5 style={{ color: accent }}>
            <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />
            Clases recomendadas para ti
          </h5>
          <div className="wizard-result-grid">
            {classData.map(c => (
              <div
                key={c.id}
                className="wizard-result-item"
                style={{ borderColor: accent, cursor: onSelectClass ? 'pointer' : 'default' }}
                onClick={() => onSelectClass?.(c.name, classData.map(x => x.name))}
                title="Click para ver esta clase"
              >
                <img src={c.icon} alt={c.name} className="class-card-icon" />
                <strong>{c.name}</strong>
                <span className="class-stat">
                  <FontAwesomeIcon icon={faDiceD20} style={{ color: accent }} /> {c.hitDice}
                </span>
              </div>
            ))}
            {classData.length >= 2 && (
              <button className="wizard-reset-btn" onClick={() => onSelectClass?.('', classData.map(x => x.name))} style={{ color: accent }}>
                Ver todas en Clases
              </button>
            )}
            <button className="wizard-reset-btn" onClick={handleReset} style={{ color: accent, marginLeft: classData.length >= 2 ? '12px' : '0' }}>
              Volver a empezar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wizard-box dnd-card" style={{ borderColor: accent }}>
      <div className="dnd-card-body">
        <h5 style={{ color: accent }}>
          <FontAwesomeIcon icon={faHatWizard} style={{ marginRight: '8px' }} />
          \u00bfQu\u00e9 clase eres? — Paso {step + 1} de {WIZARD_STEPS.length}
        </h5>
        <div className="wizard-progress">
          {WIZARD_STEPS.map((_, i) => (
            <span
              key={i}
              className={`wizard-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              style={{ background: i <= step ? accent : 'var(--color-white-20)' }}
            />
          ))}
        </div>
        <p className="wizard-question">{currentStep.question}</p>
        <div className="wizard-options">
          {currentStep.options.map(opt => (
            <button
              key={opt.value}
              className="wizard-option"
              onClick={() => handleAnswer(opt.value)}
              style={{ '--accent': accent, borderColor: 'var(--color-gold-20)' } as React.CSSProperties}
            >
              <FontAwesomeIcon icon={opt.icon} style={{ color: accent }} />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HowToPlay() {
  const [activeTab, setActiveTab] = useState<TabKey>('empezar')
  const [classQuery, setClassQuery] = useState('')
  const [raceQuery, setRaceQuery] = useState('')
  const [classTypeFilter, setClassTypeFilter] = useState<ClassTypeFilter>('all')
  const [raceTypeFilter, setRaceTypeFilter] = useState<RaceTypeFilter>('all')
  const [wizardClassIds, setWizardClassIds] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  const sectionRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const accent = ACCENT[activeTab]

  const filteredClasses = useMemo(() => classes.filter(c => {
    if (wizardClassIds.length > 0 && !wizardClassIds.includes(c.name) && !wizardClassIds.includes(c.id)) return false
    if (!isClassVisible(c, classQuery)) return false
    if (classTypeFilter !== 'all' && getClassType(c) !== classTypeFilter) return false
    return true
  }), [classQuery, classTypeFilter, wizardClassIds])
  const filteredRaces = useMemo(() => races.filter(r => {
    if (!isRaceVisible(r, raceQuery)) return false
    if (raceTypeFilter !== 'all' && getRaceType(r) !== raceTypeFilter) return false
    return true
  }), [raceQuery, raceTypeFilter])

  useEffect(() => {
    const ids = GUIDE_SECTIONS.map(s => s.id)
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          sectionRefs.current.set(entry.target.id, entry)
        })
        const visible = ids
          .map(id => ({ id, entry: sectionRefs.current.get(id) }))
          .filter((x): x is { id: string; entry: IntersectionObserverEntry } => x.entry != null && x.entry.isIntersecting)
          .sort((a, b) => b.entry.intersectionRatio - a.entry.intersectionRatio)
        if (visible.length > 0) {
          setActiveSection(visible[0].id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    els.forEach(el => observerRef.current!.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const handleTabSelect = useCallback((key: string | null) => {
    if (key) setActiveTab(key as TabKey)
  }, [])

  const titleStyle = useMemo(() => ({ color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '0.25rem' } as React.CSSProperties), [accent])

  return (
    <div style={{ position: 'relative' }}>
      <ScrollProgress />

      <Container className="mt-4 howtoplay-content">
        <Row>
          <Col md={12}>
            <h2 id="pageTitle" style={titleStyle}>
              <FontAwesomeIcon icon={faRocket} style={{ marginRight: '10px' }} />
              C&oacute;mo comenzar a jugar a Dungeons &amp; Dragons
            </h2>
          </Col>
        </Row>

        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={handleTabSelect}
          className="howtoplay-tabs mb-4"
          style={{ '--accent-color': accent } as React.CSSProperties}
        >
          {TABS.map(tab => (
            <Nav.Item key={tab.key}>
              <Nav.Link eventKey={tab.key}>
                <FontAwesomeIcon icon={tab.icon} className="tab-icon" />
                {tab.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Row>
          {activeTab === 'empezar' && (
            <Col md={3}>
              <nav className="howtoplay-sidebar">
                <h5 style={{ color: accent }}>En esta gu&iacute;a</h5>
                <ul>
                  {GUIDE_SECTIONS.map(s => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={activeSection === s.id ? 'spy-active' : ''}
                        style={{
                          '--accent': accent,
                          borderLeft: activeSection === s.id ? `3px solid ${accent}` : '3px solid transparent'
                        } as React.CSSProperties}
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Col>
          )}
          <Col md={activeTab === 'empezar' ? 9 : 12}>
            <div className="tab-content-animate" key={activeTab} style={{ '--accent-color': accent } as React.CSSProperties}>
              {activeTab === 'empezar' && (
                <EmpezarContent />
              )}
              {activeTab === 'clases' && (
                <ClasesContent
                  classes={filteredClasses}
                  accent={accent}
                  query={classQuery}
                  onQueryChange={(q) => { setClassQuery(q); setWizardClassIds([]) }}
                  typeFilter={classTypeFilter}
                  onTypeFilterChange={(f) => { setClassTypeFilter(f); setWizardClassIds([]) }}
                  wizardActive={wizardClassIds.length > 0}
                  onClearWizard={() => setWizardClassIds([])}
                />
              )}
              {activeTab === 'razas' && (
                <RazasContent
                  races={filteredRaces}
                  accent={accent}
                  query={raceQuery}
                  onQueryChange={setRaceQuery}
                  typeFilter={raceTypeFilter}
                  onTypeFilterChange={setRaceTypeFilter}
                />
              )}
              {activeTab === 'consejos' && (
                <ConsejosContent accent={accent} />
              )}
              {activeTab === 'wizard' && (
                <ClassWizard
                  accent={accent}
                  onSelectClass={(_name, allNames) => {
                    setActiveTab('clases')
                    setClassQuery('')
                    setClassTypeFilter('all')
                    setWizardClassIds(allNames ?? [])
                  }}
                />
              )}
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}>
            <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/principal">Home</Link>
                </li>
                <li className="breadcrumb-item active" style={{ color: accent }} aria-current="page">
                  Como Jugar
                </li>
              </ol>
            </nav>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

function EmpezarContent() {
  return (
    <>
      <div className="howtoplay-hero">
        <div className="howtoplay-hero-overlay" />
        <div className="howtoplay-hero-content">
          <img src="/images/dndMinimal-removebg-preview-cropped.png" alt="D&D" className="howtoplay-hero-logo" />
          <h3 style={{ color: '#fff' }}>Bienvenido a Dungeons &amp; Dragons</h3>
          <p style={{ color: 'var(--color-white-85)', maxWidth: '600px', margin: '0 auto' }}>
            Una gu&iacute;a r&aacute;pida para empezar tu primera aventura. Todo lo que necesitas saber
            para crear personajes, entender las reglas y divertirte con tu grupo.
          </p>
        </div>
      </div>
      <GuideSection id="reunir-grupo" title="Reune a tu grupo antes de continuar">
        <p>
          Dungeons &amp; Dragons se juega en compa&ntilde;&iacute;a. Necesit&aacute;is al menos dos personas
          (aunque m&aacute;s jugadores = m&aacute;s diversi&oacute;n).
        </p>
        <SubItem icon={faUserTie} title="El Master (DM)">
          <p>
            Crea la historia, dirige la narrativa e interpreta a los personajes que no son los jugadores.
            Su labor es conducir la trama para que los jugadores puedan centrarse en sus personajes.
          </p>
        </SubItem>
        <SubItem icon={faUserFriends} title="Los jugadores">
          <p>
            Cada uno maneja un personaje &uacute;nico. Pod&eacute;is elegir entre m&uacute;ltiples razas
            (elfos, enanos, humanos, draconidos&hellip;) y clases (mago, palad&iacute;n, bardo&hellip;).
          </p>
        </SubItem>
        <SubItem icon={faStar} title="Consejo para crear personaje">
          <p>
            Elegid una combinaci&oacute;n que os guste: un tiefling cl&eacute;rigo, una semielfa barda,
            un humano guerrero&hellip; Lo ideal es que el grupo est&eacute; equilibrado, pero lo importante
            es pasarlo bien con el personaje que elij&aacute;is.
          </p>
        </SubItem>
      </GuideSection>

      <GuideSection id="reglas" title="Las reglas estan para ayudarte">
        <SubItem icon={faBook} title="Los 3 manuales b&aacute;sicos">
          <ul style={{ marginBottom: '1rem' }}>
            <li><strong>Manual del Jugador</strong> &mdash; creaci&oacute;n de personaje, combate, turnos.</li>
            <li><strong>Gu&iacute;a del Dungeon Master</strong> &mdash; consejos para dirigir partidas.</li>
            <li><strong>Manual de Monstruos</strong> &mdash; bestiario de criaturas.</li>
          </ul>
        </SubItem>
        <SubItem icon={faTools} title="Las reglas son flexibles">
          <p>
            No teng&aacute;is miedo de cambiar las reglas o usar reglas caseras. Si algo se vuelve
            complicado o resta diversi&oacute;n, adaptadlo. Lo importante es que el grupo se divierta.
          </p>
        </SubItem>
        <SubItem icon={faPlay} title="Enfoque de la partida">
          <p>
            &iquest;Pref&eacute;ris interpretaci&oacute;n, combate o una mezcla? Todo vale.
            No hace falta ser actor profesional, pero &ldquo;meteros en el personaje&rdquo; ayuda
            a disfrutar m&aacute;s la experiencia.
          </p>
        </SubItem>
      </GuideSection>

      <GuideSection id="empezar-partida" title="Como empezar una partida">
        <SubItem icon={faRocket} title="Caja de inicio">
          <p>
            Incluye un manual resumido, una aventura lista para jugar, personajes pregenerados
            y un juego de dados. Es la forma m&aacute;s f&aacute;cil de probar D&D sin agobios.
          </p>
        </SubItem>
        <SubItem icon={faList} title="Primera partida corta">
          <p>
            Para grupos nuevos, lo mejor es empezar con una historia que dure 1-2 sesiones.
            As&iacute; jugadores y Master se conocen y se adaptan a la din&aacute;mica del grupo.
          </p>
        </SubItem>
        <SubItem icon={faBookOpen} title="Aventuras oficiales">
          <p>
            Hay muchas historias listas para jugar, como <em>La Maldici&oacute;n de Strahd</em> o
            <em> Waterdeep: El Golpe de los Dragones</em>. Son ideales para aprender c&oacute;mo
            estructurar una campa&ntilde;a.
          </p>
        </SubItem>
        <SubItem icon={faPaintBrush} title="Crea tu propio mundo">
          <p>
            &iquest;Prefieres inventarlo todo? Adelante. Usa un escenario conocido como
            Reinos Olvidados o crea el tuyo desde cero. Las aventuras oficiales pueden servirte
            de inspiraci&oacute;n.
          </p>
        </SubItem>
      </GuideSection>
    </>
  )
}

function ClasesContent({
  classes: items, accent, query, onQueryChange, typeFilter, onTypeFilterChange, wizardActive, onClearWizard
}: {
  classes: typeof classes
  accent: string
  query: string
  onQueryChange: (q: string) => void
  typeFilter: ClassTypeFilter
  onTypeFilterChange: (f: ClassTypeFilter) => void
  wizardActive?: boolean
  onClearWizard?: () => void
}) {
  return (
    <>
      {wizardActive && (
        <div className="wizard-active-banner" style={{ borderColor: accent }}>
          <span>
            <FontAwesomeIcon icon={faHatWizard} style={{ color: accent, marginRight: '8px' }} />
            Mostrando clases recomendadas por el Wizard
          </span>
          <button onClick={onClearWizard} className="wizard-clear-btn" style={{ color: accent }}>
            Limpiar filtro
          </button>
        </div>
      )}
      <div className="filter-bar">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" style={{ color: accent }} />
          <Form.Control
            type="text"
            placeholder="Buscar clase..."
            value={query}
            onChange={e => { onQueryChange(e.target.value); onClearWizard?.() }}
            className="dnd-input search-input"
          />
        </div>
        <div className="type-filters">
          <FontAwesomeIcon icon={faFilter} style={{ color: accent, marginRight: '6px', fontSize: '0.85rem' }} />
          {CLASS_TYPES.map(t => (
            <button
              key={t}
              className={`type-filter-btn ${typeFilter === t ? 'active' : ''}`}
              onClick={() => { onTypeFilterChange(t); onClearWizard?.() }}
              style={{
                '--accent': accent,
                borderColor: typeFilter === t ? accent : 'var(--color-gold-20)',
              } as React.CSSProperties}
            >
              {t === 'all' ? 'Todas' : t === 'marrial' ? 'Marrial' : t === 'mago' ? 'Mago' : 'H\u00edbrido'}
            </button>
          ))}
        </div>
      </div>
      {items.length === 0 ? (
        <p className="textcont" style={{ textAlign: 'center', padding: '2rem' }}>
          No se encontraron clases con ese filtro.
        </p>
      ) : (
        <div className="class-grid">
          {items.map(c => (
            <ClassCardCompact key={c.id} c={c} accent={accent} />
          ))}
        </div>
      )}
    </>
  )
}

function RazasContent({
  races: items, accent, query, onQueryChange, typeFilter, onTypeFilterChange
}: {
  races: typeof races
  accent: string
  query: string
  onQueryChange: (q: string) => void
  typeFilter: RaceTypeFilter
  onTypeFilterChange: (f: RaceTypeFilter) => void
}) {
  return (
    <>
      <div className="filter-bar">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" style={{ color: accent }} />
          <Form.Control
            type="text"
            placeholder="Buscar raza..."
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            className="dnd-input search-input"
          />
        </div>
        <div className="type-filters">
          <FontAwesomeIcon icon={faFilter} style={{ color: accent, marginRight: '6px', fontSize: '0.85rem' }} />
          {RACE_TYPES.map(t => (
            <button
              key={t}
              className={`type-filter-btn ${typeFilter === t ? 'active' : ''}`}
              onClick={() => onTypeFilterChange(t)}
              style={{
                '--accent': accent,
                borderColor: typeFilter === t ? accent : 'var(--color-gold-20)',
              } as React.CSSProperties}
            >
              {t === 'all' ? 'Todas' : t === 'comunes' ? 'Comunes' : 'Ex\u00f3ticas'}
            </button>
          ))}
        </div>
      </div>
      {items.length === 0 ? (
        <p className="textcont" style={{ textAlign: 'center', padding: '2rem' }}>
          No se encontraron razas con ese filtro.
        </p>
      ) : (
        <div className="race-grid">
          {items.map(r => (
            <RaceCardCompact key={r.id} r={r} accent={accent} />
          ))}
        </div>
      )}
    </>
  )
}

function ConsejosContent({ accent }: { accent: string }) {
  return (
    <>
      <GuideSection id="buen-rollo" title="El buen rollo es fundamental">
        <p>
          Lo m&aacute;s importante para disfrutar de D&D es que haya buen ambiente en el grupo.
          Habr&aacute; momentos tensos, pero la clave es la colaboraci&oacute;n y el respeto mutuo.
        </p>
        <SubItem icon={faHeart} title="No es Master vs Jugadores">
          <p>
            D&D no se &ldquo;gana&rdquo;. Todos colabor&aacute;is para mover la trama.
            Si alguien sabotea al grupo o busca siempre el protagonismo, habladlo abiertamente.
          </p>
        </SubItem>
        <SubItem icon={faSmile} title="Consejos para una buena mesa">
          <ul style={{ marginBottom: 0 }}>
            <li>Prestad atenci&oacute;n durante las descripciones del Master.</li>
            <li>Respetad el tiempo que el Master dedica a preparar la partida.</li>
            <li>Si algo no se entiende, ped&iacute; ayuda sin miedo.</li>
            <li>Como Master, no tortureis a los jugadores; vuestro rol es hacer el juego divertido para todos.</li>
          </ul>
        </SubItem>
      </GuideSection>

      <GuideSection id="herramientas" title="Herramientas de oficio">
        <SubItem icon={faDiceD20} title="En fisico">
          <p>
            Necesitar&eacute;is fichas de personaje, dados variados (un par de sets bastan),
            l&aacute;pices y una libreta para apuntar lugares, nombres y res&uacute;menes de la sesi&oacute;n.
          </p>
        </SubItem>
        <SubItem icon={faDesktop} title="En digital">
          <p>
            <strong>D&amp;D Beyond</strong> tiene todos los libros oficiales y hojas de personaje digitales.
            <strong> Roll20</strong> permite jugar online con mapas, fichas y tiradas de dados integradas.
          </p>
        </SubItem>
        <SubItem icon={faPlay} title="YouTube">
          <p>
            <em>Handbooker Helper</em> (Critical Role) explica las bases del juego en ingl&eacute;s.
            <em> Game Master Tips</em> (Geek &amp; Sundry) ofrece consejos de direcci&oacute;n.
            Hay much&iacute;simos canales en espa&ntilde;ol para seguir aprendiendo.
          </p>
        </SubItem>
      </GuideSection>

      <h4 style={{ color: accent }}>Videos &uacute;tiles</h4>
      <Row>
        <Col md={6}>
          <h6>C&oacute;mo se juega</h6>
          <iframe
            style={{ maxWidth: '100%', borderRadius: '8px' }}
            width="100%"
            height="280"
            src="https://www.youtube.com/embed/lkjoLmStBUI"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </Col>
        <Col md={6}>
          <h6>Rellenar la ficha de personaje</h6>
          <iframe
            style={{ maxWidth: '100%', borderRadius: '8px' }}
            width="100%"
            height="280"
            src="https://www.youtube.com/embed/IlWed5Ur7bI"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </Col>
      </Row>
    </>
  )
}
