"use client";

import { useState } from "react";

export interface Segment {
  id?: string;
  label: string;
  color: string;
  probability: number;
}

interface SpinWheel {
  id: string;
  business_id: string;
  is_active: boolean;
  frequency: string;
}

interface SpinWheelClientProps {
  wheel: SpinWheel;
  rewards: Segment[];
  businessId: string;
}

const FREQUENCY_OPTIONS = [
  { value: "once", label: "Une seule fois" },
  { value: "daily", label: "Chaque jour" },
  { value: "weekly", label: "Chaque semaine" },
  { value: "monthly", label: "Chaque mois" },
];

const DEFAULT_COLORS = [
  "#534AB7", "#7C3AED", "#2563EB", "#059669",
  "#D97706", "#DC2626", "#DB2777", "#0891B2",
];

function WheelSVG({ segments }: { segments: Segment[] }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  if (segments.length === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#E5E7EB" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#9CA3AF" fontSize="14">
          Aucun segment
        </text>
      </svg>
    );
  }

  const total = segments.reduce((sum, s) => sum + s.probability, 0);
  let currentAngle = -Math.PI / 2; // start at top

  const paths: React.ReactNode[] = [];

  segments.forEach((seg, i) => {
    const fraction = seg.probability / (total || 1);
    const angle = fraction * 2 * Math.PI;
    const endAngle = currentAngle + angle;

    const x1 = cx + r * Math.cos(currentAngle);
    const y1 = cy + r * Math.sin(currentAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const midAngle = currentAngle + angle / 2;
    const labelR = r * 0.65;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);

    const d = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    // Truncate label for display
    const maxLen = Math.max(4, Math.floor(12 * fraction));
    const displayLabel = seg.label.length > maxLen
      ? seg.label.slice(0, maxLen - 1) + "…"
      : seg.label;

    paths.push(
      <g key={i}>
        <path d={d} fill={seg.color} stroke="white" strokeWidth="2" />
        {fraction > 0.05 && (
          <text
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {displayLabel}
          </text>
        )}
      </g>
    );

    currentAngle = endAngle;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#E5E7EB" strokeWidth="4" />
      {paths}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={10} fill="white" stroke="#534AB7" strokeWidth="2" />
      {/* Pointer arrow at top */}
      <polygon
        points={`${cx - 8},6 ${cx + 8},6 ${cx},22`}
        fill="#534AB7"
      />
    </svg>
  );
}

