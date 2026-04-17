'use client';

import PhoneMockup from './PhoneMockup';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16"
      style={{ background: '#ffffff' }}
    >
      {/* Subtle green halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 65% 50%, rgba(29,158,117,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 py-20 w-full">
        <div className="grid lg:grid-cols-[60fr_40fr] gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: '#E8F8F3', color: '#1d9e75' }}>
              <span>✦</span>
              <span>Carte fidélité digitale · Suisse romande</span>
            </div>

            {/* H1 */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1a1a1a' }}
            >
              Tes clients reviennent.{' '}
              <span className="block">Sans carte papier à perdre.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: '#6b7280', maxWidth: '480px' }}
            >
              Stampify donne à ton commerce une carte fidélité sur smartphone,
              un site vitrine soigné et une présence locale qui se voit.
              En 48h, tout est prêt.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 text-white font-semibold px-7 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: '#1d9e75', borderRadius: '12px' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0d7a5a')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1d9e75')}
              >
                Découvrir Stampify — 990 CHF
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-1.5 font-medium transition-all duration-200 group"
                style={{ color: '#1d9e75' }}
              >
                Voir une démo
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {[
                  'photo-1494790108377-be9c29b29330',
                  'photo-1507003211169-0a1dd7228f2d',
                  'photo-1438761681033-6461ffad8d80',
                  'photo-1500648767791-00dcc994a43e',
                  'photo-1534528741775-53994a69daeb',
                ].map((id, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${id}?w=80&h=80&fit=crop&q=80`}
                    alt="Commerçant Stampify"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover"
                    loading="eager"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                  <span>Rejoins 40+ commerçants romands</span>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7280' }}>
                  <span>★★★★★ 4.9</span>
                  <span>·</span>
                  <span>Genève · Lausanne · Fribourg · Nyon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
