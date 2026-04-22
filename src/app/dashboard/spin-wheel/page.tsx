"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { createClient } from "@/lib/supabase/client";

interface Segment {
  label: string;
  color: string;
  probability: number;
  reward: string;
}

interface WheelRow {
  id: string;
  business_id: string;
  is_active: boolean;
  frequency: string;
  segments: Segment[];
  require_google_review: boolean;
  // Chantier 4 : paramétrage fin de la fréquence
  frequency_days?: number | null;
  requires_order_since?: boolean;
  min_orders_count?: number;
  // Phase 7 : modes exclusifs
  config_mode?: "frequency" | "weekdays" | "disabled";
  allowed_weekdays?: number[];
}

/**
 * Paliers du slider Mode Fréquence (Phase 7).
 * Valeur en frequency_days : null = "Pas de roue" (palier max)
 */
const FREQUENCY_STEPS: {
  value: number | null;
  label: string;
  sub: string;
}[] = [
  { value: 1, label: "1/jour", sub: "Chaque jour" },
  { value: 3, label: "2/sem", sub: "Tous les 3 jours" },
  { value: 7, label: "1/sem", sub: "Chaque semaine" },
  { value: 30, label: "1/mois", sub: "Chaque mois" },
  { value: null, label: "Pas de roue", sub: "Désactivée" },
];

const WEEKDAYS_ISO: { iso: number; label: string; short: string }[] = [
  { iso: 1, label: "Lundi", short: "Lun" },
  { iso: 2, label: "Mardi", short: "Mar" },
  { iso: 3, label: "Mercredi", short: "Mer" },
  { iso: 4, label: "Jeudi", short: "Jeu" },
  { iso: 5, label: "Vendredi", short: "Ven" },
  { iso: 6, label: "Samedi", short: "Sam" },
  { iso: 7, label: "Dimanche", short: "Dim" },
];

const PALETTE = [
  "#534AB7", "#7C3AED", "#2563EB", "#059669",
  "#D97706", "#DC2626", "#DB2777", "#0891B2",
];

const DEFAULT_SEGMENTS: Segment[] = [
  { label: "10% de réduction", color: "#534AB7", probability: 30, reward: "10% de réduction" },
  { label: "Café offert",       color: "#059669", probability: 25, reward: "Café offert" },
  { label: "Tentez encore",     color: "#D97706", probability: 30, reward: "" },
  { label: "Cadeau mystère",    color: "#DC2626", probability: 15, reward: "Cadeau mystère" },
];

