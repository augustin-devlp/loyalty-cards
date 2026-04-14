import type { Metadata } from "next";
import DemoBanner from "@/components/DemoBanner";
import DemoAnimation from "@/components/DemoAnimation";

export const metadata: Metadata = {
  title: "Spa Essence — Démo Stampify",
  description: "Exemple de site web pour un spa à Genève avec carte de fidélité digitale. Livré par Stampify en 48h.",
};

const PRIMARY = "#2D5A4E";
const ACCENT = "#8FBF9F";
const LIGHT = "#F0F7F4";

const menu = [
  { name: "Massage signature 60 min", price: "120.00 CHF", desc: "Huiles essentielles biologiques, relaxation profonde" },
  { name: "Soin visage lumineux", price: "90.00 CHF", desc: "Nettoyage, peeling doux, masque hydratant premium" },
  { name: "Enveloppement détox", price: "110.00 CHF", desc: "Argile verte, algues marines, drainage lymphatique" },
  { name: "Rituel duo", price: "220.00 CHF", desc: "Massage 2 personnes simultané, champagne offert" },
];

export default function SpaPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF8" }}>
      <DemoBanner />

      {/* Demo site navbar */}
      <nav style={{ background: PRIMARY, padding: "0 24px", position: "sticky", top: 56, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
            🧖 Spa Essence
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Soins", "Notre spa", "Fidélité", "Réservation"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500 }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #1B4332 0%, ${PRIMARY} 100%)`, padding: "80px 24px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(143,191,159,0.2)", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: ACCENT, marginBottom: 20 }}>
            ⭐ Démo principale · Spa & bien-être · Genève
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, color: "white", margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Votre havre de paix<br /><em style={{ fontStyle: "italic", color: ACCENT }}>au cœur de Genève</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 32px 0" }}>
            Massages, soins visage, rituels bien-être — une parenthèse de sérénité dans votre quotidien. Espace privé, produits biologiques, équipe certifiée.
          </p>
          <a href="#reservation" style={{ display: "inline-block", background: "white", color: PRIMARY, padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Réserver un soin →
          </a>
        </div>
      </section>

      {/* About */}
      <section id="notre-spa" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Notre spa</div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: "0 0 16px 0", lineHeight: 1.2 }}>
              Un espace dédié à votre bien-être
            </h2>
            <p style={{ color: "#6B6259", lineHeight: 1.75, margin: "0 0 16px 0" }}>
              Ouvert en 2019 dans un hôtel particulier du 18e siècle, Spa Essence propose une expérience holistique unique à Genève. Quatre cabines privées, hammam, jacuzzi — tout pour votre ressourcement.
            </p>
            <p style={{ color: "#6B6259", lineHeight: 1.75 }}>
              Nos thérapeutes sont certifiés par l&apos;Association Suisse des Spa & Wellness. Nous utilisons uniquement des cosmétiques biologiques certifiés NATRUE et Ecocert.
            </p>
          </div>
          <div style={{ background: LIGHT, borderRadius: 20, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🧖</div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, color: "#1A1410", fontWeight: 700, marginBottom: 8 }}>
              6 Rue des Alpes
            </div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>1201 Genève</div>
            <div style={{ color: "#6B6259", fontSize: 14, marginTop: 4 }}>Mar–Dim : 10h – 20h</div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>Lun : fermé</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="soins" style={{ background: LIGHT, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Nos soins</div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: 0 }}>Rituels bien-être</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {menu.map((item) => (
              <div key={item.name} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 17, fontWeight: 700, color: "#1A1410", marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: "#6B6259", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
                <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 16, fontWeight: 700, color: PRIMARY, whiteSpace: "nowrap", marginLeft: 16 }}>{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Card */}
      <section id="fidelite" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Programme fidélité</div>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: "0 0 16px 0" }}>
            Soin visage offert après 10 visites
          </h2>
          <p style={{ color: "#6B6259", lineHeight: 1.7, marginBottom: 40, fontSize: 16 }}>
            Chaque soin vous rapproche de votre récompense. Approchez votre téléphone de la plaquette NFC à l&apos;entrée ou scannez le QR code à l&apos;accueil.
          </p>
          <div style={{ background: LIGHT, border: "1px solid #E2D9CC", borderRadius: 20, padding: "32px", display: "inline-block", minWidth: 300 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1410", marginBottom: 20 }}>Votre carte fidélité soins</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: i < 6 ? PRIMARY : "transparent",
                    border: i < 6 ? `2px solid ${PRIMARY}` : "2px solid #E2D9CC",
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
            <div style={{ fontSize: 13, color: "#6B6259" }}>6 / 10 · Plus que 4 soins</div>
          </div>
        </div>
      </section>

      {/* Stampify Feature Showcase */}
      <section style={{ background: LIGHT, padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <DemoAnimation
            primaryColor={PRIMARY}
            stampIcon="🧖"
            businessName="Spa Essence"
            reward="Soin visage offert après 10 visites"
            rewardIcon="✨"
          />
          <p style={{ fontSize: 13, color: "#9C9085", marginTop: 32 }}>
            Propulsé par <strong style={{ color: "#3D31B0" }}>Stampify</strong> · Carte fidélité digitale
          </p>
        </div>
      </section>

      {/* Réservation */}
      <section id="reservation" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Réservation</div>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A1410", margin: "0 0 24px 0" }}>Réservez votre moment</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              { icon: "📍", label: "Adresse", value: "6 Rue des Alpes, 1201 Genève" },
              { icon: "📞", label: "Téléphone", value: "+41 22 000 00 00" },
              { icon: "✉️", label: "Email", value: "booking@spa-essence.ch" },
            ].map((c) => (
              <div key={c.label} style={{ background: LIGHT, borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: "#6B6259", lineHeight: 1.4 }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1A1410", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
          Spa Essence © 2026 · Site créé par{" "}
          <a href="https://www.stampify.ch" style={{ color: "#3D31B0", textDecoration: "none" }}>Stampify</a>
        </p>
      </footer>
    </div>
  );
}
