"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image_url?: string;
}

const DEFAULT_CATEGORIES = ["Entrées", "Plats", "Desserts", "Boissons", "Formules"];

export default function MenuDashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setBusinessId(user.id);
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .eq("business_id", user.id)
        .order("category")
        .order("name");
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!businessId) return;
    const supabase = createClient();
    const channel = supabase
      .channel("menu-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items", filter: `business_id=eq.${businessId}` },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((item) =>
                item.id === (payload.new as MenuItem).id ? (payload.new as MenuItem) : item
              )
            );
          } else if (payload.eventType === "INSERT") {
            setItems((prev) => [...prev, payload.new as MenuItem]);
          } else if (payload.eventType === "DELETE") {
            setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [businessId]);

  const toggleAvailable = async (item: MenuItem) => {
    setSavingId(item.id);
    const supabase = createClient();
    await supabase
      .from("menu_items")
      .update({ available: !item.available })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
    );
    setSavingId(null);
  };

  const savePrice = async (item: MenuItem) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) return;
    setSavingId(item.id);
    const supabase = createClient();
    await supabase
      .from("menu_items")
      .update({ price: newPrice })
      .eq("id", item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, price: newPrice } : i))
    );
    setEditingId(null);
    setSavingId(null);
  };

  const categories = ["Tous", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const filtered = activeCategory === "Tous" ? items : items.filter((i) => i.category === activeCategory);

  if (loading) {
    return (
      <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <span style={{ color: "#6B6259", fontSize: 14 }}>Chargement du menu…</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", fontFamily: "'DM Sans', sans-serif", maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1A1410", margin: "0 0 6px" }}>
          Gestion du menu
        </h1>
        <p style={{ fontSize: 14, color: "#6B6259", margin: 0 }}>
          Gérez la disponibilité et les prix de vos produits en temps réel.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total produits", value: items.length, icon: "📋" },
          { label: "Disponibles", value: items.filter((i) => i.available).length, icon: "✅" },
          { label: "Épuisés", value: items.filter((i) => !i.available).length, icon: "⛔" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#1A1410" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B6259" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "7px 16px",
              borderRadius: 999,
              border: "1.5px solid",
              borderColor: activeCategory === cat ? "#3D31B0" : "#E2D9CC",
              background: activeCategory === cat ? "#EEF0FC" : "white",
              color: activeCategory === cat ? "#3D31B0" : "#6B6259",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p style={{ color: "#6B6259", fontSize: 15, margin: 0 }}>
            Aucun produit dans cette catégorie.
          </p>
          <p style={{ color: "#9B8A7E", fontSize: 13, marginTop: 8 }}>
            Les produits sont ajoutés via votre panneau d&apos;administration Supabase ou l&apos;API.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((item) => {
            const isEditing = editingId === item.id;
            const isSaving = savingId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  background: "white",
                  border: `1.5px solid ${!item.available ? "#FCA5A5" : "#E2D9CC"}`,
                  borderRadius: 12,
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: !item.available ? 0.75 : 1,
                  transition: "opacity 0.2s, border-color 0.2s",
                }}
              >
                {/* Name + category */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1410" }}>{item.name}</div>
                  {item.description && (
                    <div style={{ fontSize: 12, color: "#9B8A7E", marginTop: 1 }}>{item.description}</div>
                  )}
                  {item.category && (
                    <span style={{ display: "inline-block", background: "#F5F0E8", color: "#6B6259", fontSize: 10, fontWeight: 600, padding: "1px 8px", borderRadius: 999, marginTop: 4 }}>
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div style={{ minWidth: 80, textAlign: "right" }}>
                  {isEditing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        type="number"
                        step="0.50"
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: 64, padding: "4px 8px", borderRadius: 6, border: "1.5px solid #3D31B0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", textAlign: "right" }}
                        autoFocus
                      />
                      <button
                        onClick={() => savePrice(item)}
                        disabled={isSaving}
                        style={{ background: "#3D31B0", color: "white", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ background: "#F5F0E8", color: "#6B6259", border: "none", borderRadius: 6, padding: "4px 6px", fontSize: 12, cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(item.id); setEditPrice(item.price.toFixed(2)); }}
                      style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#1A1410", background: "none", border: "none", cursor: "pointer", textDecoration: "underline dotted" }}
                      title="Cliquer pour modifier le prix"
                    >
                      {item.price.toFixed(2)} CHF
                    </button>
                  )}
                </div>

                {/* Status badge */}
                <div style={{ minWidth: 90 }}>
                  <span style={{
                    display: "inline-block",
                    background: item.available ? "#ECFDF5" : "#FEF2F2",
                    color: item.available ? "#065F46" : "#991B1B",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}>
                    {item.available ? "Disponible" : "Épuisé"}
                  </span>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleAvailable(item)}
                  disabled={isSaving}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    border: "none",
                    background: item.available ? "#3D31B0" : "#E2D9CC",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                    opacity: isSaving ? 0.6 : 1,
                  }}
                  title={item.available ? "Marquer épuisé" : "Marquer disponible"}
                >
                  <span style={{
                    position: "absolute",
                    top: 2,
                    left: item.available ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                  }} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: 12, color: "#9B8A7E", marginTop: 16, fontStyle: "italic" }}>
        Les modifications sont instantanément visibles sur votre site vitrine via Supabase Realtime.
      </p>
    </div>
  );
}
