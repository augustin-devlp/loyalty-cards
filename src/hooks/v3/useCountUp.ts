'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function useCountUp(
  endValue: number,
  duration = 1600,
  startDelay = 0
) {
  const [count, setCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number>()

  const startAnimation = useCallback(() => {
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(
        elapsed / duration, 1)
      setCount(Math.round(
        easeOutQuart(progress) * endValue))
      if (progress < 1) {
        rafRef.current =
          requestAnimationFrame(tick)
      } else {
        setCount(endValue)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [endValue, duration])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true)
          const t = setTimeout(
            startAnimation, startDelay)
          return () => clearTimeout(t)
        }
      }, { threshold: 0.35 })
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafRef.current)
        cancelAnimationFrame(rafRef.current)
    }
  }, [triggered, startAnimation, startDelay])

  return { count, elementRef }
}
