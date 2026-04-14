"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [step, setStep] = useState(0);
  const [spinKey, setSpinKey] = useState(0);
  const [typeKey, setTypeKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => {
        const next = (s + 1) % 4;
        if (next === 2) setSpinKey(k => k + 1);
        if (next === 3) setTypeKey(k => k + 1);
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F5F0E8' }}>

      {/* ══ KEYFRAMES ══ */}
      <style>{`
        @keyframes slideInPhone {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes rippleAnim {
          from { transform: scale(0.5); opacity: 1; }
          to   { transform: scale(2);   opacity: 0; }
        }
        @keyframes stampBounce {
          0%   { transform: scale(0);   opacity: 0; }
          60%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes spinWheel {
          from { transform: rotate(0deg); }
          to   { transform: rotate(1440deg); }
        }
        @keyframes typewriterAnim {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes cursorBlink {
          0%, 100% { border-color: white; }
          50%       { border-color: transparent; }
        }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{ background: 'rgba(245,240,232,0.95)', borderBottom: '1px solid #E2D9CC' }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div style={{ background: '#3D31B0' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8"/>
                <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8"/>
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M12 18l0 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M10 20.5l2-2.5 2 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ color: '#1A1410' }} className="font-semibold text-lg tracking-tight">Stampify</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/demo" style={{ color: '#6B6259' }} className="text-sm hover:opacity-80 transition-opacity">Démos</Link>
            <Link href="/services" style={{ color: '#6B6259' }} className="text-sm hover:opacity-80 transition-opacity">Services</Link>
            <Link
              href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
              style={{ background: '#3D31B0', color: 'white' }}
              className="text-sm px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left column */}
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase"
                style={{ background: '#EEEDF9', color: '#3D31B0' }}
              >
                <span style={{ width: 6, height: 6, background: '#3D31B0', borderRadius: '50%', flexShrink: 0 }}></span>
                Livraison 48h · Réponse sous 2h
              </div>
              <h1 style={{ color: '#1A1410' }} className="text-5xl font-bold leading-[1.1] tracking-tight mb-6">
                Votre commerce mérite<br />
                <span style={{ color: '#3D31B0' }}>mieux qu'une carte papier.</span>
              </h1>
              <p style={{ color: '#6B6259' }} className="text-lg leading-relaxed mb-8 max-w-lg">
                Site vitrine + carte fidélité digitale + plaquette NFC gravée. 990 CHF, livraison 48h.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
                  style={{ background: '#3D31B0', color: 'white' }}
                  className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
                >
                  Obtenir mon site
                </Link>
                <Link
                  href="/demo"
                  style={{ background: 'white', color: '#1A1410', border: '1px solid #E2D9CC' }}
                  className="px-6 py-3 rounded-xl font-semibold transition-colors hover:bg-[#EDE8E0]"
                >
                  Voir les démos →
                </Link>
              </div>
              <div className="flex flex-wrap gap-5">
                {["48h chrono", "990 CHF tout inclus", "Zéro abonnement", "Plaquette NFC gravée"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#6B6259' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#D1FAE5"/>
                      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — 4-step animation */}
            <div className="relative hidden lg:block">
              <div style={{ position: 'relative', width: '100%', height: 380 }}>

                {/* Step 0: NFC tap */}
                <div style={{ position: 'absolute', inset: 0, opacity: step === 0 ? 1 : 0, transition: 'opacity 0.4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{ width: 200, height: 130, background: 'linear-gradient(135deg, #8B6335 0%, #C8960C 50%, #8B6335 100%)', borderRadius: 16, boxShadow: '0 8px 32px rgba(139,99,53,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px solid rgba(255,255,255,0.2)' }}
                      aria-label="Plaquette NFC en bois gravee Stampify carte fidelite digitale commercants Suisse"
                    >
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="8" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>
                        <path d="M10 20 Q10 8 20 8 Q30 8 30 20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                        <path d="M6 20 Q6 4 20 4 Q34 4 34 20" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      </svg>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Boulangerie Martin</div>
                    </div>
                    <div style={{ position: 'absolute', right: -60, animation: 'slideInPhone 0.8s ease-out 0.3s both', fontSize: 40 }}>📱</div>
                    <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '3px solid #3D31B0', animation: 'rippleAnim 0.6s ease-out 1.2s both', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ background: '#1A1410', color: 'white', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>Approchez votre téléphone</div>
                </div>

                {/* Step 1: Loyalty card with stamps */}
                <div style={{ position: 'absolute', inset: 0, opacity: step === 1 ? 1 : 0, transition: 'opacity 0.4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                  <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '24px 28px', width: 280 }} aria-label="Carte de fidelite digitale Stampify sans application telephone">
                    <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1A1410', marginBottom: 6 }}>Boulangerie Martin</div>
                    <div style={{ fontSize: 12, color: '#6B6259', marginBottom: 16 }}>Carte fidélité · 10 tampons</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                      {[0,1,2,3,4,5,6,7,8,9].map(i => (
                        <div key={i} style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: i < 6 ? '#3D31B0' : '#EEF0FC',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          animation: i === 6 ? 'stampBounce 0.4s ease-out 0.3s both' : 'none',
                        }}>
                          {i < 6 && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3.5 8l3 3L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#3D31B0', color: 'white', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>Tampon ajouté ✓</div>
                </div>

                {/* Step 2: Spin wheel */}
                <div style={{ position: 'absolute', inset: 0, opacity: step === 2 ? 1 : 0, transition: 'opacity 0.4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '16px solid #1A1410', zIndex: 2 }} />
                    <svg
                      key={spinKey}
                      width="200"
                      height="200"
                      viewBox="-105 -105 210 210"
                      style={{ animation: step === 2 ? 'spinWheel 2.8s cubic-bezier(0.1,0.8,0.2,1) forwards' : 'none' }}
                    >
                      {['Café offert', '-10%', 'Croissant', '-20%', 'Tampon x2', 'Surprise'].map((label, i) => {
                        const startAngle = (i * 60 - 90) * Math.PI / 180;
                        const endAngle = ((i + 1) * 60 - 90) * Math.PI / 180;
                        const x1 = 95 * Math.cos(startAngle);
                        const y1 = 95 * Math.sin(startAngle);
                        const x2 = 95 * Math.cos(endAngle);
                        const y2 = 95 * Math.sin(endAngle);
                        const cx = 70 * Math.cos((startAngle + endAngle) / 2);
                        const cy = 70 * Math.sin((startAngle + endAngle) / 2);
                        const colors = ['#3D31B0','#EEF0FC','#3D31B0','#EEF0FC','#3D31B0','#EEF0FC'];
                        const textColors = ['white','#1A1410','white','#1A1410','white','#1A1410'];
                        return (
                          <g key={i}>
                            <path d={`M 0 0 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`} fill={colors[i]} stroke="white" strokeWidth="1.5"/>
                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="600" fill={textColors[i]} transform={`rotate(${i*60+30-90}, ${cx}, ${cy})`}>{label}</text>
                          </g>
                        );
                      })}
                      <circle cx="0" cy="0" r="16" fill="white" stroke="#E2D9CC" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div style={{ background: '#3D31B0', color: 'white', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>Café offert ! ☕</div>
                </div>

                {/* Step 3: SMS typewriter */}
                <div style={{ position: 'absolute', inset: 0, opacity: step === 3 ? 1 : 0, transition: 'opacity 0.4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                  <div style={{ background: '#1A1410', borderRadius: 16, maxWidth: 280, padding: '20px 20px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 24, height: 24, background: '#3D31B0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/>
                        </svg>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600 }}>Stampify SMS</span>
                    </div>
                    <div
                      key={typeKey}
                      style={{
                        color: 'white',
                        fontSize: 14,
                        lineHeight: 1.7,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        width: 0,
                        borderRight: '2px solid white',
                        animation: 'typewriterAnim 2s steps(60) 0.3s forwards, cursorBlink 0.7s step-end infinite',
                      }}
                    >
                      Il vous reste 3 tampons pour votre café offert ! Revenez ce weekend.
                    </div>
                  </div>
                  <div style={{ background: '#1A1410', color: 'white', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>SMS envoyé à vos clients</div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ background: '#1A1410', borderTop: '1px solid #2A2420', borderBottom: '1px solid #2A2420' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '56px 32px' }} className="max-[768px]:!py-[40px] max-[768px]:!px-[20px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "48h", label: "Délai de livraison" },
              { num: "990", label: "CHF tout inclus" },
              { num: "0", label: "Abonnement mensuel" },
              { num: "2h", label: "Réponse garantie" },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div style={{ fontSize: 36, fontWeight: 700, color: '#3D31B0', marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROBLÈME ══ */}
      <section className="py-20 px-6" style={{ background: '#F5F0E8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div style={{ color: '#3D31B0' }} className="text-xs font-semibold tracking-widest uppercase mb-3">Le problème</div>
            <h2 style={{ color: '#1A1410' }} className="text-3xl font-bold">Ce que vivent vos clients aujourd'hui</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🗑️", title: "Vos cartes papier finissent à la poubelle", desc: "Perdues, oubliées, jetées. Toute votre fidélisation part avec." },
              { icon: "👋", title: "Sans rappel digital, ils vont ailleurs", desc: "Le café d'en face a une carte fidélité sur téléphone. Le vôtre est en carton." },
              { icon: "🔍", title: "Invisible sur Google, invisible pour vos clients", desc: "97% des gens cherchent un commerce local sur Google avant de se déplacer." },
            ].map(p => (
              <div key={p.title} style={{ background: 'white', border: '1px solid #E2D9CC' }} className="rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 style={{ color: '#1A1410' }} className="font-semibold mb-2">{p.title}</h3>
                <p style={{ color: '#6B6259' }} className="text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-20 px-6" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div style={{ color: '#3D31B0' }} className="text-xs font-semibold tracking-widest uppercase mb-3">La solution Stampify</div>
            <h2 style={{ color: '#1A1410' }} className="text-3xl font-bold">Tout ce qu'il faut pour fidéliser et attirer</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📱", title: "Site vitrine professionnel", body: "5 pages à vos couleurs. Domaine .ch + hébergement inclus. Sur Google dès la première semaine." },
              { icon: "🎟️", title: "Carte fidélité sans app", body: "QR code ou NFC. La carte s'ouvre instantanément. Zéro téléchargement pour vos clients." },
              { icon: "🪵", title: "Plaquette en bois gravée à votre nom", body: "Sur votre comptoir, elle attire l'œil et fidélise chaque client qui passe." },
              { icon: "🔍", title: "SEO local optimisé", body: "Boulangerie Genève, café Lausanne... vos clients vous trouvent avant vos concurrents." },
              { icon: "🌐", title: "Domaine .ch + hébergement offerts", body: "Tout inclus la première année. Pas de surprise, pas de facture cachée." },
              { icon: "📩", title: "Campagnes SMS add-on", body: "Ce weekend -20% envoyé à tous vos clients fidèles. Depuis votre tableau de bord." },
            ].map(f => (
              <div key={f.title} className="group">
                <div style={{ background: '#EEEDF9' }} className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 style={{ color: '#1A1410' }} className="font-semibold text-lg mb-2">{f.title}</h3>
                <p style={{ color: '#6B6259' }} className="text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DÉMOS ══ */}
      <section className="py-20 px-6" style={{ background: '#F5F0E8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div style={{ color: '#3D31B0' }} className="text-xs font-semibold tracking-widest uppercase mb-3">Démos interactives</div>
            <h2 style={{ color: '#1A1410' }} className="text-3xl font-bold">Voyez le résultat pour votre commerce</h2>
            <p style={{ color: '#6B6259' }} className="mt-3">Cliquez sur votre secteur pour voir une démo complète</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { emoji: "☕", label: "Café / Coffee shop", href: "/demo/cafe" },
              { emoji: "🥐", label: "Boulangerie", href: "/demo/boulangerie" },
              { emoji: "✂️", label: "Barbershop", href: "/demo/barbershop" },
              { emoji: "🍽️", label: "Restaurant", href: "/demo/restaurant" },
              { emoji: "💅", label: "Manucure", href: "/demo/manucure" },
              { emoji: "🧖", label: "Spa / Institut", href: "/public/lessence-spa%20(1).html" },
            ].map(d => (
              <Link
                key={d.label}
                href={d.href}
                style={{ background: 'white', border: '1px solid #E2D9CC' }}
                className="rounded-2xl p-5 hover:border-[#3D31B0] hover:shadow-md transition-all group flex items-center gap-4"
              >
                <div style={{ background: '#F5F0E8' }} className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{d.emoji}</div>
                <div>
                  <div style={{ color: '#1A1410' }} className="font-semibold text-sm">{d.label}</div>
                  <div style={{ color: '#3D31B0' }} className="text-xs mt-0.5">Voir la démo →</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/demo" style={{ color: '#3D31B0' }} className="font-semibold text-sm hover:underline">🎯 Voir toutes les démos →</Link>
          </div>
        </div>
      </section>

      {/* ══ TARIFS ══ */}
      <section style={{ padding: '100px 24px', background: 'white' }} className="!py-[60px] md:!py-[100px]">
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3D31B0', marginBottom: 12 }}>Tarif</div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 32, fontWeight: 700, color: '#1A1410', margin: '0 0 12px 0' }}>Un investissement unique. Zéro abonnement.</h2>
            <p style={{ color: '#6B6259', maxWidth: 480, margin: '0 auto', fontSize: 15, fontStyle: 'italic' }}>Une agence suisse facture 1 500 à 5 000 CHF pour un site seul. Nous livrons site + carte fidélité + plaquette NFC + SEO + hébergement. Pour 990 CHF. En 48h.</p>
          </div>

          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ background: '#3D31B0', borderRadius: 24, padding: 40 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Pack Stampify</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: 'white', marginBottom: 4 }}>990 CHF</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>paiement unique · tout inclus</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  "Site vitrine 5 pages à vos couleurs",
                  "Carte fidélité digitale QR + NFC",
                  "Plaquette NFC en bois gravée",
                  "SEO local Suisse romande",
                  "Domaine .ch + hébergement 1 an",
                  "Livraison en 48h chrono",
                  "Vous êtes propriétaire de tout",
                ].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'white', fontSize: 14, paddingTop: 8, paddingBottom: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,0.2)"/>
                      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
                style={{ display: 'block', textAlign: 'center', background: 'white', color: '#3D31B0', padding: '14px 0', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none', marginBottom: 16 }}
              >
                Obtenir mon site →
              </Link>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>2.71 CHF par jour. Moins que votre café du matin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ══ */}
      <section className="py-20 px-6" style={{ background: '#F5F0E8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div style={{ color: '#3D31B0' }} className="text-xs font-semibold tracking-widest uppercase mb-3">Simple et rapide</div>
            <h2 style={{ color: '#1A1410' }} className="text-3xl font-bold">Comment ça marche ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", icon: "💬", title: "Parlez-nous de votre commerce", desc: "Un échange rapide sur WhatsApp. Réponse sous 2h, 7j/7." },
              { num: "2", icon: "⚡", title: "On crée tout en 48h", desc: "Site, carte fidélité, plaquette NFC gravée, SEO local. Zéro action de votre part." },
              { num: "3", icon: "🚀", title: "Vos clients reviennent", desc: "Votre commerce apparaît sur Google. Vos clients ont leur carte dans la poche." },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div style={{ background: '#3D31B0', color: 'white' }} className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">{s.num}</div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 style={{ color: '#1A1410' }} className="font-semibold mb-2">{s.title}</h3>
                <p style={{ color: '#6B6259' }} className="text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DERNIERS ARTICLES ══ */}
      <section style={{ background: 'white', padding: '80px 24px', borderTop: '1px solid #E2D9CC' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3D31B0', marginBottom: 12 }}>Blog</div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A1410', margin: 0 }}>Conseils pour les commerçants</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { category: "Fidélisation", title: "Carte de fidélité digitale pour boulangerie en Suisse : le guide complet 2026", slug: "carte-fidelite-digitale-boulangerie-suisse" },
              { category: "Site web", title: "Créer un site web pour son café à Lausanne ou Genève : prix et options 2026", slug: "site-web-cafe-lausanne-geneve" },
              { category: "NFC", title: "Plaquette NFC pour commerce local : qu'est-ce que c'est et pourquoi en avoir une", slug: "plaquette-nfc-commerce-local" },
            ].map(p => (
              <article key={p.slug} style={{ background: 'white', border: '1px solid #E2D9CC', borderRadius: 12, padding: 24 }}>
                <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3D31B0', marginBottom: 8 }}>{p.category}</span>
                <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1A1410', margin: '0 0 16px 0', lineHeight: 1.3 }}>{p.title}</h3>
                <Link href={`/blog/${p.slug}`} style={{ color: '#3D31B0', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Lire →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-20 px-6" style={{ background: '#1A1410' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à booster votre commerce ?</h2>
          <p style={{ color: '#9B9590' }} className="mb-8">Parlez-nous de votre commerce. On s'occupe de tout en 48h.</p>
          <Link
            href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
            style={{ background: '#3D31B0', color: 'white' }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
          >
            Nous contacter sur WhatsApp
            <span>→</span>
          </Link>
          <p style={{ color: '#6B6259' }} className="text-sm mt-4">📱 Réponse garantie sous 2h · 7j/7</p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#111009' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ background: '#3D31B0' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8"/>
                    <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8"/>
                    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M12 18l0 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-white font-semibold">Stampify</span>
              </div>
              <p style={{ color: '#6B6259' }} className="text-sm max-w-xs">La fidélisation digitale pour les commerces de proximité.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <div className="text-white font-semibold text-sm mb-3">Navigation</div>
                <div className="flex flex-col gap-2">
                  <Link href="/demo" style={{ color: '#6B6259' }} className="text-sm hover:text-white transition-colors">Nos démos</Link>
                  <Link href="/services" style={{ color: '#6B6259' }} className="text-sm hover:text-white transition-colors">Services</Link>
                  <Link href="/blog" style={{ color: '#6B6259' }} className="text-sm hover:text-white transition-colors">Blog</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-3">Contact</div>
                <div className="flex flex-col gap-2">
                  <Link href="https://wa.me/33XXXXXXXXX" style={{ color: '#6B6259' }} className="text-sm hover:text-white transition-colors">WhatsApp</Link>
                  <Link href="mailto:contact@stampify.ch" style={{ color: '#6B6259' }} className="text-sm hover:text-white transition-colors">contact@stampify.ch</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-3">Légal</div>
                <div className="flex flex-col gap-2">
                  <Link href="/mentions-legales" style={{ color: '#6B6259' }} className="text-sm hover:text-white transition-colors">Mentions légales</Link>
                  <Link href="/politique-de-confidentialite" style={{ color: '#6B6259' }} className="text-sm hover:text-white transition-colors">Confidentialité</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2A2720', paddingTop: 24, textAlign: 'center', color: '#4A4540', fontSize: 12 }}>
            © 2026 Stampify. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* ══ WHATSAPP FLOATING BUTTON — mobile only ══ */}
      <Link
        href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 100,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
          textDecoration: 'none',
        }}
        aria-label="Contacter Stampify sur WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </Link>

    </div>
  );
}
