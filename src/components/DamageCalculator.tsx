import { useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100]

export default function DamageCalculator() {
  const [numDice, setNumDice] = useState(1)
  const [dieType, setDieType] = useState(8)
  const [modifier, setModifier] = useState(0)
  const [results, setResults] = useState<{ rolls: number[]; total: number } | null>(null)
  const [isCritical, setIsCritical] = useState(false)

  function rollDice() {
    const count = isCritical ? numDice * 2 : numDice
    const rolls: number[] = []
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * dieType) + 1)
    }
    const total = rolls.reduce((a, b) => a + b, 0) + modifier
    setResults({ rolls, total })
  }

  return (
    <div className="dnd-card" style={{ marginTop: '1rem' }}>
      <div className="dnd-card-header">
        <FontAwesomeIcon icon={faCalculator} style={{ marginRight: '8px' }} />
        Calculadora de Daño
      </div>
      <div className="dnd-card-body">
        <Row className="g-3 align-items-end">
          <Col xs={4} md={2}>
            <Form.Group>
              <Form.Label style={{ fontSize: '0.8rem' }}>Nº Dados</Form.Label>
              <Form.Control className="dnd-input text-center" type="number" min={1} max={100}
                value={numDice} onChange={e => setNumDice(Math.max(1, Number(e.target.value) || 1))} />
            </Form.Group>
          </Col>
          <Col xs={4} md={2}>
            <Form.Group>
              <Form.Label style={{ fontSize: '0.8rem' }}>Tipo Dado</Form.Label>
              <Form.Select className="dnd-input" value={dieType} onChange={e => setDieType(Number(e.target.value))}>
                {DICE_TYPES.map(d => <option key={d} value={d}>d{d}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={4} md={2}>
            <Form.Group>
              <Form.Label style={{ fontSize: '0.8rem' }}>Modificador</Form.Label>
              <Form.Control className="dnd-input text-center" type="number" value={modifier}
                onChange={e => setModifier(Number(e.target.value))} />
            </Form.Group>
          </Col>
          <Col xs={6} md={2}>
            <Form.Check type="switch" id="crit-switch" label="Crítico"
              checked={isCritical} onChange={e => setIsCritical(e.target.checked)}
              style={{ color: 'var(--color-gold)' }} />
          </Col>
          <Col xs={6} md={2}>
            <button className="dnd-btn" onClick={rollDice} style={{ width: '100%', fontSize: '14px', padding: '6px 12px' }}>
              Tirar
            </button>
          </Col>
        </Row>

        {results && (
          <div style={{ marginTop: '1rem', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {isCritical && <span style={{ color: 'var(--color-gold)' }}>CRÍTICO · </span>}
              {results.rolls.length}d{dieType}{modifier !== 0 ? `${modifier > 0 ? '+' : ''}${modifier}` : ''}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-cream)', marginBottom: '6px' }}>
              [{results.rolls.join(', ')}]
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>
              {results.total}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
