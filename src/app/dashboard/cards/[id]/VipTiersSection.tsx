"use client";

import { useState, useEffect, useCallback } from "react";

interface VipTier {
  id: string;
  tier_name: string;
  stamps_required: number;
  reward_description: string;
  discount_percentage: number | null;
  position: number;
}

const DEFAULT_TIERS = [
  { tier_name: "Régulier", stamps_required: 0, reward_description: "Membre fidèle", discount_percentage: null },
  { tier_name: "Bronze", stamps_required: 10, reward_description: "Café offert", discount_percentage: null },
  { tier_name: "Argent", stamps_required: 20, reward_description: "Réduction spéciale", discount_percentage: 10 },
  { tier_name: "Or", stamps_required: 50, reward_description: "Réduction VIP", discount_percentage: 20 },
  { tier_name: "VIP", stamps_required: 100, reward_description: "30% réduction + accès prioritaire", discount_percentage: 30 },
];

export default function VipTiersSection({ cardId }: { cardId: string }) {
  const [tiers, setTiers] = useState<VipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for adding / editing
  const [form, setForm] = useState({
    tier_name: "",
    stamps_required: 0,
    reward_description: "",
    discount_percentage: "",
  });

  const fetchTiers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vip-tiers?card_id=${cardId}`);
      const data = await res.json() as { tiers?: VipTier[]; error?: string };
      if (data.tiers) setTiers(data.tiers);
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => { fetchTiers(); }, [fetchTiers]);

  const resetForm = () => setForm({ tier_name: "", stamps_required: 0, reward_description: "", discount_percentage: "" });

  const startEdit = (tier: VipTier) => {
    setEditingId(tier.id);
    setForm({
      tier_name: tier.tier_name,
      stamps_required: tier.stamps_required,
      reward_description: tier.reward_description,
      discount_percentage: tier.discount_percentage?.toString() ?? "",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        tier_name: form.tier_name.trim(),
        stamps_required: Number(form.stamps_required),
        reward_description: form.reward_description.trim(),
        discount_percentage: form.discount_percentage !== "" ? Number(form.discount_percentage) : null,
      };

      if (editingId) {
        await fetch(`/api/vip-tiers/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setEditingId(null);
      } else {
        await fetch("/api/vip-tiers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card_id: cardId, ...payload }),
        });
      }
      resetForm();
      await fetchTiers();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce palier ?")) return;
    await fetch(`/api/vip-tiers/${id}`, { method: "DELETE" });
    await fetchTiers();
  };

  const handleMoveUp = async (tier: VipTier, index: number) => {
    if (index === 0) return;
    const prev = tiers[index - 1];
    await Promise.all([
      fetch(`/api/vip-tiers/${tier.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: prev.position }) }),
      fetch(`/api/vip-tiers/${prev.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: tier.position }) }),
    ]);
    await fetchTiers();
  };

  const handleMoveDown = async (tier: VipTier, index: number) => {
    if (index === tiers.length - 1) return;
    const next = tiers[index + 1];
    await Promise.all([
      fetch(`/api/vip-tiers/${tier.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: next.position }) }),
      fetch(`/api/vip-tiers/${next.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: tier.position }) }),
    ]);
    await fetchTiers();
  };

  const handleLoadDefaults = async () => {
    if (!confirm("Charger les paliers par défaut ? Les paliers existants seront conservés.")) return;
    setSaving(true);
    try {
      for (const t of DEFAULT_TIERS) {
        await fetch("/api/vip-tiers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card_id: cardId, ...t }),
        });
      }
      await fetchTiers();
    } finally {
      setSaving(false);
    }
  };

  const TIER_COLORS = ["#9CA3AF", "#CD7F32", "#C0C0C0", "#FFD700", "#8B5CF6"];
  const tierColor = (i: number) => TIER_COLORS[i % TIER_COLORS.length];

  return (
    <div className="rounded-2xl border p-8 shadow-sm" style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            👑 Paliers VIP
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Pro / Business</span>
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--dash-muted)" }}>
            Récompensez vos clients fidèles avec des paliers progressifs.
          </p>
        </div>
        {tiers.length === 0 && !loading && (
          <button
            onClick={handleLoadDefaults}
            disabled={saving}
            className="text-sm px-4 py-2 rounded-xl border font-medium transition-colors"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          >
            ✨ Paliers suggérés
          </button>
        )}
      </div>

      {/* Existing tiers */}
      {loading ? (
        <div className="text-sm py-6 text-center" style={{ color: "var(--dash-muted)" }}>Chargement…</div>
      ) : tiers.length === 0 ? (
        <div className="text-sm py-6 text-center rounded-xl border border-dashed" style={{ color: "var(--dash-muted)", borderColor: "var(--dash-border)" }}>
          Aucun palier VIP. Ajoutez-en un ci-dessous ou utilisez les paliers suggérés.
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {tiers.map((tier, i) => (
            <div
              key={tier.id}
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)" }}
            >
              {/* Color dot */}
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tierColor(i) }} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--dash-text)" }}>
                  {tier.tier_name}
                  {tier.discount_percentage != null && (
                    <span className="ml-2 text-xs font-medium text-green-600">-{tier.discount_percentage}%</span>
                  )}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--dash-muted)" }}>
                  🏷 {tier.stamps_required} tampons · {tier.reward_description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleMoveUp(tier, i)} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-xs">↑</button>
                <button onClick={() => handleMoveDown(tier, i)} disabled={i === tiers.length - 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-xs">↓</button>
                <button
                  onClick={() => startEdit(tier)}
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 text-xs font-medium"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(tier.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 text-xs font-medium"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      <div
        className="rounded-xl border p-5 space-y-4"
        style={{ background: editingId ? "rgba(99,102,241,0.04)" : "var(--dash-bg)", borderColor: "var(--dash-border)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
          {editingId ? "✏️ Modifier le palier" : "➕ Ajouter un palier"}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--dash-muted)" }}>Nom du palier</label>
            <input
              type="text"
              placeholder="Ex: Or"
              value={form.tier_name}
              onChange={(e) => setForm(f => ({ ...f, tier_name: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "var(--dash-muted)" }}>Tampons cumulés requis</label>
            <input
              type="number"
              min={0}
              value={form.stamps_required}
              onChange={(e) => setForm(f => ({ ...f, stamps_required: Number(e.target.value) }))}
              className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "var(--dash-muted)" }}>Description de la récompense</label>
          <input
            type="text"
            placeholder="Ex: Café offert à chaque visite"
            value={form.reward_description}
            onChange={(e) => setForm(f => ({ ...f, reward_description: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "var(--dash-muted)" }}>Réduction % (optionnel)</label>
          <input
            type="number"
            min={0}
            max={100}
            placeholder="Ex: 10"
            value={form.discount_percentage}
            onChange={(e) => setForm(f => ({ ...f, discount_percentage: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !form.tier_name.trim() || !form.reward_description.trim()}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ background: "var(--dash-accent)" }}
          >
            {saving ? "Enregistrement…" : editingId ? "Mettre à jour" : "Ajouter le palier"}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); resetForm(); }}
              className="px-4 py-2 rounded-xl text-sm font-medium border"
              style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
