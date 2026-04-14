import type { Metadata } from "next";
import DemoBanner from "@/components/DemoBanner";
import DemoAnimation from "@/components/DemoAnimation";

export const metadata: Metadata = {
  title: "Café Lumière — Démo Stampify",
  description: "Exemple de site web pour un café à Genève avec carte de fidélité digitale et plaquette NFC. Livré par Stampify en 48h.",
};

const PRIMARY = "#6B3F2A";
const LIGHT = "#F5EFE8";

const menu = [
  { name: "Espresso", price: "3.50 CHF", desc: "Arabica grand cru, torréfaction artisanale" },
  { name: "Flat White", price: "5.50 CHF", desc: "Double ristretto, lait entier micromoussé" },
  { name: "Latte", price: "5.00 CHF", desc: "Espresso onctueux, lait chaud, mousse légère" },
  { name: "Croissant", price: "4.00 CHF", desc: "Pur beurre, feuilletage croustillant maison" },
];

export default function CafePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF8" }}>
      <DemoBanner />

      {/* Demo site navbar */}
      <nav style={{ background: PRIMARY, padding: "0 24px", position: "sticky", top: 56, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
            ☕ Café Lumière
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Menu", "Notre histoire", "Fidélité", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500 }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #3E1F0A 0%, ${PRIMARY} 100%)`, padding: "80px 24px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 20 }}>
            Café de spécialité · Genève
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, color: "white", margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Le meilleur café<br /><em style={{ fontStyle: "italic" }}>de spécialité à Genève</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 32px 0" }}>
            Torréfaction artisanale, baristas passionnés, ambiance chaleureuse au cœur du Rhône.
          </p>
          <a href="#fidelite" style={{ display: "inline-block", background: "white", color: PRIMARY, padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Rejoindre le programme fidélité →
          </a>
        </div>
      </section>

      {/* About */}
      <section id="notre-histoire" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Notre histoire</div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: "0 0 16px 0", lineHeight: 1.2 }}>
              Une passion du café depuis 2012
            </h2>
            <p style={{ color: "#6B6259", lineHeight: 1.75, margin: "0 0 16px 0" }}>
              Fondé par Marie et Thomas, Café Lumière est né d&apos;une passion commune pour les origines uniques et les méthodes d&apos;extraction précises.
            </p>
            <p style={{ color: "#6B6259", lineHeight: 1.75 }}>
              Chaque tasse est préparée avec soin, en utilisant des grains torréfiés sur place chaque semaine. Nous collaborons directement avec des producteurs d&apos;Éthiopie, du Brésil et de Colombie.
            </p>
          </div>
          <div style={{ background: LIGHT, borderRadius: 20, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>☕</div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, color: "#1A1410", fontWeight: 700, marginBottom: 8 }}>
              14 Rue du Rhône
            </div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>1204 Genève</div>
            <div style={{ color: "#6B6259", fontSize: 14, marginTop: 4 }}>Lun–Sam : 7h30 – 18h</div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>Dim : 9h – 16h</div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" style={{ background: LIGHT, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Menu</div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: 0 }}>Nos incontournables</h2>
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
            Café offert après 10 visites
          </h2>
          <p style={{ color: "#6B6259", lineHeight: 1.7, marginBottom: 40, fontSize: 16 }}>
            Chaque passage au comptoir est récompensé. Scannez simplement le QR code ou approchez votre téléphone de la plaquette NFC à l&apos;entrée.
          </p>
          <div style={{ background: LIGHT, border: "1px solid #E2D9CC", borderRadius: 20, padding: "32px", display: "inline-block", minWidth: 300 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1410", marginBottom: 20 }}>Votre carte fidélité</div>
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
            <div style={{ fontSize: 13, color: "#6B6259" }}>6 / 10 · Plus que 4 visites</div>
          </div>
        </div>
      </section>

      {/* Stampify Feature Showcase */}
      <section style={{ background: LIGHT, padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <DemoAnimation
            primaryColor={PRIMARY}
            stampIcon="☕"
            businessName="Café Lumière"
            reward="Café offert après 10 visites"
            rewardIcon="☕"
          />
          <p style={{ fontSize: 13, color: "#9C9085", marginTop: 32 }}>
            Propulsé par <strong style={{ color: "#3D31B0" }}>Stampify</strong> · Carte fidélité digitale
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Contact</div>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A1410", margin: "0 0 24px 0" }}>Venez nous rendre visite</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              { icon: "📍", label: "Adresse", value: "14 Rue du Rhône, 1204 Genève" },
              { icon: "📞", label: "Téléphone", value: "+41 22 000 00 00" },
              { icon: "✉️", label: "Email", value: "bonjour@cafe-lumiere.ch" },
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
          Café Lumière © 2026 · Site créé par{" "}
          <a href="https://www.stampify.ch" style={{ color: "#3D31B0", textDecoration: "none" }}>Stampify</a>
        </p>
      </footer>
    </div>
  );
}
