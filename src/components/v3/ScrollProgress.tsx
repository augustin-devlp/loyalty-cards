'use client'
import { useState, useEffect, useCallback } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  const update = useCallback(() => {
    const st = window.scrollY
    const dh =
      document.documentElement.scrollHeight -
      window.innerHeight
    setProgress(dh > 0
      ? Math.min(Math.max((st/dh)*100,0),100)
      : 0)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll',
      update, { passive: true })
    update()
    return () =>
      window.removeEventListener('scroll', update)
  }, [update])

  return (
    <div aria-hidden="true" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '2px', zIndex: 9999,
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background:
          'linear-gradient(90deg,#1d9e75,#0D7A5A)',
        transition: 'width 0.06s linear',
        boxShadow:
          '0 0 6px rgba(29,158,117,0.55),' +
          '0 0 12px rgba(29,158,117,0.25)',
      }} />
    </div>
  )
}
