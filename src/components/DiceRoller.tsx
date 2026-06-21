import { useState, useEffect } from 'react'
import { useDiceRoller } from '../hooks/useDiceRoller'
import '../styles/diceroll.css'

export default function DiceRoller() {
  const {
    dice, total, soundOn, helpOpen, setHelpOpen,
    DICE_TYPES, addDie, toggleDie, removeDie,
    rollSelected, rollDie, removeSelected, selectAll, deselectAll, resetValues, toggleSound,
  } = useDiceRoller()

  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('.die') && !target.closest('#total') && !target.closest('#stock') && !target.closest('#help')) {
        deselectAll()
        resetValues()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [deselectAll, resetValues])

  return (
    <div>
      <div id="stock">
        {DICE_TYPES.map(type => (
          <div
            key={type}
            className="die-stock"
            onClick={e => { e.stopPropagation(); addDie(type) }}
            title={`Add d${type} to the table`}
            style={{ backgroundImage: `url(/images/diceroll/d${type}.png)` }}
          >
            {type}
            <img src="/images/diceroll/icon-add.png" className="icon-add" alt="+" />
          </div>
        ))}
        <div
          id="sound-toggle"
          onClick={() => { toggleSound(); resetValues() }}
          style={{ backgroundImage: soundOn
            ? 'url(/images/diceroll/icon-sound-on.png)'
            : 'url(/images/diceroll/icon-sound-off.png)'
          }}
        />
        <div
          id="help-button"
          onClick={() => setHelpOpen(true)}
        />
      </div>

      <div
        id="total"
        style={{ display: dice.length > 0 ? 'block' : 'none' }}
        onClick={() => { selectAll(); resetValues() }}
      >
        <div className="rotatable">
          <div id="total-value">{total}</div>
        </div>
        <div className="die-buttons">
          <div
            className="btn-roll-selected"
            title="Roll all (or all selected) dice!"
            onClick={e => { e.stopPropagation(); rollSelected() }}
          />
          <div
            className="btn-remove-selected"
            title="Remove all selected dice!"
            onClick={e => { e.stopPropagation(); removeSelected() }}
          />
        </div>
      </div>

      <div id="table">
        {dice.map(d => (
          <div
            key={d.id}
            className={`die ${d.active ? 'active' : ''} ${d.rolling ? 'rolling' : ''} ${hoveredId === d.id ? 'hover' : ''}`}
            onClick={() => toggleDie(d.id)}
            onMouseEnter={() => setHoveredId(d.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="rotatable">
              <div
                className="die-image"
                style={{ backgroundImage: `url(/images/diceroll/d${d.type}.png)` }}
              />
              <div className={`die-value ${d.rolling ? 'rolling-text' : ''}`}>{d.value}</div>
            </div>
            <div className="die-buttons" style={{ display: hoveredId === d.id ? 'flex' : 'none' }}>
              <div
                className="btn-roll"
                title="Roll this die!"
                onClick={e => { e.stopPropagation(); rollDie(d.id) }}
              />
              <div
                className="btn-remove"
                title="Remove this die!"
                onClick={e => { e.stopPropagation(); removeDie(d.id) }}
              />
            </div>
          </div>
        ))}
      </div>

      {helpOpen && (
        <div id="help" style={{ display: 'flex' }} onClick={() => setHelpOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <img src="/images/diceroll/d20.png" alt="" />
            <p>
              <strong>dice-or-die: </strong>
              Add dice by clicking the type at the top. Roll a single die by hovering
              and clicking the roll button. Roll multiple dice by selecting them,
              then roll one. See total in the circle.
            </p>
            <p>
              Visit on Github:{' '}
              <a href="https://github.com/bkis/dice-or-die" target="_blank" rel="noreferrer">
                bkis/dice-or-die
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
