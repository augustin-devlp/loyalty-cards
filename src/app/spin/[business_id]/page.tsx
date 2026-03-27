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
  require_google_review: boolean;
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
  const [size, setSize] = useState(320); // logical CSS size

  // Responsive: 480px on desktop, 320px on mobile
  useEffect(() => {
    const update = () => setSize(window.innerWidth < 640 ? 320 : 480);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr  = window.devicePixelRatio || 1;
    const SIZE = size;                    // logical pixels
    const sc   = SIZE / 320;             // scale factor (1 at 320, 1.5 at 480)

    // Physical pixels = logical × DPR for crisp rendering
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // all coords below are logical

    const cx      = SIZE / 2;
    const ringW   = Math.round(10 * sc);
    const capR    = Math.round(22 * sc);
    const r       = cx - capR - Math.round(2 * sc); // wheel radius
    const equalSweep = (Math.PI * 2) / segments.length;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // ── Drop shadow
    ctx.save();
    ctx.shadowColor   = "rgba(0,0,0,0.45)";
    ctx.shadowBlur    = Math.round(28 * sc);
    ctx.shadowOffsetY = Math.round(6 * sc);
    ctx.beginPath();
    ctx.arc(cx, cx, r + ringW, 0, Math.PI * 2);
    ctx.fillStyle = "#F59E0B";
    ctx.fill();
    ctx.restore();

    // ── Gold outer ring
    ctx.beginPath();
    ctx.arc(cx, cx, r + ringW, 0, Math.PI * 2);
    ctx.fillStyle = "#F59E0B";
    ctx.fill();

    // ── Slices
    const n          = segments.length;
    const baseFontPx = n <= 4 ? 15 : n <= 6 ? 13 : 11;
    let   angle      = rotation - Math.PI / 2;

    segments.forEach((seg) => {
      const sweep = equalSweep;

      // Filled slice
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.arc(cx, cx, r, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle    = seg.color;
      ctx.fill();
      ctx.strokeStyle  = "#ffffff";
      ctx.lineWidth    = Math.round(3 * sc);
      ctx.stroke();

      // Label — truncate at 10 chars, fit to 80% of slice radius
      ctx.save();
      ctx.translate(cx, cx);
      ctx.rotate(angle + sweep / 2);
      ctx.textAlign    = "right";
      ctx.fillStyle    = "#ffffff";
      ctx.shadowColor  = "rgba(0,0,0,0.6)";
      ctx.shadowBlur   = 5;

      let txt      = seg.label.length > 10 ? seg.label.slice(0, 10) + "…" : seg.label;
      const xOff   = Math.round(12 * sc);
      const maxW   = (r - xOff) * 0.8;
      let   fSize  = Math.round(baseFontPx * sc);

      ctx.font = `bold ${fSize}px system-ui, -apple-system, sans-serif`;
      while (ctx.measureText(txt).width > maxW && fSize > 7) {
        fSize--;
        ctx.font = `bold ${fSize}px system-ui, -apple-system, sans-serif`;
      }

      ctx.fillText(txt, r - xOff, Math.round(4 * sc));
      ctx.restore();

      angle += sweep;
    });

    // ── Center cap
    const capGrad = ctx.createRadialGradient(cx - Math.round(4 * sc), cx - Math.round(4 * sc), Math.round(2 * sc), cx, cx, capR);
    capGrad.addColorStop(0, "#fde68a");
    capGrad.addColorStop(1, "#b45309");
    ctx.beginPath();
    ctx.arc(cx, cx, capR, 0, Math.PI * 2);
    ctx.fillStyle   = capGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth   = Math.round(2 * sc);
    ctx.stroke();

    // ── Arrow (red triangle pointing down from top)
    const arrowHalfW = Math.round(18 * sc);
    const arrowBaseY = Math.round(2 * sc);
    const arrowTipY  = cx - r + Math.round(2 * sc);

    ctx.beginPath();
    ctx.moveTo(cx, arrowTipY);
    ctx.lineTo(cx - arrowHalfW, arrowBaseY);
    ctx.lineTo(cx + arrowHalfW, arrowBaseY);
    ctx.closePath();
    ctx.fillStyle   = "#EF4444";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur  = Math.round(8 * sc);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth   = Math.round(2.5 * sc);
    ctx.shadowBlur  = 0;
    ctx.stroke();

  }, [segments, rotation, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        minWidth: size,
        filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.35))",
      }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SpinPage() {
  const { business_id: businessId } = useParams<{ business_id: string }>();

  const [step, setStep] = useState<"form" | "review" | "wheel" | "result">("form");
  const [wheel, setWheel] = useState<WheelData | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("+33 ");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState<string | null>(null);

  // Phone verification
  const [codeStep,    setCodeStep]    = useState(false);
  const [verifCode,   setVerifCode]   = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Google review mode
  const [reviewOpened,   setReviewOpened]   = useState(false);
  const [reviewVerifying, setReviewVerifying] = useState(false);
  const [reviewError,    setReviewError]    = useState<string | null>(null);

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
      sb.from("spin_wheels").select("id, is_active, frequency, segments, require_google_review").eq("business_id", businessId).maybeSingle(),
      sb.from("businesses").select("business_name, google_place_id").eq("id", businessId).maybeSingle(),
    ]).then(([wRes, bRes]) => {
      if (wRes.data) setWheel(wRes.data as WheelData);
      if (bRes.data) setBusiness(bRes.data as BusinessData);
      setLoading(false);
    });
  }, [businessId]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // Strip everything except leading + and digits — used on both client and server
  function normalizePhone(p: string) { return p.replace(/[^+\d]/g, ""); }
  function isE164(p: string) { return /^\+[1-9]\d{6,14}$/.test(normalizePhone(p)); }

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

  const startSpin = useCallback(() => {
    if (!wheel || spinning) return;
    const segs = wheel.segments;
    const idx = pickSegment(segs);
    setWonIndex(idx);

    const segSweep = (Math.PI * 2) / segs.length;
    const cumAngle = idx * segSweep;
    const landingOffset = cumAngle + segSweep * (0.25 + Math.random() * 0.5);

    const TAU = Math.PI * 2;
    const delta = (((-landingOffset - rotation) % TAU) + TAU) % TAU;

    startRotRef.current = rotation;
    targetRotRef.current = rotation + delta + TAU * 6;
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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wheel) return;
    setError(null);
    if (!isE164(phone)) {
      setError("Format invalide. Exemple : +33 6 12 34 56 78 ou +41 76 123 45 67");
      return;
    }
    setSendingCode(true);
    const res = await fetch("/api/verify/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizePhone(phone) }),
    });
    const data = await res.json();
    setSendingCode(false);
    if (!res.ok) { setError(data.error ?? "Erreur lors de l'envoi du SMS."); return; }
    setCodeStep(true);
    setResendTimer(30);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setSendingCode(true);
    const res = await fetch("/api/verify/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizePhone(phone) }),
    });
    const data = await res.json();
    setSendingCode(false);
    if (!res.ok) { setError(data.error ?? "Erreur."); return; }
    setResendTimer(30);
  };

  const handleVerifyAndSpin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wheel) return;
    setError(null);
    if (verifCode.length !== 4) { setError("Entrez les 4 chiffres du code."); return; }
    setSubmitting(true);

    // 1. Verify SMS code
    const vRes = await fetch("/api/verify/check-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizePhone(phone), code: verifCode }),
    });
    const vData = await vRes.json();
    if (!vData.verified) {
      setError(vData.error ?? "Code invalide ou expiré.");
      setSubmitting(false);
      return;
    }

    // 2. Anti-doublon check (server-side)
    const eligRes = await fetch("/api/spin/check-eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wheelId: wheel.id, phone: normalizePhone(phone), frequency: wheel.frequency }),
    });
    const eligData = await eligRes.json();
    if (!eligData.eligible) {
      setAlreadyPlayed(eligData.message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);

    // 3. Google review gate?
    const needsReview = wheel.require_google_review && !!business?.google_place_id;
    if (needsReview) {
      setStep("review");
    } else {
      setStep("wheel");
      setTimeout(startSpin, 600);
    }
  };

  // After user confirms they left a review (Mode 2) — real Google API verification
  const handleReviewConfirmed = async () => {
    setReviewVerifying(true);
    setReviewError(null);
    try {
      const res = await fetch("/api/spin/verify-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await res.json() as { verified: boolean; message?: string };
      if (data.verified) {
        setStep("wheel");
        setTimeout(startSpin, 600);
      } else {
        setReviewError(data.message ?? "Avis non trouvé. Réessayez.");
      }
    } catch {
      setReviewError("Erreur réseau. Réessayez.");
    } finally {
      setReviewVerifying(false);
    }
  };

  // Replay — server check then spin directly (no new SMS needed)
  const handleReplay = async () => {
    if (!wheel) return;
    setError(null);
    setSubmitting(true);

    const eligRes = await fetch("/api/spin/check-eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wheelId: wheel.id, phone: normalizePhone(phone), frequency: wheel.frequency }),
    });
    const eligData = await eligRes.json();

    if (!eligData.eligible) {
      setAlreadyPlayed(eligData.message);
      setWonIndex(null);
      setStep("form");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setWonIndex(null);
    setStep("wheel");
    setTimeout(startSpin, 600);
  };

  const saveResult = useCallback(async () => {
    if (!wheel || wonIndex === null) return;
    const sb = createAnonClient();
    const reward = wheel.segments[wonIndex]?.reward ?? null;
    const cleanPhone = normalizePhone(phone);
    // Always insert a new row — multiple rows per phone is intentional for replay tracking
    await sb.from("spin_results").insert({
      wheel_id: wheel.id,
      first_name: firstName.trim(),
      phone: cleanPhone,
      reward,
    });
    await sb.from("spin_entries").insert({
      wheel_id: wheel.id,
      phone: cleanPhone,
      last_spin_at: new Date().toISOString(),
      reward_won: reward,
    });
  }, [wheel, wonIndex, firstName, phone]);

  useEffect(() => {
    if (step === "result") saveResult();
  }, [step, saveResult]);

  const won = wheel && wonIndex !== null ? wheel.segments[wonIndex] : null;
  const hasReward = !!won?.reward;
  const canReplay = wheel?.frequency !== "once" && !hasReward;

  const googleMapsUrl = business?.google_place_id
    ? `https://www.google.com/maps/search/?api=1&query_place_id=${business.google_place_id}`
    : null;
  const googleReviewUrl = business?.google_place_id
    ? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
    : null;

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
              ) : codeStep ? (
                // ── Code verification ──
                <form onSubmit={handleVerifyAndSpin} className="space-y-5">
                  {error && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">{error}</div>}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 text-center">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Code envoyé par SMS au</p>
                    <p className="text-base font-bold text-amber-900">{normalizePhone(phone)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Code de vérification *</label>
                    <input
                      type="text" inputMode="numeric" maxLength={4} required autoFocus
                      value={verifCode}
                      onChange={e => setVerifCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="• • • •"
                      className="w-full text-center text-3xl font-bold tracking-[0.6em] border-2 border-gray-200 rounded-2xl px-4 py-4 bg-gray-50 focus:outline-none focus:border-amber-400 text-black"
                    />
                    <p className="text-xs text-gray-400 mt-2 text-center">Le code expire dans 10 minutes</p>
                  </div>
                  <button type="submit" disabled={submitting || verifCode.length !== 4}
                    className="w-full py-4 rounded-2xl font-black text-white text-base shadow-lg disabled:opacity-50 transition-all active:scale-95"
                    style={{ background: "linear-gradient(135deg, #3E1F0A, #6B3A2A)" }}>
                    {submitting ? "Vérification…" : "🎰 Vérifier et continuer"}
                  </button>
                  <button type="button" onClick={handleResend} disabled={sendingCode || resendTimer > 0}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50 py-1">
                    {resendTimer > 0 ? `Renvoyer dans ${resendTimer}s` : sendingCode ? "Envoi…" : "Renvoyer le code"}
                  </button>
                  <button type="button" onClick={() => { setCodeStep(false); setVerifCode(""); setError(null); }}
                    className="w-full text-xs text-gray-400 hover:text-gray-500">← Modifier mon numéro</button>
                </form>
              ) : (
                // ── Phone input ──
                <>
                  <div className="text-center mb-7">
                    <h2 className="text-xl font-black text-gray-900">Tentez votre chance !</h2>
                    <p className="text-gray-400 text-sm mt-1">Entrez vos infos pour faire tourner la roue 🍀</p>
                  </div>
                  <form onSubmit={handleSendCode} className="space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">{error}</div>}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prénom *</label>
                      <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Marie"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Téléphone *</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+33 6 12 34 56 78"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition" />
                      <p className="text-xs text-gray-400 mt-1.5 ml-1">Format international requis · ex : +33 6 12 34 56 78</p>
                    </div>
                    <button type="submit" disabled={sendingCode}
                      className="w-full py-4 rounded-2xl font-black text-white text-base shadow-lg disabled:opacity-50 transition-all active:scale-95 mt-2"
                      style={{ background: "linear-gradient(135deg, #3E1F0A, #6B3A2A)" }}>
                      {sendingCode ? "Envoi du code…" : "📱 Recevoir le code par SMS"}
                    </button>
                  </form>
                </>
              )}
            </>
          )}

          {/* ── Step: review (Mode 2 — Google review verified before spinning) ── */}
          {step === "review" && (
            <div className="flex flex-col items-center text-center gap-6 py-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
                style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
                ⭐
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Dernière étape !</h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Laissez un avis Google sur{" "}
                  <strong className="text-gray-800">{business?.business_name}</strong>{" "}
                  pour débloquer la roue.
                </p>
              </div>

              <div className="w-full space-y-3">
                {/* 1 — Open review URL */}
                {googleReviewUrl && (
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { setReviewOpened(true); setReviewError(null); }}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-base shadow-lg transition-all active:scale-95"
                    style={{ background: "linear-gradient(135deg, #3E1F0A, #6B3A2A)", color: "#fff" }}
                  >
                    ⭐ Laisser mon avis Google
                  </a>
                )}

                {/* 2 — Confirm + verify */}
                <button
                  onClick={handleReviewConfirmed}
                  disabled={reviewVerifying}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 ${
                    reviewOpened
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {reviewVerifying
                    ? "Vérification en cours…"
                    : reviewOpened
                    ? "✓ J'ai laissé mon avis → Vérifier"
                    : "J'ai déjà laissé un avis"}
                </button>

                {/* Error message */}
                {reviewError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">
                    {reviewError}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Votre avis aide {business?.business_name} à se faire connaître. Merci !
              </p>
            </div>
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
                    <h2 className="text-2xl font-black text-gray-900">Tentez encore lors de votre prochaine visite !</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      La chance vous sourit peut-être la prochaine fois.
                    </p>
                  </>
                )}

                {/* Google review — Mode 1 only (optional, after result) */}
                {!wheel.require_google_review && googleReviewUrl && (
                  <a
                    href={googleReviewUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    ⭐ Laisser un avis Google
                  </a>
                )}

                {/* Rejouer button — only if lost AND frequency !== once */}
                {canReplay && (
                  <button
                    onClick={handleReplay}
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? "Vérification…" : "🔄 Rejouer"}
                  </button>
                )}

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
