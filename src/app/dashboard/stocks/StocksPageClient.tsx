"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MenuItemRow = {
  id: string;
  name: string;
  category_id: string | null;
  price: number;
  is_out_of_stock: boolean | null;
  out_of_stock_since: string | null;
  out_of_stock_reason: string | null;
  out_of_stock_auto_reactivate_at: string | null;
  is_available: boolean;
};

type Category = { id: string; name: string };

export default function StocksPageClient({ userId }: { userId: string }) {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "out_of_stock" | "available">("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      // Find restaurant
      const { data: rest } = await supabase
        .from("restaurants")
        .select("id")
        .eq("business_id", userId)
        .maybeSingle();
      if (!rest) {
        setLoading(false);
        return;
      }
      const [{ data: itms }, { data: cats }] = await Promise.all([
        supabase
          .from("menu_items")
          .select(
            "id, name, category_id, price, is_out_of_stock, out_of_stock_since, out_of_stock_reason, out_of_stock_auto_reactivate_at, is_available",
          )
          .eq("restaurant_id", rest.id)
          .order("name"),
        supabase
          .from("menu_categories")
          .select("id, name")
          .eq("restaurant_id", rest.id),
      ]);
      setItems((itms ?? []) as MenuItemRow[]);
      setCategories((cats ?? []) as Category[]);
      setLoading(false);
    })();
  }, [userId]);

  const categoryMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categories) m.set(c.id, c.name);
    return m;
  }, [categories]);

  const filtered = useMemo(() => {
    let arr = items;
    if (filter === "out_of_stock") arr = arr.filter((i) => i.is_out_of_stock);
    else if (filter === "available") arr = arr.filter((i) => !i.is_out_of_stock);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((i) => i.name.toLowerCase().includes(q));
    }
    return arr;
  }, [items, filter, search]);

  async function toggle(item: MenuItemRow, hours: number | null) {
    setTogglingId(item.id);
    try {
      const res = await fetch("/api/dashboard/menu/stock", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          menu_item_id: item.id,
          is_out_of_stock: !item.is_out_of_stock,
          auto_reactivate_hours: hours,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                is_out_of_stock: body.is_out_of_stock,
                out_of_stock_since: body.is_out_of_stock ? new Date().toISOString() : null,
                out_of_stock_auto_reactivate_at: body.auto_reactivate_at ?? null,
              }
            : i,
        ),
      );
    } catch (err) {
      console.error("[stock] toggle failed", err);
      alert("Erreur.");
    } finally {
      setTogglingId(null);
    }
  }

  const counts = useMemo(() => {
    const oos = items.filter((i) => i.is_out_of_stock).length;
    return { total: items.length, oos };
  }, [items]);

  if (loading) {
    return <div className="text-center text-gray-400">Chargement…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un plat…"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C73E1D] focus:outline-none md:flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "out_of_stock" | "available")}
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#C73E1D] focus:outline-none"
        >
          <option value="all">Tous ({counts.total})</option>
          <option value="available">Disponibles ({counts.total - counts.oos})</option>
          <option value="out_of_stock">Épuisés ({counts.oos})</option>
        </select>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Aucun plat.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((item) => {
              const catName = item.category_id ? categoryMap.get(item.category_id) : "";
              const oos = item.is_out_of_stock === true;
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{item.name}</div>
                      {oos && (
                        <span className="rounded-full bg-[#C73E1D] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Épuisé
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {catName ? `${catName} · ` : ""}
                      {Number(item.price).toFixed(2)} CHF
                      {oos && item.out_of_stock_auto_reactivate_at && (
                        <>
                          {" · "}
                          réactive le{" "}
                          {new Date(item.out_of_stock_auto_reactivate_at).toLocaleString("fr-CH", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {oos ? (
                      <button
                        type="button"
                        onClick={() => toggle(item, null)}
                        disabled={togglingId === item.id}
                        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Réactiver maintenant
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => toggle(item, 4)}
                          disabled={togglingId === item.id}
                          className="rounded-xl bg-[#F59E0B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                          title="Épuisé jusqu'à dans 4h"
                        >
                          Épuisé (4h)
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(item, 24)}
                          disabled={togglingId === item.id}
                          className="rounded-xl bg-[#C73E1D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                          title="Épuisé jusqu'à demain"
                        >
                          Épuisé (24h)
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(item, null)}
                          disabled={togglingId === item.id}
                          className="rounded-xl border-2 border-[#C73E1D] px-3 py-1.5 text-xs font-semibold text-[#C73E1D] hover:bg-[#C73E1D] hover:text-white disabled:opacity-60"
                          title="Épuisé jusqu'à réactivation manuelle"
                        >
                          Épuisé indéfini
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
