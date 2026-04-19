"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardNav from "@/components/DashboardNav";
import SMSLockCard from "@/components/SMSLockCard";

// 15 SMS trigger definitions
const SMS_TRIGGERS = [
  { id: "carte_complete", label: "Carte fidélité complétée", defaultMessage: "🎉 Félicitations ! Votre carte est complète. Venez récupérer votre récompense chez nous.", icon: "🎟️" },
  { id: "bienvenue", label: "Nouveau client inscrit", defaultMessage: "Bienvenue ! Merci de rejoindre notre programme fidélité. Votre 1ère visite compte double 🎁", icon: "👋" },
  { id: "inactif_3sem", label: "Inactif depuis 3 semaines", defaultMessage: "On ne vous a pas vu depuis un moment 😊 Revenez cette semaine et obtenez un tampon bonus !", icon: "⏰" },
  { id: "inactif_1mois", label: "Inactif depuis 1 mois", defaultMessage: "Vous nous manquez ! 💙 Votre prochain café est à -20% ce week-end. À bientôt !", icon: "💙" },
  { id: "mi_chemin", label: "À mi-chemin de la carte (5/10)", defaultMessage: "Vous êtes à mi-chemin ! Plus que 5 tampons pour votre récompense 🎯", icon: "🎯" },
  { id: "avant_dernier", label: "Avant-dernier tampon (9/10)", defaultMessage: "Plus qu'un tampon et votre récompense est à vous ! 🏆 On vous attend.", icon: "🏆" },
  { id: "anniversaire", label: "Anniversaire du client", defaultMessage: "Joyeux anniversaire ! 🎂 Un cadeau vous attend chez nous aujourd'hui.", icon: "🎂" },
  { id: "parrainage", label: "Parrainage réussi", defaultMessage: "Merci pour votre parrainage ! 🙏 Vous avez gagné 2 tampons bonus sur votre carte.", icon: "🙏" },
  { id: "nouveau_produit", label: "Nouveau produit/menu", defaultMessage: "Découvrez notre nouvelle carte du moment 🍽️ Disponible dès maintenant !", icon: "🆕" },
  { id: "fermeture_exceptionnelle", label: "Fermeture exceptionnelle", defaultMessage: "⚠️ Notre établissement sera exceptionnellement fermé demain. On vous retrouve mercredi !", icon: "⚠️" },
  { id: "evenement", label: "Événement spécial", defaultMessage: "🎉 Événement spécial ce week-end ! Venez nombreux, des surprises vous attendent.", icon: "🎉" },
  { id: "promo_weekend", label: "Promotion week-end", defaultMessage: "Ce week-end : profitez de -15% sur toute la carte 🎁 Offre valable sam. et dim.", icon: "💸" },
  { id: "roue_fortune", label: "Participation roue de la fortune", defaultMessage: "🎡 Vous avez une tentative sur notre roue de la fortune ! Connectez-vous pour jouer.", icon: "🎡" },
  { id: "loterie_gagnant", label: "Gagnant de la loterie", defaultMessage: "🎊 Félicitations ! Vous avez gagné le tirage de ce mois-ci. Venez récupérer votre prix.", icon: "🎊" },
  { id: "renouvellement_carte", label: "Carte expirée / renouvellement", defaultMessage: "Votre carte fidélité a été renouvelée 🔄 Continuez à cumuler pour vos prochaines récompenses !", icon: "🔄" },
];

