'use client';

import { useState, useEffect } from 'react';

interface DemoAnimationProps {
  primaryColor: string;
  stampIcon: string;
  businessName: string;
  reward: string;
  rewardIcon: string;
}

export default function DemoAnimation({
  primaryColor,
  stampIcon,
  businessName,
  reward,
  rewardIcon,
}: DemoAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 384, margin: '0 auto', height: 288 }}>
      <style>{`
        @keyframes demoSlidePhone {
          from { transform: translateX(60px); opacity: 0; }
          to { transform: translateX(20px); opacity: 1; }
        }
        @keyframes demoArcPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes demoTypeIn {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes demoStampPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes demoIconPop {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          60% { transform: scale(1.4) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes demoConfettiFly {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Step 0: NFC scan */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: step === 0 ? 1 : 0,
          transition: 'opacity 0.4s', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          background: '#F5F0E8', borderRadius: 16, padding: 24,
        }}
      >
        <div style={{ fontSize: 13, color: '#6B6259', fontWeight: 600, marginBottom: 4 }}>
          Approchez la plaquette NFC
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          {/* Wood plaque */}
          <div
            style={{
              width: 90, height: 90, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #D4B896, #B89060)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ fontSize: 28 }}>{stampIcon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#5C3D11', textAlign: 'center', padding: '0 6px', lineHeight: 1.2 }}>
              {businessName}
            </div>
          </div>
          {/* Arc signals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 6 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 10 + i * 6, height: 10 + i * 6,
                  border: `2px solid ${primaryColor}`,
                  borderLeft: 'none',
                  borderRadius: `0 ${6 + i * 4}px ${6 + i * 4}px 0`,
                  animation: step === 0 ? `demoArcPulse 1.2s ease-in-out ${i * 0.2}s infinite` : 'none',
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
          {/* Phone */}
          <div
            style={{
              width: 50, height: 80, background: '#1A1410', borderRadius: 10,
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              animation: step === 0 ? 'demoSlidePhone 0.6s ease-out forwards' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: 30, height: 52, background: primaryColor, borderRadius: 6, opacity: 0.9 }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#9C9085' }}>Technologie NFC sans contact</div>
      </div>

      {/* Step 1: Signup form */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: step === 1 ? 1 : 0,
          transition: 'opacity 0.4s', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 24,
        }}
      >
        <div
          style={{
            background: 'white', borderRadius: 16, padding: '20px 24px',
            width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #E2D9CC',
          }}
        >
          <div
            style={{
              fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 700,
              color: '#1A1410', marginBottom: 16, textAlign: 'center',
            }}
          >
            Rejoignez {businessName}
          </div>
          {['Votre prénom', 'Votre numéro'].map((placeholder, i) => (
            <div
              key={i}
              style={{
                height: 36, background: '#F5F0E8', borderRadius: 8,
                marginBottom: 10, padding: '0 12px', display: 'flex', alignItems: 'center',
                border: '1px solid #E2D9CC', overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontSize: 13, color: '#6B6259', whiteSpace: 'nowrap', overflow: 'hidden',
                  width: 0,
                  animation: step === 1 ? `demoTypeIn 0.8s ease-out ${i * 0.5}s forwards` : 'none',
                }}
              >
                {placeholder}
              </div>
            </div>
          ))}
          <div
            style={{
              background: primaryColor, color: 'white', borderRadius: 8, padding: '10px 0',
              textAlign: 'center', fontSize: 13, fontWeight: 700, marginTop: 4,
            }}
          >
            S&apos;inscrire →
          </div>
        </div>
      </div>

      {/* Step 2: Stamp added */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: step === 2 ? 1 : 0,
          transition: 'opacity 0.4s', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 24,
        }}
      >
        <div
          style={{
            background: 'white', borderRadius: 16, padding: '20px 24px',
            width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #E2D9CC',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', marginBottom: 4 }}>
            Votre carte fidélité
          </div>
          <div style={{ fontSize: 11, color: '#6B6259', marginBottom: 14 }}>7 / 10 tampons</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i < 7 ? primaryColor : 'transparent',
                  border: i < 7 ? `2px solid ${primaryColor}` : '2px solid #E2D9CC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: i === 6 && step === 2 ? 'demoStampPop 0.5s ease-out 0.6s both' : 'none',
                  ...(i === 6 && step !== 2 ? { transform: 'scale(0)', opacity: 0 } : {}),
                }}
              >
                {i < 7 && (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 8l3 3L12.5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#9C9085', marginTop: 12 }}>
            Plus que 3 tampons pour votre récompense !
          </div>
        </div>
      </div>

      {/* Step 3: Reward unlocked */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: step === 3 ? 1 : 0,
          transition: 'opacity 0.4s', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 24,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: primaryColor, borderRadius: 16, padding: '24px',
            width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Confetti */}
          {step === 3 && ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'].map((color, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 8, height: 8,
                background: color,
                borderRadius: i % 2 === 0 ? '50%' : 2,
                left: `${15 + i * 14}%`,
                top: '20%',
                animation: `demoConfettiFly 1s ease-out ${i * 0.1}s both`,
              }}
            />
          ))}
          <div
            style={{
              fontSize: 40, marginBottom: 8,
              animation: step === 3 ? 'demoIconPop 0.6s ease-out 0.2s both' : 'none',
              display: 'inline-block',
            }}
          >
            {rewardIcon}
          </div>
          <div
            style={{
              fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, fontWeight: 700,
              color: 'white', marginBottom: 6,
            }}
          >
            Félicitations !
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
            {reward}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
            Montrez ce message au comptoir
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div
        style={{
          position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: i === step ? 16 : 6, height: 6, borderRadius: 3,
              background: i === step ? primaryColor : '#E2D9CC',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
