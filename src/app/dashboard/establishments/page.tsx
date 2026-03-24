"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardNav from "@/components/DashboardNav";

interface Establishment {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string | null;
}

const EMPTY: Omit<Establishment, "id"> = {
  name: "", address: "", city: "", postal_code: "", phone: "",
};

export default function EstablishmentsPage() {
  const router = useRouter();
  const [list, setList]           = useState<Establishment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [plan, setPlan]           = useState<string | null>(null);
  const [editing, setEditing]     = useState<Establishment | null>(null);
  const [creating, setCreating]   = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const MAX = 10;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }

      const { data: biz } = await supabase
        .from("businesses")
        .select("plan")
        .eq("id", user.id)
        .single();

      setPlan(biz?.plan ?? null);

      if (biz?.plan !== "business") {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("establishments")
        .select("id, name, address, city, postal_code, phone")
        .eq("business_id", user.id)
        .order("created_at");

      setList(data ?? []);
      setLoading(false);
    });
  }, [router]);

  const openCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null); setError(null); };
  const openEdit   = (e: Establishment) => { setEditing(e); setForm({ name: e.name, address: e.address ?? "", city: e.city ?? "", postal_code: e.postal_code ?? "", phone: e.phone ?? "" }); setCreating(false); setError(null); };
  const closePanel = () => { setEditing(null); setCreating(false); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Le nom est obligatoire."); return; }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (creating) {
      const { data, error: err } = await supabase
        .from("establishments")
        .insert({ business_id: user.id, ...form })
        .select()
        .single();
      if (err) { setError(err.message); setSaving(false); return; }
      setList((prev) => [...prev, data]);
    } else if (editing) {
      const { error: err } = await supabase
        .from("establishments")
        .update(form)
        .eq("id", editing.id);
      if (err) { setError(err.message); setSaving(false); return; }
      setList((prev) => prev.map((x) => x.id === editing.id ? { ...x, ...form } : x));
    }

    setSaving(false);
    closePanel();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet établissement ?")) return;
    const supabase = createClient();
    await supabase.from("establishments").delete().eq("id", id);
    setList((prev) => prev.filter((x) => x.id !== id));
    if (editing?.id === id) closePanel();
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
        <DashboardNav />
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (plan !== "business") {
    return (
      <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
        <DashboardNav />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-5xl mb-4">🏢</p>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Multi-établissements</h1>
          <p className="text-gray-500 mb-6">
            Cette fonctionnalité est réservée au plan <strong>Business</strong>.
          </p>
          <a
            href="mailto:contact@stampify.ch?subject=Demande%20forfait%20Business"
            className="inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Nous contacter pour le plan Business
          </a>
        </main>
      </div>
    );
  }

  const showForm = creating || !!editing;

  return (
    <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black" style={{ color: "var(--dash-text)" }}>Établissements</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--dash-muted)" }}>
              {list.length} / {MAX} établissements
            </p>
          </div>
          {!showForm && list.length < MAX && (
            <button
              onClick={openCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              + Ajouter
            </button>
          )}
        </div>

        {/* Form panel */}
        {showForm && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 space-y-4">
            <p className="font-bold text-gray-900">{creating ? "Nouvel établissement" : "Modifier"}</p>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nom *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Boutique Centre-Ville" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Adresse</label>
                <input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="12 rue de la Paix" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ville</label>
                <input value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Paris" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Code postal</label>
                <input value={form.postal_code ?? ""} onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="75001" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
                <input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+33 1 23 45 67 89" />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button type="button" onClick={closePanel}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5">
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* List */}
        {list.length === 0 && !showForm ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-4xl mb-3">🏢</p>
            <p className="font-semibold text-gray-700">Aucun établissement</p>
            <p className="text-sm text-gray-400 mt-1">Ajoutez vos établissements pour les associer à vos cartes de fidélité.</p>
            <button onClick={openCreate}
              className="mt-5 bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              + Ajouter un établissement
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((est) => (
              <div key={est.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{est.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {[est.address, est.postal_code, est.city].filter(Boolean).join(", ") || "Adresse non renseignée"}
                    {est.phone && ` · ${est.phone}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(est)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(est.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
