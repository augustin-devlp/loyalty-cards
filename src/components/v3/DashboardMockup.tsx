'use client'
import { useState, useEffect } from 'react'

const NAMES = ["Sophie M.", "Karim B.", "Marie-Claire F.", "Lucas T.", "Emma V.", "Julien R."]

export default function DashboardMockup() {
  const [notifState, setNotifState] = useState<'hidden' | 'visible' | 'leaving'>('hidden')
  const [nameIndex, setNameIndex] = useState(0)
  const [barsAnimated, setBarsAnimated] = useState(false)
  const targets = [45, 60, 75, 55, 80, 65, 100]

  useEffect(() => {
    let isMounted = true

    const runCycle = async () => {
      while (isMounted) {
        await new Promise(r => setTimeout(r, 1800))
        if (!isMounted) return
        setNotifState('visible')
        
        await new Promise(r => setTimeout(r, 2800))
        if (!isMounted) return
        setNotifState('leaving')
        
        await new Promise(r => setTimeout(r, 600))
        if (!isMounted) return
        setNotifState('hidden')
        setNameIndex(prev => (prev + 1) % NAMES.length)
        
        await new Promise(r => setTimeout(r, 1800))
      }
    }
    
    runCycle()
    
    const barsTimeout = setTimeout(() => {
      if (isMounted) setBarsAnimated(true)
    }, 800)
    
    return () => { 
      isMounted = false
      clearTimeout(barsTimeout)
    }
  }, [])

  return (
    <div style={{
      width: '100%',
      aspectRatio: '3/4',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      fontFamily: 'var(--font-inter), sans-serif'
    }}>
      {/* Header mock */}
      <div style={{ display: 'flex', justifySelf: 'flex-start', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ width: '80px', height: '12px', background: 'rgba(29, 158, 117, 0.2)', borderRadius: '6px', marginBottom: '8px' }} />
          <div style={{ width: '140px', height: '24px', background: '#1d9e75', borderRadius: '8px', opacity: 0.9 }} />
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(29, 158, 117, 0.2)' }} />
      </div>

      {/* SMS mockup */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Nouvelle Campagne SMS</div>
        <div style={{
          background: '#FBF8F3',
          padding: '12px',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#1A1A1A'
        }}>
          <div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            borderRight: '2px solid transparent',
            animation: 'smsTyping 1.6s steps(36,end) 2.2s forwards, cursorBlink 0.75s step-end 2.2s 3 forwards',
            width: '0ch'
          }}>
            🥐 Ce weekend −20% sur les viennoiseries !
          </div>
        </div>
      </div>
      
      {/* Chart Mockup */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '0 10px', marginTop: 'auto', minHeight: '120px' }}>
        {targets.map((val, i) => (
          <div key={i} style={{ flex: 1, height: '100%', background: 'rgba(29,158,117,0.10)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
            <div 
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: i === 6 ? '#1d9e75' : 'rgba(29,158,117,0.4)',
                borderRadius: '4px 4px 0 0',
                height: barsAnimated ? `${val}%` : '0%',
                transition: `height 0.55s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s`
              }} 
            />
          </div>
        ))}
      </div>

      {/* Notification popup */}
      {notifState !== 'hidden' && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '240px',
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          animation: notifState === 'visible' ? 'notifSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards' : 'notifSlideOut 0.6s cubic-bezier(0.16,1,0.3,1) forwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E8F7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d9e75', flexShrink: 0 }}>✨</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{NAMES[nameIndex]}</div>
              <div style={{ fontSize: '11px', color: '#5C5C5C' }}>Nouveau tampon ajouté</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
