"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/anon";

interface Segment {
  label: string;
  color: string;
  probability: number;
  reward: string;
}

interface WheelData {
  id: string;
  is_active: boolean;
  frequency: string;
  segments: Segment[];
}

interface BusinessData {
  business_name: string;
  google_place_id: string | null;
  primary_color?: string;
}

// ── Weighted random pick ───────────────────────────────────────────────────────
function pickSegment(segments: Segment[]): number {
  const total = segments.reduce((a, s) => a + s.probability, 0);
  let r = Math.random() * total;
  for (let i = 0; i < segments.length; i++) {
    r -= segments[i].probability;
    if (r <= 0) return i;
  }
  return segments.length - 1;
}

// ── Canvas Wheel ──────────────────────────────────────────────────────────────
function CanvasWheel({
  segments,
  rotation,
}: {
  segments: Segment[];
  rotation: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2;
    const r = cx - 10;
    const total = segments.reduce((a, s) => a + s.probability, 0) || 1;

    ctx.clearRect(0, 0, size, size);

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cx, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = "#e5e7eb";
    ctx.fill();

    let angle = rotation - Math.PI / 2;
    segments.forEach((seg) => {
      const sweep = (seg.probability / total) * Math.PI * 2;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.arc(cx, cx, r, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cx);
      ctx.rotate(angle + sweep / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui, sans-serif";
      const txt = seg.label.length > 12 ? seg.label.slice(0, 11) + "…" : seg.label;
      ctx.fillText(txt, r - 14, 4);
      ctx.restore();

      angle += sweep;
    });

    // Center cap
    ctx.beginPath();
    ctx.arc(cx, cx, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#534AB7";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Arrow indicator at top
    ctx.beginPath();
    ctx.moveTo(cx - 10, cx - r - 4);
    ctx.lineTo(cx + 10, cx - r - 4);
    ctx.lineTo(cx, cx - r + 16);
    ctx.closePath();
    ctx.fillStyle = "#534AB7";
    ctx.fill();
  }, [segments, rotation]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="drop-shadow-2xl"
      style={{ borderRadius: "50%" }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SpinPage() {
  const { business_id: businessId } = useParams<{ business_id: string }>();

  const [step, setStep] = useState<"form" | "wheel" | "result">("form");
  const [wheel, setWheel] = useState<WheelData | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("+33 ");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState<string | null>(null);

  // Wheel animation
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [wonIndex, setWonIndex] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);
  const startRotRef = useRef(0);
  const targetRotRef = useRef(0);
  const startTimeRef = useRef(0);
  const DURATION = 4000;

  useEffect(() => {
    const sb = createAnonClient();
    Promise.all([
      sb.from("spin_wheels").select("id, is_active, frequency, segments").eq("business_id", businessId).maybeSingle(),
      sb.from("businesses").select("business_name, google_place_id").eq("id", businessId).maybeSingle(),
      sb.from("loyalty_cards").select("primary_color").eq("business_id", businessId).eq("is_active", true).maybeSingle(),
    ]).then(([wRes, bRes, cRes]) => {
      if (wRes.data) setWheel(wRes.data as WheelData);
      if (bRes.data) setBusiness({ ...bRes.data, primary_color: cRes.data?.primary_color ?? "#534AB7" });
      setLoading(false);
    });
  }, [businessId]);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

  const startSpin = useCallback(() => {
    if (!wheel || spinning) return;
    const segs = wheel.segments;
    const idx = pickSegment(segs);
    setWonIndex(idx);

    const total = segs.reduce((a, s) => a + s.probability, 0);
    let cumAngle = 0;
    for (let i = 0; i < idx; i++) cumAngle += (segs[i].probability / total) * Math.PI * 2;
    const segCenter = cumAngle + (segs[idx].probability / total) * Math.PI * 2 / 2;

    // How much to rotate so the winning segment ends at top (arrow)
    const stopAngle = Math.PI * 2 * 5 + (Math.PI / 2) - segCenter;
    startRotRef.current = rotation;
    targetRotRef.current = rotation + stopAngle;
    startTimeRef.current = performance.now();
    setSpinning(true);

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = easeOut(t);
      setRotation(startRotRef.current + (targetRotRef.current - startRotRef.current) * eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setStep("result");
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [wheel, spinning, rotation]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wheel) return;
    setSubmitting(true);
    setError(null);

    // Check anti-doublon
    const sb = createAnonClient();
    const { data: existing } = await sb
      .from("spin_entries")
      .select("last_spin_at")
      .eq("wheel_id", wheel.id)
      .eq("phone", phone.trim())
      .order("last_spin_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const lastSpin = new Date(existing.last_spin_at);
      const now = new Date();
      let blocked = false;
      let msg = "";
      if (wheel.frequency === "once") {
        blocked = true; msg = "Vous avez déjà participé à cette roue.";
      } else if (wheel.frequency === "daily") {
        blocked = lastSpin.toDateString() === now.toDateString();
        if (blocked) msg = "Vous avez déjà joué aujourd'hui. Revenez demain !";
      } else if (wheel.frequency === "weekly") {
        const diff = (now.getTime() - lastSpin.getTime()) / 86400000;
        blocked = diff < 7;
        if (blocked) msg = `Revenez dans ${Math.ceil(7 - diff)} jour(s).`;
      } else if (wheel.frequency === "monthly") {
        const diff = (now.getTime() - lastSpin.getTime()) / 86400000;
        blocked = diff < 30;
        if (blocked) msg = `Revenez dans ${Math.ceil(30 - diff)} jour(s).`;
      }
      if (blocked) { setAlreadyPlayed(msg); setSubmitting(false); return; }
    }

    setSubmitting(false);
    setStep("wheel");
    setTimeout(startSpin, 600);
  };

  const saveResult = useCallback(async () => {
    if (!wheel || wonIndex === null) return;
    const sb = createAnonClient();
    const reward = wheel.segments[wonIndex]?.reward ?? null;
    await sb.from("spin_results").insert({
      wheel_id: wheel.id,
      first_name: firstName.trim(),
      phone: phone.trim(),
      reward,
    });
    // Also upsert spin_entries for anti-doublon tracking
    const existing2 = await sb.from("spin_entries").select("id").eq("wheel_id", wheel.id).eq("phone", phone.trim()).maybeSingle();
    if (existing2.data) {
      await sb.from("spin_entries").update({ last_spin_at: new Date().toISOString(), reward_won: reward ?? undefined }).eq("id", existing2.data.id);
    } else {
      await sb.from("spin_entries").insert({ wheel_id: wheel.id, phone: phone.trim(), reward_won: reward ?? undefined });
    }
  }, [wheel, wonIndex, firstName, phone]);

  useEffect(() => {
    if (step === "result") saveResult();
  }, [step, saveResult]);

  const primaryColor = business?.primary_color ?? "#534AB7";
  const won = wheel && wonIndex !== null ? wheel.segments[wonIndex] : null;
  const hasReward = won?.reward;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!wheel || !wheel.is_active || wheel.segments.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-5xl mb-4">🎰</div>
      <h1 className="text-xl font-bold text-gray-800">{business?.business_name ?? "Ce commerce"}</h1>
      <p className="text-gray-500 mt-2">La roue de la fortune n&apos;est pas disponible pour le moment.</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="text-white px-5 pt-10 pb-6 text-center" style={{ background: primaryColor }}>
        <div className="text-4xl mb-2">🎰</div>
        <h1 className="text-xl font-bold">{business?.business_name}</h1>
        <p className="text-sm opacity-80 mt-1">Roue de la fortune</p>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-5 pt-8 pb-10 max-w-md w-full mx-auto">

        {/* ── Step: form ── */}
        {step === "form" && (
          <>
            {alreadyPlayed ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">⏰</div>
                <p className="text-gray-700 font-semibold">{alreadyPlayed}</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Tentez votre chance !</h2>
                <p className="text-sm text-gray-500 mb-6">Entrez vos infos pour faire tourner la roue.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Prénom *</label>
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                      placeholder="Marie" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Téléphone *</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg disabled:opacity-60 transition-all active:scale-95"
                    style={{ background: primaryColor }}>
                    {submitting ? "Vérification…" : "🎰 Faire tourner la roue !"}
                  </button>
                </form>
              </>
            )}
          </>
        )}

        {/* ── Step: wheel ── */}
        {step === "wheel" && (
          <div className="flex flex-col items-center gap-6 py-4">
            <CanvasWheel segments={wheel.segments} rotation={rotation} />
            <p className="text-sm text-gray-500 animate-pulse">
              {spinning ? "La roue tourne…" : "Préparation…"}
            </p>
          </div>
        )}

        {/* ── Step: result ── */}
        {step === "result" && won && (
          <div className="text-center py-6 space-y-4">
            <div className="text-6xl">{hasReward ? "🎉" : "😊"}</div>
            <h2 className="text-2xl font-black text-gray-900">
              {hasReward ? "Félicitations !" : "Merci d'avoir joué !"}
            </h2>
            {hasReward ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
                <p className="text-sm text-indigo-600 font-semibold mb-1">Votre récompense :</p>
                <p className="text-xl font-black text-indigo-700">{won.reward}</p>
                <p className="text-xs text-indigo-400 mt-2">Présentez cet écran au commerçant pour en profiter.</p>
              </div>
            ) : (
              <p className="text-gray-600">Segment obtenu : <strong>{won.label}</strong></p>
            )}

            {business?.google_place_id && (
              <a
                href={`https://search.google.com/local/writereview?placeid=${business.google_place_id}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                ⭐ Laisser un avis Google
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
