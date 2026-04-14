"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const SUBSCRIPTIONS = [
  {
    id: "none" as const,
    label: "SANS ABONNEMENT",
    sublabel: "Je gère en autonomie",
    price: 0,
    period: "",
    badge: null,
    badgeColor: null,
    features: [
      "Accès complet au dashboard Stampify",
      "Gestion en autonomie",
    ],
    cta: "Continuer sans abonnement",
    plan: null as string | null,
  },
  {
    id: "standard" as const,
    label: "ESSENTIEL",
    sublabel: null,
    price: 49,
    period: "/mois",
    badge: null,
    badgeColor: null,
    features: [
      "1 campagne SMS/mois rédigée par nous",
      "Rapport mensuel des performances",
      "Mises à jour mineures incluses",
      "Support par email",
    ],
    cta: "Choisir Essentiel",
    plan: "essential" as string | null,
  },
  {
    id: "premium" as const,
    label: "PRO",
    sublabel: null,
    price: 79,
    period: "/mois",
    badge: "RECOMMANDÉ",
    badgeColor: "#F59E0B",
    features: [
      "Tout l'Essentiel",
      "2 campagnes SMS/mois",
      "Support prioritaire réponse sous 4h",
      "Modifications avancées incluses",
      "Revue stratégique trimestrielle",
    ],
    cta: "Choisir Pro",
    plan: "pro" as string | null,
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

  // Devis form state
  const [showDevis, setShowDevis] = useState(false);
  const [devisFirstname, setDevisFirstname] = useState("");
  const [devisEmail, setDevisEmail] = useState("");
  const [devisDescription, setDevisDescription] = useState("");
  const [devisSending, setDevisSending] = useState(false);
  const [devisSent, setDevisSent] = useState(false);
  const [devisError, setDevisError] = useState<string | null>(null);

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

    if (sub.id === "none" || !sub.plan) {
      // For no subscription, redirect to signup or dashboard
      if (!isLoggedIn) {
        router.push("/signup");
      } else {
        router.push("/dashboard");
      }
      return;
    }

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

  const handleDevisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDevisSending(true);
    setDevisError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname: devisFirstname, email: devisEmail, description: devisDescription }),
      });
      if (!res.ok) throw new Error("Erreur envoi");
      setDevisSent(true);
    } catch {
      setDevisError("Une erreur est survenue. Contactez-nous sur WhatsApp.");
    } finally {
      setDevisSending(false);
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
              {/* Card A — Forfait Complet 990 CHF */}
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
                <div style={{ position: "absolute", top: 16, right: 16, background: "#22C55E", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.05em" }}>
                  MEILLEUR CHOIX
                </div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1410", margin: "0 0 8px 0" }}>
                  Forfait Complet
                </h2>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 700, color: "#3D31B0", marginBottom: 4 }}>
                  990 CHF
                </div>
                <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 20 }}>Paiement unique · Livraison en moins de 48h</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[
                    "Site vitrine 5 pages",
                    "Carte fidélité digitale 10 cases",
                    "Plaquette NFC en bois gravée",
                    "SEO local optimisé",
                    "Domaine .ch + hébergement 1ère année",
                    "QR code A4/A5",
                    "1 campagne SMS offerte",
                    "2 retouches incluses",
                    "Guide vidéo d'utilisation",
                    "Livraison en 48h garantie",
                  ].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 14, color: "#1A1410" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#3D31B0", color: "white", padding: "14px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15 }}>
                  Commencer maintenant →
                </div>
              </div>

              {/* Card B — Sur Mesure */}
              <div
                style={{
                  background: "white",
                  border: "1.5px solid #E2D9CC",
                  borderRadius: 20,
                  padding: "32px",
                  transition: "box-shadow 0.2s",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>💬</div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1410", margin: "0 0 4px 0" }}>
                  Sur Mesure
                </h2>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 700, color: "#1A1410", marginBottom: 4 }}>
                  Devis gratuit
                </div>
                <div style={{ fontSize: 13, color: "#6B6259", marginBottom: 20 }}>Back-end, SAAS, 3D, inventaire...</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[
                    "Développement back-end sur mesure",
                    "Intégrations API complexes",
                    "Applications web avancées",
                    "Prix selon complexité",
                  ].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 14, color: "#1A1410" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Inline devis form */}
                {!showDevis && !devisSent && (
                  <button
                    onClick={() => setShowDevis(true)}
                    style={{ width: "100%", background: "#1A1410", color: "white", padding: "14px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
                  >
                    Demander un devis →
                  </button>
                )}

                {showDevis && !devisSent && (
                  <form onSubmit={handleDevisSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      type="text"
                      placeholder="Prénom *"
                      value={devisFirstname}
                      onChange={(e) => setDevisFirstname(e.target.value)}
                      required
                      style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={devisEmail}
                      onChange={(e) => setDevisEmail(e.target.value)}
                      required
                      style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                    />
                    <textarea
                      placeholder="Description de votre projet *"
                      value={devisDescription}
                      onChange={(e) => setDevisDescription(e.target.value)}
                      required
                      rows={4}
                      style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical" }}
                    />
                    {devisError && <p style={{ color: "#991B1B", fontSize: 13, margin: 0 }}>{devisError}</p>}
                    <button
                      type="submit"
                      disabled={devisSending}
                      style={{ background: "#3D31B0", color: "white", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: devisSending ? "not-allowed" : "pointer", opacity: devisSending ? 0.7 : 1 }}
                    >
                      {devisSending ? "Envoi en cours…" : "Envoyer ma demande →"}
                    </button>
                  </form>
                )}

                {devisSent && (
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
                Votre site est prêt.
              </h1>
              <p style={{ fontSize: 16, color: "#6B6259", lineHeight: 1.65, maxWidth: 500, margin: "0 auto" }}>
                Option de suivi à partir du 2ème mois. Sans engagement.
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
                const isEssentiel = sub.id === "standard";
                const isPro = sub.id === "premium";

                return (
                  <div
                    key={sub.id}
                    style={{
                      background: isEssentiel ? "#3D31B0" : "white",
                      border: `2px solid ${isEssentiel ? "#3D31B0" : isPro ? "#1A1410" : "#E2D9CC"}`,
                      borderRadius: 20,
                      padding: "28px 24px",
                      position: "relative",
                      boxShadow: isEssentiel ? "0 8px 32px rgba(61,49,176,0.2)" : "none",
                    }}
                  >
                    {sub.badge && (
                      <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: sub.badgeColor ?? "#F59E0B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                        {sub.badge}
                      </div>
                    )}

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isEssentiel ? "rgba(255,255,255,0.7)" : "#6B6259", marginBottom: 2, letterSpacing: "0.04em" }}>
                        {sub.label}
                      </div>
                      {sub.sublabel && (
                        <div style={{ fontSize: 12, color: isEssentiel ? "rgba(255,255,255,0.55)" : "#9B8A7E", marginBottom: 8, fontStyle: "italic" }}>
                          {sub.sublabel}
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 700, color: isEssentiel ? "white" : isPro ? "#1A1410" : "#1A1410", lineHeight: 1 }}>
                          {sub.price === 0 ? "0 CHF" : `${sub.price} CHF`}
                        </span>
                        {sub.period && (
                          <span style={{ fontSize: 14, color: isEssentiel ? "rgba(255,255,255,0.7)" : "#6B6259" }}>{sub.period}</span>
                        )}
                      </div>
                      {sub.price > 0 && (
                        <div style={{ fontSize: 12, color: isEssentiel ? "rgba(255,255,255,0.55)" : "#6B6259", marginTop: 4 }}>
                          Sans engagement · Résiliable à tout moment
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                      {sub.features.map((f) => (
                        <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: isEssentiel ? "rgba(255,255,255,0.9)" : "#3D31B0", fontWeight: 700, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 13, color: isEssentiel ? "rgba(255,255,255,0.85)" : "#374151" }}>{f}</span>
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
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.7 : 1,
                        border: "none",
                        background: isEssentiel ? "white" : isPro ? "#1A1410" : "#F5F0E8",
                        color: isEssentiel ? "#3D31B0" : isPro ? "white" : "#1A1410",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "opacity 0.2s",
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
                ← Retour au choix du forfait
              </button>
            </div>
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
