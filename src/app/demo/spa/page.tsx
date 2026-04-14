"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DemoBanner from "@/components/DemoBanner";

// ─── Theme ────────────────────────────────────────────────────────────────────
const THEME = {
  primary: "#2C4A3E",
  accent: "#8FBF9F",
  light: "#EEF5F1",
  name: "L'Essence Spa",
  subtitle: "Lausanne",
  emoji: "🧖",
  whatsapp: "Bonjour, je suis intéressée par Stampify pour mon spa. Pouvez-vous me contacter ?",
  stamps: 10,
  reward: "1 soin offert",
  // 6 segments — segment 0 is the guaranteed prize
  spinSegments: [
    { label: "Soin visage offert 🧖", color: "#2C4A3E" },
    { label: "−10%", color: "#8FBF9F" },
    { label: "Massage offert", color: "#3D6B58" },
    { label: "−20%", color: "#5A8F7B" },
    { label: "Soin corps", color: "#2C4A3E" },
    { label: "Surprise ✨", color: "#8FBF9F" },
  ],
};

// ─── QR Code SVG fictif ───────────────────────────────────────────────────────
function FakeQR({ color }: { color: string }) {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,1,1,1,0,0,1,0,1,1,0,1,0,0,1],
    [0,1,0,1,0,1,0,0,1,1,0,1,0,0,1,0,1,1,0],
    [1,1,0,0,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1],
    [0,0,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,0,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,1,1,0,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1],
  ];
  return (
    <svg viewBox="0 0 19 19" className="w-40 h-40">
      {pattern.map((row, y) =>
        row.map((cell, x) =>
          cell ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} /> : null
        )
      )}
    </svg>
  );
}

// ─── Spin Wheel ───────────────────────────────────────────────────────────────
// The wheel always stops on segment 0 ("Soin visage offert 🧖").
//
// Geometry:
//   - 6 segments × 60° each.
//   - Pointer is at the top of the canvas (canvas angle = −π/2).
//   - Segment i occupies angles [currentAngle + i·arc, currentAngle + (i+1)·arc].
//   - For segment 0 midpoint at the pointer:
//       −π/2 − currentAngle  (mod 2π)  ≡  arc/2  =  π/6
//     ⇒  currentAngle  ≡  −π/2 − π/6  =  −2π/3  (mod 2π)
//   - TARGET_STOP = −2π/3  (+ large multiple of 2π so the wheel spins visibly)
//
// Result calculation (must match the visual):
//   pointerInSegmentSpace = ((−π/2 − currentAngle) % 2π + 2π) % 2π
//   idx = floor(pointerInSegmentSpace / arc)

const TWO_PI = 2 * Math.PI;
// Base stop angle that puts segment 0 under the pointer
const BASE_STOP = -TWO_PI / 3; // −2π/3

