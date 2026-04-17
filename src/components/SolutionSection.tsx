'use client';

export default function SolutionSection() {
  const features = [
    {
      icon: '📱',
      title: 'Tampons via QR code',
      desc: 'Le client scanne, le tampon s\'ajoute en 3 secondes. Pas d\'app à télécharger.',
    },
    {
      icon: '🌐',
      title: 'Site vitrine inclus',
      desc: '5 pages soignées avec tes horaires, photos, menu et carte fidélité. Tout en 1.',
    },
    {
      icon: '📍',
      title: 'SEO local optimisé',
      desc: 'Tes voisins te trouvent sur Google. On s\'occupe de tout.',
    },
    {
      icon: '📊',
      title: 'Suivi en temps réel',
      desc: 'Combien de clients reviennent, quand, combien de fois. En un coup d\'œil.',
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
            style={{ backgroundColor: '#E8F8F3', color: '#1d9e75' }}
            data-animate="fadeIn"
          >
            ✦ La solution
          </div>
          <h2
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '40px',
              color: '#1a1a1a',
              lineHeight: 1.25,
            }}
            data-animate="fadeUp"
          >
            Stampify, c&apos;est la carte fidélité que tes clients gardent — parce qu&apos;elle est sur leur téléphone.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              data-animate="scaleIn"
              className={`delay-${i + 1}`}
              style={{
                backgroundColor: '#FBF8F3',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid transparent',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#1d9e75';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(29,158,117,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div
                className="flex items-center justify-center mb-5"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#E8F8F3',
                  fontSize: '28px',
                }}
              >
                {feature.icon}
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: '#1a1a1a',
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#6b7280' }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
