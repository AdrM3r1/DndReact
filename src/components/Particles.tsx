import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { COLORS } from '../theme/colors'

const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛝ', 'ᛟ', 'ᛞ']

interface P {
  x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; rune: string
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<P[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function spawn() {
      if (particlesRef.current.length > 15) return
      particlesRef.current.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.4 + 0.2),
        size: Math.random() * 16 + 20,
        alpha: Math.random() * 0.3 + 0.35,
        life: 1,
        rune: RUNES[Math.floor(Math.random() * RUNES.length)],
      })
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      const keep: P[] = []
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.004
        p.alpha = Math.max(0, p.alpha - 0.002)
        if (p.life <= 0) continue
        keep.push(p)
        ctx!.globalAlpha = p.alpha
        ctx!.fillStyle = COLORS.gold
        ctx!.font = `${p.size}px serif`
        ctx!.shadowColor = COLORS.gold50
        ctx!.shadowBlur = 15
        ctx!.fillText(p.rune, p.x, p.y)
      }
      particlesRef.current = keep
      if (Math.random() < 0.04) spawn()
      rafRef.current = requestAnimationFrame(animate)
    }

    for (let i = 0; i < 10; i++) spawn()
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const canvas = (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )

  if (typeof document !== 'undefined') {
    return createPortal(canvas, document.body)
  }
  return null
}