'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Mes clients doivent télécharger une app ?',
    a: 'Non. Ils scannent un QR code avec l\'appareil photo de leur téléphone. C\'est tout.',
  },
  {
    q: 'Combien de temps pour que ce soit en ligne ?',
    a: '48h ouvrables. Tu nous envoies tes photos et infos, on s\'occupe du reste.',
  },
  {
    q: 'Est-ce que je dois payer un abonnement ?',
    a: 'Non. Le pack de base est un paiement unique de 990 CHF. L\'hébergement de la première année est inclus. Ensuite, renouvellement à 149 CHF/an.',
  },
  {
    q: 'Qu\'est-ce qui se passe si je ne suis pas satisfait ?',
    a: 'On te rembourse intégralement dans les 14 jours. Sans question.',
  },
  {
    q: 'Est-ce que vous travaillez qu\'en Suisse ?',
    a: 'Principalement en Suisse romande, mais on travaille aussi avec des commerces en France voisine (Annecy, Annemasse, Thonon).',
  },
  {
    q: 'Comment les tampons sont-ils ajoutés ?',
    a: 'Tu reçois un QR code à afficher en caisse. Le client scanne, le tampon s\'ajoute automatiquement.',
  },
  {
    q: 'Peut-on modifier le site après la mise en ligne ?',
    a: 'Oui. 2 révisions sont incluses. Pour des modifications régulières, le pack mensuel à 49 CHF/mois est fait pour ça.',
  },
  {
    q: 'C\'est sécurisé ?',
    a: 'Oui. Le site est hébergé sur Vercel (infrastructure de niveau entreprise), avec SSL inclus.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number>(-1);

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-3xl mx-auto">
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
            Les questions qu&apos;on nous pose souvent
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                data-animate="fadeUp"
                className={`delay-${(i % 3) + 1}`}
                style={{
                  backgroundColor: '#FBF8F3',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: isOpen ? '1px solid #1d9e75' : '1px solid transparent',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-semibold pr-4 text-sm"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: '#1a1a1a',
                      textAlign: 'left',
                      lineHeight: 1.5,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 700,
                      backgroundColor: isOpen ? '#1d9e75' : '#E8F8F3',
                      color: isOpen ? '#ffffff' : '#1d9e75',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s, background-color 0.2s, color 0.2s',
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? '200px' : '0px',
                    overflow: 'hidden',
                    opacity: isOpen ? 1 : 0,
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      padding: '0 24px 20px',
                      color: '#6b7280',
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
