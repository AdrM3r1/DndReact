interface SkeletonProps {
  width?: string | number
  height?: string | number
  lines?: number
  variant?: 'text' | 'circle' | 'rect'
  style?: React.CSSProperties
}

export default function Skeleton({ width, height, lines = 1, variant = 'text', style }: SkeletonProps) {
  if (lines > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              height: height || 14,
              borderRadius: 4,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || variant === 'circle' ? 40 : 14,
        borderRadius: variant === 'circle' ? '50%' : variant === 'rect' ? 8 : 4,
        ...style,
      }}
    />
  )
}

export function SkeletonTable({ rows = 3, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 16 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height={16} width={`${Math.floor(Math.random() * 30 + 10)}%`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="dnd-card" style={{ padding: '20px' }}>
      <Skeleton height={20} width="40%" style={{ marginBottom: 16 }} />
      <Skeleton lines={3} />
    </div>
  )
}