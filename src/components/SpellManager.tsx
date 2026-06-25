import { useMemo } from 'react'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faMagic, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { SPELL_SLOTS_BY_CLASS, SPELL_SAVE_STATS, SPELL_CASTING_STATS, type Spell } from '../data/spells'

interface ClassEntry {
  name: string
  level: number
}

interface Props {
  className: string
  level: number
  stats: Record<string, number>
  proficiencyBonus: number
  selectedSpells: string[]
  onSpellsChange: (spells: string[]) => void
  usedSlots: number[]
  onSlotsChange: (slots: number[]) => void
  editable?: boolean
  spellsList: Spell[]
  classList?: ClassEntry[]
}

const FULL_CASTER_SLOTS: number[][] = [
  [2,0,0,0,0,0,0,0,0],
  [3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],
  [4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],
  [4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],
  [4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],
  [4,3,3,3,2,0,0,0,0],
  [4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0],
  [4,3,3,3,2,1,1,0,0],
  [4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1],
  [4,3,3,3,3,1,1,1,1],
  [4,3,3,3,3,2,1,1,1],
  [4,3,3,3,3,2,2,1,1],
]

const HALF_CASTER_SLOTS: number[][] = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0],
  [3,0,0,0,0,0,0,0,0],
  [3,0,0,0,0,0,0,0,0],
  [3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0],
  [4,3,0,0,0,0,0,0,0],
  [4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],
  [4,3,3,0,0,0,0,0,0],
  [4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0],
  [4,3,3,2,0,0,0,0,0],
  [4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],
]

const WARLOCK_SLOTS: number[][] = [
  [1,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0],
  [0,2,0,0,0,0,0,0,0],
  [0,2,0,0,0,0,0,0,0],
  [0,0,2,0,0,0,0,0,0],
  [0,0,2,0,0,0,0,0,0],
  [0,0,0,2,0,0,0,0,0],
  [0,0,0,2,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0],
  [0,0,0,0,2,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
  [0,0,0,0,3,0,0,0,0],
]

const HALF_CASTER_CLASSES: Set<string> = new Set(['PALADIN', 'EXPLORADOR'])
const WARLOCK_CLASS: Set<string> = new Set(['BRUJO'])
const FULL_CASTER_CLASSES: Set<string> = new Set(['BARDO', 'CLERIGO', 'DRUIDA', 'HECHICERO', 'MAGO'])

function getMaxSlots(className: string, level: number): number[] {
  if (level < 1 || level > 20) return []
  const idx = level - 1
  if (HALF_CASTER_CLASSES.has(className)) return HALF_CASTER_SLOTS[idx]
  if (WARLOCK_CLASS.has(className)) return WARLOCK_SLOTS[idx]
  return FULL_CASTER_SLOTS[idx]
}

function getCombinedCasterLevel(classList: ClassEntry[]): number {
  let total = 0
  for (const entry of classList) {
    if (FULL_CASTER_CLASSES.has(entry.name)) total += entry.level
    else if (HALF_CASTER_CLASSES.has(entry.name)) total += Math.floor(entry.level / 2)
  }
  return Math.min(total, 20)
}

function getMulticlassMaxSlots(classList: ClassEntry[]): number[] {
  const cl = getCombinedCasterLevel(classList)
  if (cl < 1) return []
  return FULL_CASTER_SLOTS[Math.min(cl - 1, 19)]
}

function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2)
}

