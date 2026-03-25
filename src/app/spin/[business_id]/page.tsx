"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/anon";

interface Segment {
  id: string;
  label: string;
  color: string;
  probability: number;
}

interface SpinWheel {
  id: string;
  is_active: boolean;
  frequency: string;
}

interface Business {
  business_name: string;
  logo_url: string | null;
  google_place_id: string | null;
}

interface PrimaryColor {
  primary_color: string;
}

// Compute the final rotation angle for the wheel given a target segment index
function getStopAngle(segments: Segment[], targetIndex: number): number {
  const total = segments.reduce((sum, s) => sum + s.probability, 0);
  let cumulative = 0;
  for (let i = 0; i < targetIndex; i++) {
    cumulative += segments[i].probability / total;
  }
  // Middle of the target segment
  const segFraction = segments[targetIndex].probability / total;
  const targetCenter = cumulative + segFraction / 2;

  // We want the center of the target segment to land at the top (pointer)
  // Wheel starts at top (-90deg), so we need to rotate such that targetCenter * 360 lands at 0
  const offsetDeg = targetCenter * 360;
  // Spin 5 full turns + offset to stop at the right sector
  return 5 * 360 + (360 - offsetDeg);
}

function WheelSVG({
  segments,
  rotation,
}: {
  segments: Segment[];
  rotation: number;
}) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const total = segments.reduce((sum, s) => sum + s.probability, 0);
  let currentAngle = -Math.PI / 2;

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

    const maxLen = Math.max(4, Math.floor(12 * fraction));
    const displayLabel =
      seg.label.length > maxLen ? seg.label.slice(0, maxLen - 1) + "…" : seg.label;

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
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: rotation !== 0 ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 1)" : "none",
      }}
    >
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#E5E7EB" strokeWidth="4" />
      {paths}
      <circle cx={cx} cy={cy} r={10} fill="white" stroke="#534AB7" strokeWidth="2" />
    </svg>
  );
}

