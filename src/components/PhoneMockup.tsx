'use client';

export default function PhoneMockup() {
  const stamps = Array.from({ length: 10 }, (_, i) => i < 7);

  return (
    <div className="relative inline-flex items-start justify-center" style={{ width: '320px', height: '600px' }}>
      {/* Notification badge — floating top-right */}
      <div
        className="animate-fade-in-down"
        style={{
          position: 'absolute',
          top: '24px',
          right: '-16px',
          zIndex: 10,
          background: '#ffffff',
          borderRadius: '12px',
          padding: '10px 14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
          maxWidth: '200px',
          animationDelay: '0.8s',
          opacity: 0,
        }}
      >
        <p
          className="text-xs font-medium leading-snug"
          style={{ color: '#1a1a1a', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}
        >
          🔔 Tampon ajouté ! +1 chez Café Lumière
        </p>
      </div>

      {/* Phone chassis */}
      <div
        className="animate-float"
        style={{
          position: 'relative',
          width: '280px',
          height: '560px',
          borderRadius: '44px',
          background: 'linear-gradient(145deg, #e8e8e8, #f5f5f5)',
          boxShadow:
            '0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Side button details */}
        <div
          style={{
            position: 'absolute',
            right: '-3px',
            top: '120px',
            width: '4px',
            height: '60px',
            background: 'linear-gradient(180deg, #d0d0d0, #c0c0c0)',
            borderRadius: '0 2px 2px 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-3px',
            top: '100px',
            width: '4px',
            height: '36px',
            background: 'linear-gradient(180deg, #d0d0d0, #c0c0c0)',
            borderRadius: '2px 0 0 2px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-3px',
            top: '148px',
            width: '4px',
            height: '36px',
            background: 'linear-gradient(180deg, #d0d0d0, #c0c0c0)',
            borderRadius: '2px 0 0 2px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-3px',
            top: '196px',
            width: '4px',
            height: '36px',
            background: 'linear-gradient(180deg, #d0d0d0, #c0c0c0)',
            borderRadius: '2px 0 0 2px',
          }}
        />

        {/* Inner screen */}
        <div
          style={{
            width: '260px',
            height: '520px',
            background: '#0a0a0a',
            borderRadius: '36px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '12px',
              paddingBottom: '0',
              background: '#0a0a0a',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '96px',
                height: '28px',
                background: '#000000',
                borderRadius: '20px',
              }}
            />
          </div>

          {/* Screen content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: '#111111',
              margin: '8px 6px 6px',
              borderRadius: '20px',
            }}
          >
            {/* Card header */}
            <div
              style={{
                background: '#1d9e75',
                padding: '14px 14px 0',
                flexShrink: 0,
              }}
            >
              {/* Shop info row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}
              >
                {/* "S" logo circle */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      color: '#1d9e75',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: '16px',
                      lineHeight: 1,
                    }}
                  >
                    S
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: '#ffffff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '13px',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Café Lumière · Genève
                  </p>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      lineHeight: 1.3,
                      marginTop: '1px',
                    }}
                  >
                    Carte fidélité · 10 tampons
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '999px',
                  height: '6px',
                  marginBottom: '14px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '70%',
                    height: '100%',
                    background: '#ffffff',
                    borderRadius: '999px',
                    boxShadow: '0 0 8px rgba(255,255,255,0.6)',
                  }}
                />
              </div>
            </div>

            {/* Card body */}
            <div
              style={{
                flex: 1,
                background: '#111111',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Stamp grid: 5 columns × 2 rows */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                }}
              >
                {stamps.map((filled, i) => (
                  <div
                    key={i}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: filled ? '#1d9e75' : '#2a2a2a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: filled
                        ? '0 2px 8px rgba(29,158,117,0.4)'
                        : 'inset 0 0 0 1.5px rgba(255,255,255,0.08)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {filled && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8l3.5 3.5L13 5"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom hint text */}
              <p
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                Plus que 3 tampons pour un café offert ☕
              </p>

              {/* CTA button */}
              <button
                style={{
                  width: '100%',
                  padding: '11px 0',
                  background: '#1d9e75',
                  color: '#ffffff',
                  borderRadius: '12px',
                  border: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  boxShadow: '0 4px 12px rgba(29,158,117,0.35)',
                }}
              >
                Voir mes avantages
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shadow beneath phone */}
      <div
        className="animate-float"
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '160px',
          height: '12px',
          background: 'rgba(0,0,0,0.18)',
          borderRadius: '50%',
          filter: 'blur(8px)',
          animationDuration: '4s',
        }}
      />
    </div>
  );
}
