import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDragon, faUsers, faBook, faStore, faCalendarDay, faPlus, faTrash, faEdit, faSave, faSearch, faFilter, faCoins } from '@fortawesome/free-solid-svg-icons'
import { ITEMS, type ShopItem } from '../data/items'

type DMTab = 'encuentros' | 'npcs' | 'notas' | 'tienda' | 'campanas'

interface EncounterMonster {
  id: number
  name: string
  quantity: number
  hp: number
  ac: number
  notes: string
}

interface NPC {
  id: number
  name: string
  role: string
  description: string
  location: string
}

interface SessionNote {
  id: number
  title: string
  content: string
  date: string
}

interface CampaignSession {
  id: number
  title: string
  date: string
  summary: string
  notes: string
}

interface Campaign {
  id: number
  name: string
  description: string
  sessions: CampaignSession[]
}

const ENC_KEY = 'dnd_dm_encounters'
const NPC_KEY = 'dnd_dm_npcs'
const NOTE_KEY = 'dnd_dm_notes'
const CAMP_KEY = 'dnd_dm_campaigns'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

const CATEGORIES = [
  'Todas',
  'Armas simples cuerpo a cuerpo',
  'Armas marciales cuerpo a cuerpo',
  'Armas simples a distancia',
  'Armas marciales a distancia',
  'Armaduras ligeras',
  'Armaduras intermedias',
  'Armaduras pesadas',
  'Escudos',
  'Equipo de aventura',
]

