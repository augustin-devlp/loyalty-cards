'use client';

import { useState, useEffect, useRef } from 'react';

const tabs = [
  { label: 'Le client scanne' },
  { label: 'Le tampon s\'ajoute' },
  { label: 'La récompense arrive' },
];

function QRIllustration() {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Phone frame with QR */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: '140px',
          height: '200px',
          backgroundColor: '#1a2a1f',
          borderRadius: '20px',
          border: '3px solid rgba(255,255,255,0.15)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Phone notch */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            width: '40px',
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
          }}
        />
        {/* Screen */}
        <div
          style={{
            width: '110px',
            height: '150px',
            backgroundColor: '#0f1a15',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* QR code CSS pattern */}
          <div
            style={{
              width: '72px',
              height: '72px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '6px',
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1px',
            }}
          >
            {[
              1,1,1,0,1,1,1,
              1,0,1,0,1,0,1,
              1,1,1,0,1,1,1,
              0,0,0,1,0,0,0,
              1,1,1,0,1,0,1,
              1,0,0,0,0,1,1,
              1,1,1,0,1,1,1,
            ].map((cell, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: cell ? '#1a1a1a' : '#ffffff',
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Success badge */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: '#E8F8F3',
          color: '#1d9e75',
          animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <span>✓</span>
        <span>Tampon ajouté !</span>
      </div>
    </div>
  );
}

function StampCard() {
  const filled = 7;
  const total = 10;
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card background */}
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <p
          className="text-xs font-semibold mb-4 text-center"
          style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          Carte fidélité
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 44px)',
            gap: '8px',
          }}
        >
          {Array.from({ length: total }).map((_, i) => {
            const isFilled = i < filled;
            const isNew = i === filled - 1;
            return (
              <div
                key={i}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: isFilled ? '#1d9e75' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isFilled ? 'none' : '2px dashed rgba(255,255,255,0.2)',
                  transform: isNew ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: isNew ? '0 0 16px rgba(29,158,117,0.7)' : 'none',
                  transition: 'all 0.3s',
                  animation: isNew ? 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
                }}
              >
                {isFilled && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color: '#1d9e75' }}>
        7/10 tampons · Plus que 3 !
      </p>
    </div>
  );
}

function RewardNotification() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          maxWidth: '280px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          animation: 'slideInUp 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          🎁
        </div>
        <div>
          <p
            className="font-bold text-sm mb-1"
            style={{ color: '#1a1a1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Ton café offert t&apos;attend !
          </p>
          <p className="text-xs" style={{ color: '#6b7280' }}>
            Montre cette notification au comptoir.
          </p>
          <div
            className="mt-2 text-xs font-semibold"
            style={{ color: '#1d9e75' }}
          >
            Stampify · maintenant
          </div>
        </div>
      </div>
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
        style={{ backgroundColor: '#E8F8F3', color: '#1d9e75' }}
      >
        🎉 Carte complétée !
      </div>
    </div>
  );
}

const stepContent = [
  {
    component: QRIllustration,
    description: 'Le client ouvre son appareil photo, scanne le QR code en caisse, et son tampon s\'ajoute instantanément.',
  },
  {
    component: StampCard,
    description: 'La carte fidélité se met à jour en temps réel. Le client voit sa progression et reste motivé.',
  },
  {
    component: RewardNotification,
    description: 'Quand le client complète sa carte, il reçoit automatiquement sa récompense. Zéro effort de ta part.',
  },
];

export default function DemoSection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 3000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTabClick = (i: number) => {
    setActive(i);
    startTimer();
  };

  const ActiveComponent = stepContent[active].component;

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#0f1a15' }}>
      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '40px',
              color: '#ffffff',
              lineHeight: 1.2,
            }}
            data-animate="fadeUp"
          >
            Regarde comment ça marche
          </h2>
          <p
            className="mt-3 text-lg"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            data-animate="fadeUp"
          >
            3 étapes. 3 secondes chacune.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10" data-animate="fadeIn">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => handleTabClick(i)}
              className="font-medium rounded-full transition-all duration-300"
              style={{
                padding: '10px 20px',
                backgroundColor: active === i ? '#1d9e75' : 'rgba(29,158,117,0.15)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div
          className="max-w-lg mx-auto text-center"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '40px 32px',
          }}
          data-animate="scaleIn"
        >
          <div
            style={{
              minHeight: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.4s, transform 0.4s',
            }}
          >
            <div
              key={active}
              style={{
                animation: 'fadeStepIn 0.4s ease forwards',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <style>{`
                @keyframes fadeStepIn {
                  from { opacity: 0; transform: translateY(12px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              <ActiveComponent />
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {stepContent[active].description}
              </p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              style={{
                width: active === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: active === i ? '#1d9e75' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
