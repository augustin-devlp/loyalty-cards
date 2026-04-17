'use client'
import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W * devicePixelRatio
    canvas.height = H * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)

    const orbs = [
      { x: W*.50, y: H*.05, r: 420, o: 0.13, px: 0, py: 0 },
      { x: W*.85, y: H*.20, r: 260, o: 0.09, px: 1, py: 0 },
      { x: W*.15, y: H*.75, r: 200, o: 0.07, px: 2, py: 0 },
      { x: W*.25, y: H*.40, r: 130, o: 0.09, px: 3, py: 0 },
      { x: W*.50, y: H*.50, r: 520, o: 0.04, px: 4, py: 0 },
    ]

    const beams = [
      { p: 0.00, y: H*.36, s: 0.00476, o: 1.00 },
      { p: 0.33, y: H*.50, s: 0.00400, o: 0.65 },
      { p: 0.66, y: H*.64, s: 0.00510, o: 0.42 },
    ]

    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.005

      // Orbs
      orbs.forEach((orb, i) => {
        orb.x += Math.sin(t*.4 + i*1.2)*.15 + Math.sin(t*.7 + i*.8)*.08
        orb.y += Math.cos(t*.35 + i*.9)*.12 + Math.cos(t*.6 + i*1.4)*.07
        ctx.globalCompositeOperation = 'screen'
        const g = ctx.createRadialGradient(orb.x,orb.y,0,orb.x,orb.y,orb.r)
        g.addColorStop(0,   `rgba(29,158,117,${orb.o})`)
        g.addColorStop(0.4, `rgba(29,158,117,${orb.o*.4})`)
        g.addColorStop(0.7, `rgba(29,158,117,${orb.o*.1})`)
        g.addColorStop(1,   'rgba(29,158,117,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI*2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = 'source-over'

      // Beams
      beams.forEach(b => {
        b.p += b.s
        if (b.p > 1.3) b.p = -0.3
        const bW = W * .42
        const sx = -bW + (W + bW) * b.p
        const ex = sx + bW
        const dy = b.y + Math.sin(t*1.2)*4

        const drawLine = (lw: number, alphaScale: number, white = false) => {
          const grad = ctx.createLinearGradient(sx,0,ex,0)
          const c = white ? '255,255,255' : '29,158,117'
          grad.addColorStop(0,   `rgba(${c},0)`)
          grad.addColorStop(0.08,`rgba(${c},0)`)
          grad.addColorStop(0.25,`rgba(${c},${(.7*b.o*alphaScale).toFixed(2)})`)
          grad.addColorStop(0.50,`rgba(${c},${(1.0*b.o*alphaScale).toFixed(2)})`)
          grad.addColorStop(0.75,`rgba(${c},${(.7*b.o*alphaScale).toFixed(2)})`)
          grad.addColorStop(0.92,`rgba(${c},0)`)
          grad.addColorStop(1,   `rgba(${c},0)`)
          ctx.strokeStyle = grad
          ctx.lineWidth = lw
          ctx.shadowBlur = lw > 5 ? 12 : 6
          ctx.shadowColor = `rgba(29,158,117,${.5*b.o})`
          ctx.beginPath()
          for (let i = 0; i <= 100; i++) {
            const px = sx + (ex-sx)*(i/100)
            const py = dy + Math.sin(px*.006 + t*1.2)*3
            i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py)
          }
          ctx.stroke()
          ctx.shadowBlur = 0
        }

        drawLine(36, .10)
        drawLine(8,  .45)
        drawLine(2,  .85)
        drawLine(.8, .50, true)
      })

      animRef.current = requestAnimationFrame(draw)
    }

    canvas.style.opacity = '0'
    canvas.style.transition = 'opacity 1.5s ease'
    setTimeout(() => { canvas.style.opacity = '1' }, 100)

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <canvas ref={ref} style={{
      position:'absolute', inset:0,
      width:'100%', height:'100%',
      pointerEvents:'none', zIndex:0,
      mixBlendMode:'screen'
    }}/>
  )
}
