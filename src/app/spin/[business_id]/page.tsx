"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
}

// ── Weighted random pick ──────────────────────────────────────────────────────
function pickSegment(segments: Segment[]): number {
  const total = segments.reduce((a, s) => a + s.probability, 0);
  let r = Math.random() * total;
  for (let i = 0; i < segments.length; i++) {
    r -= segments[i].probability;
    if (r <= 0) return i;
  }
  return segments.length - 1;
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#f59e0b", "#6366f1", "#ec4899", "#10b981", "#3b82f6", "#f97316", "#a855f7", "#14b8a6"];
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: `${(i * 137.5) % 100}%`,
      width: `${(i % 5) + 5}px`,
      height: `${(i % 4) + 5}px`,
      color: colors[i % colors.length],
      circle: i % 3 === 0,
      duration: `${2 + (i % 3) * 0.7}s`,
      delay: `${(i % 8) * 0.2}s`,
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes confetti-drop {
          0%   { transform: translateY(-20px) rotate(0deg) scale(1);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(800deg) scale(0.5); opacity: 0; }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {pieces.map(p => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: -20,
              left: p.left,
              width: p.width,
              height: p.height,
              backgroundColor: p.color,
              borderRadius: p.circle ? "50%" : "3px",
              animation: `confetti-drop ${p.duration} ${p.delay} ease-in forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ── Canvas Wheel ──────────────────────────────────────────────────────────────
function CanvasWheel({ segments, rotation }: { segments: Segment[]; rotation: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = canvas.width;
    const cx = SIZE / 2;
    const r = cx - 20;
    const total = segments.reduce((a, s) => a + s.probability, 0) || 1;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // ── Dark outer shadow ring
    ctx.beginPath();
    ctx.arc(cx, cx, r + 14, 0, Math.PI * 2);
    ctx.fillStyle = "#1a0a03";
    ctx.fill();

    // ── Gold border ring
    const goldGrad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    goldGrad.addColorStop(0, "#fbbf24");
    goldGrad.addColorStop(0.5, "#f59e0b");
    goldGrad.addColorStop(1, "#d97706");
    ctx.beginPath();
    ctx.arc(cx, cx, r + 9, 0, Math.PI * 2);
    ctx.fillStyle = goldGrad;
    ctx.fill();

    // ── Slices
    let angle = rotation - Math.PI / 2;
    segments.forEach((seg) => {
      const sweep = (seg.probability / total) * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.arc(cx, cx, r, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cx);
      ctx.rotate(angle + sweep / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
      const txt = seg.label.length > 13 ? seg.label.slice(0, 12) + "…" : seg.label;
      ctx.fillText(txt, r - 10, 4);
      ctx.restore();

      angle += sweep;
    });

    // ── Center cap — gold radial
    const capGrad = ctx.createRadialGradient(cx - 4, cx - 4, 2, cx, cx, 22);
    capGrad.addColorStop(0, "#fde68a");
    capGrad.addColorStop(1, "#b45309");
    ctx.beginPath();
    ctx.arc(cx, cx, 22, 0, Math.PI * 2);
    ctx.fillStyle = capGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // ── Arrow pointer at top (pointing INTO the wheel)
    const arrowTip = cx - r + 6;
    const arrowBase = 14;
    ctx.beginPath();
    ctx.moveTo(cx - arrowBase, 6);
    ctx.lineTo(cx + arrowBase, 6);
    ctx.lineTo(cx, arrowTip);
    ctx.closePath();
    ctx.fillStyle = "#3E1F0A";
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.stroke();

  }, [segments, rotation]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
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

  // Animation
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [wonIndex, setWonIndex] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);
  const startRotRef = useRef(0);
  const targetRotRef = useRef(0);
  const startTimeRef = useRef(0);
  const DURATION = 4500;

  useEffect(() => {
    const sb = createAnonClient();
    Promise.all([
      sb.from("spin_wheels").select("id, is_active, frequency, segments").eq("business_id", businessId).maybeSingle(),
      sb.from("businesses").select("business_name, google_place_id").eq("id", businessId).maybeSingle(),
    ]).then(([wRes, bRes]) => {
      if (wRes.data) setWheel(wRes.data as WheelData);
      if (bRes.data) setBusiness(bRes.data as BusinessData);
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
    const stopAngle = Math.PI * 2 * 6 + (Math.PI / 2) - segCenter;

    startRotRef.current = rotation;
    targetRotRef.current = rotation + stopAngle;
    startTimeRef.current = performance.now();
    setSpinning(true);

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      setRotation(startRotRef.current + (targetRotRef.current - startRotRef.current) * easeOut(t));
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

  const won = wheel && wonIndex !== null ? wheel.segments[wonIndex] : null;
  const hasReward = !!won?.reward;

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3E1F0A, #6B3A2A)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-amber-200 text-sm font-medium">Chargement…</p>
      </div>
    </div>
  );

  // ── Not available ──
  if (!wheel || !wheel.is_active || wheel.segments.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "linear-gradient(135deg, #3E1F0A, #6B3A2A)" }}>
      <div className="text-6xl mb-5">🎰</div>
      <h1 className="text-2xl font-black text-white mb-2">{business?.business_name ?? "Ce commerce"}</h1>
      <p className="text-amber-200 text-sm">La roue de la fortune n&apos;est pas disponible pour le moment.</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f7f3ef" }}>

      {/* ── Header ── */}
      <div
        className="relative flex flex-col items-center px-5 pt-12 pb-10 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3E1F0A 0%, #6B3A2A 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />
        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto shadow-lg"
            style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}>
            🎰
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{business?.business_name}</h1>
          <p className="text-amber-300 text-sm font-semibold mt-1 uppercase tracking-widest">Roue de la fortune</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 -mt-5 rounded-t-[28px] bg-white shadow-2xl overflow-hidden">
        <div className="max-w-sm mx-auto px-5 pt-8 pb-12">

          {/* ── Step: form ── */}
          {step === "form" && (
            <>
              {alreadyPlayed ? (
                <div className="flex flex-col items-center text-center py-10 gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
                    ⏰
                  </div>
                  <h2 className="text-xl font-black text-gray-900">À bientôt !</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{alreadyPlayed}</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-7">
                    <h2 className="text-xl font-black text-gray-900">Tentez votre chance !</h2>
                    <p className="text-gray-400 text-sm mt-1">Entrez vos infos pour faire tourner la roue 🍀</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text" required
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="Marie"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition"
                        style={{ "--tw-ring-color": "#d97706" } as React.CSSProperties}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel" required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition"
                        style={{ "--tw-ring-color": "#d97706" } as React.CSSProperties}
                      />
                      <p className="text-xs text-gray-400 mt-1.5 ml-1">1 participation par numéro</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-2xl font-black text-white text-base shadow-lg disabled:opacity-50 transition-all active:scale-95 mt-2"
                      style={{ background: "linear-gradient(135deg, #3E1F0A, #6B3A2A)" }}
                    >
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
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-sm font-semibold text-gray-500">
                  {spinning ? "La roue tourne…" : "Préparation…"}
                </p>
              </div>
            </div>
          )}

          {/* ── Step: result ── */}
          {step === "result" && won && (
            <>
              {hasReward && <Confetti />}

              <div className="flex flex-col items-center text-center gap-5 py-4">

                {hasReward ? (
                  <>
                    <div className="text-6xl animate-bounce">🎉</div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Félicitations !</h2>
                      <p className="text-gray-400 text-sm mt-1">{firstName}, vous avez gagné !</p>
                    </div>

                    {/* Reward card */}
                    <div
                      className="w-full rounded-3xl p-6 text-white shadow-xl"
                      style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                    >
                      <p className="text-sm font-semibold opacity-80 uppercase tracking-widest mb-3">Votre récompense</p>
                      <p className="text-2xl font-black leading-tight">{won.reward}</p>
                      <div className="mt-5 flex items-center gap-2 bg-white/15 rounded-2xl px-4 py-3">
                        <span className="text-lg">🏪</span>
                        <p className="text-xs font-semibold opacity-90 leading-snug">
                          Présentez cet écran au commerçant pour en profiter
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl">🍀</div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Merci d&apos;avoir joué !</h2>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Tentez encore lors de votre prochaine visite !
                      </p>
                    </div>
                    <div
                      className="w-full rounded-2xl px-5 py-4"
                      style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}
                    >
                      <p className="text-sm font-bold text-amber-800">
                        🎰 Segment : {won.label}
                      </p>
                      <p className="text-xs text-amber-700 mt-1">La chance vous sourit peut-être la prochaine fois !</p>
                    </div>
                  </>
                )}

                {/* Google review */}
                {business?.google_place_id && (
                  <a
                    href={`https://search.google.com/local/writereview?placeid=${business.google_place_id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    ⭐ Laisser un avis Google
                  </a>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
