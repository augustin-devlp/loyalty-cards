"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const WA_OBTENIR =
  "https://wa.me/41791342997?text=Bonjour%2C%20je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";
const WA_DEVIS =
  "https://wa.me/41791342997?text=Bonjour%2C%20je%20souhaite%20un%20devis%20sur%20mesure%20pour%20mon%20commerce.%20Pouvez-vous%20me%20contacter%20%3F";
const WA_SANS_ABONNEMENT =
  "https://wa.me/41791342997?text=Bonjour%2C%20je%20prends%20le%20forfait%20990%20CHF%20sans%20abonnement%20mensuel.%20Pouvez-vous%20me%20contacter%20%3F";

const SUBSCRIPTIONS = [
  {
    id: "none" as const,
    label: "Sans abonnement",
    price: 0,
    period: "",
    badge: null,
    features: [
      "Site livré en 48h",
      "2 retouches incluses (30 jours)",
      "Support par WhatsApp",
      "Accès au tableau de bord",
    ],
    cta: "Choisir sans abonnement",
    ctaStyle: "outline" as const,
    wa: WA_SANS_ABONNEMENT,
    plan: null,
  },
  {
    id: "standard" as const,
    label: "Standard",
    price: 49,
    period: "/mois",
    badge: "Le plus populaire",
    features: [
      "Tout le pack de base",
      "Campagnes SMS illimitées",
      "Mises à jour sur demande",
      "Rapport mensuel",
      "Support réactif",
    ],
    cta: "Choisir Standard",
    ctaStyle: "filled" as const,
    wa: null,
    plan: "essential" as const,
  },
  {
    id: "premium" as const,
    label: "Premium",
    price: 79,
    period: "/mois",
    badge: null,
    features: [
      "Tout le Standard",
      "Priorité support (< 4h)",
      "Campagnes push illimitées",
      "A/B testing contenu",
      "Rapport mensuel avancé",
    ],
    cta: "Choisir Premium",
    ctaStyle: "dark" as const,
    wa: null,
    plan: "pro" as const,
  },
] as const;

type SubscriptionId = (typeof SUBSCRIPTIONS)[number]["id"];

