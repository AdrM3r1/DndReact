import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faDiceD20, faTrash, faHeart, faHeartBroken, faRedo, faGripVertical } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { COLORS } from '../theme/colors'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Combatant {
  id: number
  name: string
  bonus: number
  hp: number
  maxHp: number
  ac: number
  initiative: number
}

const STORAGE_KEY = 'dnd_initiative_tracker'

function roll(n: number): number {
  return Math.floor(Math.random() * n) + 1
}

function SortableRow({
  c,
  idx,
  rolled,
  onReroll,
  onDamage,
  onHeal,
  onRemove,
}: {
  c: Combatant
  idx: number
  rolled: boolean
  onReroll: (id: number) => void
  onDamage: (id: number) => void
  onHeal: (id: number) => void
  onRemove: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: c.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div className={`init-row ${idx === 0 && rolled ? 'init-current' : ''}`}>
        <div className="init-order" {...attributes} {...listeners} style={{ cursor: 'grab', userSelect: 'none' }}>
          <FontAwesomeIcon icon={faGripVertical} style={{ opacity: 0.4, marginRight: 4 }} />
          {rolled && (idx === 0 ? <span className="init-badge">►</span> : `#${idx + 1}`)}
        </div>
        <div className="init-info">
          <span className="init-name">{c.name}</span>
          <span className="init-stats">
            CA {c.ac} · PG {c.hp}/{c.maxHp}
          </span>
        </div>
        <div className="init-initiative">
          {rolled ? (
            <span className="init-value">{c.initiative}</span>
          ) : (
            <span className="init-pending">—</span>
          )}
        </div>
        <div className="init-actions">
          <div className="init-hp-actions">
            <button className="init-btn-hp" onClick={() => onDamage(c.id)} title="Daño">
              <FontAwesomeIcon icon={faHeartBroken} />
            </button>
            <button className="init-btn-hp init-heal" onClick={() => onHeal(c.id)} title="Curación">
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>
          {rolled && (
            <button className="init-btn-sm" onClick={() => onReroll(c.id)} title="Retirar iniciativa">
              <FontAwesomeIcon icon={faRedo} />
            </button>
          )}
          <button className="init-btn-sm init-btn-remove" onClick={() => onRemove(c.id)} title="Eliminar">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InitiativeTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([])
  const [name, setName] = useState('')
  const [bonus, setBonus] = useState(0)
  const [hp, setHp] = useState(10)
  const [ac, setAc] = useState(10)
  const [rolled, setRolled] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCombatants(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combatants))
  }, [combatants])

  function addCombatant() {
    if (!name.trim()) return
    setCombatants(prev => [...prev, { id: Date.now(), name: name.trim(), bonus, hp, maxHp: hp, ac, initiative: 0 }])
    setName('')
    setBonus(0)
    setHp(10)
    setAc(10)
  }

  function rollInitiative() {
    setCombatants(prev =>
      prev.map(c => ({ ...c, initiative: roll(20) + c.bonus }))
        .sort((a, b) => b.initiative - a.initiative)
    )
    setRolled(true)
  }

  function rerollSingle(id: number) {
    setCombatants(prev =>
      prev.map(c => c.id === id ? { ...c, initiative: roll(20) + c.bonus } : c)
        .sort((a, b) => b.initiative - a.initiative)
    )
  }

  function damage(id: number) {
    Swal.fire({
      title: 'Daño',
      input: 'number',
      inputPlaceholder: 'Cantidad',
      inputAttributes: { min: '1' },
      showCancelButton: true,
      confirmButtonColor: COLORS.gold,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed && result.value) {
        setCombatants(prev => prev.map(c => c.id === id ? { ...c, hp: Math.max(0, c.hp - (parseInt(result.value) || 0)) } : c))
      }
    })
  }

  function heal(id: number) {
    Swal.fire({
      title: 'Curación',
      input: 'number',
      inputPlaceholder: 'Cantidad',
      inputAttributes: { min: '1' },
      showCancelButton: true,
      confirmButtonColor: COLORS.green,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed && result.value) {
        setCombatants(prev => prev.map(c => c.id === id ? { ...c, hp: Math.min(c.maxHp, c.hp + (parseInt(result.value) || 0)) } : c))
      }
    })
  }

  function remove(id: number) {
    setCombatants(prev => prev.filter(c => c.id !== id))
  }

  function clearAll() {
    setCombatants([])
    setRolled(false)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setCombatants(prev => {
      const oldIndex = prev.findIndex(c => c.id === active.id)
      const newIndex = prev.findIndex(c => c.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <div className="initiative-tracker">
      <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
        <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-gold)' }}>
          <FontAwesomeIcon icon={faDiceD20} style={{ marginRight: '8px' }} />
          Iniciativa de Combate
        </h4>
        {combatants.length > 0 && (
          <>
            <button className="dnd-btn-sm" onClick={rollInitiative} disabled={rolled}
              title={rolled ? 'Ya se ha tirado iniciativa' : 'Tirar iniciativa para todos'}>
              <FontAwesomeIcon icon={faDiceD20} style={{ marginRight: '4px' }} />
              {rolled ? 'Tirada hecha' : 'Tirar iniciativa'}
            </button>
            {rolled && (
              <button className="dnd-btn-sm-outline" onClick={() => setRolled(false)}>
                <FontAwesomeIcon icon={faRedo} style={{ marginRight: '4px' }} />
                Reiniciar tiradas
              </button>
            )}
            <button className="dnd-btn-sm-outline" onClick={clearAll} style={{ borderColor: 'var(--color-red-40)' }}>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: '4px' }} />
              Limpiar todo
            </button>
          </>
        )}
      </div>

      <div className="init-add-form">
        <Row className="g-2 align-items-end">
          <Col xs={12} md={3}>
            <div className="init-field">
              <label className="init-label">Nombre</label>
              <input className="dnd-input" type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="PJ / Enemigo" onKeyDown={e => e.key === 'Enter' && addCombatant()} />
            </div>
          </Col>
          <Col xs={4} md={2}>
            <div className="init-field">
              <label className="init-label">Bonus Init</label>
              <input className="dnd-input text-center" type="number" value={bonus} onChange={e => setBonus(Number(e.target.value))} />
            </div>
          </Col>
          <Col xs={4} md={2}>
            <div className="init-field">
              <label className="init-label">PG</label>
              <input className="dnd-input text-center" type="number" min={1} value={hp} onChange={e => setHp(Number(e.target.value))} />
            </div>
          </Col>
          <Col xs={4} md={2}>
            <div className="init-field">
              <label className="init-label">CA</label>
              <input className="dnd-input text-center" type="number" min={0} value={ac} onChange={e => setAc(Number(e.target.value))} />
            </div>
          </Col>
          <Col xs={12} md={3}>
            <button className="dnd-btn" onClick={addCombatant} disabled={!name.trim()} style={{ width: '100%', fontSize: '14px', padding: '6px 12px' }}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '6px' }} />
              Añadir
            </button>
          </Col>
        </Row>
      </div>

      {combatants.length === 0 && (
        <p className="textcont" style={{ marginTop: '1rem', opacity: 0.6 }}>
          Arrastra para reordenar · Añade combatientes y tira iniciativa para comenzar.
        </p>
      )}

      {combatants.length > 0 && (
        <div className="init-list">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={combatants.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {combatants.map((c, idx) => (
                <SortableRow key={c.id} c={c} idx={idx} rolled={rolled}
                  onReroll={rerollSingle} onDamage={damage} onHeal={heal} onRemove={remove} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
