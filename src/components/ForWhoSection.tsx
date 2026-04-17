'use client';

const categories = [
  { icon: '☕', label: 'Café & Coffee shops' },
  { icon: '🥐', label: 'Boulangeries & Pâtisseries' },
  { icon: '💇', label: 'Coiffeurs & Barbiers' },
  { icon: '💅', label: 'Instituts de beauté' },
  { icon: '🍽️', label: 'Restaurants & Brasseries' },
  { icon: '🧴', label: 'Spas & Bien-être' },
];

export default function ForWhoSection() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#FBF8F3' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '40px',
              color: '#1a1a1a',
              lineHeight: 1.2,
            }}
            data-animate="fadeUp"
          >
            Stampify est fait pour toi si...
          </h2>
          <p
            className="mt-3 text-lg"
            style={{ color: '#6b7280' }}
            data-animate="fadeUp"
          >
            Tu gères un commerce local et tu veux que tes clients reviennent.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              data-animate="scaleIn"
              className={`delay-${i + 1}`}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid transparent',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#1d9e75';
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 8px 24px rgba(29,158,117,0.12)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'transparent';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', lineHeight: 1 }}>{cat.icon}</div>
              <p
                className="mt-3 font-bold text-center"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '16px',
                  color: '#1a1a1a',
                }}
              >
                {cat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
