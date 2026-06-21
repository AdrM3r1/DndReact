import { useState, useCallback, useRef } from 'react'

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100

export interface Die {
  id: number
  type: DiceType
  value: number | '?'
  active: boolean
  rolling: boolean
}

const DICE_TYPES: DiceType[] = [4, 6, 8, 10, 12, 20, 100]

function randInt(max: number): number {
  return Math.floor(Math.random() * max) + 1
}

export interface UseDiceRollerReturn {
  dice: Die[]
  total: number
  soundOn: boolean
  helpOpen: boolean
  setHelpOpen: (v: boolean) => void
  DICE_TYPES: DiceType[]
  addDie: (type: DiceType) => void
  toggleDie: (id: number) => void
  removeDie: (id: number) => void
  rollSelected: () => void
  rollDie: (id: number) => void
  removeSelected: () => void
  selectAll: () => void
  deselectAll: () => void
  resetValues: () => void
  toggleSound: () => void
}

export function useDiceRoller(): UseDiceRollerReturn {
  const [dice, setDice] = useState<Die[]>([])
  const [total, setTotal] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const rollIdRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    if (!soundOn) return
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/roll.ogg')
    }
    const a = audioRef.current
    a.pause()
    a.currentTime = 0
    a.play().catch(() => {})
  }, [soundOn])

  const toggleSound = useCallback(() => setSoundOn(v => !v), [])

  const addDie = useCallback((type: DiceType) => {
    const newDie: Die = {
      id: Date.now() + Math.random(),
      type,
      value: type,
      active: false,
      rolling: false,
    }
    setDice(prev => [...prev, newDie])
  }, [])

  const toggleDie = useCallback((id: number) => {
    setDice(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d))
  }, [])

  const removeDie = useCallback((id: number) => {
    setDice(prev => prev.filter(d => d.id !== id))
  }, [])

  const rollSelected = useCallback(() => {
    const rid = Date.now()
    rollIdRef.current = rid
    playSound()
    setTotal(0)

    setDice(prev => {
      const hasActive = prev.some(d => d.active)
      return prev.map(d => {
        const shouldRoll = hasActive ? d.active : true
        if (!shouldRoll) return d
        return { ...d, rolling: true, value: '?' as const }
      })
    })

    setTimeout(() => {
      setDice(prev => {
        if (rollIdRef.current !== rid) return prev
        const updated = prev.map(d => {
          if (!d.rolling) return d
          const val = randInt(d.type)
          return { ...d, value: val, rolling: false }
        })
        setTotal(updated.reduce((acc, d) => acc + (typeof d.value === 'number' ? d.value : 0), 0))
        return updated
      })
    }, 1000)
  }, [playSound])

  const rollDie = useCallback((id: number) => {
    const rid = Date.now()
    rollIdRef.current = rid
    playSound()

    setDice(prev => prev.map(d =>
      d.id === id ? { ...d, rolling: true, value: '?' as const } : d
    ))

    setTimeout(() => {
      setDice(prev => {
        if (rollIdRef.current !== rid) return prev
        const updated = prev.map(d => {
          if (!d.rolling) return d
          const val = randInt(d.type)
          return { ...d, value: val, rolling: false }
        })
        setTotal(updated.reduce((acc, d) => acc + (typeof d.value === 'number' ? d.value : 0), 0))
        return updated
      })
    }, 1000)
  }, [playSound])

  const removeSelected = useCallback(() => {
    setDice(prev => prev.filter(d => !d.active))
  }, [])

  const selectAll = useCallback(() => {
    setDice(prev => {
      const allActive = prev.every(d => d.active)
      return prev.map(d => ({ ...d, active: !allActive }))
    })
  }, [])

  const deselectAll = useCallback(() => {
    setDice(prev => prev.map(d => ({ ...d, active: false })))
  }, [])

  const resetValues = useCallback(() => {
    setDice(prev => {
      const updated = prev.map(d => ({ ...d, value: d.type }))
      setTotal(updated.reduce((acc, d) => acc + (typeof d.value === 'number' ? d.value : 0), 0))
      return updated
    })
  }, [])

  return {
    dice,
    total,
    soundOn,
    helpOpen,
    setHelpOpen,
    DICE_TYPES,
    addDie,
    toggleDie,
    removeDie,
    rollSelected,
    rollDie,
    removeSelected,
    selectAll,
    deselectAll,
    resetValues,
    toggleSound,
  }
}
