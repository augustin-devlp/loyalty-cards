'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      padding: '16px 24px',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : 'border transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link href="/v3" style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A1A', textDecoration: 'none', letterSpacing: '-0.5px' }}>
        Stampify<span style={{ color: '#1d9e75' }}>.</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link href="/v3/demos" className="nav-link" style={{ fontSize: '15px', color: '#1A1A1A', fontWeight: 500, textDecoration: 'none' }}>
          Démos
        </Link>
        <Link href="/v3/subscribe" className="btn-primary" style={{
          background: '#1d9e75', color: '#fff', borderRadius: '98px',
          padding: '10px 24px', fontSize: '15px', fontWeight: 600,
          textDecoration: 'none',
        }}>
          Obtenir mon site
        </Link>
      </div>
    </nav>
  )
}
