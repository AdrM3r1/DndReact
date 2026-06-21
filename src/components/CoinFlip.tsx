import { useState } from 'react'

export default function CoinFlip() {
  const [result, setResult] = useState('')

  function flip() {
    const num = Math.random()
    setResult(num < 0.5 ? 'Ha salido 1' : 'Ha salido 2')
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <button
        onClick={flip}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <img src="/images/coin.png" alt="coin" style={{ width: 100 }} />
      </button>
      <p id="result" style={{ color: '#FFFEBD', fontFamily: 'Rostock', fontSize: 24 }}>
        {result}
      </p>
    </div>
  )
}
