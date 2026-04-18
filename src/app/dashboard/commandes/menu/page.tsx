"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import { RIALTO_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { MenuCategoryRow, MenuItemRow } from "@/lib/orderTypes";
import { formatCHF } from "@/lib/orderFormat";

export default function MenuEditorPage() {
  const [categories, setCategories] = useState<MenuCategoryRow[]>([]);
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuItemRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const sb = createClient();
    const [catRes, itRes] = await Promise.all([
      sb.from("menu_categories").select("*").eq("restaurant_id", RIALTO_ID).order("display_order"),
      sb.from("menu_items").select("*").eq("restaurant_id", RIALTO_ID).order("display_order"),
    ]);
    const cats = (catRes.data ?? []) as MenuCategoryRow[];
    setCategories(cats);
    setItems((itRes.data ?? []) as MenuItemRow[]);
    if (!selectedCat && cats.length) setSelectedCat(cats[0].id);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentItems = useMemo(
    () => items.filter((i) => i.category_id === selectedCat),
    [items, selectedCat],
  );

  async function toggleAvailability(item: MenuItemRow) {
    const next = !item.is_available;
    setItems((list) =>
      list.map((i) => (i.id === item.id ? { ...i, is_available: next } : i)),
    );
    await fetch(`/api/menu/items/${item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ is_available: next }),
    });
  }

  async function deleteItem(item: MenuItemRow) {
    if (!confirm(`Supprimer "${item.name}" ? Cette action est irréversible.`)) return;
    await fetch(`/api/menu/items/${item.id}`, { method: "DELETE" });
    setItems((list) => list.filter((i) => i.id !== item.id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pb-28 md:pb-8">
        <header className="border-b border-gray-200 bg-white px-4 py-4 md:px-8">
          <h1 className="text-2xl font-black tracking-tight">Menu Rialto</h1>
          <p className="mt-0.5 text-sm text-gray-600">
            Activez/désactivez des plats, ajustez prix et descriptions.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 p-4 md:p-8">
          <aside className="md:w-64 shrink-0">
            <div className="rounded-2xl border border-gray-200 bg-white p-2">
              <ul className="space-y-0.5">
                {categories.map((cat) => {
                  const count = items.filter((i) => i.category_id === cat.id).length;
                  const active = selectedCat === cat.id;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedCat(cat.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>
                          {cat.icon && <span className="mr-1">{cat.icon}</span>}
                          {cat.name}
                        </span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {categories.find((c) => c.id === selectedCat)?.name ?? ""}
                <span className="ml-2 text-sm font-medium text-gray-500">
                  ({currentItems.length} plats)
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black"
              >
                + Ajouter un plat
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Chargement…
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {currentItems.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-xl border bg-white p-3 transition ${
                      item.is_available ? "border-gray-200" : "border-red-200 opacity-60"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold leading-tight">{item.name}</div>
                        {item.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-sm font-bold">
                        {formatCHF(item.price)}
                      </div>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {item.is_vegetarian && (
                        <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                          🌱 Vég
                        </span>
                      )}
                      {item.is_spicy && (
                        <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                          🌶️ Épicé
                        </span>
                      )}
                      {item.has_options && (
                        <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                          ⚙️ Options
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(item)}
                        className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          item.is_available
                            ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                            : "bg-red-100 text-red-900 hover:bg-red-200"
                        }`}
                      >
                        {item.is_available ? "✓ Dispo" : "⛔ Indispo"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(item)}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        🗑
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {editing && (
          <ItemEditor
            item={editing}
            onSaved={(next) => {
              setItems((list) => list.map((i) => (i.id === next.id ? next : i)));
              setEditing(null);
            }}
            onClose={() => setEditing(null)}
          />
        )}

        {creating && selectedCat && (
          <ItemCreator
            categoryId={selectedCat}
            onCreated={(next) => {
              setItems((list) => [...list, next]);
              setCreating(false);
            }}
            onClose={() => setCreating(false)}
          />
        )}
      </main>
    </div>
  );
}

function ItemEditor({
  item,
  onSaved,
  onClose,
}: {
  item: MenuItemRow;
  onSaved: (next: MenuItemRow) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: item.name,
    description: item.description ?? "",
    price: Number(item.price),
    is_vegetarian: item.is_vegetarian,
    is_spicy: item.is_spicy,
  });
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const res = await fetch(`/api/menu/items/${item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        description: form.description || null,
      }),
    });
    setBusy(false);
    if (res.ok) {
      const body = (await res.json()) as { item: MenuItemRow };
      onSaved(body.item);
    } else {
      alert("Échec de la sauvegarde");
    }
  }

  return (
    <Modal onClose={onClose} title={`Modifier "${item.name}"`}>
      <ItemForm form={form} setForm={setForm} />
      <ModalFooter onClose={onClose} onSave={save} busy={busy} />
    </Modal>
  );
}

function ItemCreator({
  categoryId,
  onCreated,
  onClose,
}: {
  categoryId: string;
  onCreated: (item: MenuItemRow) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    is_vegetarian: false,
    is_spicy: false,
  });
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!form.name || form.price <= 0) {
      alert("Nom et prix requis.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/menu/items", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        restaurant_id: RIALTO_ID,
        category_id: categoryId,
        ...form,
        description: form.description || null,
      }),
    });
    setBusy(false);
    if (res.ok) {
      const body = (await res.json()) as { item: MenuItemRow };
      onCreated(body.item);
    } else {
      alert("Échec de la création");
    }
  }

  return (
    <Modal onClose={onClose} title="Ajouter un plat">
      <ItemForm form={form} setForm={setForm} />
      <ModalFooter onClose={onClose} onSave={save} busy={busy} />
    </Modal>
  );
}

function ItemForm({
  form,
  setForm,
}: {
  form: {
    name: string;
    description: string;
    price: number;
    is_vegetarian: boolean;
    is_spicy: boolean;
  };
  setForm: (v: typeof form) => void;
}) {
  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400";
  return (
    <div className="space-y-3 p-5">
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Nom</label>
        <input
          className={input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">
          Description
        </label>
        <textarea
          rows={2}
          className={`${input} resize-none`}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">
          Prix (CHF)
        </label>
        <input
          type="number"
          step="0.5"
          min={0}
          className={input}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
        />
      </div>
      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_vegetarian}
            onChange={(e) => setForm({ ...form, is_vegetarian: e.target.checked })}
          />
          🌱 Végétarien
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_spicy}
            onChange={(e) => setForm({ ...form, is_spicy: e.target.checked })}
          />
          🌶️ Épicé
        </label>
      </div>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <header className="flex items-center justify-between border-b border-gray-100 p-4">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

function ModalFooter({
  onClose,
  onSave,
  busy,
}: {
  onClose: () => void;
  onSave: () => void | Promise<void>;
  busy: boolean;
}) {
  return (
    <footer className="flex justify-end gap-2 border-t border-gray-100 p-4">
      <button
        type="button"
        onClick={onClose}
        className="rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        Annuler
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => void onSave()}
        className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
      >
        {busy ? "…" : "Enregistrer"}
      </button>
    </footer>
  );
}
