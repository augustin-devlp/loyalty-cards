'use client';

export default function CTASection() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#1d9e75' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: '44px',
            color: '#ffffff',
            lineHeight: 1.15,
          }}
          data-animate="fadeUp"
        >
          Prêt à fidéliser tes clients ?
        </h2>

        <p
          className="mt-4 mb-10 max-w-xl mx-auto"
          style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
          }}
          data-animate="fadeUp"
        >
          Rejoins les commerçants romands qui ont arrêté de perdre leurs clients.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          data-animate="scaleIn"
        >
          <a
            href="#pricing"
            className="font-bold transition-all duration-200"
            style={{
              backgroundColor: '#ffffff',
              color: '#1d9e75',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#F0FBF7';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#ffffff';
            }}
          >
            Démarrer maintenant — 990 CHF
          </a>

          <a
            href="mailto:contact@stampify.ch"
            className="font-medium transition-all duration-200"
            style={{
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
            }}
          >
            Parler à Augustin →
          </a>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-6 text-sm"
          style={{ color: 'rgba(255,255,255,0.8)' }}
          data-animate="fadeIn"
        >
          <span>🔒 Paiement sécurisé</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
          <span>✓ Remboursé si insatisfait</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
          <span>⚡ En ligne en 48h</span>
        </div>
      </div>
    </section>
  );
}