export default function SpinWheelClient({
  wheel: initialWheel,
  rewards: initialRewards,
  businessId,
}: SpinWheelClientProps) {
  const [isActive, setIsActive] = useState(initialWheel.is_active);
  const [frequency, setFrequency] = useState(initialWheel.frequency);
  const [segments, setSegments] = useState<Segment[]>(initialRewards);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [toggling, setToggling] = useState(false);

  // New segment form state
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_COLORS[0]);
  const [newProb, setNewProb] = useState<string>("10");
  const [formError, setFormError] = useState<string | null>(null);

  const totalProb = segments.reduce((sum, s) => sum + s.probability, 0);

  const handleAddSegment = () => {
    setFormError(null);
    const prob = parseFloat(newProb);

    if (!newLabel.trim()) {
      setFormError("Le label est requis.");
      return;
    }
    if (isNaN(prob) || prob <= 0 || prob > 100) {
      setFormError("La probabilité doit être entre 1 et 100.");
      return;
    }
    if (segments.length >= 8) {
      setFormError("Maximum 8 segments autorisés.");
      return;
    }
    if (totalProb + prob > 100) {
      setFormError(`Total dépasserait 100% (actuellement ${totalProb}%).`);
      return;
    }

    setSegments((prev) => [
      ...prev,
      { label: newLabel.trim(), color: newColor, probability: prob },
    ]);
    setNewLabel("");
    setNewProb("10");
    setNewColor(DEFAULT_COLORS[segments.length % DEFAULT_COLORS.length]);
  };

  const handleRemoveSegment = (index: number) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleActive = async () => {
    setToggling(true);
    try {
      const res = await fetch("/api/spin-wheel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (res.ok) {
        setIsActive((prev) => !prev);
      } else {
        const data = await res.json() as { error?: string };
        setSaveMsg({ type: "error", text: data.error ?? "Erreur lors de la mise à jour" });
        setTimeout(() => setSaveMsg(null), 3000);
      }
    } catch {
      setSaveMsg({ type: "error", text: "Erreur réseau" });
      setTimeout(() => setSaveMsg(null), 3000);
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async () => {
    setSaveMsg(null);

    if (segments.length === 0) {
      setSaveMsg({ type: "error", text: "Ajoutez au moins un segment." });
      return;
    }
    if (Math.round(totalProb) !== 100) {
      setSaveMsg({ type: "error", text: `La somme des probabilités doit être 100% (actuellement ${totalProb}%).` });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/spin-wheel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, segments }),
      });
      if (res.ok) {
        setSaveMsg({ type: "success", text: "Sauvegardé !" });
      } else {
        const data = await res.json() as { error?: string };
        setSaveMsg({ type: "error", text: data.error ?? "Erreur lors de la sauvegarde" });
      }
    } catch {
      setSaveMsg({ type: "error", text: "Erreur réseau" });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  const publicLink = `https://stampify.ch/spin/${businessId}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-indigo-600 font-medium mb-1">Roue de la fortune</p>
          <h1 className="text-3xl font-bold text-gray-900">Configuration de la roue</h1>
        </div>
        {/* Active toggle */}
        <button
          onClick={handleToggleActive}
          disabled={toggling}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl border font-semibold text-sm transition-all shadow-sm ${
            isActive
              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
          } disabled:opacity-50`}
        >
          <span
            className={`w-8 h-5 rounded-full transition-colors relative ${
              isActive ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isActive ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </span>
          {isActive ? "Roue active" : "Roue inactive"}
        </button>
      </div>

      {/* Public link */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-6 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-indigo-500 font-medium mb-0.5">Lien public de la roue</p>
          <p className="text-sm font-mono text-indigo-700 truncate">{publicLink}</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(publicLink)}
          className="shrink-0 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Copier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Config */}
        <div className="space-y-6">
          {/* Frequency */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Fréquence de participation</h2>
            <div className="grid grid-cols-2 gap-3">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-colors ${
                    frequency === opt.value
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Segments list */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Segments ({segments.length}/8)</h2>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  Math.round(totalProb) === 100
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                Total : {totalProb}%
              </span>
            </div>

            {segments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Aucun segment. Ajoutez-en ci-dessous.
              </p>
            ) : (
              <ul className="space-y-2 mb-4">
                {segments.map((seg, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5"
                  >
                    <span
                      className="w-5 h-5 rounded-md shrink-0 border border-white shadow-sm"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                      {seg.label}
                    </span>
                    <span className="text-sm text-gray-500 shrink-0">{seg.probability}%</span>
                    <button
                      onClick={() => handleRemoveSegment(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add segment form */}
            {segments.length < 8 && (
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ajouter un segment
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Label (ex: 10% de réduction)"
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <label className="text-xs text-gray-500 shrink-0">Couleur</label>
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-10 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {DEFAULT_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setNewColor(c)}
                          className={`w-5 h-5 rounded-md border-2 transition-all ${
                            newColor === c ? "border-gray-800 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      value={newProb}
                      onChange={(e) => setNewProb(e.target.value)}
                      min={1}
                      max={100}
                      className="w-16 border border-gray-300 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                {formError && (
                  <p className="text-xs text-red-600 font-medium">{formError}</p>
                )}
                <button
                  onClick={handleAddSegment}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm py-2 rounded-xl border border-indigo-200 transition-colors"
                >
                  + Ajouter
                </button>
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? "Sauvegarde…" : "Enregistrer"}
            </button>
            {saveMsg && (
              <span
                className={`text-sm font-medium ${
                  saveMsg.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {saveMsg.type === "success" ? "✓ " : "⚠ "}{saveMsg.text}
              </span>
            )}
          </div>
        </div>

        {/* Right: Wheel preview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
          <h2 className="font-semibold text-gray-900 mb-6 self-start">Aperçu de la roue</h2>
          <WheelSVG segments={segments} />
          <p className="text-xs text-gray-400 mt-4 text-center">
            Aperçu en temps réel. La roue sera visible sur le lien public une fois activée.
          </p>
        </div>
      </div>
    </div>
  );
}
