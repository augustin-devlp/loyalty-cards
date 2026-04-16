'use client'
import { useState } from 'react'

const LOGOS = [
  "Café Lumière · Genève", "Boulangerie Martin · Lausanne", "Black Scissors · Fribourg",
  "Spa Essence · Genève", "Nail Studio Rose · Lausanne", "Bistrot du Coin · Neuchâtel",
  "Le Petit Torréfacteur · Vevey", "Institut Belle Peau · Sion",
]

export default function MarqueeBar() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div style={{
      overflow: 'hidden',
      position: 'relative',
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
      maskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)'
    }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{
        display: 'flex',
        gap: '12px',
        width: 'max-content',
        animationPlayState: isPaused ? 'paused' : 'running',
        animation: 'marqueeScroll 30s linear infinite'
      }}>
        {[...LOGOS, ...LOGOS, ...LOGOS].map((name, i) => (
          <div key={i} style={{
            background: '#FBF8F3',
            borderRadius: '980px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#1A1A1A',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            cursor: 'default',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#E8F7F2' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FBF8F3' }}>
            {name}
          </div>
        ))}
      </div>
    </div>
  )
}
