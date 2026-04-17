"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Mes clients doivent télécharger une application ?",
    a: "Non. Ils utilisent l'appareil photo de leur téléphone pour scanner le QR code. C'est tout — aucune app, aucune inscription.",
  },
  {
    q: "Combien de temps pour que mon site soit en ligne ?",
    a: "48 heures ouvrables à partir du moment où tu nous envoies tes photos et informations. On s'occupe de tout.",
  },
  {
    q: "Est-ce qu'il y a un abonnement obligatoire ?",
    a: "Non. Le pack Essentiel est un paiement unique de 990 CHF. L'hébergement de la première année est inclus. Le suivi mensuel à 49 CHF/mois est optionnel.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait ?",
    a: "On te rembourse intégralement dans les 14 jours. Sans question, sans condition.",
  },
  {
    q: "Vous travaillez uniquement en Suisse ?",
    a: "Principalement en Suisse romande, mais on travaille aussi avec des commerces en France voisine : Annecy, Annemasse, Thonon-les-Bains.",
  },
  {
    q: "Comment les tampons sont-ils ajoutés ?",
    a: "Tu reçois un QR code à afficher à ta caisse. Le client le scanne, le tampon s'ajoute en 3 secondes. Zéro manipulation de ton côté.",
  },
  {
    q: "Peut-on modifier le site après la livraison ?",
    a: "Oui. 2 révisions sont incluses dans le pack. Pour des modifications régulières, le suivi mensuel à 49 CHF/mois est fait pour ça.",
  },
  {
    q: "C'est quoi le socle NFC ?",
    a: "C'est l'unique objet physique qu'on te livre — un socle en bois avec la puce NFC et le QR code gravé. Posé sur ton comptoir, il remplace une caissette entière de cartes papier. Beau, durable, discret.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        borderBottom: "1px solid #f0f0f0",
        padding: "24px 0",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <span style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 600,
          fontSize: 18,
          color: "#0f172a",
          lineHeight: 1.4,
        }}>{q}</span>
        <span style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 22, fontWeight: 400,
          color: "#1d9e75",
          flexShrink: 0,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          display: "inline-block",
          lineHeight: 1,
        }}>{open ? "−" : "+"}</span>
      </div>
      <div style={{
        maxHeight: open ? 400 : 0,
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}>
        <p style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 16,
          color: "#64748b",
          lineHeight: 1.8,
          paddingTop: 16,
        }}>{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section style={{ background: "#FBF8F3", padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 700,
          fontSize: "clamp(28px, 3.5vw, 44px)",
          color: "#0f172a",
          textAlign: "center",
          marginBottom: 56,
        }}>
          Questions fréquentes.
        </h2>
        {FAQS.map((item, i) => (
          <FAQItem key={i} {...item} />
        ))}
      </div>
    </section>
  );
}
