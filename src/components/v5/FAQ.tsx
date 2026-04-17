"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Qu'est-ce qui est inclus dans les 990 CHF ?",
    a: "Tout. Site vitrine 5 pages, domaine .ch ou .fr (1 an), hébergement (1 an), carte fidélité digitale QR code, plaquette NFC en bois gravée, SEO local, dashboard temps réel, 1 campagne SMS offerte, formation 30 min et support WhatsApp 7j/7. Rien à rajouter.",
  },
  {
    q: "Combien de temps faut-il pour recevoir mon site ?",
    a: "48 heures après votre message WhatsApp avec les informations de votre commerce. Nous nous occupons de tout : création du site, configuration de la carte fidélité, programmation de la plaquette NFC et référencement local.",
  },
  {
    q: "Y a-t-il des frais cachés ou un abonnement mensuel ?",
    a: "Non. Les 990 CHF couvrent tout pour la première année. Ensuite, le renouvellement du domaine et de l'hébergement est optionnel à 150 CHF/an. Pas d'abonnement mensuel, jamais.",
  },
  {
    q: "Mes clients doivent-ils télécharger une application ?",
    a: "Non. Vos clients scannent simplement le QR code affiché dans votre commerce (ou approchent leur téléphone de la plaquette NFC). La carte s'ouvre directement dans leur navigateur. Aucune application à installer.",
  },
  {
    q: "Que se passe-t-il si je veux modifier mon site après livraison ?",
    a: "Vous pouvez nous contacter à tout moment via WhatsApp pour des modifications mineures (horaires, photos, menu). Pour des refontes majeures, nous établissons un devis selon vos besoins. Le support est inclus.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {ITEMS.map((item, i) => (
        <div
          key={i}
          data-animate="fade-up"
          data-delay={String(i + 1)}
          style={{
            border: "1px solid",
            borderColor: open === i ? "rgba(29,158,117,0.35)" : "#E5E7EB",
            borderRadius: 12,
            overflow: "hidden",
            background: open === i ? "#FAFFFE" : "#fff",
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", textAlign: "left",
              padding: "20px 24px",
              background: "none", border: "none",
              cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.4 }}>
              {item.q}
            </span>
            <span style={{
              width: 24, height: 24, borderRadius: "50%",
              background: open === i ? "#1d9e75" : "#F3F4F6",
              color: open === i ? "#fff" : "#6B7280",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
              transition: "background 0.2s, color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
            }}>
              +
            </span>
          </button>

          {/* Grid trick for smooth height animation */}
          <div style={{
            display: "grid",
            gridTemplateRows: open === i ? "1fr" : "0fr",
            transition: "grid-template-rows 0.32s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ padding: "0 24px 20px" }}>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
