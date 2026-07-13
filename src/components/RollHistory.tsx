import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory, faTrash } from '@fortawesome/free-solid-svg-icons'

interface RollEntry {
  id: number
  dice: string
  result: number
  timestamp: number
}

const HISTORY_KEY = 'dnd_roll_history'
const MAX_ENTRIES = 50

export function addRollToHistory(dice: string, result: number) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const history: RollEntry[] = raw ? JSON.parse(raw) : []
    history.unshift({ id: Date.now(), dice, result, timestamp: Date.now() })
    if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch { /* ignore */ }
}

export function getRollHistory(): RollEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function clearRollHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export default function RollHistory() {
  const [history, setHistory] = useState<RollEntry[]>([])

  useEffect(() => {
    setHistory(getRollHistory())
  }, [])

  if (history.length === 0) return null

  return (
    <div style={{ marginTop: '1rem' }}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 style={{ margin: 0, color: 'var(--color-gold)', fontFamily: 'var(--font-heading)' }}>
          <FontAwesomeIcon icon={faHistory} style={{ marginRight: '6px' }} />
          Historial de Tiradas
        </h6>
        <button
          className="init-btn-sm init-btn-remove"
          onClick={() => { clearRollHistory(); setHistory([]) }}
          title="Limpiar historial"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.85rem' }}>
        {history.map(entry => (
          <div key={entry.id} style={{
            display: 'flex', justifyContent: 'space-between', padding: '4px 8px',
            borderBottom: '1px solid rgba(212,175,55,0.1)',
          }}>
            <span style={{ color: 'var(--color-cream)' }}>{entry.dice}</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>{entry.result}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
