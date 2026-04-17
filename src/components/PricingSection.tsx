'use client';

export default function PricingSection() {
  const checklistLeft = [
    'Site vitrine 5 pages',
    'Carte fidélité 10 tampons',
    'SEO local optimisé',
    '1 campagne SMS offerte',
    '2 révisions incluses',
  ];

  const checklistRight = [
    'Hébergement 1 an inclus',
    'Domaine .ch inclus',
    'QR code + affichage A4/A5',
    'Guide vidéo d\'utilisation',
    'Mise en ligne en 48h',
  ];

  const addonItems = [
    '1 SMS campagne / mois',
    'Rapport mensuel',
    'Mises à jour mineures',
    'Support prioritaire 4h',
  ];

  const comparison = [
    { label: 'Prix', agency: '5 000–15 000 CHF', freelance: '1 500–4 000 CHF', stampify: '990 CHF' },
    { label: 'Délai', agency: '2–3 mois', freelance: '3–6 semaines', stampify: '48h' },
    { label: 'Fidélité incluse', agency: '✗', freelance: '✗', stampify: '✓' },
    { label: 'SEO local', agency: 'En option', freelance: 'Rarement', stampify: '✓ inclus' },
    { label: 'Support', agency: 'Facturation horaire', freelance: 'Variable', stampify: 'Inclus 1 an' },
  ];

  return (
    <section id="pricing" className="py-20 px-4" style={{ backgroundColor: '#FBF8F3' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
            style={{ backgroundColor: '#E8F8F3', color: '#1d9e75' }}
            data-animate="fadeIn"
          >
            ✦ L&apos;offre
          </div>
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
            Tout ce qu&apos;il faut. Rien de superflu.
          </h2>
          <p
            className="mt-3 text-lg"
            style={{ color: '#6b7280' }}
            data-animate="fadeUp"
          >
            Un seul prix. Un seul paiement. Tout inclus.
          </p>
        </div>

        {/* Cards row */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start">
          {/* Main card */}
          <div
            className="flex-1"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}
            data-animate="scaleIn"
            data-delay="delay-1"
          >
            {/* Card header */}
            <div
              style={{
                backgroundColor: '#1d9e75',
                borderRadius: '24px 24px 0 0',
                padding: '32px',
              }}
            >
              <p
                className="font-semibold mb-3"
                style={{ color: '#ffffff', fontSize: '14px' }}
              >
                Pack Stampify Essentiel
              </p>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '56px',
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                990 CHF
              </p>
              <p
                className="mt-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                paiement unique · sans abonnement
              </p>
            </div>

            {/* Card body */}
            <div style={{ padding: '32px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                {checklistLeft.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span style={{ color: '#1d9e75', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span className="text-sm" style={{ color: '#1a1a1a' }}>{item}</span>
                  </div>
                ))}
                {checklistRight.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span style={{ color: '#1d9e75', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span className="text-sm" style={{ color: '#1a1a1a' }}>{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="mailto:contact@stampify.ch"
                className="block w-full text-center font-bold text-white transition-all duration-200"
                style={{
                  backgroundColor: '#1d9e75',
                  borderRadius: '12px',
                  padding: '18px',
                  fontSize: '16px',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0d7a5a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1d9e75';
                }}
              >
                Je veux Stampify pour mon commerce
              </a>

              <p
                className="text-center mt-4 text-sm"
                style={{ color: '#6b7280' }}
              >
                🔒 Pas satisfait dans les 14 jours → remboursé intégralement.
              </p>
            </div>
          </div>

          {/* Add-on card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid #e5e7eb',
              width: '100%',
              maxWidth: '300px',
              alignSelf: 'flex-start',
            }}
            data-animate="scaleIn"
            data-delay="delay-2"
          >
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
              style={{ backgroundColor: '#FBF8F3', color: '#6b7280' }}
            >
              optionnel
            </div>
            <h3
              className="font-bold text-lg mb-2"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#1a1a1a',
              }}
            >
              Suivi mensuel
            </h3>
            <p
              className="font-bold mb-5"
              style={{
                fontSize: '28px',
                color: '#1d9e75',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              49 CHF<span className="text-sm font-normal" style={{ color: '#6b7280' }}> / mois</span>
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {addonItems.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span style={{ color: '#1d9e75', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span className="text-sm" style={{ color: '#1a1a1a' }}>{item}</span>
                </div>
              ))}
            </div>

            <a
              href="mailto:contact@stampify.ch"
              className="block w-full text-center font-medium transition-all duration-200"
              style={{
                border: '1px solid #1d9e75',
                color: '#1d9e75',
                backgroundColor: 'transparent',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#E8F8F3';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
              }}
            >
              En savoir plus
            </a>
          </div>
        </div>

        {/* Comparison table */}
        <div
          style={{ overflowX: 'auto' }}
          data-animate="fadeUp"
          data-delay="delay-3"
        >
          <table
            style={{
              width: '100%',
              minWidth: '560px',
              borderCollapse: 'collapse',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#FBF8F3' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6b7280',
                    width: '25%',
                  }}
                />
                <th
                  style={{
                    textAlign: 'center',
                    padding: '16px 20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6b7280',
                  }}
                >
                  Agence web
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    padding: '16px 20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6b7280',
                  }}
                >
                  Freelance
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    padding: '16px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1d9e75',
                    backgroundColor: '#E8F8F3',
                    border: '2px solid #1d9e75',
                    borderRadius: '8px',
                  }}
                >
                  Stampify ✓
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr
                  key={row.label}
                  style={{ borderTop: '1px solid #f0f0f0' }}
                >
                  <td
                    style={{
                      padding: '14px 20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1a1a1a',
                    }}
                  >
                    {row.label}
                  </td>
                  <td
                    style={{
                      padding: '14px 20px',
                      fontSize: '14px',
                      textAlign: 'center',
                      color: '#6b7280',
                    }}
                  >
                    {row.agency}
                  </td>
                  <td
                    style={{
                      padding: '14px 20px',
                      fontSize: '14px',
                      textAlign: 'center',
                      color: '#6b7280',
                    }}
                  >
                    {row.freelance}
                  </td>
                  <td
                    style={{
                      padding: '14px 20px',
                      fontSize: '14px',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#1d9e75',
                      backgroundColor: '#E8F8F3',
                      border: '2px solid #1d9e75',
                      borderRadius: '8px',
                    }}
                  >
                    {row.stampify}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
