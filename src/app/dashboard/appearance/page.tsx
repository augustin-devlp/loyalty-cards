"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { THEME_TEMPLATES, type ThemeTemplate, buildThemeVars } from "@/lib/themes";
import DashboardNav from "@/components/DashboardNav";

function applyPreview(accent: string, dark: boolean) {
  const vars = buildThemeVars(accent, dark);
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
}

export default function AppearancePage() {
  const router = useRouter();
  const [template, setTemplate] = useState<ThemeTemplate>("clair");
  const [accent, setAccent]     = useState("#534AB7");
  const [dark, setDark]         = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { data: biz } = await supabase
        .from("businesses")
        .select("theme_template, theme_color, theme_dark")
        .eq("id", user.id)
        .single();
      if (biz) {
        const t = (biz.theme_template ?? "clair") as ThemeTemplate;
        const a = biz.theme_color ?? "#534AB7";
        const d = biz.theme_dark  ?? false;
        setTemplate(t);
        setAccent(a);
        setDark(d);
      }
      setLoaded(true);
    });
  }, [router]);

  function handleTemplate(t: ThemeTemplate) {
    const tpl = THEME_TEMPLATES[t];
    setTemplate(t);
    setAccent(tpl.accent);
    setDark(tpl.dark);
    applyPreview(tpl.accent, tpl.dark);
  }

  function handleAccent(a: string) {
    setAccent(a);
    applyPreview(a, dark);
  }

  function handleDark(d: boolean) {
    setDark(d);
    applyPreview(accent, d);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("businesses")
      .update({ theme_template: template, theme_color: accent, theme_dark: dark })
      .eq("id", user.id);
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  const templateEntries = Object.entries(THEME_TEMPLATES) as [ThemeTemplate, typeof THEME_TEMPLATES[ThemeTemplate]][];

  return (
    <div>
      <DashboardNav />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm transition-colors"
            style={{ color: "var(--dash-muted)" }}
          >
            ← Tableau de bord
          </Link>
          <span style={{ color: "var(--dash-border)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>Apparence</span>
        </div>

        <h1 className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>Apparence</h1>

        {!loaded ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--dash-accent)" }} />
          </div>
        ) : (
          <>
            {/* Templates */}
            <section
              className="rounded-2xl border p-6 space-y-4"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--dash-muted)" }}>
                Template
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {templateEntries.map(([key, tpl]) => {
                  const isSelected = template === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleTemplate(key)}
                      className="rounded-xl border-2 p-3 text-left transition-all space-y-2"
                      style={{
                        borderColor: isSelected ? "var(--dash-accent)" : "var(--dash-border)",
                        background: tpl.bg,
                      }}
                    >
                      {/* Mini preview */}
                      <div className="space-y-1">
                        <div className="h-2 rounded-full w-3/4" style={{ background: tpl.accent }} />
                        <div className="h-1.5 rounded-full w-1/2" style={{ background: tpl.dark ? "#4b5563" : "#d1d5db" }} />
                        <div className="h-1.5 rounded-full w-2/3" style={{ background: tpl.dark ? "#4b5563" : "#d1d5db" }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: tpl.dark ? "#f9fafb" : "#111827" }}
                        >
                          {tpl.label}
                        </span>
                        {isSelected && (
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: tpl.accent }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Accent color */}
            <section
              className="rounded-2xl border p-6 space-y-4"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--dash-muted)" }}>
                Couleur d&apos;accent
              </h2>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl border-2 shadow-sm"
                  style={{ background: accent, borderColor: "var(--dash-border)" }}
                />
                <div className="flex-1 space-y-1">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => handleAccent(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer border"
                    style={{ borderColor: "var(--dash-border)" }}
                  />
                  <p className="text-xs font-mono" style={{ color: "var(--dash-muted)" }}>{accent}</p>
                </div>
              </div>
            </section>

            {/* Dark mode */}
            <section
              className="rounded-2xl border p-6"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold" style={{ color: "var(--dash-text)" }}>Mode sombre</h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--dash-muted)" }}>
                    Activer le thème dark pour le dashboard
                  </p>
                </div>
                <button
                  onClick={() => handleDark(!dark)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                  style={{ background: dark ? "var(--dash-accent)" : "var(--dash-border)" }}
                  role="switch"
                  aria-checked={dark}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                    style={{ transform: dark ? "translateX(22px)" : "translateX(2px)" }}
                  />
                </button>
              </div>
            </section>

            {/* Preview band */}
            <section
              className="rounded-2xl border p-6 space-y-3"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--dash-muted)" }}>
                Aperçu
              </h2>
              <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--dash-bg)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--dash-accent)" }}>S</div>
                  <div>
                    <div className="h-2 w-24 rounded" style={{ background: "var(--dash-text)" }} />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {["Scanner", "Stats", "Apparence"].map((label, i) => (
                    <div
                      key={label}
                      className="px-3 py-1 rounded-lg text-xs font-medium"
                      style={
                        i === 2
                          ? { background: "var(--dash-accent-sub)", color: "var(--dash-accent)" }
                          : { color: "var(--dash-muted)" }
                      }
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Save */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity disabled:opacity-60"
                style={{ background: "var(--dash-accent)" }}
              >
                {saving ? "Enregistrement…" : "Sauvegarder"}
              </button>
              {saved && (
                <span className="text-sm font-medium" style={{ color: "var(--dash-accent)" }}>
                  ✓ Thème sauvegardé
                </span>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
