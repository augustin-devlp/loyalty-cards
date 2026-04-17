const testimonials = [
  {
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80',
    avatarAlt: 'Marie-Claire',
    quote: 'Mes clients adorent scanner le QR code. J\'ai l\'impression d\'avoir une vraie présence professionnelle maintenant.',
    name: 'Marie-Claire',
    business: 'Boulangerie du Valentin, Lausanne',
    delay: 'delay-1',
  },
  {
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
    avatarAlt: 'Karim',
    quote: 'En 48h mon site était en ligne et mes clients recevaient déjà leurs tampons. Simple, rapide, pro.',
    name: 'Karim',
    business: 'Best Cut Barbershop, Genève',
    delay: 'delay-2',
  },
  {
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80',
    avatarAlt: 'Sophie',
    quote: 'J\'avais peur que ce soit compliqué. Augustin a tout géré. Je n\'ai rien eu à faire.',
    name: 'Sophie',
    business: 'Café Lumière, Fribourg',
    delay: 'delay-3',
  },
];

const stats = [
  { value: '40+', label: 'commerces actifs' },
  { value: '4.9★', label: 'de satisfaction' },
  { value: '48h', label: 'de mise en ligne' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
            style={{ backgroundColor: '#E8F8F3', color: '#1d9e75' }}
            data-animate="fadeIn"
          >
            ✦ Ils nous font confiance
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
            Des commerçants romands qui ont fait le pas.
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t) => (
            <div
              key={t.name}
              data-animate="fadeUp"
              className={t.delay}
              style={{
                position: 'relative',
                backgroundColor: '#FBF8F3',
                borderRadius: '16px',
                padding: '28px',
                overflow: 'hidden',
              }}
            >
              {/* Decorative quote mark */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '20px',
                  fontSize: '80px',
                  fontFamily: 'Georgia, serif',
                  color: '#1d9e75',
                  opacity: 0.3,
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div className="mb-4 relative" style={{ zIndex: 1 }}>
                <span style={{ color: '#1d9e75', fontSize: '16px' }}>★★★★★</span>
              </div>

              {/* Quote */}
              <p
                className="text-sm leading-relaxed mb-6 relative"
                style={{ color: '#1a1a1a', zIndex: 1 }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 relative" style={{ zIndex: 1 }}>
                <img
                  src={t.avatarUrl}
                  alt={t.avatarAlt}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: '#1a1a1a',
                    }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>
                    {t.business}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="rounded-2xl"
          style={{ backgroundColor: '#1d9e75', padding: '32px' }}
          data-animate="scaleIn"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {stats.map((stat, i) => (
              <div
                key={stat.value}
                style={{
                  borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}
              >
                <p
                  className="font-extrabold text-white"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '32px',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-1 text-sm"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
