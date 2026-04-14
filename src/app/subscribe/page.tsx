"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WA_990 =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";
const WA_ESSENTIEL =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Essentiel%20%2849%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";
const WA_PRO =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Pro%20%2879%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";

export default function SubscribePage() {
  const [showDevis, setShowDevis] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [devisError, setDevisError] = useState<string | null>(null);

  const handleDevisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setDevisError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, email, description }),
      });
      if (!res.ok) throw new Error("Erreur envoi");
      setSent(true);
    } catch {
      setDevisError("Une erreur est survenue. Contactez-nous sur WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            Livraison en 48h · Paiement unique
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, color: "#1A1410", margin: "0 0 12px 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Votre site à vie.
          </h1>
          <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#3D31B0", margin: "0 0 20px 0", fontStyle: "italic" }}>
            Votre commerce, pour toujours.
          </p>
          <p style={{ fontSize: 16, color: "#6B6259", lineHeight: 1.65, margin: 0 }}>
            990 CHF — Paiement unique. Domaine + hébergement offerts.
          </p>
        </div>
      </section>

      {/* Two-card layout */}
      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Card A — 990 CHF */}
          <div style={{ background: "white", border: "2px solid #3D31B0", borderRadius: 20, padding: 32, position: "relative", boxShadow: "0 4px 24px rgba(61,49,176,0.12)" }}>
            <div style={{ position: "absolute", top: 16, right: 16, background: "#22C55E", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.05em" }}>
              LE CHOIX DE NOS CLIENTS
            </div>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1410", margin: "0 0 8px 0" }}>
              Forfait Complet
            </h2>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 700, color: "#3D31B0", marginBottom: 4 }}>
              990 CHF
            </div>
            <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 24 }}>Paiement unique · Livraison en moins de 48h</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {[
                "Site vitrine 5 pages à vos couleurs",
                "Carte fidélité digitale 10 cases",
                "Plaquette NFC en bois gravée",
                "SEO local complet (Google, Schema.org)",
                "Domaine .ch + hébergement 1ère année",
                "QR code imprimable A4/A5",
                "1 campagne SMS offerte le 1er mois",
                "Dashboard analytics inclus",
                "2 retouches gratuites après livraison",
                "Guide vidéo d'utilisation (5 min)",
                "Livraison en 48h garantie",
              ].map((f) => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#1A1410" }}>{f}</span>
                </div>
              ))}
            </div>
            <a
              href={WA_990}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", background: "#3D31B0", color: "white", padding: "16px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15, textDecoration: "none" }}
            >
              Obtenir mon site maintenant →
            </a>
          </div>

          {/* Card B — Sur Mesure */}
          <div style={{ background: "white", border: "1.5px solid #E2D9CC", borderRadius: 20, padding: 32 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>💬</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1410", margin: "0 0 8px 0" }}>
              Sur Mesure
            </h2>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 700, color: "#1A1410", marginBottom: 4 }}>
              Devis gratuit
            </div>
            <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 24 }}>Back-end, SAAS, 3D, inventaire...</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {[
                "Développement back-end sur mesure",
                "Intégrations API complexes",
                "Applications web avancées",
                "Prix selon complexité du projet",
              ].map((f) => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#1A1410" }}>{f}</span>
                </div>
              ))}
            </div>

            {!showDevis && !sent && (
              <button
                onClick={() => setShowDevis(true)}
                style={{ width: "100%", background: "#1A1410", color: "white", padding: "16px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
              >
                Demander un devis →
              </button>
            )}

            {showDevis && !sent && (
              <form onSubmit={handleDevisSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Prénom *"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                />
                <textarea
                  placeholder="Description de votre projet *"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical" }}
                />
                {devisError && <p style={{ color: "#991B1B", fontSize: 13, margin: 0 }}>{devisError}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  style={{ background: "#3D31B0", color: "white", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1 }}
                >
                  {sending ? "Envoi en cours…" : "Envoyer ma demande →"}
                </button>
              </form>
            )}

            {sent && (
              <div style={{ background: "#ECFDF5", border: "1px solid #10B981", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
                <p style={{ color: "#065F46", fontWeight: 600, fontSize: 14, margin: 0 }}>Demande envoyée !</p>
                <p style={{ color: "#6B6259", fontSize: 13, margin: "4px 0 0" }}>On vous répond sous 2h.</p>
              </div>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6B6259", marginTop: 24 }}>
          📱 Réponse sous 2h · 7j/7 · +41 79 134 29 97
        </p>
      </section>

      {/* Separator */}
      <section style={{ padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#E2D9CC" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9B8A7E", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            VOUS POUVEZ AUSSI AJOUTER UN SUIVI MENSUEL
          </span>
          <div style={{ flex: 1, height: 1, background: "#E2D9CC" }} />
        </div>
      </section>

      {/* Add-on cards */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Essentiel */}
          <div style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 16, padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1A1410" }}>Essentiel</div>
              <div style={{ background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>ADD-ON</div>
            </div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#3D31B0", marginBottom: 4 }}>49 CHF/mois</div>
            <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 16 }}>Sans engagement · résiliable à tout moment</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                "SMS automatiques (déclencheurs + campagnes manuelles)",
                "1 campagne SMS/mois rédigée par nous",
                "Rapport mensuel des performances",
                "Mises à jour mineures incluses",
                "Support email prioritaire",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#1A1410" }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#9B8A7E", fontStyle: "italic", margin: "0 0 16px" }}>
              ⚠️ Les fonctions SMS du dashboard sont actives uniquement avec cet add-on.
            </p>
            <a
              href={WA_ESSENTIEL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", background: "#EEF0FC", color: "#3D31B0", padding: "12px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              Activer l&apos;add-on Essentiel →
            </a>
          </div>

          {/* Pro */}
          <div style={{ background: "white", border: "2px solid #1A1410", borderRadius: 16, padding: "28px 32px", position: "relative" }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#F59E0B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
              RECOMMANDÉ
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1A1410" }}>Pro</div>
              <div style={{ background: "#1A1410", color: "white", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>ADD-ON</div>
            </div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A1410", marginBottom: 4 }}>79 CHF/mois</div>
            <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 16 }}>Sans engagement · résiliable à tout moment</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                "Tout ce qui est dans Essentiel",
                "Campagnes SMS illimitées",
                "SMS retargeting automatisé sur 3 mois",
                "Parrainage client automatique",
                "Rapport hebdomadaire des performances",
                "Support téléphonique prioritaire",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#1A1410", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#1A1410" }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#9B8A7E", fontStyle: "italic", margin: "0 0 16px" }}>
              ⚠️ Les fonctions SMS du dashboard sont actives uniquement avec cet add-on.
            </p>
            <a
              href={WA_PRO}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", background: "#1A1410", color: "white", padding: "12px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              Activer l&apos;add-on Pro →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
