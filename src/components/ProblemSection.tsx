export default function ProblemSection() {
  const cards = [
    {
      icon: '🗂️',
      title: 'La carte est perdue',
      text: '6 clients sur 10 perdent leur carte fidélité papier avant d\'atteindre la récompense',
      delay: 'delay-1',
    },
    {
      icon: '😤',
      title: 'Pas de suivi',
      text: 'Tu ne sais jamais combien de clients reviennent vraiment ni à quelle fréquence',
      delay: 'delay-2',
    },
    {
      icon: '💸',
      title: 'Budget marketing gaspillé',
      text: 'Tu imprimes des cartes que personne ne garde',
      delay: 'delay-3',
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#FBF8F3' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14" data-animate="fadeUp">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '40px',
              color: '#1a1a1a',
              lineHeight: 1.2,
            }}
          >
            La carte papier, tout le monde l&apos;a perdue.
          </h2>
          <p
            className="text-lg"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#6b7280',
            }}
          >
            Et avec elle, ton client régulier est reparti ailleurs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              data-animate="fadeUp"
              className={card.delay}
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div
                className="flex items-center justify-center mb-4"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#E8F8F3',
                  borderRadius: '12px',
                  fontSize: '28px',
                }}
              >
                {card.icon}
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: '#1a1a1a',
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: '#6b7280',
                }}
              >
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