// ── SVG Wheel preview — equal visual segments ─────────────────────────────────
function WheelSVG({ segments }: { segments: Segment[] }) {
  const S = 260, cx = S / 2, r = cx - 8;
  const n = segments.length || 1;
  const sweep = (2 * Math.PI) / n;
  const slices: JSX.Element[] = [];
  let angle = -Math.PI / 2;
  segments.forEach((seg, i) => {
    const end = angle + sweep;
    const x1 = cx + r * Math.cos(angle), y1 = cx + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(end),   y2 = cx + r * Math.sin(end);
    const mid = angle + sweep / 2;
    const lx = cx + r * 0.65 * Math.cos(mid);
    const ly = cx + r * 0.65 * Math.sin(mid);
    slices.push(
      <g key={i}>
        <path
          d={`M${cx},${cx} L${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0},1 ${x2},${y2} Z`}
          fill={seg.color} stroke="#fff" strokeWidth={2}
        />
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize={10} fontWeight="700"
          style={{ userSelect: "none", pointerEvents: "none" }}>
          {seg.label.length > 12 ? seg.label.slice(0, 11) + "…" : seg.label}
        </text>
      </g>
    );
    angle = end;
  });
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} className="drop-shadow-xl">
      <circle cx={cx} cy={cx} r={r + 5} fill="#e5e7eb" />
      {segments.length === 0 ? <circle cx={cx} cy={cx} r={r} fill="#f3f4f6" /> : slices}
      <circle cx={cx} cy={cx} r={14} fill="#fff" stroke="#534AB7" strokeWidth={3} />
      <polygon
        points={`${cx - 8},${cx - r - 2} ${cx + 8},${cx - r - 2} ${cx},${cx - r + 14}`}
        fill="#534AB7"
      />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SpinWheelPage() {
  const router = useRouter();
  const [wheel, setWheel]         = useState<WheelRow | null>(null);
  const [segments, setSegments]   = useState<Segment[]>(DEFAULT_SEGMENTS);
  const [frequency, setFrequency] = useState<"once" | "daily" | "weekly" | "monthly">("once");
  const [isActive, setIsActive]   = useState(false);
  const [requireGoogleReview, setRequireGoogleReview] = useState(false);
  const [businessId, setBusinessId] = useState<string>("");
  // Phase 7 : modes exclusifs (frequency slider vs weekdays)
  const [configMode, setConfigMode] = useState<"frequency" | "weekdays">(
    "frequency",
  );
  // Palier du slider Fréquence (0=1j, 1=3j, 2=7j, 3=30j, 4=Pas de roue)
  const [frequencyStepIndex, setFrequencyStepIndex] = useState<number>(0);
  const [allowedWeekdays, setAllowedWeekdays] = useState<number[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saveOk, setSaveOk]     = useState(false);
  const [copied, setCopied]     = useState(false);
  const [totalErr, setTotalErr] = useState(false);

  // Section A: new segment form
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(PALETTE[0]);

  // Which segment's color picker is open (-1 = none)
  const [colorPickerOpen, setColorPickerOpen] = useState<number>(-1);

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setBusinessId(user.id);
      const { data } = await sb.from("spin_wheels").select("*").eq("business_id", user.id).maybeSingle();
      if (data) {
        const w = data as WheelRow;
        setWheel(w);
        setSegments(Array.isArray(w.segments) && w.segments.length ? w.segments : DEFAULT_SEGMENTS);
        setFrequency(w.frequency as "once" | "daily" | "weekly" | "monthly");
        setIsActive(w.is_active);
        setRequireGoogleReview(w.require_google_review ?? false);

        // Phase 7 : config_mode + palier frequency + weekdays
        const mode = (w.config_mode as "frequency" | "weekdays") ?? "frequency";
        setConfigMode(mode);
        // Retrouver l'index du palier correspondant à frequency_days
        const fd = w.frequency_days === null ? null : (w.frequency_days ?? 1);
        const idx = FREQUENCY_STEPS.findIndex((s) => s.value === fd);
        setFrequencyStepIndex(idx >= 0 ? idx : 0);
        setAllowedWeekdays(Array.isArray(w.allowed_weekdays) ? w.allowed_weekdays : []);
      }
      setLoading(false);
    });
  }, [router]);

  const total = segments.reduce((a, s) => a + s.probability, 0);

  const save = useCallback(async () => {
    if (total !== 100) { setTotalErr(true); return; }
    setTotalErr(false);
    setSaving(true);
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    // Phase 7 : la config est soit frequency (avec palier) soit weekdays
    const currentStep = FREQUENCY_STEPS[frequencyStepIndex] ?? FREQUENCY_STEPS[0];
    const payload: Record<string, unknown> = {
      segments,
      frequency,
      is_active: isActive,
      require_google_review: requireGoogleReview,
      config_mode: configMode,
      frequency_days: configMode === "frequency" ? currentStep.value : null,
      allowed_weekdays: configMode === "weekdays" ? allowedWeekdays : [],
      // requires_order_since retiré (Phase 7 décision Augustin)
      requires_order_since: false,
      min_orders_count: 0,
    };
    if (wheel) {
      await sb.from("spin_wheels").update(payload).eq("id", wheel.id);
    } else {
      const { data } = await sb
        .from("spin_wheels")
        .insert({ business_id: user.id, ...payload })
        .select()
        .single();
      if (data) setWheel(data as WheelRow);
    }
    setSaving(false); setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2500);
  }, [
    wheel,
    segments,
    frequency,
    isActive,
    requireGoogleReview,
    configMode,
    frequencyStepIndex,
    allowedWeekdays,
    total,
  ]);

  const toggleActive = async () => {
    if (!wheel) return;
    const next = !isActive;
    setIsActive(next);
    await createClient().from("spin_wheels").update({ is_active: next }).eq("id", wheel.id);
  };

  // Section A: add segment (label + color only, default probability = 10)
  const addSeg = () => {
    if (!newLabel.trim() || segments.length >= 8) return;
    setSegments([...segments, { label: newLabel.trim(), color: newColor, probability: 10, reward: "" }]);
    setNewLabel("");
    setNewColor(PALETTE[(segments.length + 1) % PALETTE.length]);
  };

  const removeSeg = (i: number) => {
    setSegments(segments.filter((_, j) => j !== i));
    setColorPickerOpen(-1);
  };

  const updateLabel = (i: number, v: string) => {
    const next = [...segments]; next[i] = { ...next[i], label: v }; setSegments(next);
  };

  const updateColor = (i: number, c: string) => {
    const next = [...segments]; next[i] = { ...next[i], color: c }; setSegments(next);
    setColorPickerOpen(-1);
  };

  // Section B: update reward
  const updateReward = (i: number, v: string) => {
    const next = [...segments]; next[i] = { ...next[i], reward: v }; setSegments(next);
  };

  // Section B: update probability
  const updateProb = (i: number, v: number) => {
    const next = [...segments];
    next[i] = { ...next[i], probability: Math.max(1, Math.min(99, v)) };
    setSegments(next);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://stampify.ch/spin/${businessId}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen"><DashboardNav />
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎰 Roue de la fortune</h1>
            <p className="text-sm text-gray-500 mt-0.5">Configurez la roue et activez-la pour vos clients.</p>
          </div>
          {wheel && (
            <button onClick={toggleActive}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              {isActive ? "Roue active" : "Roue inactive"}
            </button>
          )}
        </div>

        {/* ── Public link ── */}
        {businessId && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Lien public clients</p>
              <p className="text-sm font-mono text-gray-700 truncate">stampify.ch/spin/{businessId}</p>
            </div>
            <button onClick={copyLink}
              className="px-4 py-2 bg-[#534AB7] text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shrink-0">
              {copied ? "✓ Copié !" : "Copier"}
            </button>
            <a href={`/spin/${businessId}`} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors shrink-0">
              Aperçu →
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: configuration ── */}
          <div className="space-y-4">

            {/* ── Config roue : modes exclusifs (Phase 7 FIX 5) ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-gray-700">Configuration de la roue</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Choisis UN des 2 modes ci-dessous.
                </p>
              </div>

              {/* Mode A — Fréquence */}
              <label
                className={`block rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                  configMode === "frequency"
                    ? "border-[#534AB7] bg-indigo-50/50"
                    : "border-gray-200 bg-white hover:border-indigo-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="configMode"
                    checked={configMode === "frequency"}
                    onChange={() => setConfigMode("frequency")}
                    className="mt-0.5 accent-[#534AB7]"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">
                      Mode Fréquence régulière
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Le client peut tourner la roue à intervalle régulier.
                    </p>
                  </div>
                </div>

                {configMode === "frequency" && (
                  <div className="mt-4 pl-5 space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={FREQUENCY_STEPS.length - 1}
                      step={1}
                      value={frequencyStepIndex}
                      onChange={(e) => setFrequencyStepIndex(Number(e.target.value))}
                      className="w-full accent-[#534AB7]"
                    />
                    <div className="flex justify-between gap-1 text-[10px] font-semibold text-gray-500">
                      {FREQUENCY_STEPS.map((s, i) => (
                        <span
                          key={i}
                          className={`flex-1 text-center ${
                            i === frequencyStepIndex
                              ? "text-[#534AB7]"
                              : ""
                          }`}
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                    <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs">
                      <span className="font-semibold text-indigo-800">
                        ✓ Sélectionné :
                      </span>{" "}
                      <span className="text-indigo-700">
                        {FREQUENCY_STEPS[frequencyStepIndex]?.sub ?? ""}
                        {FREQUENCY_STEPS[frequencyStepIndex]?.value === null && (
                          <span className="italic"> (la roue n'apparaît plus côté client)</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </label>

              {/* Mode B — Jours fixes */}
              <label
                className={`block rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                  configMode === "weekdays"
                    ? "border-[#534AB7] bg-indigo-50/50"
                    : "border-gray-200 bg-white hover:border-indigo-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="configMode"
                    checked={configMode === "weekdays"}
                    onChange={() => setConfigMode("weekdays")}
                    className="mt-0.5 accent-[#534AB7]"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">
                      Mode Calendrier (jours fixes)
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      La roue est disponible uniquement certains jours de la semaine.
                    </p>
                  </div>
                </div>

                {configMode === "weekdays" && (
                  <div className="mt-4 pl-5 space-y-3">
                    {/* Grille 7 checkboxes */}
                    <div className="grid grid-cols-7 gap-1">
                      {WEEKDAYS_ISO.map((d) => {
                        const active = allowedWeekdays.includes(d.iso);
                        return (
                          <button
                            key={d.iso}
                            type="button"
                            onClick={() =>
                              setAllowedWeekdays((prev) =>
                                prev.includes(d.iso)
                                  ? prev.filter((x) => x !== d.iso)
                                  : [...prev, d.iso].sort((a, b) => a - b),
                              )
                            }
                            className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                              active
                                ? "bg-[#534AB7] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {d.short}
                          </button>
                        );
                      })}
                    </div>

                    {/* Raccourcis */}
                    <div className="flex gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setAllowedWeekdays([6, 7])}
                        className="rounded-lg bg-gray-100 px-2 py-1 font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Week-end
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllowedWeekdays([1, 2, 3, 4, 5, 6, 7])}
                        className="rounded-lg bg-gray-100 px-2 py-1 font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Tous les jours
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllowedWeekdays([])}
                        className="rounded-lg bg-gray-100 px-2 py-1 font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Aucun
                      </button>
                    </div>

                    {/* Résumé */}
                    <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs">
                      <span className="font-semibold text-indigo-800">
                        ✓ Roue disponible :
                      </span>{" "}
                      <span className="text-indigo-700">
                        {allowedWeekdays.length === 0
                          ? "Aucun jour sélectionné"
                          : allowedWeekdays
                              .map(
                                (iso) =>
                                  WEEKDAYS_ISO.find((d) => d.iso === iso)?.label ?? "",
                              )
                              .join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Google Review Mode */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-700">Exiger un avis Google</h2>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                    Le client laisse un avis avant de tourner la roue
                  </p>
                </div>
                <button
                  onClick={() => setRequireGoogleReview(!requireGoogleReview)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${requireGoogleReview ? "bg-[#534AB7]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${requireGoogleReview ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </div>
              {requireGoogleReview ? (
                <p className="mt-3 text-xs text-indigo-600 bg-indigo-50 rounded-xl px-3 py-2 leading-snug">
                  Mode actif : après vérification SMS, le client verra un bouton &quot;Laisser un avis Google&quot; avant de pouvoir tourner.
                </p>
              ) : (
                <p className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2 leading-snug">
                  Mode simple : participation directe après vérification SMS. Le bouton avis Google s&apos;affiche en option après la roue.
                </p>
              )}
            </div>

            {/* Ancien bloc "Règles avancées" retiré en Phase 7 :
                la fréquence est maintenant pilotée par le palier du slider
                ci-dessus (1/3/7/30/null jours) et la logique
                requires_order_since est supprimée. */}

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* SECTION A — Apparence de la roue                               */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">🎨</span>
                <div>
                  <h2 className="text-sm font-bold text-gray-700">Apparence de la roue</h2>
                  <p className="text-xs text-gray-400">Nom et couleur de chaque segment ({segments.length}/8)</p>
                </div>
              </div>

              <div className="space-y-2">
                {segments.map((seg, i) => (
                  <div key={i} className="rounded-xl bg-gray-50 overflow-visible">
                    {/* Main row */}
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      {/* Color dot — click to open/close palette */}
                      <button
                        type="button"
                        onClick={() => setColorPickerOpen(colorPickerOpen === i ? -1 : i)}
                        className="w-6 h-6 rounded-full shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-200 hover:ring-indigo-400 transition-all"
                        style={{ background: seg.color }}
                        title="Changer la couleur"
                      />
                      {/* Label input */}
                      <input
                        type="text"
                        value={seg.label}
                        onChange={e => updateLabel(i, e.target.value)}
                        placeholder="Nom du segment…"
                        className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-gray-800 border-b border-transparent focus:border-indigo-300 outline-none py-0.5"
                      />
                      <button
                        onClick={() => removeSeg(i)}
                        className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none ml-1 shrink-0"
                      >×</button>
                    </div>
                    {/* Inline color palette — shown when open */}
                    {colorPickerOpen === i && (
                      <div className="flex gap-1.5 px-3 pb-3 pt-1">
                        {PALETTE.map(c => (
                          <button
                            key={c}
                            onClick={() => updateColor(i, c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${seg.color === c ? "border-gray-700 scale-110" : "border-transparent hover:scale-105"}`}
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add segment form */}
              {segments.length < 8 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Nouveau segment</p>
                  <input
                    type="text"
                    placeholder="Nom du segment *"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSeg(); } }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 shrink-0">Couleur :</span>
                    <div className="flex gap-1.5 flex-wrap flex-1">
                      {PALETTE.map(c => (
                        <button
                          key={c}
                          onClick={() => setNewColor(c)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${newColor === c ? "border-gray-700 scale-110" : "border-transparent hover:scale-105"}`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={addSeg}
                    disabled={!newLabel.trim()}
                    className="w-full py-2 bg-indigo-50 text-[#534AB7] rounded-xl text-sm font-semibold hover:bg-indigo-100 disabled:opacity-40 transition-colors"
                  >
                    + Ajouter ce segment
                  </button>
                </div>
              )}
            </div>

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* SECTION B — Récompenses et probabilités                        */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎁</span>
                  <div>
                    <h2 className="text-sm font-bold text-gray-700">Récompenses et probabilités</h2>
                    <p className="text-xs text-gray-400">Laissez la récompense vide pour un segment perdant</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${total === 100 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {total}% / 100%
                </span>
              </div>

              {totalErr && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-medium">
                  ⚠ Les probabilités doivent totaliser exactement 100%. Actuellement : {total}%
                </div>
              )}

              <div className="space-y-3">
                {segments.map((seg, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl px-3 py-3 space-y-2">
                    {/* Segment name header */}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                      <span className="text-xs font-bold text-gray-600 truncate">{seg.label || `Segment ${i + 1}`}</span>
                    </div>
                    {/* Reward input */}
                    <input
                      type="text"
                      placeholder="Récompense (ex: Café offert) — vide = segment perdant"
                      value={seg.reward}
                      onChange={e => updateReward(i, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                    />
                    {/* Probability */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 shrink-0 w-20">Probabilité :</span>
                      <input
                        type="number" min={1} max={99} value={seg.probability}
                        onChange={e => updateProb(i, parseInt(e.target.value) || 1)}
                        className="w-16 text-center border border-gray-200 rounded-lg py-1 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                      />
                      <span className="text-xs text-gray-400">%</span>
                      {/* Visual bar */}
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${Math.min(seg.probability, 100)}%`, background: seg.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                💡 Les segments sans récompense sont des segments perdants (ex : &quot;Tentez encore&quot;).
              </p>
            </div>

            {/* Save */}
            <button
              onClick={save}
              disabled={saving}
              className="w-full py-3 bg-[#534AB7] text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-md"
            >
              {saving ? "Enregistrement…" : saveOk ? "✓ Enregistré !" : "Enregistrer la roue"}
            </button>
          </div>

          {/* ── Right: live preview ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center gap-4 self-start sticky top-4">
            <h2 className="text-sm font-bold text-gray-700 self-start">Aperçu en temps réel</h2>
            <WheelSVG segments={segments} />
            <p className="text-xs text-gray-400 text-center">
              Segments visuellement égaux · les probabilités déterminent uniquement le tirage au sort.
            </p>
            <div className="w-full bg-gray-50 rounded-xl p-3 space-y-1.5">
              {segments.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="flex-1 text-gray-700 truncate">{s.label || `Segment ${i + 1}`}</span>
                  <span className="font-semibold text-gray-500 shrink-0">{s.probability}%</span>
                  {s.reward ? (
                    <span className="text-green-600 shrink-0">🎁</span>
                  ) : (
                    <span className="text-gray-300 shrink-0">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
