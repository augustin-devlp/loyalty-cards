"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import DashboardNav from "@/components/DashboardNav";

interface Employee {
  id: string;
  name: string;
  email: string;
  invite_accepted: boolean;
  created_at: string;
}

const MAX_EMPLOYEES = 5;

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: biz }, { data: emps }] = await Promise.all([
      supabase.from("businesses").select("plan, subscription_status").eq("id", user.id).single(),
      supabase.from("employees").select("id, name, email, invite_accepted, created_at").eq("business_id", user.id).order("created_at"),
    ]);

    // FIX : Équipe déverrouillée pour tous les plans actifs (seul SMS reste Pro).
    setIsPro(biz?.subscription_status === "active");
    setEmployees(emps ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setFormError(null);
    setFormSuccess(null);

    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error);
    } else {
      setFormSuccess(`Invitation envoyée à ${form.email}`);
      setForm({ name: "", email: "" });
      await load();
    }
    setInviting(false);
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Supprimer ${name} de l'équipe ?`)) return;
    setRemoving(id);
    await fetch("/api/team/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: id }),
    });
    await load();
    setRemoving(null);
  };

  return (
    <div>
      <DashboardNav />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm transition-colors" style={{ color: "var(--dash-muted)" }}>
            ← Tableau de bord
          </Link>
          <span style={{ color: "var(--dash-border)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>Équipe</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>Mon équipe</h1>
          {!loading && (
            <span className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ background: "var(--dash-accent-sub)", color: "var(--dash-accent)" }}>
              {employees.length}/{MAX_EMPLOYEES} employés
            </span>
          )}
        </div>

        {/* Pro gate */}
        {!loading && !isPro && (
          <div className="rounded-2xl border-2 border-dashed p-8 text-center space-y-3"
            style={{ borderColor: "var(--dash-border)" }}>
            <p className="text-2xl">👥</p>
            <p className="font-semibold" style={{ color: "var(--dash-text)" }}>
              Fonctionnalité réservée au plan Pro
            </p>
            <p className="text-sm" style={{ color: "var(--dash-muted)" }}>
              Invitez jusqu&apos;à 5 employés pour scanner les cartes de vos clients.
            </p>
            <Link href="/dashboard/billing"
              className="inline-block px-5 py-2.5 rounded-xl font-semibold text-sm text-white mt-2"
              style={{ background: "var(--dash-accent)" }}>
              Passer au plan Pro
            </Link>
          </div>
        )}

        {/* Employee list */}
        {!loading && isPro && (
          <>
            <section className="rounded-2xl border space-y-0 overflow-hidden"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}>
              {employees.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm" style={{ color: "var(--dash-muted)" }}>
                    Aucun employé pour l&apos;instant. Invitez votre premier collaborateur ci-dessous.
                  </p>
                </div>
              ) : (
                employees.map((emp, i) => (
                  <div key={emp.id}
                    className="flex items-center justify-between px-5 py-4"
                    style={{
                      borderTop: i > 0 ? `1px solid var(--dash-border)` : undefined,
                    }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                        style={{ background: "var(--dash-accent)" }}>
                        {emp.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: "var(--dash-text)" }}>{emp.name}</p>
                        <p className="text-xs" style={{ color: "var(--dash-muted)" }}>{emp.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        emp.invite_accepted
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {emp.invite_accepted ? "Actif" : "En attente"}
                      </span>
                      <button
                        onClick={() => handleRemove(emp.id, emp.name)}
                        disabled={removing === emp.id}
                        className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-40"
                        style={{ borderColor: "var(--dash-border)", color: "var(--dash-muted)" }}>
                        {removing === emp.id ? "…" : "Supprimer"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Invite form */}
            {employees.length < MAX_EMPLOYEES && (
              <section className="rounded-2xl border p-6 space-y-4"
                style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}>
                <h2 className="font-semibold" style={{ color: "var(--dash-text)" }}>Inviter un employé</h2>
                <p className="text-sm" style={{ color: "var(--dash-muted)" }}>
                  L&apos;employé recevra un email avec un lien pour créer son compte. Il aura uniquement accès au scanner.
                </p>

                <form onSubmit={handleInvite} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--dash-muted)" }}>Prénom et nom</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Marie Dupont"
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                        style={{
                          borderColor: "var(--dash-border)",
                          background: "var(--dash-bg)",
                          color: "var(--dash-text)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--dash-muted)" }}>Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="marie@exemple.fr"
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                        style={{
                          borderColor: "var(--dash-border)",
                          background: "var(--dash-bg)",
                          color: "var(--dash-text)",
                        }}
                      />
                    </div>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                      ✓ {formSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={inviting}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-60 transition-opacity"
                    style={{ background: "var(--dash-accent)" }}>
                    {inviting ? "Envoi en cours…" : "Envoyer l'invitation"}
                  </button>
                </form>
              </section>
            )}
          </>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--dash-accent)" }} />
          </div>
        )}
      </main>
    </div>
  );
}
