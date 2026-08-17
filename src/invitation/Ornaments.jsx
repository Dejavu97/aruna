export function Flourish({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 240 28" className={className} fill="none" aria-hidden>
      <path
        d="M8 14h62M170 14h62M120 4.5c6 0 10 4 10 9.5s-4 9.5-10 9.5-10-4-10-9.5S114 4.5 120 4.5Z"
        stroke={color}
        strokeWidth="0.9"
      />
      <path
        d="M96 14c6-7 12-7 18 0M126 14c6 7 12 7 18 0"
        stroke={color}
        strokeWidth="0.9"
      />
    </svg>
  )
}

export function Corner({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <path d="M8 72V28C8 14 14 8 28 8h44" stroke={color} strokeWidth="1.1" />
      <path d="M18 72V34C18 22 22 18 34 18h38" stroke={color} strokeWidth="0.6" opacity="0.7" />
      <circle cx="28" cy="28" r="2" fill={color} />
    </svg>
  )
}

export function StarGeom({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path d="M32 4 36 24 56 20 40 32 56 44 36 40 32 60 28 40 8 44 24 32 8 20 28 24Z" stroke={color} strokeWidth="1" />
      <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="1" />
    </svg>
  )
}

export function BatikLine({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 280 20" className={className} fill="none" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <ellipse
          key={i}
          cx={10 + i * 20}
          cy="10"
          rx="7"
          ry="4"
          stroke={color}
          strokeWidth="0.8"
          transform={`rotate(${i % 2 ? 25 : -25} ${10 + i * 20} 10)`}
        />
      ))}
    </svg>
  )
}