export default function SpellManager({ className, level, stats, proficiencyBonus, selectedSpells, onSpellsChange, usedSlots, onSlotsChange, editable = true, spellsList, classList }: Props) {
  const isCaster = classList
    ? classList.some(e => !!SPELL_SLOTS_BY_CLASS[e.name])
    : !!SPELL_SLOTS_BY_CLASS[className]

  const maxSlots = useMemo(() => {
    if (classList) return getMulticlassMaxSlots(classList)
    return getMaxSlots(className, level)
  }, [classList, className, level])

  const castingStat = useMemo(() => {
    if (classList) {
      for (const entry of classList) {
        const stat = SPELL_CASTING_STATS[entry.name]
        if (stat) return stat
      }
    }
    return SPELL_CASTING_STATS[className]
  }, [classList, className])
  const castingMod = castingStat ? abilityMod(stats[castingStat] || 10) : 0
  const spellSaveDC = 8 + proficiencyBonus + castingMod
  const spellAttack = proficiencyBonus + castingMod

  const classSpells = useMemo(() => {
    const classNames = classList ? classList.map(e => e.name) : [className]
    return spellsList.filter(s => s.classes.some(c => classNames.includes(c)))
  }, [spellsList, classList, className])

  const spellsByLevel = useMemo(() => {
    const groups: Record<number, Spell[]> = {}
    classSpells.forEach(s => {
      if (!groups[s.level]) groups[s.level] = []
      groups[s.level].push(s)
    })
    return groups
  }, [classSpells])

  const maxPrepared = useMemo(() => {
    const prepClasses = classList ? classList.filter(e => SPELL_SLOTS_BY_CLASS[e.name]) : null
    if (prepClasses && prepClasses.length > 0) {
      let total = 0
      for (const entry of prepClasses) {
        const stat = SPELL_CASTING_STATS[entry.name]
        const mod = stat ? abilityMod(stats[stat] || 10) : 0
        total += Math.max(1, entry.level + mod)
      }
      return total
    }
    if (className === 'MAGO' || className === 'CLERIGO' || className === 'DRUIDA' || className === 'PALADIN')
      return Math.max(1, level + castingMod)
    if (className === 'EXPLORADOR')
      return Math.max(1, level + abilityMod(stats['sabiduria'] || 10))
    return classSpells.length
  }, [classList, className, level, castingMod, stats, classSpells.length])

  function toggleSpell(spellId: string) {
    if (!editable) return
    const isPrepared = selectedSpells.includes(spellId)
    if (isPrepared) {
      onSpellsChange(selectedSpells.filter(id => id !== spellId))
    } else if (selectedSpells.length < maxPrepared) {
      onSpellsChange([...selectedSpells, spellId])
    }
  }

  function adjustSlot(levelIdx: number, delta: number) {
    if (!editable) return
    const max = maxSlots[levelIdx] || 0
    const current = usedSlots[levelIdx] || 0
    const next = Math.max(0, Math.min(max, current + delta))
    const newSlots = [...usedSlots]
    newSlots[levelIdx] = next
    onSlotsChange(newSlots)
  }

  if (!isCaster) return null

  return (
    <div className="spell-manager">
      <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
        <FontAwesomeIcon icon={faMagic} style={{ marginRight: '8px' }} />
        Conjuros
      </h5>

      <Row className="g-2 mb-3">
        <Col xs={4} md={2}>
          <div className="cs-stat-box">
            <span className="cs-stat-label">CD</span>
            <span className="cs-stat-value">{spellSaveDC}</span>
          </div>
        </Col>
        <Col xs={4} md={2}>
          <div className="cs-stat-box">
            <span className="cs-stat-label">Ataque</span>
            <span className="cs-stat-value">+{spellAttack}</span>
          </div>
        </Col>
        <Col xs={4} md={2}>
          <div className="cs-stat-box">
            <span className="cs-stat-label">{castingStat ? castingStat.charAt(0).toUpperCase() + castingStat.slice(1, 4) : '—'}</span>
            <span className="cs-stat-value">{castingMod >= 0 ? `+${castingMod}` : castingMod}</span>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="cs-stat-box">
            <span className="cs-stat-label">Preparados</span>
            <span className="cs-stat-value">{selectedSpells.length}/{maxPrepared}</span>
          </div>
        </Col>
      </Row>

      {editable && (
        <div style={{ marginBottom: '1rem' }}>
          <h6 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <FontAwesomeIcon icon={faSlidersH} style={{ marginRight: '6px', fontSize: '0.75rem' }} />
            Slots de Conjuros
          </h6>
          <Row className="g-2">
            {maxSlots.map((max, i) => {
              if (max === 0) return null
              const levelDisplay = i + 1
              const used = usedSlots[i] || 0
              return (
                <Col xs={6} md={2} key={i}>
                  <div className="spell-slot-box">
                    <span className="spell-slot-label">Nivel {levelDisplay}</span>
                    <div className="spell-slot-controls">
                      <button className="spell-slot-btn" onClick={() => adjustSlot(i, -1)} disabled={used <= 0}>−</button>
                      <span className="spell-slot-count">{used}/{max}</span>
                      <button className="spell-slot-btn" onClick={() => adjustSlot(i, 1)} disabled={used >= max}>+</button>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </div>
      )}

      {!editable && maxSlots.some(s => s > 0) && (
        <div style={{ marginBottom: '1rem' }}>
          <h6 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Slots de Conjuros
          </h6>
          <Row className="g-2">
            {maxSlots.map((max, i) => {
              if (max === 0) return null
              const used = usedSlots[i] || 0
              return (
                <Col xs={4} md={2} key={i}>
                  <div className="spell-slot-box">
                    <span className="spell-slot-label">Nv.{i + 1}</span>
                    <span className="spell-slot-count">{used}/{max}</span>
                  </div>
                </Col>
              )
            })}
          </Row>
        </div>
      )}

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(levelNum => {
        const spells = spellsByLevel[levelNum]
        if (!spells || spells.length === 0) return null
        const preparedInLevel = selectedSpells.filter(id => spells.some(s => s.id === id)).length
        return (
          <div key={levelNum} style={{ marginBottom: '0.75rem' }}>
            <div className="spell-level-header">
              <span className="spell-level-label">{levelNum === 0 ? 'Trucos' : `Nivel ${levelNum}`}</span>
              <span className="spell-level-count">{preparedInLevel}/{spells.length}</span>
            </div>
            <div className="spell-grid">
              {spells.map(spell => {
                const isPrepared = selectedSpells.includes(spell.id)
                return (
                  <div
                    key={spell.id}
                    className={`spell-item ${isPrepared ? 'spell-prepared' : ''}`}
                    onClick={() => toggleSpell(spell.id)}
                    title={`${spell.school} · ${spell.castingTime} · ${spell.range} · ${spell.components} · ${spell.duration}\n\n${spell.description}`}
                    style={{ cursor: editable ? 'pointer' : 'default' }}
                  >
                    <div className="spell-item-header">
                      <span className="spell-item-name">{spell.name}</span>
                      {isPrepared && <span className="spell-prepared-badge"><FontAwesomeIcon icon={faBolt} /></span>}
                    </div>
                    <span className="spell-item-school">{spell.school}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
