"use client"

import { useEffect, useState } from "react"

const WA_MAIN = "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F"
const WA_DEVIS = "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20un%20devis%20pour%20un%20projet%20sur%20mesure.%20Pouvez-vous%20me%20contacter%20%3F"
const WA_ESSENTIEL = "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Essentiel%20%2849%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify."
const WA_PRO = "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Pro%20%2879%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify."

export default function SubscribePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 700px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 48px !important; }
          .hero-subtitle { font-size: 24px !important; }
          .section-pad { padding: 80px 24px !important; }
          .main-card { padding: 28px 20px !important; }
          .addon-card { padding: 24px 20px !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ background: "#ffffff", padding: "180px 24px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          {/* Badge */}
          <div className="fade-up" style={{
            display: "inline-block",
            background: "#f5f5f7",
            borderRadius: 980,
            padding: "6px 16px",
            fontSize: 13,
            color: "#1d1d1f",
            marginBottom: 28,
            fontWeight: 500,
          }}>
            Livraison en 48h · Paiement unique
          </div>

          {/* Title */}
          <h1 className="fade-up hero-title" style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#1d1d1f",
            margin: "0 0 16px",
            lineHeight: 1.05,
          }}>
            Votre site à vie.
          </h1>

          {/* Italic subtitle */}
          <p className="fade-up hero-subtitle" style={{
            fontSize: 32,
            fontStyle: "italic",
            color: "#0071e3",
            fontWeight: 400,
            margin: "0 0 24px",
            lineHeight: 1.2,
          }}>
            Votre commerce, pour toujours.
          </p>

          {/* Body */}
          <p className="fade-up" style={{
            fontSize: 17,
            color: "#6e6e73",
            margin: 0,
            lineHeight: 1.6,
          }}>
            990 CHF — Paiement unique. Domaine + hébergement offerts.
          </p>
        </div>
      </section>

      {/* ── Two Main Cards ── */}
      <section className="section-pad" style={{ background: "#f5f5f7", padding: "180px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="two-col-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}>

            {/* Card A — Forfait Complet */}
            <div className="fade-up main-card" style={{
              background: "#ffffff",
              borderRadius: 20,
              padding: 32,
              border: "2px solid #0071e3",
              boxShadow: "0 4px 24px rgba(0,113,227,0.12)",
              position: "relative",
            }}>
              {/* Badge top-right */}
              <div style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "#1d9e75",
                color: "#ffffff",
                borderRadius: 980,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}>
                LE CHOIX DE NOS CLIENTS
              </div>

              <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", margin: "0 0 12px" }}>
                Forfait Complet
              </h2>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#0071e3", margin: "0 0 6px" }}>
                990 CHF
              </div>
              <p style={{ fontSize: 13, color: "#6e6e73", margin: "0 0 24px" }}>
                Paiement unique · Livraison en moins de 48h
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
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
                ].map((feature, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ color: "#0071e3", fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: "#1d1d1f", lineHeight: 1.4 }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={WA_MAIN}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  background: "#1d1d1f",
                  color: "#ffffff",
                  borderRadius: 980,
                  padding: "14px 28px",
                  fontSize: 17,
                  fontWeight: 500,
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                Obtenir mon site maintenant →
              </a>
            </div>

            {/* Card B — Sur Mesure */}
            <div className="fade-up main-card" style={{
              background: "#ffffff",
              borderRadius: 20,
              padding: 32,
              border: "1.5px solid #e8e8e8",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", margin: "0 0 12px" }}>
                Sur Mesure
              </h2>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", margin: "0 0 6px" }}>
                Devis gratuit
              </div>
              <p style={{ fontSize: 13, color: "#6e6e73", margin: "0 0 24px" }}>
                Back-end, SAAS, 3D, inventaire...
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                {[
                  "Développement back-end sur mesure",
                  "Intégrations API complexes",
                  "Applications web avancées",
                  "Prix selon complexité",
                ].map((feature, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ color: "#0071e3", fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: "#1d1d1f", lineHeight: 1.4 }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={WA_DEVIS}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  background: "#1d1d1f",
                  color: "#ffffff",
                  borderRadius: 980,
                  padding: "14px 28px",
                  fontSize: 17,
                  fontWeight: 500,
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                Demander un devis →
              </a>
            </div>
          </div>

          {/* Contact note */}
          <p style={{ textAlign: "center", fontSize: 13, color: "#6e6e73", marginTop: 24 }}>
            📱 Réponse sous 2h · 7j/7 · +41 79 134 29 97
          </p>
        </div>
      </section>

      {/* ── Separator ── */}
      <section style={{ background: "#ffffff", padding: "56px 24px", textAlign: "center" }}>
        <p style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#9B8A7E",
          letterSpacing: "0.1em",
          margin: 0,
        }}>
          ━━━ VOUS POUVEZ AUSSI AJOUTER UN SUIVI MENSUEL ━━━
        </p>
      </section>

      {/* ── Add-on Cards ── */}
      <section className="section-pad" style={{ background: "#f5f5f7", padding: "180px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="two-col-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            alignItems: "start",
          }}>

            {/* Essentiel */}
            <div className="fade-up addon-card" style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "28px 32px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f" }}>Essentiel</span>
                <span style={{
                  background: "#e8f4fd",
                  color: "#0071e3",
                  borderRadius: 980,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  ADD-ON
                </span>
              </div>

              <div style={{ fontSize: 28, fontWeight: 700, color: "#0071e3", margin: "0 0 4px" }}>
                49 CHF/mois
              </div>
              <p style={{ fontSize: 13, color: "#6e6e73", margin: "0 0 20px" }}>
                Sans engagement · résiliable à tout moment
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                {[
                  "SMS automatiques (déclencheurs + campagnes manuelles)",
                  "1 campagne SMS/mois rédigée par nous",
                  "Rapport mensuel des performances",
                  "Mises à jour mineures incluses",
                  "Support email prioritaire",
                ].map((feature, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                    <span style={{ color: "#0071e3", fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: "#1d1d1f", lineHeight: 1.4 }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <p style={{ fontSize: 12, color: "#9B8A7E", fontStyle: "italic", margin: "0 0 20px" }}>
                ⚠️ Les fonctions SMS du dashboard sont actives uniquement avec cet add-on.
              </p>

              <a
                href={WA_ESSENTIEL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  background: "#e8f4fd",
                  color: "#0071e3",
                  borderRadius: 980,
                  padding: "14px 28px",
                  fontSize: 17,
                  fontWeight: 500,
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                Activer l&apos;add-on Essentiel →
              </a>
            </div>

            {/* Pro */}
            <div className="fade-up addon-card" style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "28px 32px",
              border: "2px solid #1d1d1f",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              position: "relative",
              marginTop: 14,
            }}>
              {/* Badge top centered */}
              <div style={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#f59e0b",
                color: "#ffffff",
                borderRadius: 980,
                padding: "4px 14px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}>
                RECOMMANDÉ
              </div>

              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f" }}>Pro</span>
                <span style={{
                  background: "#1d1d1f",
                  color: "#ffffff",
                  borderRadius: 980,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  ADD-ON
                </span>
              </div>

              <div style={{ fontSize: 28, fontWeight: 700, color: "#1d1d1f", margin: "0 0 4px" }}>
                79 CHF/mois
              </div>
              <p style={{ fontSize: 13, color: "#6e6e73", margin: "0 0 20px" }}>
                Sans engagement · résiliable à tout moment
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                {[
                  "Tout ce qui est dans Essentiel",
                  "Campagnes SMS illimitées",
                  "SMS retargeting automatisé sur 3 mois",
                  "Parrainage client automatique",
                  "Rapport hebdomadaire des performances",
                  "Support téléphonique prioritaire",
                ].map((feature, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                    <span style={{ color: "#1d1d1f", fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: "#1d1d1f", lineHeight: 1.4 }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <p style={{ fontSize: 12, color: "#9B8A7E", fontStyle: "italic", margin: "0 0 20px" }}>
                ⚠️ Les fonctions SMS du dashboard sont actives uniquement avec cet add-on.
              </p>

              <a
                href={WA_PRO}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  background: "#1d1d1f",
                  color: "#ffffff",
                  borderRadius: 980,
                  padding: "14px 28px",
                  fontSize: 17,
                  fontWeight: 500,
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                Activer l&apos;add-on Pro →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
