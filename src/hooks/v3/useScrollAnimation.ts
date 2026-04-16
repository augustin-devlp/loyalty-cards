'use client'
import { useEffect } from 'react'

export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.10,
        rootMargin: '0px 0px -64px 0px' }
    )
    document
      .querySelectorAll('[data-animate]')
      .forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