export default function SpinPage() {
  const params = useParams();
  const business_id = params.business_id as string;

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#534AB7");
  const [wheel, setWheel] = useState<SpinWheel | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [unavailable, setUnavailable] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinError, setSpinError] = useState<string | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [nextSpinAt, setNextSpinAt] = useState<string | null>(null);

  const spinDone = useRef(false);

  useEffect(() => {
    const supabase = createAnonClient();

    async function load() {
      // Fetch business info
      const { data: biz } = await supabase
        .from("businesses")
        .select("business_name, logo_url, google_place_id")
        .eq("id", business_id)
        .single();

      setBusiness(biz ?? null);

      // Fetch primary color from loyalty_cards
      const { data: card } = await supabase
        .from("loyalty_cards")
        .select("primary_color")
        .eq("business_id", business_id)
        .eq("is_active", true)
        .limit(1)
        .single();

      if (card) {
        setPrimaryColor((card as PrimaryColor).primary_color ?? "#534AB7");
      }

      // Fetch active spin wheel
      const { data: spinWheel } = await supabase
        .from("spin_wheels")
        .select("id, is_active, frequency")
        .eq("business_id", business_id)
        .single();

      if (!spinWheel || !spinWheel.is_active) {
        setUnavailable(true);
        setLoading(false);
        return;
      }

      setWheel(spinWheel as SpinWheel);

      // Fetch segments
      const { data: rewards } = await supabase
        .from("spin_rewards")
        .select("id, label, color, probability")
        .eq("wheel_id", spinWheel.id)
        .order("created_at", { ascending: true });

      setSegments((rewards ?? []) as Segment[]);
      setLoading(false);
    }

    load();
  }, [business_id]);

  const handleSpin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSpinError(null);
    setResult(null);
    setAlreadyPlayed(false);
    spinDone.current = false;

    if (!firstName.trim()) {
      setFormError("Veuillez entrer votre prénom.");
      return;
    }
    if (!phone.trim()) {
      setFormError("Veuillez entrer votre numéro de téléphone.");
      return;
    }

    setSpinning(true);

    try {
      const res = await fetch(`/api/spin/${business_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName.trim(), phone: phone.trim() }),
      });

      const data = await res.json() as {
        reward?: string;
        error?: string;
        next_spin_at?: string;
      };

      if (!res.ok) {
        setSpinning(false);
        if (res.status === 409) {
          setAlreadyPlayed(true);
          setSpinError(data.error ?? "Vous avez déjà participé");
          if (data.next_spin_at) setNextSpinAt(data.next_spin_at);
        } else {
          setSpinError(data.error ?? "Erreur lors du tirage");
        }
        return;
      }

      // Find the winning segment index to animate correctly
      const wonLabel = data.reward ?? "";
      const winIndex = segments.findIndex((s) => s.label === wonLabel);
      const targetIndex = winIndex >= 0 ? winIndex : 0;

      const stopAngle = getStopAngle(segments, targetIndex);
      setRotation(stopAngle);

      // Wait for the animation to finish (3s)
      setTimeout(() => {
        setResult(wonLabel);
        setSpinning(false);
        spinDone.current = true;
      }, 3200);
    } catch {
      setSpinning(false);
      setSpinError("Erreur réseau. Veuillez réessayer.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const googleReviewUrl = business?.google_place_id
    ? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
    : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: primaryColor }}>
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-6 px-4">
        {business?.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.logo_url}
            alt={business.business_name}
            className="w-16 h-16 rounded-2xl object-cover shadow-md mb-3 bg-white"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-md">
            {business?.business_name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <h1 className="text-white font-bold text-xl text-center">
          {business?.business_name ?? "Roue de la fortune"}
        </h1>
        <p className="text-white/70 text-sm mt-1">Tentez votre chance !</p>
      </div>

      {/* Main card */}
      <div className="flex-1 bg-white rounded-t-3xl px-4 pt-8 pb-10 flex flex-col items-center max-w-md mx-auto w-full">
        {unavailable ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎡</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Roue indisponible
            </h2>
            <p className="text-gray-500 text-sm">
              La roue n'est pas disponible pour le moment. Revenez plus tard !
            </p>
          </div>
        ) : alreadyPlayed ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-5xl mb-2">⏳</div>
            <h2 className="text-xl font-bold text-gray-800">{spinError}</h2>
            {nextSpinAt && (
              <p className="text-gray-500 text-sm">
                Prochain tirage disponible le{" "}
                {new Date(nextSpinAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        ) : result !== null ? (
          /* Result screen */
          <div className="text-center space-y-6 w-full">
            <div className="flex justify-center">
              <WheelSVG segments={segments} rotation={rotation} />
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
              <p className="text-sm text-indigo-600 font-semibold mb-1">Votre résultat</p>
              <p className="text-2xl font-bold text-gray-900">{result}</p>
            </div>
            {googleReviewUrl && (
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-center transition-colors shadow-sm"
              >
                Laisser un avis Google ⭐
              </a>
            )}
          </div>
        ) : (
          /* Wheel + form */
          <div className="w-full space-y-6">
            {/* Wheel preview (static before spin) */}
            <div className="flex justify-center relative">
              {/* Pointer */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
                style={{ marginTop: "-6px" }}
              >
                <svg width="20" height="28" viewBox="0 0 20 28">
                  <polygon points="0,0 20,0 10,28" fill="#534AB7" />
                </svg>
              </div>
              <WheelSVG segments={segments} rotation={rotation} />
            </div>

            {spinError && !alreadyPlayed && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
                {spinError}
              </div>
            )}

            <form onSubmit={handleSpin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  disabled={spinning}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  disabled={spinning}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>
              {formError && (
                <p className="text-sm text-red-600 font-medium">{formError}</p>
              )}
              <button
                type="submit"
                disabled={spinning || segments.length === 0}
                className="w-full font-bold py-3.5 rounded-xl text-white transition-all shadow-md disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {spinning ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    La roue tourne…
                  </span>
                ) : (
                  "Faire tourner la roue 🎡"
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">
                En participant, vous acceptez que votre numéro soit utilisé uniquement pour cette opération.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
