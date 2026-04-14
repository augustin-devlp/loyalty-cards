import type { Metadata } from "next";
import DemoBanner from "@/components/DemoBanner";
import DemoAnimation from "@/components/DemoAnimation";

export const metadata: Metadata = {
  title: "Boulangerie Martin — Démo Stampify",
  description: "Exemple de site web pour une boulangerie artisanale à Lausanne avec carte de fidélité digitale. Livré par Stampify en 48h.",
};

const PRIMARY = "#8B6914";
const LIGHT = "#FAF5E4";

const menu = [
  { name: "Baguette tradition", price: "2.80 CHF", desc: "Farine type 65, fermentation lente 24h" },
  { name: "Croissant au beurre", price: "2.50 CHF", desc: "Pur beurre AOC, 27 couches feuilletées" },
  { name: "Pain au chocolat", price: "3.00 CHF", desc: "Chocolat noir Valrhona, pâte levée feuilletée" },
  { name: "Kouglof alsacien", price: "18.00 CHF", desc: "Recette familiale, raisins macérés au kirsch" },
];

export default function BoulangeriePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF8" }}>
      <DemoBanner />

      {/* Demo site navbar */}
      <nav style={{ background: PRIMARY, padding: "0 24px", position: "sticky", top: 56, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
            🥐 Boulangerie Martin
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Carte", "Notre histoire", "Fidélité", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500 }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #5C4309 0%, ${PRIMARY} 100%)`, padding: "80px 24px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 20 }}>
            Artisan boulanger · Lausanne depuis 1987
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, color: "white", margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Artisan boulanger<br /><em style={{ fontStyle: "italic" }}>depuis 1987 à Lausanne</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 32px 0" }}>
            Trois générations de passion pour le pain. Levain naturel, farine locale et amour du métier à chaque fournée.
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
              Trois générations de maîtres boulangers
            </h2>
            <p style={{ color: "#6B6259", lineHeight: 1.75, margin: "0 0 16px 0" }}>
              Henri Martin a fondé la boulangerie en 1987 avec une recette simple : des ingrédients de qualité, du temps, et beaucoup d&apos;amour.
            </p>
            <p style={{ color: "#6B6259", lineHeight: 1.75 }}>
              Aujourd&apos;hui, son fils Pierre perpétue cette tradition en travaillant uniquement avec des farines de moulins vaudois et des levains cultivés depuis 30 ans.
            </p>
          </div>
          <div style={{ background: LIGHT, borderRadius: 20, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🥐</div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, color: "#1A1410", fontWeight: 700, marginBottom: 8 }}>
              8 Avenue de la Gare
            </div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>1003 Lausanne</div>
            <div style={{ color: "#6B6259", fontSize: 14, marginTop: 4 }}>Mar–Sam : 6h30 – 18h30</div>
            <div style={{ color: "#6B6259", fontSize: 14 }}>Dim : 7h – 13h</div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="carte" style={{ background: LIGHT, padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PRIMARY, marginBottom: 12 }}>Nos produits</div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", margin: 0 }}>La sélection du jour</h2>
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
            Viennoiserie offerte après 10 visites
          </h2>
          <p style={{ color: "#6B6259", lineHeight: 1.7, marginBottom: 40, fontSize: 16 }}>
            Un tampon à chaque achat. Scannez le QR code en caisse ou approchez votre téléphone de la plaquette NFC à l&apos;entrée.
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
            stampIcon="🥐"
            businessName="Boulangerie Martin"
            reward="Viennoiserie offerte après 10 visites"
            rewardIcon="🥐"
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
              { icon: "📍", label: "Adresse", value: "8 Avenue de la Gare, 1003 Lausanne" },
              { icon: "📞", label: "Téléphone", value: "+41 21 000 00 00" },
              { icon: "✉️", label: "Email", value: "bonjour@boulangerie-martin.ch" },
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
          Boulangerie Martin © 2026 · Site créé par{" "}
          <a href="https://www.stampify.ch" style={{ color: "#3D31B0", textDecoration: "none" }}>Stampify</a>
        </p>
      </footer>
    </div>
  );
}
