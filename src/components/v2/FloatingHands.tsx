"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FloatingHands() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, amount: 0.25 });

  return (
    <div ref={sectionRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* MAIN GAUCHE */}
      <motion.div
        style={{ position: "absolute", top: "-20px", left: "-30px", width: 280, zIndex: 1, pointerEvents: "none" }}
        initial={{ x: -65, y: -65, rotate: 18, opacity: 0, scale: 0.80 }}
        animate={isInView ? { x: 0, y: 0, rotate: -10, opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.95, delay: 0.25, ease: [0.34, 1.15, 0.64, 1] }}
      >
        <motion.div
          animate={isInView ? {
            x: [0, -3, -5, -4, -2, 1, 2, 0],
            y: [0, -5, -10, -13, -11, -6, -2, 0],
            rotate: [-10, -9.2, -8.5, -9.0, -10.0, -10.8, -10.5, -10],
          } : {}}
          transition={{ duration: 4.2, delay: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
        >
          <svg viewBox="0 0 260 320" xmlns="http://www.w3.org/2000/svg" fill="none" width={280} height={340}>
            <defs>
              <filter id="handShadowL">
                <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="rgba(0,0,0,0.15)" floodOpacity="1"/>
              </filter>
              <linearGradient id="woodGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C8A060"/>
                <stop offset="45%" stopColor="#A07040"/>
                <stop offset="100%" stopColor="#C8A060"/>
              </linearGradient>
            </defs>
            <g filter="url(#handShadowL)">
              <rect x="90" y="240" width="80" height="80" rx="18" fill="#F2C9A0"/>
              <rect x="70" y="155" width="120" height="100" rx="22" fill="#F2C9A0"/>
              <ellipse cx="68" cy="185" rx="22" ry="32" transform="rotate(-25 68 185)" fill="#F2C9A0"/>
              <rect x="73" y="75" width="24" height="92" rx="12" fill="#F2C9A0"/>
              <rect x="103" y="68" width="24" height="98" rx="12" fill="#F2C9A0"/>
              <rect x="133" y="75" width="24" height="90" rx="12" fill="#F2C9A0"/>
              <rect x="160" y="90" width="22" height="76" rx="11" fill="#F2C9A0"/>
              <ellipse cx="130" cy="180" rx="55" ry="18" fill="#D4A070" opacity="0.3"/>
              <rect x="58" y="108" width="144" height="88" rx="14" fill="url(#woodGradL)"/>
              <line x1="68" y1="120" x2="68" y2="184" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
              <line x1="88" y1="116" x2="88" y2="188" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
              <line x1="108" y1="114" x2="108" y2="190" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
              <line x1="148" y1="114" x2="148" y2="190" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
              <line x1="168" y1="116" x2="168" y2="188" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
              <line x1="188" y1="120" x2="188" y2="184" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
              <text x="130" y="148" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="13" fontWeight="700" letterSpacing="2.5" fill="rgba(0,0,0,0.32)">STAMPIFY</text>
              <rect x="104" y="158" width="6" height="6" rx="1.5" fill="#1d9e75" opacity="0.7"/>
              <rect x="114" y="158" width="6" height="6" rx="1.5" fill="#1d9e75" opacity="0.7"/>
              <rect x="124" y="158" width="6" height="6" rx="1.5" fill="#1d9e75" opacity="0.7"/>
              <rect x="104" y="168" width="6" height="6" rx="1.5" fill="#1d9e75" opacity="0.7"/>
              <rect x="114" y="168" width="6" height="6" rx="1.5" fill="#1d9e75" opacity="0.7"/>
              <rect x="124" y="168" width="6" height="6" rx="1.5" fill="#1d9e75" opacity="0.7"/>
              <rect x="104" y="178" width="6" height="6" rx="1.5" fill="#1d9e75" opacity="0.7"/>
              <rect x="114" y="178" width="6" height="6" rx="1.5" fill="none" stroke="#1d9e75" strokeWidth="1.2" opacity="0.5"/>
              <rect x="124" y="178" width="6" height="6" rx="1.5" fill="none" stroke="#1d9e75" strokeWidth="1.2" opacity="0.5"/>
              <rect x="58" y="108" width="144" height="88" rx="14" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5"/>
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* MAIN DROITE */}
      <motion.div
        style={{ position: "absolute", bottom: "-30px", right: "-20px", width: 240, zIndex: 1, pointerEvents: "none" }}
        initial={{ x: 65, y: 65, rotate: -18, opacity: 0, scale: 0.80 }}
        animate={isInView ? { x: 0, y: 0, rotate: 10, opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.95, delay: 0.45, ease: [0.34, 1.15, 0.64, 1] }}
      >
        <motion.div
          animate={isInView ? {
            x: [0, 3, 4, 2, -1, -2, 0],
            y: [0, -4, -9, -12, -7, -2, 0],
            rotate: [10, 9.2, 8.6, 9.2, 10.4, 10.8, 10],
          } : {}}
          transition={{ duration: 4.8, delay: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
        >
          <svg viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" fill="none" width={240} height={300}>
            <defs>
              <filter id="handShadowR">
                <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="rgba(0,0,0,0.15)" floodOpacity="1"/>
              </filter>
              <linearGradient id="woodGradR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C8A060"/>
                <stop offset="45%" stopColor="#A07040"/>
                <stop offset="100%" stopColor="#C8A060"/>
              </linearGradient>
            </defs>
            <g filter="url(#handShadowR)">
              <rect x="80" y="220" width="80" height="72" rx="16" fill="#F2C9A0"/>
              <rect x="60" y="140" width="120" height="95" rx="20" fill="#F2C9A0"/>
              <ellipse cx="172" cy="170" rx="20" ry="30" transform="rotate(25 172 170)" fill="#F2C9A0"/>
              <rect x="65" y="68" width="22" height="84" rx="11" fill="#F2C9A0"/>
              <rect x="93" y="60" width="22" height="90" rx="11" fill="#F2C9A0"/>
              <rect x="121" y="68" width="22" height="82" rx="11" fill="#F2C9A0"/>
              <rect x="148" y="82" width="20" height="70" rx="10" fill="#F2C9A0"/>
              <ellipse cx="120" cy="165" rx="52" ry="16" fill="#D4A070" opacity="0.3"/>
              {/* Smartphone */}
              <rect x="52" y="95" width="136" height="82" rx="12" fill="url(#woodGradR)"/>
              <rect x="58" y="101" width="124" height="70" rx="10" fill="#1a1a2e"/>
              <text x="120" y="128" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="600" fill="#1d9e75">✓ Carte ouverte</text>
              <text x="120" y="142" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fill="rgba(255,255,255,0.6)">8/10 tampons</text>
              <rect x="80" y="150" width="80" height="6" rx="3" fill="rgba(29,158,117,0.3)"/>
              <rect x="80" y="150" width="64" height="6" rx="3" fill="#1d9e75"/>
              <line x1="62" y1="110" x2="62" y2="165" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
              <line x1="78" y1="107" x2="78" y2="167" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
              <rect x="52" y="95" width="136" height="82" rx="12" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
            </g>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
