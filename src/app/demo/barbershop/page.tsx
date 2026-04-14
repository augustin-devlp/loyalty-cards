import type { Metadata } from "next";
import DemoBanner from "@/components/DemoBanner";
import DemoAnimation from "@/components/DemoAnimation";

export const metadata: Metadata = {
  title: "Barber Shop 41 — Démo Stampify",
  description: "Exemple de site web pour un barbershop à Genève avec carte de fidélité digitale. Livré par Stampify en 48h.",
};

const PRIMARY = "#2C2C2C";
const ACCENT = "#D4A853";
const LIGHT = "#F5F5F5";

const menu = [
  { name: "Coupe homme", price: "45.00 CHF", desc: "Consultation, shampooing, coupe stylisée, finition" },
  { name: "Coupe + barbe", price: "65.00 CHF", desc: "Coupe complète et taille de barbe au rasoir droit" },
  { name: "Barbe seule", price: "35.00 CHF", desc: "Taille, façonnage, rasage à la serviette chaude" },
  { name: "Coupe enfant", price: "30.00 CHF", desc: "Pour les moins de 12 ans, avec patience et sourire" },
];

export default function BarbershopPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF8" }}>
      <DemoBanner />

      {/* Demo site navbar */}
      <nav style={{ background: PRIMARY, padding: "0 24px", position: "sticky", top: 56, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
            ✂️ Barber Shop 41
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Services", "Notre équipe", "Fidélité", "Réservation"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500 }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #111111 0%, ${PRIMARY} 100%)`, padding: "80px 24px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(212,168,83,0.2)", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: ACCENT, marginBottom: 20 }}>
            Barbershop premium · Genève
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, color: "white", margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Le barbershop<br /><em style={{ fontStyle: "italic", color: ACCENT }}>de référence à Genève</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 32px 0" }}>
            Coupes précises, rasage à l&apos;ancienne, ambiance vintage. Parce que vous méritez le meilleur.
          </p>
          <a href="#reservation" style={{ display: "inline-block", background: ACCENT, color: "#1A1410", padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Prendre rendez-vous →
          </a>
        </div>
      </section>

      {/* About */}
      <section id="notre-equipe" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>Notre équipe</div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: "0 0 16px 0", lineHeight: 1.2 }}>
              Des artisans de la coupe masculine
            </h2>
            <p style={{ color: "#6B6259", lineHeight: 1.75, margin: "0 0 16px 0" }}>
              Fondé par Karim en 2018, Barber Shop 41 est devenu la référence genevoise pour les gentlemen qui exigent l&apos;excellence. Chaque coupe est un acte artisanal.
            </p>
            <p style={{ color: "#6B6259", lineHeight: 1.75 }}>
              Notre équipe de 3 barbiers certifiés maîtrise aussi bien les coupes classiques que les styles contemporains. Outils premium, serviettes chaudes, rasoir droit — l&apos;expérience complète.
            </p>
          </div>
          <div style={{ background: LIGHT, borderRadius: 20, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✂️</div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, color: "#1A1410", fontWeight: 700, marginBottom: 8 }}>
              22 Rue de Rive
            </div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>1204 Genève</div>
            <div style={{ color: "#6B6259", fontSize: 14, marginTop: 4 }}>Lun–Sam : 9h – 19h</div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>Dim : fermé</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ background: LIGHT, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>Services</div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: 0 }}>Nos prestations</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {menu.map((item) => (
              <div key={item.name} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 17, fontWeight: 700, color: "#1A1410", marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: "#6B6259", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
                <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 16, fontWeight: 700, color: ACCENT, whiteSpace: "nowrap", marginLeft: 16 }}>{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Card */}
      <section id="fidelite" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>Carte VIP</div>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: "0 0 16px 0" }}>
            Coupe offerte après 10 visites
          </h2>
          <p style={{ color: "#6B6259", lineHeight: 1.7, marginBottom: 40, fontSize: 16 }}>
            Un tampon à chaque passage. Approchez votre téléphone de la plaquette NFC à l&apos;entrée ou scannez le QR code en caisse.
          </p>
          <div style={{ background: "#1A1410", borderRadius: 20, padding: "32px", display: "inline-block", minWidth: 300 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 20 }}>Votre carte VIP</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: i < 6 ? ACCENT : "transparent",
                    border: i < 6 ? `2px solid ${ACCENT}` : "2px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {i < 6 && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 8l3 3L12.5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>6 / 10 · Plus que 4 visites</div>
          </div>
        </div>
      </section>

      {/* Stampify Feature Showcase */}
      <section style={{ background: LIGHT, padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <DemoAnimation
            primaryColor={PRIMARY}
            stampIcon="✂️"
            businessName="Barber Shop 41"
            reward="Coupe offerte après 10 visites"
            rewardIcon="✂️"
          />
          <p style={{ fontSize: 13, color: "#9C9085", marginTop: 32 }}>
            Propulsé par <strong style={{ color: "#3D31B0" }}>Stampify</strong> · Carte fidélité digitale
          </p>
        </div>
      </section>

      {/* Réservation */}
      <section id="reservation" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>Rendez-vous</div>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A1410", margin: "0 0 24px 0" }}>Réservez votre créneau</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              { icon: "📍", label: "Adresse", value: "22 Rue de Rive, 1204 Genève" },
              { icon: "📞", label: "Téléphone", value: "+41 22 000 00 00" },
              { icon: "✉️", label: "Email", value: "booking@barbershop41.ch" },
            ].map((c) => (
              <div key={c.label} style={{ background: LIGHT, borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: "#6B6259", lineHeight: 1.4 }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1A1410", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
          Barber Shop 41 © 2026 · Site créé par{" "}
          <a href="https://www.stampify.ch" style={{ color: "#3D31B0", textDecoration: "none" }}>Stampify</a>
        </p>
      </footer>
    </div>
  );
}