export default function SmsDashboardPage() {
  const [hasAddon, setHasAddon] = useState<boolean | null>(null);
  const [triggers, setTriggers] = useState<Record<string, { enabled: boolean; message: string }>>(() => {
    const initial: Record<string, { enabled: boolean; message: string }> = {};
    SMS_TRIGGERS.forEach(t => {
      initial[t.id] = { enabled: false, message: t.defaultMessage };
    });
    return initial;
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campaign state
  const [campaignMessage, setCampaignMessage] = useState("");
  const [campaignAudience, setCampaignAudience] = useState<"all" | "loyal" | "inactive">("all");
  const [campaignScheduled, setCampaignScheduled] = useState(false);
  const [campaignDate, setCampaignDate] = useState("");
  const [campaignSending, setCampaignSending] = useState(false);
  const [campaignSent, setCampaignSent] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("businesses")
        .select("subscription_plan")
        .eq("id", user.id)
        .single();
      setHasAddon(data?.subscription_plan === "essential" || data?.subscription_plan === "pro");
    });
  }, []);

  const handleCampaignSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignSending(true);
    // In production, call /api/sms/campaign
    await new Promise(r => setTimeout(r, 1500));
    setCampaignSent(true);
    setCampaignSending(false);
  };

  const charCount = campaignMessage.length;
  const smsCount = Math.ceil(charCount / 160) || 1;

  // Add-on gate
  if (hasAddon === null) {
    return (
      <div style={{ background: "#FBF8F3", minHeight: "100vh" }}>
        <DashboardNav />
        <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <span style={{ color: "#6B6259", fontSize: 14 }}>Chargement…</span>
        </div>
      </div>
    );
  }

  if (!hasAddon) {
    return (
      <div style={{ background: "#FBF8F3", minHeight: "100vh" }}>
        <DashboardNav />
        <div className="py-8">
          <SMSLockCard />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FBF8F3", minHeight: "100vh" }}>
    <DashboardNav />
    <div style={{ padding: "24px", fontFamily: "'DM Sans', sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A1410", margin: "0 0 6px" }}>
          SMS & Automatisations
        </h1>
        <p style={{ fontSize: 14, color: "#6B6259", margin: 0 }}>Gérez vos déclencheurs automatiques et vos campagnes manuelles.</p>
      </div>

      {/* Section A — Triggers */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1410", marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid #E2D9CC" }}>
          Automatisations ({SMS_TRIGGERS.filter(t => triggers[t.id]?.enabled).length} actives)
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SMS_TRIGGERS.map((trigger) => {
            const state = triggers[trigger.id];
            const isEditing = editingId === trigger.id;
            return (
              <div key={trigger.id} style={{ background: "white", border: `1.5px solid ${state.enabled ? "#3D31B0" : "#E2D9CC"}`, borderRadius: 12, padding: "16px 20px", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{trigger.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1410" }}>{trigger.label}</div>
                    {!isEditing && (
                      <div style={{ fontSize: 12, color: "#9B8A7E", marginTop: 2, fontStyle: "italic" }}>{state.message}</div>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingId(isEditing ? null : trigger.id)}
                    style={{ background: "#F5F0E8", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#6B6259", cursor: "pointer" }}
                  >
                    {isEditing ? "Fermer" : "Modifier"}
                  </button>
                  {/* Toggle */}
                  <button
                    onClick={() => setTriggers(prev => ({ ...prev, [trigger.id]: { ...prev[trigger.id], enabled: !prev[trigger.id].enabled } }))}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      border: "none",
                      background: state.enabled ? "#3D31B0" : "#E2D9CC",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{
                      position: "absolute",
                      top: 2,
                      left: state.enabled ? 22 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "white",
                      transition: "left 0.2s",
                    }} />
                  </button>
                </div>
                {isEditing && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      value={state.message}
                      onChange={(e) => setTriggers(prev => ({ ...prev, [trigger.id]: { ...prev[trigger.id], message: e.target.value } }))}
                      rows={3}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #3D31B0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                    />
                    <div style={{ fontSize: 11, color: "#9B8A7E", marginTop: 4 }}>{state.message.length} caractères · {Math.ceil(state.message.length / 160) || 1} SMS</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section B — Campaign */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1410", marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid #E2D9CC" }}>
          Envoyer une campagne manuelle
        </h2>
        {campaignSent ? (
          <div style={{ background: "#ECFDF5", border: "1px solid #10B981", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <p style={{ color: "#065F46", fontWeight: 600, fontSize: 15, margin: 0 }}>Campagne envoyée avec succès !</p>
            <button onClick={() => { setCampaignSent(false); setCampaignMessage(""); }} style={{ marginTop: 12, background: "none", border: "none", color: "#3D31B0", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
              Envoyer une nouvelle campagne
            </button>
          </div>
        ) : (
          <form onSubmit={handleCampaignSend} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1410", display: "block", marginBottom: 6 }}>Audience</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { val: "all", label: "Tous les clients" },
                  { val: "loyal", label: "Clients fidèles (5+ tampons)" },
                  { val: "inactive", label: "Inactifs (21+ jours)" },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setCampaignAudience(opt.val as typeof campaignAudience)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1.5px solid",
                      borderColor: campaignAudience === opt.val ? "#3D31B0" : "#E2D9CC",
                      background: campaignAudience === opt.val ? "#EEF0FC" : "white",
                      color: campaignAudience === opt.val ? "#3D31B0" : "#6B6259",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1410", display: "block", marginBottom: 6 }}>Message</label>
              <textarea
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                placeholder="Écrivez votre message SMS ici..."
                required
                rows={4}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: 12, color: "#9B8A7E", marginTop: 4 }}>
                {charCount}/160 caractères · {smsCount} SMS {charCount > 160 && <span style={{ color: "#F59E0B" }}>(SMS long — coût x{smsCount})</span>}
              </div>
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#1A1410", cursor: "pointer" }}>
                <input type="checkbox" checked={campaignScheduled} onChange={(e) => setCampaignScheduled(e.target.checked)} />
                Planifier l&apos;envoi
              </label>
              {campaignScheduled && (
                <input
                  type="datetime-local"
                  value={campaignDate}
                  onChange={(e) => setCampaignDate(e.target.value)}
                  style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2D9CC", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={campaignSending || !campaignMessage.trim()}
              style={{ background: "#3D31B0", color: "white", padding: "14px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: campaignSending || !campaignMessage.trim() ? "not-allowed" : "pointer", opacity: campaignSending || !campaignMessage.trim() ? 0.6 : 1 }}
            >
              {campaignSending ? "Envoi en cours…" : campaignScheduled ? "Planifier la campagne →" : "Envoyer maintenant →"}
            </button>
          </form>
        )}
      </section>

      {/* Section C — Stats */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1410", marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid #E2D9CC" }}>
          Statistiques SMS
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "SMS envoyés ce mois", value: "—", icon: "📤" },
            { label: "Taux d'ouverture moyen", value: "—", icon: "👁️" },
            { label: "Clients actifs", value: "—", icon: "👥" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A1410", marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#6B6259" }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#9B8A7E", marginTop: 12, fontStyle: "italic" }}>Les statistiques apparaîtront après votre première campagne.</p>
      </section>
    </div>
    </div>
  );
}
