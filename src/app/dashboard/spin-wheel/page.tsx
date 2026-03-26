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
}

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

// ── SVG Wheel preview ─────────────────────────────────────────────────────────
function WheelSVG({ segments }: { segments: Segment[] }) {
  const S = 260, cx = S / 2, r = cx - 8;
  const total = segments.reduce((a, s) => a + s.probability, 0) || 1;
  const slices: JSX.Element[] = [];
  let angle = -Math.PI / 2;
  segments.forEach((seg, i) => {
    const sweep = (seg.probability / total) * 2 * Math.PI;
    const end = angle + sweep;
    const x1 = cx + r * Math.cos(angle), y1 = cx + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(end),   y2 = cx + r * Math.sin(end);
    const mid = angle + sweep / 2;
    const lx = cx + r * 0.65 * Math.cos(mid);
    const ly = cx + r * 0.65 * Math.sin(mid);
    slices.push(
      <g key={i}>
        <path d={`M${cx},${cx} L${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0},1 ${x2},${y2} Z`}
          fill={seg.color} stroke="#fff" strokeWidth={2} />
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
      <polygon points={`${cx - 8},${cx - r - 2} ${cx + 8},${cx - r - 2} ${cx},${cx - r + 14}`} fill="#534AB7" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SpinWheelPage() {
  const router = useRouter();
  const [wheel, setWheel]       = useState<WheelRow | null>(null);
  const [segments, setSegments] = useState<Segment[]>(DEFAULT_SEGMENTS);
  const [frequency, setFrequency] = useState<"once" | "daily" | "weekly" | "monthly">("once");
  const [isActive, setIsActive] = useState(false);
  const [businessId, setBusinessId] = useState<string>("");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saveOk, setSaveOk]     = useState(false);
  const [copied, setCopied]     = useState(false);
  const [totalErr, setTotalErr] = useState(false);
  const [newSeg, setNewSeg]     = useState<Segment>({ label: "", color: PALETTE[0], probability: 10, reward: "" });

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
    if (wheel) {
      await sb.from("spin_wheels").update({ segments, frequency, is_active: isActive }).eq("id", wheel.id);
    } else {
      const { data } = await sb.from("spin_wheels").insert({ business_id: user.id, segments, frequency, is_active: isActive }).select().single();
      if (data) setWheel(data as WheelRow);
    }
    setSaving(false); setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2500);
  }, [wheel, segments, frequency, isActive, total]);

  const toggleActive = async () => {
    if (!wheel) return;
    const next = !isActive;
    setIsActive(next);
    await createClient().from("spin_wheels").update({ is_active: next }).eq("id", wheel.id);
  };

  const addSeg = () => {
    if (!newSeg.label.trim() || segments.length >= 8) return;
    setSegments([...segments, { ...newSeg }]);
    setNewSeg({ label: "", color: PALETTE[(segments.length + 1) % PALETTE.length], probability: 10, reward: "" });
  };

  const removeSeg = (i: number) => setSegments(segments.filter((_, j) => j !== i));
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

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎰 Roue de la fortune</h1>
            <p className="text-sm text-gray-500 mt-0.5">Configurez les segments et activez la roue pour vos clients.</p>
          </div>
          {wheel && (
            <button onClick={toggleActive}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              {isActive ? "Roue active" : "Roue inactive"}
            </button>
          )}
        </div>

        {/* Public link */}
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
          {/* Left: config */}
          <div className="space-y-4">

            {/* Frequency */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-700 mb-3">Fréquence de participation</h2>
              <div className="grid grid-cols-2 gap-2">
                {(["once", "daily", "weekly", "monthly"] as const).map(f => (
                  <button key={f} onClick={() => setFrequency(f)}
                    className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${frequency === f ? "bg-[#534AB7] text-white border-[#534AB7]" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
                    {f === "once" ? "Une fois" : f === "daily" ? "Chaque jour" : f === "weekly" ? "Chaque semaine" : "Chaque mois"}
                  </button>
                ))}
              </div>
            </div>

            {/* Segments */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">Segments ({segments.length}/8)</h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${total === 100 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  Total : {total}%
                </span>
              </div>

              {totalErr && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-medium">
                  ⚠ Les probabilités doivent totaliser exactement 100%. Actuellement : {total}%
                </div>
              )}

              <div className="space-y-2">
                {segments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                    <div className="w-4 h-4 rounded-full shrink-0 border border-white/50" style={{ background: seg.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{seg.label}</p>
                      {seg.reward && <p className="text-xs text-gray-400 truncate">🎁 {seg.reward}</p>}
                    </div>
                    <input type="number" min={1} max={99} value={seg.probability}
                      onChange={e => updateProb(i, parseInt(e.target.value) || 1)}
                      className="w-14 text-center border border-gray-200 rounded-lg py-1 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                    <span className="text-xs text-gray-400 shrink-0">%</span>
                    <button onClick={() => removeSeg(i)} className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none ml-1">×</button>
                  </div>
                ))}
              </div>

              {/* Add segment form */}
              {segments.length < 8 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Nouveau segment</p>
                  <input type="text" placeholder="Label sur la roue *" value={newSeg.label}
                    onChange={e => setNewSeg({ ...newSeg, label: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  <input type="text" placeholder="Récompense à afficher (optionnel)" value={newSeg.reward}
                    onChange={e => setNewSeg({ ...newSeg, reward: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 flex-wrap flex-1">
                      {PALETTE.map(c => (
                        <button key={c} onClick={() => setNewSeg({ ...newSeg, color: c })}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${newSeg.color === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                          style={{ background: c }} />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <input type="number" min={1} max={99} value={newSeg.probability}
                        onChange={e => setNewSeg({ ...newSeg, probability: parseInt(e.target.value) || 0 })}
                        className="w-14 text-center border border-gray-200 rounded-lg py-1 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                      <span className="text-xs text-gray-400">%</span>
                    </div>
                  </div>
                  <button onClick={addSeg} disabled={!newSeg.label.trim()}
                    className="w-full py-2 bg-indigo-50 text-[#534AB7] rounded-xl text-sm font-semibold hover:bg-indigo-100 disabled:opacity-40 transition-colors">
                    + Ajouter ce segment
                  </button>
                </div>
              )}
            </div>

            {/* Save */}
            <button onClick={save} disabled={saving}
              className="w-full py-3 bg-[#534AB7] text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-md">
              {saving ? "Enregistrement…" : saveOk ? "✓ Enregistré !" : "Enregistrer la roue"}
            </button>
          </div>

          {/* Right: live preview */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center gap-4">
            <h2 className="text-sm font-bold text-gray-700 self-start">Aperçu en temps réel</h2>
            <WheelSVG segments={segments} />
            <p className="text-xs text-gray-400 text-center">La roue s&apos;arrête selon les probabilités configurées.</p>
            <div className="w-full bg-gray-50 rounded-xl p-3 space-y-1">
              {segments.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="flex-1 text-gray-700 truncate">{s.label}</span>
                  <span className="font-semibold text-gray-500">{s.probability}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