function SpinWheel({
  segments,
  accent,
  primary,
}: {
  segments: { label: string; color: string }[];
  accent: string;
  primary: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const currentAngle = useRef(0);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;
    const arc = TWO_PI / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Shadow ring
    ctx.save();
    ctx.shadowColor = "rgba(44,74,62,0.3)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();

    segments.forEach((seg, i) => {
      const start = angle + i * arc;
      const end = start + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px system-ui";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 4;
      ctx.fillText(seg.label, r - 10, 4);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, TWO_PI);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🧖", cx, cy);
  };

  useEffect(() => {
    drawWheel(currentAngle.current);
  });

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Compute the target stop angle:
    // We want to end at BASE_STOP (mod 2π), adding at least 4 full rotations for effect.
    // Find how many full rotations bring us above currentAngle:
    const fullRotations = 4; // always spin at least 4 × 360°
    const targetBase = BASE_STOP + fullRotations * TWO_PI; // ≈ 24.3 rad
    // Ensure target > currentAngle (if user re-spins, add extra rounds)
    const extraRounds =
      currentAngle.current >= targetBase
        ? Math.ceil((currentAngle.current - targetBase) / TWO_PI) + 1
        : 0;
    const targetAngle = targetBase + extraRounds * TWO_PI;

    const duration = 3000;
    const startTime = performance.now();
    const startAngle = currentAngle.current;
    const totalTravel = targetAngle - startAngle;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out (quartic)
      const ease = 1 - Math.pow(1 - progress, 4);
      currentAngle.current = startAngle + totalTravel * ease;
      drawWheel(currentAngle.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        // Determine result from pointer position (top = −π/2)
        const arc = TWO_PI / segments.length;
        const pointerInSegSpace =
          ((-Math.PI / 2 - currentAngle.current) % TWO_PI + TWO_PI) % TWO_PI;
        const idx = Math.floor(pointerInSegSpace / arc) % segments.length;
        setResult(segments[idx].label);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Pointer */}
      <div className="relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `20px solid ${accent}`,
          }}
        />
        <canvas ref={canvasRef} width={240} height={240} className="drop-shadow-xl" />
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="px-8 py-3 rounded-2xl font-black text-white text-lg shadow-lg transition-all active:scale-95 disabled:opacity-60"
        style={{ backgroundColor: primary }}
      >
        {spinning ? "⏳ La roue tourne…" : "🎰 Tourner !"}
      </button>

      {result && (
        <div
          className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg animate-bounce"
          style={{ backgroundColor: accent }}
        >
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-black text-white text-lg">{result}</p>
            <p className="text-white/80 text-xs">Montrez cet écran au comptoir !</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SpaDemo() {
  const [stamps, setStamps] = useState(4);
  const [showQR, setShowQR] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addingStamp, setAddingStamp] = useState(false);
  const maxStamps = THEME.stamps;

  const addStamp = () => {
    if (stamps >= maxStamps || addingStamp) return;
    setAddingStamp(true);
    setTimeout(() => {
      setStamps((s) => Math.min(s + 1, maxStamps));
      setAddingStamp(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DemoBanner />

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/demo"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              />
            </svg>
            Toutes les démos
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">{THEME.emoji}</span>
            <span className="font-black text-gray-900 text-sm">{THEME.name}</span>
          </div>
          <Link
            href="/signup"
            className="text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: THEME.primary }}
          >
            Créer le mien
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-16">

        {/* ── SECTION 1 : SITE VITRINE ─────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
              style={{ backgroundColor: THEME.accent }}
            >
              1
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-xl">Site vitrine</h2>
              <p className="text-gray-500 text-sm">Mini-aperçu de votre présence en ligne</p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            {/* Hero */}
            <div
              className="relative h-56 sm:h-72 flex flex-col items-center justify-center text-center px-6"
              style={{ backgroundColor: THEME.primary }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25% 50%, #8FBF9F 0%, transparent 55%), radial-gradient(circle at 75% 20%, #EEF5F1 0%, transparent 40%)",
                }}
              />
              <span className="text-6xl mb-4 drop-shadow-lg">{THEME.emoji}</span>
              <h3 className="text-3xl font-black text-white mb-1">{THEME.name}</h3>
              <p className="text-sm font-medium mb-4" style={{ color: THEME.accent }}>
                {THEME.subtitle} · Institut de beauté
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: THEME.accent, color: THEME.primary }}
              >
                Voir le site complet →
              </button>
            </div>

            {/* Info */}
            <div className="grid sm:grid-cols-3 gap-0 bg-white">
              <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-100">
                <h4 className="font-black text-gray-900 mb-2">Notre univers</h4>
                <p className="text-sm text-gray-600">
                  L&apos;Essence Spa vous accueille dans un espace de sérénité absolue. Soins du
                  visage, massages bien-être, rituals corps — une parenthèse de douceur rien que pour
                  vous.
                </p>
              </div>
              <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-100">
                <h4 className="font-black text-gray-900 mb-3">Nos soins</h4>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  {[
                    "Soin visage — 80 CHF",
                    "Massage relaxant — 90 CHF",
                    "Ritual corps — 120 CHF",
                    "Gommage — 60 CHF",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span style={{ color: THEME.accent }}>•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6">
                <h4 className="font-black text-gray-900 mb-3">Nous trouver</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 14 av. de la Gare, Lausanne</p>
                  <p>🕐 Mar–Sam : 9h–19h</p>
                  <p>🕐 Dim : 10h–17h</p>
                  <p>📞 021 XXX XX XX</p>
                </div>
                <div className="mt-4 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">📍 Carte interactive</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2 : CARTE FIDÉLITÉ ───────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
              style={{ backgroundColor: THEME.accent }}
            >
              2
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-xl">Carte fidélité digitale</h2>
              <p className="text-gray-500 text-sm">Cliquez sur un tampon pour simuler une visite</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Card header */}
            <div className="p-5 sm:p-8" style={{ backgroundColor: THEME.primary }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p
                    className="text-xs font-semibold mb-1 tracking-wider"
                    style={{ color: THEME.accent }}
                  >
                    CARTE BIEN-ÊTRE
                  </p>
                  <h3 className="text-xl font-black text-white">{THEME.name}</h3>
                  <p className="text-white/60 text-xs mt-0.5">Bonjour, Sophie 🧖</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white">{stamps}</span>
                  <span className="text-white/60 text-sm">/{maxStamps}</span>
                  <p className="text-xs mt-0.5" style={{ color: THEME.accent }}>
                    soins
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-white/20 mb-6">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(stamps / maxStamps) * 100}%`,
                    backgroundColor: THEME.accent,
                  }}
                />
              </div>

              {/* Stamps grid — 5 columns × 2 rows */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {Array.from({ length: maxStamps }).map((_, i) => (
                  <button
                    key={i}
                    onClick={addStamp}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-xl transition-all duration-300 border-2 ${
                      i < stamps
                        ? "scale-100 border-transparent"
                        : "scale-95 border-white/30 bg-white/10"
                    } ${i === stamps && !addingStamp ? "animate-pulse" : ""}`}
                    style={i < stamps ? { backgroundColor: THEME.accent } : {}}
                    title={i < stamps ? "Tampon validé" : "Cliquer pour ajouter"}
                  >
                    {i < stamps ? "🌿" : <span className="text-white/40 text-lg">+</span>}
                  </button>
                ))}
              </div>

              <p className="text-center text-white/60 text-xs">
                {stamps >= maxStamps
                  ? "🎉 Félicitations ! Réclamez votre soin offert."
                  : `Encore ${maxStamps - stamps} soin${maxStamps - stamps > 1 ? "s" : ""} pour ${THEME.reward}`}
              </p>
            </div>

            {/* Card footer */}
            <div
              className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between"
              style={{ backgroundColor: THEME.light }}
            >
              <div>
                <p className="font-bold text-gray-900 text-sm">🎁 Récompense : {THEME.reward}</p>
                <p className="text-xs text-gray-500 mt-0.5">Valable 60 jours après l&apos;obtention</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addStamp}
                  disabled={stamps >= maxStamps}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-40"
                  style={{ backgroundColor: THEME.primary }}
                >
                  + Tampon
                </button>
                <button
                  onClick={() => {
                    setStamps(0);
                    setShowQR(false);
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-sm border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* QR Section */}
            <div className="px-5 sm:px-8 pb-6 flex flex-col items-center gap-4">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 shadow-md"
                style={{ backgroundColor: THEME.accent }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <path d="M14 14h.01M14 18h.01M18 14h.01M18 18h.01" />
                </svg>
                {showQR ? "Masquer le QR code" : "📱 Scanner le QR code"}
              </button>

              {showQR && (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                    <FakeQR color={THEME.primary} />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Présentez ce QR au comptoir pour valider votre soin
                  </p>
                  <div
                    className="flex gap-2 items-center text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: THEME.light, color: THEME.primary }}
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: THEME.accent }}
                    />
                    QR actif — expire dans 4:59
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 3 : ROUE DE LA FORTUNE ─────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
              style={{ backgroundColor: THEME.accent }}
            >
              3
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-xl">Roue de la fortune</h2>
              <p className="text-gray-500 text-sm">Récompensez vos clients avec des soins surprise</p>
            </div>
          </div>

          <div
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 flex flex-col items-center"
          >
            <p className="text-center text-gray-500 text-sm mb-8 max-w-sm">
              Activée après chaque visite ou avis Google — vos clients adorent ça !
            </p>
            <SpinWheel
              segments={THEME.spinSegments}
              accent={THEME.accent}
              primary={THEME.primary}
            />
          </div>
        </section>

        {/* ── SECTION 4 : CTA ──────────────────────────────────────────── */}
        <section>
          <div
            className="rounded-3xl overflow-hidden shadow-xl"
            style={{ backgroundColor: THEME.primary }}
          >
            <div className="p-8 sm:p-12 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-black text-white mb-3">
                Vous voulez ça<br />pour votre commerce ?
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Carte fidélité, roue de la fortune, site vitrine — tout en un. Prêt en moins de
                5 minutes, sans application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/41791234567?text=${encodeURIComponent(THEME.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contacter via WhatsApp
                </a>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                >
                  Essayer gratuitement →
                </Link>
              </div>
              <p className="text-white/40 text-xs mt-6">
                Sans engagement · Réponse sous 24h · Setup inclus
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── FULL SCREEN MODAL ─────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ backgroundColor: THEME.primary }}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{THEME.emoji}</span>
              <div>
                <h2 className="font-black text-white text-lg">{THEME.name}</h2>
                <p className="text-xs" style={{ color: THEME.accent }}>
                  Site vitrine complet
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero */}
            <div className="relative py-20 flex flex-col items-center text-center px-6">
              <span className="text-8xl mb-6 drop-shadow-2xl">{THEME.emoji}</span>
              <h1 className="text-5xl font-black text-white mb-3">{THEME.name}</h1>
              <p className="text-lg mb-2" style={{ color: THEME.accent }}>
                Institut de beauté · {THEME.subtitle}
              </p>
              <p className="text-white/60 text-sm max-w-md">
                Un cocon de sérénité au cœur de Lausanne. Soins sur mesure, massages
                thérapeutiques, rituels corps — votre bien-être est notre priorité absolue.
              </p>
              <div className="flex gap-3 mt-6">
                <span className="px-4 py-2 rounded-full text-sm font-semibold border border-white/20 text-white">
                  ⭐ 4.9/5 (147 avis)
                </span>
                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: THEME.accent, color: THEME.primary }}
                >
                  RDV disponibles
                </span>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white">
              <div className="max-w-3xl mx-auto px-6 py-12">
                <h3 className="font-black text-2xl text-gray-900 mb-8 text-center">
                  Nos prestations
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "Soin visage signature", price: "80 CHF", desc: "Nettoyage, massage, masque personnalisé" },
                    { name: "Massage relaxant", price: "90 CHF", desc: "Huiles essentielles, 60 minutes de détente" },
                    { name: "Ritual corps", price: "120 CHF", desc: "Gommage, enveloppement, massage complet" },
                    { name: "Gommage corps", price: "60 CHF", desc: "Exfoliation douce, peau veloutée" },
                    { name: "Soin anti-âge", price: "100 CHF", desc: "Actifs premium, résultats visibles" },
                    { name: "Forfait duo", price: "160 CHF", desc: "Massage relaxant pour deux, champagne offert" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-start justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <span
                        className="font-black text-lg ml-4 shrink-0"
                        style={{ color: THEME.primary }}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="py-10 px-6 text-center"
              style={{ backgroundColor: THEME.light }}
            >
              <p className="font-black text-gray-900 text-lg mb-1">{THEME.name}</p>
              <p className="text-gray-600 text-sm">14 av. de la Gare, Lausanne · 021 XXX XX XX</p>
              <p className="text-gray-400 text-xs mt-2">Mar–Sam 9h–19h · Dim 10h–17h · Lun fermé</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>
          Démo Stampify —{" "}
          <Link href="/demo" className="text-indigo-500 hover:underline">
            Voir toutes les démos
          </Link>{" "}
          ·{" "}
          <Link href="/signup" className="text-indigo-500 hover:underline">
            Créer mon programme
          </Link>
        </p>
      </footer>
    </div>
  );
}
