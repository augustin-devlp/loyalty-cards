'use client'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function FloatingHands() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, {
    once: true, amount: 0.25,
  })

  return (
    <div ref={ref}>

      {/* LEFT HAND */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-20px', left: '-30px',
          width: '280px', zIndex: 1,
          pointerEvents: 'none',
        }}
        initial={{
          x: -65, y: -65,
          rotate: 18, opacity: 0, scale: 0.80,
        }}
        animate={inView ? {
          x: 0, y: 0,
          rotate: -10, opacity: 1, scale: 1,
        } : {}}
        transition={{
          duration: 0.95, delay: 0.25,
          ease: [0.34, 1.15, 0.64, 1],
        }}
      >
        <motion.div
          animate={inView ? {
            x: [0,-3,-5,-4,-2,1,2,0],
            y: [0,-5,-10,-13,-11,-6,-2,0],
            rotate: [-10,-9.2,-8.5,-9.0,
                     -10.0,-10.8,-10.5,-10],
          } : {}}
          transition={{
            duration: 4.2, delay: 1.2,
            ease: 'easeInOut',
            repeat: Infinity, repeatType: 'loop',
          }}
        >
          <Image src="/v3/hand-left.svg"
            alt="" width={280} height={340}
            style={{
              filter: 'sepia(15%) saturate(85%)' +
                ' hue-rotate(95deg) brightness(0.92)',
              mixBlendMode: 'multiply',
            }}
            priority={false}
          />
        </motion.div>
      </motion.div>

      {/* RIGHT HAND */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-30px', right: '-20px',
          width: '240px', zIndex: 1,
          pointerEvents: 'none',
        }}
        initial={{
          x: 65, y: 65,
          rotate: -18, opacity: 0, scale: 0.80,
        }}
        animate={inView ? {
          x: 0, y: 0,
          rotate: 10, opacity: 1, scale: 1,
        } : {}}
        transition={{
          duration: 0.95, delay: 0.45,
          ease: [0.34, 1.15, 0.64, 1],
        }}
      >
        <motion.div
          animate={inView ? {
            x: [0,3,4,2,-1,-2,0],
            y: [0,-4,-9,-12,-7,-2,0],
            rotate: [10,9.2,8.6,9.2,10.4,10.8,10],
          } : {}}
          transition={{
            duration: 4.8, delay: 1.4,
            ease: 'easeInOut',
            repeat: Infinity, repeatType: 'loop',
          }}
        >
          <Image src="/v3/hand-right.svg"
            alt="" width={240} height={300}
            style={{
              filter: 'sepia(15%) saturate(85%)' +
                ' hue-rotate(95deg) brightness(0.92)',
              mixBlendMode: 'multiply',
            }}
            priority={false}
          />
        </motion.div>
      </motion.div>

    </div>
  )
}
