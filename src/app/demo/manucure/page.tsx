"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DemoBanner from "@/components/DemoBanner";

const THEME = {
  primary: "#D4AF37",
  primaryDark: "#8B6914",
  accent: "#D4AF37",
  light: "#FFF5F7",
  card: "#FFF0F3",
  name: "Nail Studio",
  subtitle: "Genève",
  emoji: "💅",
  whatsapp: "Bonjour, je suis intéressée par Stampify pour mon salon de manucure. Pouvez-vous me contacter ?",
  stamps: 6,
  reward: "1 soin offert",
  spinSegments: [
    { label: "Soin offert", color: "#C9A0B0" },
    { label: "−10%", color: "#D4AF37" },
    { label: "Nail art offert", color: "#E8B4BF" },
    { label: "Retente !", color: "#DBA0B0" },
    { label: "Double tampon", color: "#C9A0B0" },
    { label: "−20%", color: "#D4AF37" },
    { label: "Vernis offert", color: "#E8B4BF" },
    { label: "Retente !", color: "#DBA0B0" },
  ],
};

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

function SpinWheel({ segments, accent }: { segments: { label: string; color: string }[]; accent: string; primary: string }) {
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
    const arc = (2 * Math.PI) / segments.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.shadowColor = "rgba(212,175,55,0.3)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
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
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.fillText(seg.label, r - 10, 4);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💅", cx, cy);
  };

  useEffect(() => { drawWheel(currentAngle.current); });

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const extraSpins = (5 + Math.random() * 5) * 2 * Math.PI;
    const duration = 4000;
    const start = performance.now();
    const startAngle = currentAngle.current;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      currentAngle.current = startAngle + extraSpins * ease;
      drawWheel(currentAngle.current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const arc = (2 * Math.PI) / segments.length;
        const normalised = (((-currentAngle.current) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const idx = Math.floor(normalised / arc) % segments.length;
        setResult(segments[idx].label);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0"
          style={{ borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `20px solid ${accent}` }} />
        <canvas ref={canvasRef} width={240} height={240} className="drop-shadow-xl" />
      </div>
      <button onClick={spin} disabled={spinning}
        className="px-8 py-3 rounded-2xl font-black text-white text-lg shadow-lg transition-all active:scale-95 disabled:opacity-60"
        style={{ backgroundColor: "#C9A0B0" }}>
        {spinning ? "⏳ La roue tourne…" : "🎰 Tourner !"}
      </button>
      {result && (
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg animate-bounce" style={{ backgroundColor: accent }}>
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-black text-white text-lg">{result}</p>
            <p className="text-white/80 text-xs">Montrez cet écran à votre esthéticienne !</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManucureDemo() {
  const [stamps, setStamps] = useState(2);
  const [showQR, setShowQR] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addingStamp, setAddingStamp] = useState(false);
  const maxStamps = THEME.stamps;

  const addStamp = () => {
    if (stamps >= maxStamps || addingStamp) return;
    setAddingStamp(true);
    setTimeout(() => { setStamps((s) => Math.min(s + 1, maxStamps)); setAddingStamp(false); }, 300);
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: THEME.light }}>
      <DemoBanner />

      <header className="bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/demo" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" />
            </svg>
            Toutes les démos
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">{THEME.emoji}</span>
            <span className="font-black text-gray-900 text-sm">{THEME.name}</span>
          </div>
          <Link href="/signup" className="text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors" style={{ backgroundColor: "#C9A0B0" }}>
            Créer le mien
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-16">

        {/* Section 1 — Vitrine */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-sm">1</div>
            <div>
              <h2 className="font-black text-gray-900 text-xl">Site vitrine</h2>
              <p className="text-gray-500 text-sm">Mini-aperçu de votre présence en ligne</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-pink-100">
            <div className="relative h-56 sm:h-72 flex flex-col items-center justify-center text-center px-6" style={{ background: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFD1DC 100%)" }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #D4AF37 0%, transparent 40%)" }} />
              <span className="text-6xl mb-4 drop-shadow-lg">{THEME.emoji}</span>
              <h3 className="text-3xl font-black text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>{THEME.name}</h3>
              <p className="text-sm font-semibold mb-4 text-white/80">{THEME.subtitle} · Beauté & bien-être</p>
              <button onClick={() => setShowModal(true)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 text-white shadow-lg"
                style={{ backgroundColor: THEME.accent }}>
                Voir le site complet →
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-0 bg-white">
              <div className="p-6 border-b sm:border-b-0 sm:border-r border-pink-50">
                <h4 className="font-black text-gray-900 mb-2">Notre univers</h4>
                <p className="text-sm text-gray-600">Un espace dédié à votre beauté et votre bien-être. Nail art créatif, manucure classique, soins des mains — tout pour vous faire sentir parfaite.</p>
              </div>
              <div className="p-6 border-b sm:border-b-0 sm:border-r border-pink-50">
                <h4 className="font-black text-gray-900 mb-3">Nos soins</h4>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  {["Manucure classique — 35€", "Pose gel — 55€", "Nail art — à partir de 5€", "Soin mains — 25€"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><span className="text-pink-400">•</span> {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-6">
                <h4 className="font-black text-gray-900 mb-3">Nous trouver</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 18 Rue du Stand 18, Genève</p>
                  <p>🕐 Mar–Sam : 9h–19h</p>
                  <p>🕐 Dim : 10h–17h</p>
                  <p>📞 04 72 XX XX XX</p>
                </div>
                <div className="mt-4 h-24 rounded-xl overflow-hidden bg-pink-50 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">📍 Carte interactive</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Carte fidélité */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-sm">2</div>
            <div>
              <h2 className="font-black text-gray-900 text-xl">Carte fidélité digitale</h2>
              <p className="text-gray-500 text-sm">Cliquez sur un tampon pour simuler une visite</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
            <div className="p-5 sm:p-8" style={{ background: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 60%, #FFD1DC 100%)" }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold mb-1 text-white/80 tracking-wider">CARTE BEAUTÉ</p>
                  <h3 className="text-xl font-black text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>{THEME.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">Bonjour, Emma 💅</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white">{stamps}</span>
                  <span className="text-white/70 text-sm">/{maxStamps}</span>
                  <p className="text-xs mt-0.5 text-white/70">visites</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/30 mb-6">
                <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${(stamps / maxStamps) * 100}%`, backgroundColor: THEME.accent }} />
              </div>
              <div className="grid grid-cols-6 gap-3 mb-4">
                {Array.from({ length: maxStamps }).map((_, i) => (
                  <button key={i} onClick={addStamp}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-xl transition-all duration-300 border-2 ${
                      i < stamps ? "scale-100 border-transparent shadow-md" : "scale-95 border-white/40 bg-white/20"
                    } ${i === stamps && !addingStamp ? "animate-pulse" : ""}`}
                    style={i < stamps ? { backgroundColor: THEME.accent } : {}}
                    title={i < stamps ? "Visite validée" : "Cliquer pour ajouter"}>
                    {i < stamps ? "💅" : <span className="text-white/50 text-lg">+</span>}
                  </button>
                ))}
              </div>
              <p className="text-center text-white/70 text-xs">
                {stamps >= maxStamps ? "🎉 Félicitations ! Votre soin est offert !" : `Encore ${maxStamps - stamps} visite${maxStamps - stamps > 1 ? "s" : ""} pour ${THEME.reward}`}
              </p>
            </div>
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between" style={{ backgroundColor: THEME.light }}>
              <div>
                <p className="font-bold text-gray-900 text-sm">🎁 Récompense : {THEME.reward}</p>
                <p className="text-xs text-gray-500 mt-0.5">Valable 60 jours après l&apos;obtention</p>
              </div>
              <div className="flex gap-3">
                <button onClick={addStamp} disabled={stamps >= maxStamps}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-40"
                  style={{ backgroundColor: "#C9A0B0" }}>
                  + Tampon
                </button>
                <button onClick={() => { setStamps(0); setShowQR(false); }}
                  className="px-4 py-2 rounded-xl font-bold text-sm border border-pink-200 bg-white text-gray-600 hover:bg-pink-50 transition-all active:scale-95">
                  Reset
                </button>
              </div>
            </div>
            <div className="px-5 sm:px-8 pb-6 flex flex-col items-center gap-4">
              <button onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 shadow-md"
                style={{ backgroundColor: THEME.accent }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  <path d="M14 14h.01M14 18h.01M18 14h.01M18 18h.01"/>
                </svg>
                {showQR ? "Masquer le QR code" : "📱 Scanner le QR code"}
              </button>
              {showQR && (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-pink-100">
                    <FakeQR color="#C9A0B0" />
                  </div>
                  <p className="text-xs text-gray-500 text-center">Présentez ce QR à votre esthéticienne pour valider votre visite</p>
                  <div className="flex gap-2 items-center text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: "#FFE4E8", color: "#C9A0B0" }}>
                    <span className="w-2 h-2 rounded-full animate-pulse bg-pink-400" />
                    QR actif — expire dans 4:59
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 3 — Roue */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-sm">3</div>
            <div>
              <h2 className="font-black text-gray-900 text-xl">Roue de la fortune</h2>
              <p className="text-gray-500 text-sm">Surprenez vos clientes avec des lots beauté</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8 sm:p-12 flex flex-col items-center">
            <p className="text-center text-gray-500 text-sm mb-8 max-w-sm">Activée après chaque visite ou avis Google — vos clientes adorent ça !</p>
            <SpinWheel segments={THEME.spinSegments} accent={THEME.accent} primary="#C9A0B0" />
          </div>
        </section>

        {/* Section 4 — CTA */}
        <section>
          <div className="rounded-3xl overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 60%, #FFD1DC 100%)" }}>
            <div className="p-8 sm:p-12 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-black text-white mb-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                Vous voulez ça<br />pour votre commerce ?
              </h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">Carte fidélité, roue de la fortune, site vitrine — tout en un. Prêt en moins de 5 minutes, sans application.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`https://wa.me/41791342997?text=${encodeURIComponent(THEME.whatsapp)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contacter via WhatsApp
                </a>
                <Link href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/40 text-white hover:bg-white/20 transition-all">
                  Essayer gratuitement →
                </Link>
              </div>
              <p className="text-white/50 text-xs mt-6">Sans engagement · Réponse sous 24h · Setup inclus</p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFD1DC 100%)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{THEME.emoji}</span>
              <div>
                <h2 className="font-black text-white text-lg" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>{THEME.name}</h2>
                <p className="text-xs text-white/70">Site vitrine complet</p>
              </div>
            </div>
            <button onClick={() => setShowModal(false)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="relative py-20 flex flex-col items-center text-center px-6">
              <span className="text-8xl mb-6 drop-shadow-2xl">{THEME.emoji}</span>
              <h1 className="text-5xl font-black text-white mb-3" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>{THEME.name}</h1>
              <p className="text-lg mb-2 text-white/80">Institut de beauté · {THEME.subtitle}</p>
              <p className="text-white/60 text-sm max-w-md">Votre espace beauté sur-mesure. Nail art créatif, manucure de luxe, soins des mains et des pieds. Parce que vous le méritez.</p>
              <div className="flex gap-3 mt-6">
                <span className="px-4 py-2 rounded-full text-sm font-semibold border border-white/30 text-white">⭐ 4.9/5 (203 avis)</span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: THEME.accent }}>RDV disponibles</span>
              </div>
            </div>
            <div className="bg-white">
              <div className="max-w-3xl mx-auto px-6 py-12">
                <h3 className="font-black text-2xl text-gray-900 mb-8 text-center">Nos prestations</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "Manucure classique", price: "35€", desc: "Soin, lime, cuticules, vernis au choix" },
                    { name: "Pose de gel", price: "55€", desc: "Longue durée, couleur ou french" },
                    { name: "Nail art", price: "dès 5€", desc: "Motifs, strass, dégradé, peinture à la main" },
                    { name: "Soin mains", price: "25€", desc: "Exfoliation, masque, massage, vernis" },
                    { name: "Pédicure spa", price: "50€", desc: "Bain, soin, vernis, massage pieds" },
                    { name: "Forfait mariée", price: "120€", desc: "Mains + pieds + nail art sur mesure" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-start justify-between p-4 rounded-2xl border border-pink-100 hover:border-pink-200 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <span className="font-black text-lg ml-4 shrink-0" style={{ color: "#C9A0B0" }}>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="py-10 px-6 text-center" style={{ backgroundColor: THEME.light }}>
              <p className="font-black text-gray-900 text-lg mb-1">{THEME.name}</p>
              <p className="text-gray-600 text-sm">18 Rue du Stand 18, Genève · 04 72 XX XX XX</p>
              <p className="text-gray-400 text-xs mt-2">Mar–Sam 9h–19h · Dim 10h–17h · Lun fermé</p>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-pink-100 py-6 text-center text-xs text-gray-400 bg-white">
        <p>Démo Stampify — <Link href="/demo" className="text-indigo-500 hover:underline">Voir toutes les démos</Link> · <Link href="/signup" className="text-indigo-500 hover:underline">Créer mon programme</Link></p>
      </footer>
    </div>
  );
}
