'use client'
import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)

  useEffect(() => {
    const loadVanta = async () => {
      // Charge Three.js puis Vanta
      const THREE = await import('three')
      // @ts-ignore
      window.THREE = THREE

      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js'
      script.onload = () => {
        if (ref.current && !vantaRef.current) {
          // @ts-ignore
          vantaRef.current = window.VANTA.HALO({
            el: ref.current,
            THREE: THREE,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            backgroundColor: 0x0a0a0a,
            baseColor: 0x1d9e75,
            amplitudeFactor: 1.5,
            size: 1.8,
            xOffset: 0.0,
            yOffset: -0.1,
          })
        }
      }
      document.head.appendChild(script)
    }

    loadVanta()

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy()
        vantaRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