function SubscribeContent() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingId, setLoadingId] = useState<SubscriptionId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setIsChecking(false); return; }
      setIsLoggedIn(true);
      const { data: biz } = await supabase
        .from("businesses")
        .select("subscription_status")
        .eq("id", user.id)
        .single();
      if (biz?.subscription_status === "active") {
        router.push("/dashboard");
        return;
      }
      setIsChecking(false);
    });
  }, [router]);

  const handleSubscription = async (sub: (typeof SUBSCRIPTIONS)[number]) => {
    setError(null);

    // No subscription → WhatsApp
    if (sub.id === "none" || !sub.plan) {
      window.open(sub.wa ?? WA_SANS_ABONNEMENT, "_blank");
      return;
    }

    // Not logged in → signup page
    if (!isLoggedIn) {
      router.push(`/signup?plan=${sub.plan}`);
      return;
    }

    setLoadingId(sub.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: sub.plan, country: "CH" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur Stripe");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoadingId(null);
    }
  };

  if (isChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F0E8" }}>
        <span style={{ color: "#6B6259", fontSize: 14 }}>Chargement…</span>
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 48 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: step >= s ? "#3D31B0" : "#E2D9CC",
                color: step >= s ? "white" : "#9B8A7E",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                transition: "all 0.2s",
              }}>
                {step > s ? "✓" : s}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step >= s ? "#1A1410" : "#9B8A7E" }}>
                {s === 1 ? "Votre projet" : "Abonnement mensuel"}
              </span>
              {s < 2 && <div style={{ width: 40, height: 1, background: step >= 2 ? "#3D31B0" : "#E2D9CC" }} />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Étape 1 sur 2
              </div>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#1A1410", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
                Quel type de projet ?
              </h1>
              <p style={{ fontSize: 16, color: "#6B6259", lineHeight: 1.65 }}>
                Choisissez l&apos;option qui correspond à votre commerce.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="max-[640px]:!grid-cols-1">
              {/* Option A: 990 CHF */}
              <div
                style={{
                  background: "white",
                  border: "2px solid #3D31B0",
                  borderRadius: 20,
                  padding: "32px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "box-shadow 0.2s",
                  boxShadow: "0 4px 24px rgba(61,49,176,0.12)",
                }}
                onClick={() => setStep(2)}
              >
                <div style={{ position: "absolute", top: 16, right: 16, background: "#3D31B0", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.05em" }}>
                  Le plus courant
                </div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1410", margin: "0 0 8px 0" }}>
                  Forfait complet
                </h2>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 700, color: "#3D31B0", marginBottom: 4 }}>
                  990 CHF
                </div>
                <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 20 }}>Paiement unique · Livraison en moins de 48h</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[
                    "Site vitrine 5 pages à vos couleurs",
                    "Domaine .ch + hébergement 1ère année",
                    "Carte de fidélité digitale 10 cases",
                    "Plaquette NFC en bois gravée",
                    "QR code imprimable (A4 et A5)",
                    "SEO local complet",
                    "1 campagne SMS offerte",
                    "Tableau de bord analytics",
                    "2 retouches incluses",
                  ].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 14, color: "#1A1410" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#3D31B0", color: "white", padding: "14px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15 }}>
                  Choisir ce forfait →
                </div>
              </div>

              {/* Option B: Custom */}
              <div
                style={{
                  background: "white",
                  border: "1.5px solid #E2D9CC",
                  borderRadius: 20,
                  padding: "32px",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                }}
                onClick={() => window.open(WA_DEVIS, "_blank")}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>💬</div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1410", margin: "0 0 8px 0" }}>
                  Devis sur mesure
                </h2>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 700, color: "#1A1410", marginBottom: 4 }}>
                  Sur devis
                </div>
                <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 20 }}>Pour les projets spécifiques ou complexes</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[
                    "Multi-pages ou fonctionnalités avancées",
                    "E-commerce ou réservation complexe",
                    "Intégrations sur mesure",
                    "Accompagnement premium inclus",
                    "Délai et tarif négociés ensemble",
                  ].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#6B6259", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span style={{ fontSize: 14, color: "#6B6259" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={WA_DEVIS}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", background: "#25D366", color: "white", padding: "14px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15, textDecoration: "none" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Demander un devis WhatsApp →
                </a>
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: 13, color: "#6B6259", marginTop: 24 }}>
              📱 Réponse sous 2h · 7j/7 · +41 79 134 29 97
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Étape 2 sur 2
              </div>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1A1410", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
                Choisissez votre suivi mensuel
              </h1>
              <p style={{ fontSize: 16, color: "#6B6259", lineHeight: 1.65, maxWidth: 500, margin: "0 auto" }}>
                Le forfait 990 CHF est déjà complet. Ces add-ons sont optionnels et résiliables à tout moment.
              </p>
            </div>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", borderRadius: 10, padding: "12px 16px", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="max-[768px]:!grid-cols-1">
              {SUBSCRIPTIONS.map((sub) => {
                const isLoading = loadingId === sub.id;
                const isPopular = sub.id === "standard";
                const isDark = sub.id === "premium";

                const cardBg = isPopular ? "#3D31B0" : "white";
                const cardBorder = isPopular ? "#3D31B0" : isDark ? "#1A1410" : "#E2D9CC";
                const textColor = isPopular ? "white" : "#1A1410";
                const mutedColor = isPopular ? "rgba(255,255,255,0.7)" : "#6B6259";
                const checkColor = isPopular ? "rgba(255,255,255,0.8)" : "#3D31B0";

                return (
                  <div
                    key={sub.id}
                    style={{
                      background: isDark ? "#1A1410" : cardBg,
                      border: `2px solid ${cardBorder}`,
                      borderRadius: 20,
                      padding: "28px 24px",
                      position: "relative",
                      boxShadow: isPopular ? "0 8px 32px rgba(61,49,176,0.2)" : "none",
                    }}
                  >
                    {sub.badge && (
                      <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#F59E0B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                        {sub.badge}
                      </div>
                    )}

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isPopular ? "rgba(255,255,255,0.8)" : isDark ? "rgba(255,255,255,0.6)" : "#6B6259", marginBottom: 6 }}>
                        {sub.label}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 700, color: isPopular ? "white" : isDark ? "white" : "#1A1410", lineHeight: 1 }}>
                          {sub.price === 0 ? "Gratuit" : `${sub.price} CHF`}
                        </span>
                        {sub.period && (
                          <span style={{ fontSize: 14, color: mutedColor }}>{sub.period}</span>
                        )}
                      </div>
                      {sub.price > 0 && (
                        <div style={{ fontSize: 12, color: mutedColor, marginTop: 4 }}>
                          Sans engagement · Résiliable à tout moment
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                      {sub.features.map((f) => (
                        <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: isPopular ? "rgba(255,255,255,0.9)" : isDark ? "#F59E0B" : checkColor, fontWeight: 700, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 13, color: isPopular ? "rgba(255,255,255,0.85)" : isDark ? "rgba(255,255,255,0.75)" : "#374151" }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSubscription(sub)}
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: 10,
                        border: "none",
                        cursor: isLoading ? "default" : "pointer",
                        fontWeight: 700,
                        fontSize: 14,
                        transition: "all 0.15s",
                        opacity: isLoading ? 0.7 : 1,
                        background: isPopular ? "white" : isDark ? "#F59E0B" : "#3D31B0",
                        color: isPopular ? "#3D31B0" : isDark ? "#1A1410" : "white",
                      }}
                    >
                      {isLoading ? "Chargement…" : sub.cta}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                onClick={() => setStep(1)}
                style={{ background: "none", border: "none", color: "#6B6259", fontSize: 14, cursor: "pointer", textDecoration: "underline" }}
              >
                ← Retour à l&apos;étape précédente
              </button>
            </div>

            {!isLoggedIn && (
              <div style={{ background: "#EEF0FC", border: "1px solid #C7D2F8", borderRadius: 12, padding: "16px 20px", marginTop: 24, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#3D31B0", margin: 0 }}>
                  Vous n&apos;avez pas encore de compte.{" "}
                  <Link href="/signup" style={{ fontWeight: 700, color: "#3D31B0" }}>
                    Créer mon compte →
                  </Link>
                  {" "}(gratuit, en 2 minutes)
                </p>
              </div>
            )}

            <p style={{ textAlign: "center", fontSize: 13, color: "#6B6259", marginTop: 20 }}>
              Des questions ?{" "}
              <a href={WA_OBTENIR} target="_blank" rel="noopener noreferrer" style={{ color: "#3D31B0", fontWeight: 600 }}>
                Contactez-nous sur WhatsApp →
              </a>
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense>
      <SubscribeContent />
    </Suspense>
  );
}
