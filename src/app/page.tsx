"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const WA = "https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify.";

export default function Home() {
  const [step, setStep] = useState(0);
  const [spinKey, setSpinKey] = useState(0);
  const [typeKey, setTypeKey] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blog posts data (first 3 for the section)
  const blogPreviews = [
    { slug: "carte-fidelite-digitale-boulangerie-suisse", category: "Fidélisation", title: "Carte de fidélité digitale pour boulangerie en Suisse : le guide complet 2026" },
    { slug: "site-web-cafe-lausanne-geneve", category: "Site web", title: "Créer un site web pour son café à Lausanne ou Genève : prix et options 2026" },
    { slug: "fideliser-clients-restaurant-suisse-romande", category: "Restaurant", title: "Comment fidéliser les clients de son restaurant en Suisse romande" },
  ];

  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes slideInPhone { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(10px); opacity: 1; } }
        @keyframes rippleAnim { 0% { transform: scale(0); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes stampBounce { 0% { transform: scale(0); } 60% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes spinWheel { from { transform: rotate(0deg); } to { transform: rotate(1440deg); } }
        @keyframes typewriterAnim { from { width: 0; } to { width: 100%; } }
        @keyframes cursorBlink { 0%,100% { border-right-color: white; } 50% { border-right-color: transparent; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(245,240,232,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E2D9CC" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, background: "#3D31B0", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8"/>
                <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8"/>
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ color: "#1A1410", fontWeight: 700, fontSize: 18, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}>Stampify</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
            <Link href="#demos" style={{ color: "#6B6259", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>Démos</Link>
            <Link href="#tarif" style={{ color: "#6B6259", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>Tarif</Link>
            <Link href="#comment" style={{ color: "#6B6259", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>Comment ça marche</Link>
            <Link href={WA} style={{ background: "#3D31B0", color: "white", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Obtenir mon site
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ display: "flex", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 8 }}
            className="md:hidden"
            aria-label="Menu"
          >
            <span style={{ width: 22, height: 2, background: "#1A1410", borderRadius: 2, transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ width: 22, height: 2, background: "#1A1410", borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: "all 0.2s" }} />
            <span style={{ width: 22, height: 2, background: "#1A1410", borderRadius: 2, transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ background: "#F5F0E8", borderTop: "1px solid #E2D9CC", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }} className="md:hidden">
            <Link href="#demos" onClick={() => setMenuOpen(false)} style={{ color: "#1A1410", fontSize: 16, textDecoration: "none", fontWeight: 500 }}>Démos</Link>
            <Link href="#tarif" onClick={() => setMenuOpen(false)} style={{ color: "#1A1410", fontSize: 16, textDecoration: "none", fontWeight: 500 }}>Tarif</Link>
            <Link href="#comment" onClick={() => setMenuOpen(false)} style={{ color: "#1A1410", fontSize: 16, textDecoration: "none", fontWeight: 500 }}>Comment ça marche</Link>
            <Link href={WA} style={{ background: "#3D31B0", color: "white", borderRadius: 8, padding: "12px 20px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
              Obtenir mon site
            </Link>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ paddingTop: 128, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "55% 45%", gap: 64, alignItems: "center" }} className="max-[900px]:!grid-cols-1">

            {/* Left */}
            <div>
              <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                ⚡ Livraison en 48h garantie
              </div>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 600, lineHeight: 1.05, color: "#1A1410", margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
                Votre commerce mérite <em style={{ fontStyle: "italic" }}>mieux</em> qu&apos;une carte papier.
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#6B6259", lineHeight: 1.65, maxWidth: 480, margin: "0 0 32px 0" }}>
                Site vitrine + carte fidélité digitale + plaquette NFC gravée. 990 CHF, livraison 48h.
              </p>
              <Link href={WA} style={{
                display: "inline-block", background: "#3D31B0", color: "white",
                padding: "16px 32px", borderRadius: 10, fontSize: 16, fontWeight: 600,
                textDecoration: "none", marginBottom: 20,
                transition: "background 0.2s, transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#2D2390"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(61,49,176,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#3D31B0"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
              >
                Obtenir mon site →
              </Link>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 8 }}>
                {["✓ 48h chrono", "✓ 990 CHF tout inclus", "✓ Zéro abonnement", "✓ Plaquette NFC gravée"].map(f => (
                  <span key={f} style={{ fontSize: 14, color: "#6B6259" }}>{f}</span>
                ))}
              </div>
            </div>

            {/* Right — 4-step animation */}
            <div style={{ position: "relative", height: 380 }} className="hidden lg:block">

              {/* Step 0: NFC tap */}
              <div style={{ position: "absolute", inset: 0, opacity: step === 0 ? 1 : 0, transition: "opacity 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 200, height: 130, background: "linear-gradient(135deg, #8B6335 0%, #C8960C 50%, #8B6335 100%)", borderRadius: 16, boxShadow: "0 8px 32px rgba(139,99,53,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, border: "2px solid rgba(255,255,255,0.2)" }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="8" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>
                      <path d="M10 20 Q10 8 20 8 Q30 8 30 20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <path d="M6 20 Q6 4 20 4 Q34 4 34 20" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Boulangerie Martin</div>
                  </div>
                  <div style={{ position: "absolute", right: -60, animation: step === 0 ? "slideInPhone 0.8s ease-out 0.3s both" : "none", fontSize: 40 }}>📱</div>
                  <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", border: "3px solid #3D31B0", animation: step === 0 ? "rippleAnim 0.6s ease-out 1.2s both" : "none", pointerEvents: "none" }} />
                </div>
                <div style={{ background: "#1A1410", color: "white", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>Approchez votre téléphone →</div>
              </div>

              {/* Step 1: Loyalty card */}
              <div style={{ position: "absolute", inset: 0, opacity: step === 1 ? 1 : 0, transition: "opacity 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ background: "white", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", padding: "24px 28px", width: 280 }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#1A1410", marginBottom: 12 }}>Boulangerie Martin</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 12 }}>
                    {[0,1,2,3,4,5,6,7,8,9].map(i => (
                      <div key={i} style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: i < 6 ? "#3D31B0" : "#EEF0FC",
                        border: "1px solid #E2D9CC",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        animation: i === 6 && step === 1 ? "stampBounce 0.4s ease-out 0.6s both" : "none",
                      }}>
                        {i < 6 && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8l3 3L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B6259" }}>6 / 10 tampons — encore 4 pour votre café offert</div>
                </div>
                <div style={{ background: "#3D31B0", color: "white", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>✓ Tampon ajouté</div>
              </div>

              {/* Step 2: Spin wheel */}
              <div style={{ position: "absolute", inset: 0, opacity: step === 2 ? 1 : 0, transition: "opacity 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "16px solid #1A1410", zIndex: 2 }} />
                  <svg
                    key={spinKey}
                    width="200" height="200" viewBox="-105 -105 210 210"
                    style={{ animation: step === 2 ? "spinWheel 2.5s cubic-bezier(0.1,0.8,0.2,1) forwards" : "none" }}
                  >
                    {[["Café offert","#3D31B0","white"],["−10%","#EEF0FC","#1A1410"],["Croissant 🥐","#3D31B0","white"],["−20%","#EEF0FC","#1A1410"],["Tampon x2","#3D31B0","white"],["Surprise ✨","#EEF0FC","#1A1410"]].map(([label, bg, fg], i) => {
                      const sa = (i * 60 - 90) * Math.PI / 180;
                      const ea = ((i + 1) * 60 - 90) * Math.PI / 180;
                      const x1 = 95 * Math.cos(sa), y1 = 95 * Math.sin(sa);
                      const x2 = 95 * Math.cos(ea), y2 = 95 * Math.sin(ea);
                      const cx = 68 * Math.cos((sa + ea) / 2), cy = 68 * Math.sin((sa + ea) / 2);
                      return (
                        <g key={i}>
                          <path d={`M 0 0 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`} fill={bg as string} stroke="white" strokeWidth="1.5"/>
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fontWeight="600" fill={fg as string} transform={`rotate(${i*60+30-90}, ${cx}, ${cy})`}>{label as string}</text>
                        </g>
                      );
                    })}
                    <circle cx="0" cy="0" r="16" fill="white" stroke="#E2D9CC" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={{ background: "#3D31B0", color: "white", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>🎰 Café offert !</div>
              </div>

              {/* Step 3: SMS typewriter */}
              <div style={{ position: "absolute", inset: 0, opacity: step === 3 ? 1 : 0, transition: "opacity 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ background: "#1A1410", borderRadius: 16, padding: "20px 24px", width: 280 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, background: "#3D31B0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/></svg>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Stampify</span>
                  </div>
                  <div
                    key={typeKey}
                    style={{
                      color: "white", fontSize: 14, lineHeight: 1.7,
                      overflow: "hidden", whiteSpace: "nowrap",
                      width: 0, borderRight: "2px solid white",
                      fontFamily: "'DM Sans', sans-serif",
                      animation: "typewriterAnim 2s steps(45) 0.3s forwards, cursorBlink 0.7s step-end infinite",
                    }}
                  >
                    🥐 Il vous reste 3 tampons pour votre café offert ! Revenez ce weekend.
                  </div>
                </div>
                <div style={{ background: "#1A1410", color: "white", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)" }}>📱 SMS envoyé à vos clients</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section style={{ background: "#1A1410", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 32 }}>
          {[
            { num: "48h", label: "Livraison garantie" },
            { num: "990 CHF", label: "Tout inclus" },
            { num: "100%", label: "Propriétaire du site" },
            { num: "0€", label: "Abonnement mensuel" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingRight: i < 3 ? 32 : 0, flex: 1, minWidth: 140 }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "white", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)", marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PROBLEM ══ */}
      <section style={{ background: "#F5F0E8", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Le problème</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "#1A1410", margin: 0, letterSpacing: "-0.02em" }}>Ce que vivent vos clients aujourd&apos;hui</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { e: "🗑️", t: "Vos cartes papier finissent à la poubelle", d: "Perdues, oubliées, jetées. Toute votre fidélisation part avec." },
              { e: "👋", t: "Sans rappel digital, ils vont ailleurs", d: "Le café d'en face a une carte fidélité sur téléphone. Le vôtre est en carton." },
              { e: "🔍", t: "Invisible sur Google, invisible pour vos clients", d: "97% des gens cherchent un commerce local sur Google avant de se déplacer." },
            ].map(p => (
              <div key={p.t} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 12, padding: 32, transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#3D31B0"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#E2D9CC"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{p.e}</div>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 600, color: "#1A1410", margin: "0 0 12px 0" }}>{p.t}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6B6259", lineHeight: 1.65, margin: 0 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOLUTION ══ */}
      <section style={{ background: "#F5F0E8", paddingBottom: 96, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>La solution Stampify</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "#1A1410", margin: 0, letterSpacing: "-0.02em" }}>Tout ce qu&apos;il faut pour fidéliser et attirer</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", border: "1px solid #E2D9CC", borderRadius: 12, overflow: "hidden", background: "white" }}>
            {[
              { e: "🌐", t: "Site vitrine professionnel", d: "5 pages à vos couleurs. Domaine .ch + hébergement inclus. Sur Google dès la première semaine." },
              { e: "🎟️", t: "Carte fidélité sans app", d: "QR code ou NFC. La carte s'ouvre instantanément. Zéro téléchargement pour vos clients." },
              { e: "🪵", t: "Plaquette en bois gravée à votre nom", d: "Sur votre comptoir, elle attire l'œil et fidélise chaque client qui passe." },
              { e: "📍", t: "SEO local optimisé", d: "Boulangerie Genève, café Lausanne... vos clients vous trouvent avant vos concurrents." },
              { e: "🌍", t: "Domaine .ch + hébergement offerts", d: "Tout inclus la première année. Pas de surprise, pas de facture cachée." },
              { e: "📩", t: "Campagnes SMS (add-on)", d: "'Ce weekend -20%' envoyé à tous vos clients fidèles. Depuis votre tableau de bord." },
            ].map((f, i) => (
              <div key={f.t} style={{ padding: 32, borderRight: (i % 3 !== 2) ? "1px solid #E2D9CC" : "none", borderBottom: i < 3 ? "1px solid #E2D9CC" : "none" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.e}</div>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#1A1410", margin: "0 0 8px 0" }}>{f.t}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6B6259", lineHeight: 1.6, margin: 0 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DEMOS ══ */}
      <section id="demos" style={{ background: "white", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Démos interactives</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "#1A1410", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>Voyez le résultat pour votre commerce</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#6B6259", margin: 0 }}>Exemples réels de sites livrés à des commerçants en Suisse romande</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="md:!grid-cols-3">
            {[
              { e: "☕", n: "Café", path: "/demo/cafe" },
              { e: "🥐", n: "Boulangerie", path: "/demo/boulangerie" },
              { e: "✂️", n: "Barbershop", path: "/demo/barbershop" },
              { e: "🍽️", n: "Restaurant", path: "/demo/restaurant" },
              { e: "💅", n: "Manucure", path: "/demo/manucure" },
              { e: "🧖", n: "Spa", path: "/demo/spa" },
            ].map(d => (
              <Link key={d.path} href={d.path} style={{
                display: "block", background: "#F5F0E8", border: "1px solid #E2D9CC",
                borderRadius: 12, padding: 28, textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#3D31B0"; el.style.background = "#EEF0FC"; el.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#E2D9CC"; el.style.background = "#F5F0E8"; el.style.transform = "none"; }}
              >
                <div style={{ fontSize: 40 }}>{d.e}</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#1A1410", marginTop: 12 }}>{d.n}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#3D31B0", marginTop: 16, fontWeight: 500 }}>Voir la démo →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="tarif" style={{ background: "#F5F0E8", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Tarif</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 600, color: "#1A1410", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>Un investissement unique. Zéro abonnement.</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#6B6259", maxWidth: 520, margin: "0 auto" }}>Vous payez une fois, c&apos;est à vous pour toujours. Pas de frais cachés, pas d&apos;engagement.</p>
          </div>

          <div style={{ maxWidth: 512, margin: "0 auto", background: "white", border: "2px solid #3D31B0", borderRadius: 20, padding: "48px" }}>
            <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "4px 12px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>⭐ Le seul forfait</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 72, fontWeight: 700, color: "#1A1410", lineHeight: 1 }}>990 CHF</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B6259", marginTop: 4 }}>ou 900€ en France</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B6259" }}>paiement unique — aucun abonnement</div>
            <div style={{ borderTop: "1px solid #E2D9CC", margin: "28px 0" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                "Site web vitrine 5 pages (domaine .ch + hébergement inclus 1ère année)",
                "Carte de fidélité digitale 10 cases",
                "Plaquette NFC en bois gravée à votre nom",
                "SEO local complet",
                "QR code imprimable A4/A5",
                "1 campagne SMS offerte le premier mois",
                "2 retouches gratuites incluses",
                "Guide vidéo d'utilisation 5 min",
                "Livraison en 48h garantie",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #F5F0E8", alignItems: "flex-start" }}>
                  <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#1A1410" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#EEF0FC", borderRadius: 10, padding: 16, margin: "24px 0", fontSize: 14, fontStyle: "italic", color: "#3D31B0", lineHeight: 1.6 }}>
              Une agence suisse facture 1 500 à 5 000 CHF pour un site seul. Nous livrons site + carte fidélité + plaquette NFC + SEO + hébergement. Pour 990 CHF. En 48h.
            </div>
            <Link href={WA} style={{ display: "block", background: "#3D31B0", color: "white", padding: "16px", borderRadius: 10, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
              Obtenir mon site maintenant →
            </Link>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B6259", textAlign: "center", marginTop: 12, marginBottom: 0 }}>2.71 CHF par jour. Moins que votre café du matin.</p>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B6259", textAlign: "center", marginTop: 16 }}>Add-on optionnel : 49 CHF/mois — campagnes SMS + mises à jour + rapport mensuel. Sans engagement.</p>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="comment" style={{ background: "#1A1410", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Simple et rapide</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "white", margin: 0, letterSpacing: "-0.02em" }}>Comment ça marche ?</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }} className="md:!flex-row md:!gap-12">
            {[
              { n: "1", e: "💬", t: "Parlez-nous de votre commerce", d: "Un échange rapide sur WhatsApp. Réponse sous 2h, 7j/7." },
              { n: "2", e: "⚡", t: "On crée tout en 48h", d: "Site, carte fidélité, plaquette NFC gravée, SEO local. Zéro action de votre part." },
              { n: "3", e: "🚀", t: "Vos clients reviennent", d: "Votre commerce apparaît sur Google. Vos clients ont leur carte dans la poche." },
            ].map(s => (
              <div key={s.n} style={{ flex: 1, position: "relative" }}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 80, fontWeight: 700, color: "rgba(255,255,255,0.06)", position: "absolute", top: -16, left: -8, lineHeight: 1, userSelect: "none" }}>{s.n}</div>
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.e}</div>
                  <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 600, color: "white", margin: "0 0 8px 0" }}>{s.t}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <Link href={WA} style={{ display: "inline-block", background: "white", color: "#3D31B0", padding: "16px 32px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
              Nous contacter sur WhatsApp →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ BLOG ══ */}
      <section style={{ background: "#F5F0E8", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 600, color: "#1A1410", marginBottom: 40, letterSpacing: "-0.01em" }}>Conseils pour les commerçants</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="md:!flex-row">
            {blogPreviews.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ flex: 1, background: "white", border: "1px solid #E2D9CC", borderRadius: 12, padding: 24, textDecoration: "none", display: "block" }}>
                <span style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.category}</span>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#1A1410", margin: "12px 0 0 0", lineHeight: 1.35 }}>{p.title}</h3>
                <span style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#3D31B0", fontWeight: 500, marginTop: 16 }}>Lire →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section style={{ background: "#3D31B0", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "white", margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>Prêt à fidéliser vos clients ?</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.75)", margin: "0 0 32px 0" }}>Parlez-nous de votre commerce. On s&apos;occupe de tout en 48h.</p>
          <Link href={WA} style={{ display: "inline-block", background: "white", color: "#3D31B0", padding: "20px 40px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 18, textDecoration: "none" }}>
            Nous contacter sur WhatsApp →
          </Link>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>📱 Réponse garantie sous 2h · 7j/7</p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "#1A1410", padding: "40px 32px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "#3D31B0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/><circle cx="12" cy="9" r="3" stroke="white" strokeWidth="2"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span style={{ color: "white", fontWeight: 700, fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>Stampify</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Démos", "/demo"], ["Blog", "/blog"], ["Mentions légales", "/mentions-legales"], ["CGV", "/conditions-utilisation"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>{l}</Link>
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>© 2026 Stampify</span>
        </div>
      </footer>

      {/* ══ WHATSAPP FLOATING BUTTON (mobile) ══ */}
      <Link href={WA} aria-label="Contacter sur WhatsApp" className="md:hidden" style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 50,
        width: 56, height: 56, borderRadius: "50%", background: "#25D366",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,211,102,0.4)", textDecoration: "none",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </Link>

    </div>
  );
}
