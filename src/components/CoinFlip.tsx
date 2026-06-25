import { useState } from 'react'

export default function CoinFlip() {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null)
  const [flipping, setFlipping] = useState(false)

  function flip() {
    if (flipping) return
    setFlipping(true)
    setResult(null)
    setTimeout(() => {
      setResult(Math.random() < 0.5 ? 'heads' : 'tails')
      setFlipping(false)
    }, 600)
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <button
        onClick={flip}
        disabled={flipping}
        style={{ background: 'transparent', border: 'none', cursor: flipping ? 'default' : 'pointer' }}
      >
        <div className={`coin ${flipping ? 'coin-flipping' : ''}`}>
          <div className={`coin-face ${result === 'heads' ? '' : result === 'tails' ? 'show-tails' : ''}`}>
            <div className="coin-heads">C</div>
            <div className="coin-tails">X</div>
          </div>
        </div>
      </button>
      <p id="result" style={{ color: '#FFFEBD', fontFamily: 'Rostock', fontSize: 24, minHeight: '36px' }}>
        {result === 'heads' ? 'Cara' : result === 'tails' ? 'Cruz' : flipping ? '...' : ''}
      </p>
    </div>
  )
}