export default function DMSection() {
  const [tab, setTab] = useState<DMTab>('encuentros')

  // Encounters
  const [encounters, setEncounters] = useState<EncounterMonster[]>(() => load(ENC_KEY, []))
  const [encName, setEncName] = useState('')
  const [encQty, setEncQty] = useState(1)
  const [encHp, setEncHp] = useState(15)
  const [encAc, setEncAc] = useState(10)
  const [encNotes, setEncNotes] = useState('')
  const [editingEnc, setEditingEnc] = useState<number | null>(null)

  // NPCs
  const [npcs, setNpcs] = useState<NPC[]>(() => load(NPC_KEY, []))
  const [npcName, setNpcName] = useState('')
  const [npcRole, setNpcRole] = useState('')
  const [npcDesc, setNpcDesc] = useState('')
  const [npcLoc, setNpcLoc] = useState('')
  const [editingNpc, setEditingNpc] = useState<number | null>(null)

  // Notes
  const [notes, setNotes] = useState<SessionNote[]>(() => load(NOTE_KEY, []))
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [editingNote, setEditingNote] = useState<number | null>(null)

  // Shop
  const [shopQuery, setShopQuery] = useState('')
  const [shopCategory, setShopCategory] = useState('Todas')

  // Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => load(CAMP_KEY, []))
  const [campName, setCampName] = useState('')
  const [campDesc, setCampDesc] = useState('')
  const [selectedCamp, setSelectedCamp] = useState<number | null>(null)
  const [sesTitle, setSesTitle] = useState('')
  const [sesSummary, setSesSummary] = useState('')
  const [sesNotes, setSesNotes] = useState('')

  useEffect(() => { localStorage.setItem(ENC_KEY, JSON.stringify(encounters)) }, [encounters])
  useEffect(() => { localStorage.setItem(NPC_KEY, JSON.stringify(npcs)) }, [npcs])
  useEffect(() => { localStorage.setItem(NOTE_KEY, JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem(CAMP_KEY, JSON.stringify(campaigns)) }, [campaigns])

  // ── Encounter handlers ──
  function addOrUpdateEncounter() {
    if (!encName.trim()) return
    if (editingEnc !== null) {
      setEncounters(prev => prev.map(e =>
        e.id === editingEnc ? { ...e, name: encName.trim(), quantity: encQty, hp: encHp, ac: encAc, notes: encNotes } : e
      ))
      setEditingEnc(null)
    } else {
      setEncounters(prev => [...prev, { id: Date.now(), name: encName.trim(), quantity: encQty, hp: encHp, ac: encAc, notes: encNotes }])
    }
    setEncName(''); setEncQty(1); setEncHp(15); setEncAc(10); setEncNotes('')
  }

  function editEncounter(e: EncounterMonster) {
    setEditingEnc(e.id); setEncName(e.name); setEncQty(e.quantity); setEncHp(e.hp); setEncAc(e.ac); setEncNotes(e.notes)
  }

  function deleteEncounter(id: number) {
    setEncounters(prev => prev.filter(e => e.id !== id))
  }

  // ── NPC handlers ──
  function addOrUpdateNpc() {
    if (!npcName.trim()) return
    if (editingNpc !== null) {
      setNpcs(prev => prev.map(n =>
        n.id === editingNpc ? { ...n, name: npcName.trim(), role: npcRole, description: npcDesc, location: npcLoc } : n
      ))
      setEditingNpc(null)
    } else {
      setNpcs(prev => [...prev, { id: Date.now(), name: npcName.trim(), role: npcRole, description: npcDesc, location: npcLoc }])
    }
    setNpcName(''); setNpcRole(''); setNpcDesc(''); setNpcLoc('')
  }

  function editNpc(n: NPC) {
    setEditingNpc(n.id); setNpcName(n.name); setNpcRole(n.role); setNpcDesc(n.description); setNpcLoc(n.location)
  }

  function deleteNpc(id: number) {
    setNpcs(prev => prev.filter(n => n.id !== id))
  }

  // ── Note handlers ──
  function addOrUpdateNote() {
    if (!noteTitle.trim()) return
    if (editingNote !== null) {
      setNotes(prev => prev.map(n =>
        n.id === editingNote ? { ...n, title: noteTitle.trim(), content: noteContent } : n
      ))
      setEditingNote(null)
    } else {
      setNotes(prev => [...prev, { id: Date.now(), title: noteTitle.trim(), content: noteContent, date: new Date().toLocaleDateString() }])
    }
    setNoteTitle(''); setNoteContent('')
  }

  function editNote(n: SessionNote) {
    setEditingNote(n.id); setNoteTitle(n.title); setNoteContent(n.content)
  }

  function deleteNote(id: number) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  // ── Shop ──
  const shopFiltered = ITEMS.filter(item => {
    const matchName = item.name.toLowerCase().includes(shopQuery.toLowerCase())
    const matchCat = shopCategory === 'Todas' || item.category === shopCategory
    return matchName && matchCat
  })

  const shopGrouped = shopFiltered.reduce<Record<string, ShopItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const TAB_ICONS: Record<DMTab, any> = { encuentros: faDragon, npcs: faUsers, notas: faBook, tienda: faStore, campanas: faCalendarDay }

  return (
    <div className="dm-section">
      <div className="dm-tabs">
        {(Object.entries(TAB_ICONS) as [DMTab, any][]).map(([key, icon]) => (
          <button
            key={key}
            className={`dm-tab ${tab === key ? 'dm-tab-active' : ''}`}
            onClick={() => setTab(key)}
          >
            <FontAwesomeIcon icon={icon} style={{ marginRight: '6px' }} />
            {key === 'encuentros' ? 'Encuentros' : key === 'npcs' ? 'PNJs' : key === 'notas' ? 'Notas' : key === 'tienda' ? 'Tienda' : 'Campañas'}
          </button>
        ))}
      </div>

      {/* ── Encuentros Tab ── */}
      {tab === 'encuentros' && (
        <>
          <div className="dm-form">
            <Row className="g-2 align-items-end">
              <Col xs={6} md={3}>
                <div className="init-field">
                  <label className="init-label">Criatura</label>
                  <input className="dnd-input" type="text" value={encName} onChange={e => setEncName(e.target.value)} placeholder="Nombre" />
                </div>
              </Col>
              <Col xs={3} md={1}>
                <div className="init-field">
                  <label className="init-label">Cant</label>
                  <input className="dnd-input text-center" type="number" min={1} value={encQty} onChange={e => setEncQty(Math.max(1, Number(e.target.value)))} />
                </div>
              </Col>
              <Col xs={3} md={1}>
                <div className="init-field">
                  <label className="init-label">PG</label>
                  <input className="dnd-input text-center" type="number" min={1} value={encHp} onChange={e => setEncHp(Number(e.target.value))} />
                </div>
              </Col>
              <Col xs={3} md={1}>
                <div className="init-field">
                  <label className="init-label">CA</label>
                  <input className="dnd-input text-center" type="number" min={0} value={encAc} onChange={e => setEncAc(Number(e.target.value))} />
                </div>
              </Col>
              <Col xs={9} md={4}>
                <div className="init-field">
                  <label className="init-label">Notas</label>
                  <input className="dnd-input" type="text" value={encNotes} onChange={e => setEncNotes(e.target.value)} placeholder="Tácticas, tesoro..." />
                </div>
              </Col>
              <Col xs={12} md={2}>
                <button className="dnd-btn" onClick={addOrUpdateEncounter} disabled={!encName.trim()} style={{ width: '100%', fontSize: '13px', padding: '5px 10px' }}>
                  <FontAwesomeIcon icon={editingEnc !== null ? faSave : faPlus} style={{ marginRight: '4px' }} />
                  {editingEnc !== null ? 'Guardar' : 'Añadir'}
                </button>
              </Col>
            </Row>
          </div>

          {encounters.length === 0 ? (
            <p className="textcont" style={{ marginTop: '1rem', opacity: 0.5 }}>No hay criaturas en este encuentro.</p>
          ) : (
            <div className="dm-list">
              {encounters.map(e => (
                <div className="dm-row" key={e.id}>
                  <div className="dm-row-info">
                    <span className="dm-row-name">x{e.quantity} {e.name}</span>
                    <span className="dm-row-detail">PG {e.hp} &middot; CA {e.ac}{e.notes ? ` &middot; ${e.notes}` : ''}</span>
                  </div>
                  <div className="dm-row-actions">
                    <button className="init-btn-sm" onClick={() => editEncounter(e)} title="Editar"><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="init-btn-sm init-btn-remove" onClick={() => deleteEncounter(e.id)} title="Eliminar"><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── NPCs Tab ── */}
      {tab === 'npcs' && (
        <>
          <div className="dm-form">
            <Row className="g-2 align-items-end">
              <Col xs={6} md={3}>
                <div className="init-field">
                  <label className="init-label">Nombre</label>
                  <input className="dnd-input" type="text" value={npcName} onChange={e => setNpcName(e.target.value)} placeholder="Nombre del PNJ" />
                </div>
              </Col>
              <Col xs={6} md={2}>
                <div className="init-field">
                  <label className="init-label">Rol</label>
                  <input className="dnd-input" type="text" value={npcRole} onChange={e => setNpcRole(e.target.value)} placeholder="Comerciante, guardia..." />
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="init-field">
                  <label className="init-label">Localización</label>
                  <input className="dnd-input" type="text" value={npcLoc} onChange={e => setNpcLoc(e.target.value)} placeholder="Ciudad, taberna..." />
                </div>
              </Col>
              <Col xs={6} md={2}>
                <div className="init-field">
                  <label className="init-label">Descripción</label>
                  <input className="dnd-input" type="text" value={npcDesc} onChange={e => setNpcDesc(e.target.value)} placeholder="Rasgos, actitud..." />
                </div>
              </Col>
              <Col xs={12} md={2}>
                <button className="dnd-btn" onClick={addOrUpdateNpc} disabled={!npcName.trim()} style={{ width: '100%', fontSize: '13px', padding: '5px 10px' }}>
                  <FontAwesomeIcon icon={editingNpc !== null ? faSave : faPlus} style={{ marginRight: '4px' }} />
                  {editingNpc !== null ? 'Guardar' : 'Añadir'}
                </button>
              </Col>
            </Row>
          </div>

          {npcs.length === 0 ? (
            <p className="textcont" style={{ marginTop: '1rem', opacity: 0.5 }}>No hay PNJs registrados.</p>
          ) : (
            <div className="dm-list">
              {npcs.map(n => (
                <div className="dm-row" key={n.id}>
                  <div className="dm-row-info">
                    <span className="dm-row-name">{n.name}</span>
                    <span className="dm-row-detail">
                      {n.role && `«${n.role}»`}{n.location && ` — ${n.location}`}{n.description && ` — ${n.description}`}
                    </span>
                  </div>
                  <div className="dm-row-actions">
                    <button className="init-btn-sm" onClick={() => editNpc(n)} title="Editar"><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="init-btn-sm init-btn-remove" onClick={() => deleteNpc(n.id)} title="Eliminar"><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Notes Tab ── */}
      {tab === 'notas' && (
        <>
          <div className="dm-form">
            <Row className="g-2 align-items-end">
              <Col xs={12} md={4}>
                <div className="init-field">
                  <label className="init-label">Título</label>
                  <input className="dnd-input" type="text" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Sesión 1: El viaje..." />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="init-field">
                  <label className="init-label">Contenido</label>
                  <textarea className="dnd-input" rows={3} value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Escribe tus notas de sesión..." style={{ resize: 'vertical' }} />
                </div>
              </Col>
              <Col xs={12} md={2}>
                <button className="dnd-btn" onClick={addOrUpdateNote} disabled={!noteTitle.trim()} style={{ width: '100%', fontSize: '13px', padding: '5px 10px' }}>
                  <FontAwesomeIcon icon={editingNote !== null ? faSave : faPlus} style={{ marginRight: '4px' }} />
                  {editingNote !== null ? 'Guardar' : 'Añadir'}
                </button>
              </Col>
            </Row>
          </div>

          {notes.length === 0 ? (
            <p className="textcont" style={{ marginTop: '1rem', opacity: 0.5 }}>No hay notas de sesión.</p>
          ) : (
            <div className="dm-list">
              {notes.sort((a, b) => b.id - a.id).map(n => (
                <div className="dm-note" key={n.id}>
                  <div className="dm-note-header">
                    <div>
                      <span className="dm-row-name">{n.title}</span>
                      <span className="dm-row-detail" style={{ marginLeft: '8px' }}>{n.date}</span>
                    </div>
                    <div className="dm-row-actions">
                      <button className="init-btn-sm" onClick={() => editNote(n)} title="Editar"><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="init-btn-sm init-btn-remove" onClick={() => deleteNote(n.id)} title="Eliminar"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </div>
                  <p className="dm-note-content">{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Shop Tab ── */}
      {tab === 'tienda' && (
        <div className="shop-section-inner">
          <div className="shop-filters" style={{ marginBottom: '1rem' }}>
            <Row className="g-2 align-items-center">
              <Col xs={12} md={6}>
                <div className="search-bar" style={{ width: '100%' }}>
                  <FontAwesomeIcon icon={faSearch} className="search-icon" style={{ color: 'var(--color-gold)' }} />
                  <input
                    className="dnd-input search-input"
                    type="text"
                    placeholder="Buscar objeto..."
                    value={shopQuery}
                    onChange={e => setShopQuery(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </Col>
              <Col xs={12} md={4}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFilter} style={{ color: 'var(--color-gold)', opacity: 0.6 }} />
                  <select className="dnd-input" value={shopCategory} onChange={e => setShopCategory(e.target.value)} style={{ flex: 1 }}>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col xs={12} md={2} style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', opacity: 0.6 }}>
                  {shopFiltered.length} objetos
                </span>
              </Col>
            </Row>
          </div>

          {Object.keys(shopGrouped).length === 0 ? (
            <p className="textcont" style={{ textAlign: 'center', opacity: 0.5 }}>No se encontraron objetos.</p>
          ) : (
            Object.entries(shopGrouped).map(([cat, items]) => (
              <div key={cat} className="shop-section">
                <h4 className="shop-category-title">{cat}</h4>
                <Row className="g-2">
                  {items.map(item => (
                    <Col xs={12} sm={6} md={4} lg={3} key={item.id}>
                      <div className="shop-item-card">
                        <div className="shop-item-header">
                          <span className="shop-item-name">{item.name}</span>
                          <span className="shop-item-cost">
                            <FontAwesomeIcon icon={faCoins} style={{ marginRight: '4px', fontSize: '0.7rem' }} />
                            {item.cost} po
                          </span>
                        </div>
                        <p className="shop-item-desc">{item.description}</p>
                        <div className="shop-item-meta">
                          {item.weight && <span>Peso: {item.weight}</span>}
                          {item.properties && <span>{item.properties}</span>}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Campañas Tab ── */}
      {tab === 'campanas' && (
        <>
          {selectedCamp === null ? (
            <>
              <div className="dm-form">
                <Row className="g-2 align-items-end">
                  <Col xs={6} md={4}>
                    <div className="init-field">
                      <label className="init-label">Nombre</label>
                      <input className="dnd-input" type="text" value={campName} onChange={e => setCampName(e.target.value)} placeholder="Nombre de la campaña" />
                    </div>
                  </Col>
                  <Col xs={6} md={6}>
                    <div className="init-field">
                      <label className="init-label">Descripción</label>
                      <input className="dnd-input" type="text" value={campDesc} onChange={e => setCampDesc(e.target.value)} placeholder="Breve descripción" />
                    </div>
                  </Col>
                  <Col xs={12} md={2}>
                    <button className="dnd-btn" onClick={() => {
                      if (!campName.trim()) return
                      setCampaigns(prev => [...prev, { id: Date.now(), name: campName.trim(), description: campDesc, sessions: [] }])
                      setCampName(''); setCampDesc('')
                    }} disabled={!campName.trim()} style={{ width: '100%', fontSize: '13px', padding: '5px 10px' }}>
                      <FontAwesomeIcon icon={faPlus} style={{ marginRight: '4px' }} />
                      Crear
                    </button>
                  </Col>
                </Row>
              </div>
              {campaigns.length === 0 ? (
                <p className="textcont" style={{ marginTop: '1rem', opacity: 0.5 }}>No hay campañas. ¡Crea una!</p>
              ) : (
                <div className="dm-list">
                  {campaigns.map(c => (
                    <div className="dm-row" key={c.id}>
                      <div className="dm-row-info" style={{ cursor: 'pointer' }} onClick={() => setSelectedCamp(c.id)}>
                        <span className="dm-row-name">{c.name}</span>
                        <span className="dm-row-detail">{c.description || 'Sin descripción'} &middot; {c.sessions.length} sesiones</span>
                      </div>
                      <div className="dm-row-actions">
                        <button className="init-btn-sm" onClick={() => setSelectedCamp(c.id)} title="Abrir"><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="init-btn-sm init-btn-remove" onClick={() => {
                          setCampaigns(prev => prev.filter(x => x.id !== c.id))
                          if (selectedCamp === c.id) setSelectedCamp(null)
                        }} title="Eliminar"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {(() => {
                const camp = campaigns.find(c => c.id === selectedCamp)
                if (!camp) { setSelectedCamp(null); return null }
                return (
                  <>
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
                      <button className="dnd-btn" onClick={() => setSelectedCamp(null)} style={{ fontSize: '13px', padding: '4px 10px' }}>
                        ← Volver
                      </button>
                      <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', margin: 0 }}>{camp.name}</h5>
                      {camp.description && <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>{camp.description}</span>}
                    </div>

                    <div className="dm-form">
                      <Row className="g-2 align-items-end">
                        <Col xs={6} md={3}>
                          <div className="init-field">
                            <label className="init-label">Título</label>
                            <input className="dnd-input" type="text" value={sesTitle} onChange={e => setSesTitle(e.target.value)} placeholder="Sesión 1: El inicio" />
                          </div>
                        </Col>
                        <Col xs={6} md={2}>
                          <div className="init-field">
                            <label className="init-label">Resumen</label>
                            <input className="dnd-input" type="text" value={sesSummary} onChange={e => setSesSummary(e.target.value)} placeholder="Qué pasó" />
                          </div>
                        </Col>
                        <Col xs={12} md={5}>
                          <div className="init-field">
                            <label className="init-label">Notas</label>
                            <input className="dnd-input" type="text" value={sesNotes} onChange={e => setSesNotes(e.target.value)} placeholder="Detalles, PNJs, tesoro..." />
                          </div>
                        </Col>
                        <Col xs={12} md={2}>
                          <button className="dnd-btn" onClick={() => {
                            if (!sesTitle.trim()) return
                            setCampaigns(prev => prev.map(c => c.id === selectedCamp
                              ? { ...c, sessions: [...c.sessions, { id: Date.now(), title: sesTitle.trim(), date: new Date().toLocaleDateString(), summary: sesSummary, notes: sesNotes }] }
                              : c
                            ))
                            setSesTitle(''); setSesSummary(''); setSesNotes('')
                          }} disabled={!sesTitle.trim()} style={{ width: '100%', fontSize: '13px', padding: '5px 10px' }}>
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '4px' }} />
                            Añadir sesión
                          </button>
                        </Col>
                      </Row>
                    </div>

                    {camp.sessions.length === 0 ? (
                      <p className="textcont" style={{ marginTop: '1rem', opacity: 0.5 }}>No hay sesiones registradas.</p>
                    ) : (
                      <div className="dm-list" style={{ marginTop: '1rem' }}>
                        {[...camp.sessions].reverse().map(s => (
                          <div className="dm-row" key={s.id}>
                            <div className="dm-row-info">
                              <span className="dm-row-name">{s.title}</span>
                              <span className="dm-row-detail">{s.date}{s.summary ? ` — ${s.summary}` : ''}{s.notes ? ` — ${s.notes}` : ''}</span>
                            </div>
                            <div className="dm-row-actions">
                              <button className="init-btn-sm init-btn-remove" onClick={() => {
                                setCampaigns(prev => prev.map(c => c.id === selectedCamp
                                  ? { ...c, sessions: c.sessions.filter(x => x.id !== s.id) }
                                  : c
                                ))
                              }} title="Eliminar"><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )
              })()}
            </>
          )}
        </>
      )}
    </div>
  )
}
