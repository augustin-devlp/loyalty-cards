"use client";

import type { CSSProperties, ChangeEvent } from "react";
import { useState, FormEvent } from "react";

const BUSINESS_TYPES = [
  "Café / Salon de thé",
  "Boulangerie / Pâtisserie",
  "Restaurant / Bistrot",
  "Salon de coiffure / Barbershop",
  "Spa / Institut de beauté",
  "Nail studio",
  "Fleuriste",
  "Autre commerce",
];

export default function SubscribePage() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    city: "",
    phone: "",
    type: "",
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = encodeURIComponent(
      `Bonjour ! Je souhaite créer mon site Stampify.\n\n` +
        `👤 Nom : ${form.name}\n` +
        `🏪 Commerce : ${form.business}\n` +
        `📍 Ville : ${form.city}\n` +
        `📞 Téléphone : ${form.phone}\n` +
        `🏷️ Type : ${form.type || "Non précisé"}\n\n` +
        `Je suis prêt(e) à démarrer. Quelles sont les prochaines étapes ?`
    );
    window.open(`https://wa.me/41791234567?text=${text}`, "_blank");
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    fontSize: "15px",
    border: "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: "12px",
    outline: "none",
    fontFamily: "inherit",
    color: "#0A0A0A",
    background: "#fff",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#0A0A0A",
    marginBottom: "6px",
    letterSpacing: "-0.01em",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        paddingBottom: "120px",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,247,242,0.6) 0%, #ffffff 70%)",
          paddingTop: "80px",
          paddingBottom: "60px",
          textAlign: "center",
          padding: "80px 24px 60px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#E8F7F2",
            border: "1px solid rgba(29,158,117,0.2)",
            borderRadius: "980px",
            padding: "6px 16px",
            fontSize: "13px",
            color: "#1d9e75",
            fontWeight: 500,
            marginBottom: "28px",
          }}
        >
          ✦ Livraison en 48h garantie
        </div>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "20px",
            color: "#0A0A0A",
          }}
        >
          Démarrons votre projet
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#6B7280",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Remplissez ce formulaire et nous vous contactons sur WhatsApp dans
          les 2 heures. 7j/7.
        </p>
      </div>

      {/* Form */}
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "24px",
            padding: "48px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.06)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Votre prénom et nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Sophie Dupont"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1d9e75")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")
                  }
                />
              </div>

              <div>
                <label htmlFor="business" style={labelStyle}>
                  Nom de votre commerce
                </label>
                <input
                  id="business"
                  name="business"
                  type="text"
                  required
                  placeholder="Café Lumière"
                  value={form.business}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1d9e75")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")
                  }
                />
              </div>

              <div>
                <label htmlFor="city" style={labelStyle}>
                  Ville
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder="Lausanne"
                  value={form.city}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1d9e75")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")
                  }
                />
              </div>

              <div>
                <label htmlFor="phone" style={labelStyle}>
                  Numéro WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+41 79 000 00 00"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1d9e75")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")
                  }
                />
              </div>

              <div>
                <label htmlFor="type" style={labelStyle}>
                  Type de commerce
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: "44px",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1d9e75")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")
                  }
                >
                  <option value="">Choisissez une catégorie</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "18px 32px",
                  background: "#1d9e75",
                  color: "#fff",
                  border: "none",
                  borderRadius: "980px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s, transform 0.15s",
                  fontFamily: "inherit",
                  marginTop: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0D7A5A";
                  e.currentTarget.style.transform = "scale(1.01)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1d9e75";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Démarrer sur WhatsApp →
              </button>
            </div>
          </form>

          <p
            style={{
              fontSize: "13px",
              color: "#6B7280",
              textAlign: "center",
              marginTop: "20px",
              lineHeight: 1.6,
            }}
          >
            📱 Réponse sous 2h · 7j/7 · ⚡ Livraison 48h garantie
          </p>
        </div>

        {/* Reassurance */}
        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {[
            { icon: "🔒", title: "Paiement sécurisé", desc: "990 CHF, une seule fois" },
            { icon: "⚡", title: "Livraison 48h", desc: "Chrono après validation" },
            { icon: "✏️", title: "2 retouches gratuites", desc: "Incluses dans le forfait" },
            { icon: "🌿", title: "100% propriétaire", desc: "Votre site, vos données" },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "#F9FAFB",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>
                {item.icon}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0A0A0A",
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
