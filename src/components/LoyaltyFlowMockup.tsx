"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    num: 1,
    label: "Le client scanne",
    sub: "Il pointe son appareil photo vers le QR code en caisse",
  },
  {
    num: 2,
    label: "Sa carte s'ouvre",
    sub: "La carte fidélité apparaît instantanément — sans app",
  },
  {
    num: 3,
    label: "Le tampon s'ajoute",
    sub: "Tu valides en un clic depuis ton tableau de bord",
  },
  {
    num: 4,
    label: "C'est dans la poche",
    sub: "Le client voit sa progression et revient pour la récompense",
  },
];

const STEP_DURATION = 2600;

function PhoneScan() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
      <style>{`
        @keyframes scanLine { 0%{top:56px} 100%{top:160px} }
        @keyframes scanPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes qrGlow { 0%,100%{box-shadow:0 0 0 0 rgba(29,158,117,0)} 50%{box-shadow:0 0 0 8px rgba(29,158,117,0.15)} }
      `}</style>
      {/* Phone */}
      <div style={{ position: "relative", width: 180, height: 320 }}>
        <svg width="180" height="320" viewBox="0 0 180 320" fill="none">
          <rect x="4" y="4" width="172" height="312" rx="28" fill="#1a1a2e"/>
          <rect x="4" y="4" width="172" height="312" rx="28" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
          <rect x="14" y="28" width="152" height="262" rx="10" fill="#f8f9fa"/>
          <rect x="62" y="10" width="56" height="14" rx="7" fill="#111"/>
        </svg>
        {/* Camera viewfinder overlay */}
        <div style={{
          position: "absolute", top: 50, left: 30, width: 120, height: 120,
          background: "rgba(0,0,0,0.05)", borderRadius: 8, overflow: "hidden",
        }}>
          {/* Corner brackets */}
          {[
            { top: 0, left: 0, borderTop: "3px solid #1d9e75", borderLeft: "3px solid #1d9e75" },
            { top: 0, right: 0, borderTop: "3px solid #1d9e75", borderRight: "3px solid #1d9e75" },
            { bottom: 0, left: 0, borderBottom: "3px solid #1d9e75", borderLeft: "3px solid #1d9e75" },
            { bottom: 0, right: 0, borderBottom: "3px solid #1d9e75", borderRight: "3px solid #1d9e75" },
          ].map((style, i) => (
            <div key={i} style={{ position: "absolute", width: 18, height: 18, ...style }} />
          ))}
          {/* QR code inside viewfinder */}
          <div style={{ position: "absolute", inset: 14, animation: "qrGlow 1.4s ease-in-out infinite" }}>
            <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
              <rect x="2" y="2" width="88" height="88" rx="6" fill="white"/>
              {/* QR pattern simplified */}
              <rect x="8" y="8" width="28" height="28" rx="3" fill="none" stroke="#0f172a" strokeWidth="2.5"/>
              <rect x="14" y="14" width="16" height="16" rx="1" fill="#0f172a"/>
              <rect x="56" y="8" width="28" height="28" rx="3" fill="none" stroke="#0f172a" strokeWidth="2.5"/>
              <rect x="62" y="14" width="16" height="16" rx="1" fill="#0f172a"/>
              <rect x="8" y="56" width="28" height="28" rx="3" fill="none" stroke="#0f172a" strokeWidth="2.5"/>
              <rect x="14" y="62" width="16" height="16" rx="1" fill="#0f172a"/>
              {/* data modules */}
              {[[48,8],[56,16],[64,24],[72,32],[48,32],[56,40],[48,48],[64,48],[72,48],[48,56],[56,56],[64,64],[72,64],[48,64],[56,72],[64,72],[72,72],[48,72],[56,80],[64,80]].map(([x,y], i) => (
                <rect key={i} x={x} y={y} width="6" height="6" rx="1" fill="#0f172a"/>
              ))}
              {/* Stampify logo center */}
              <text x="46" y="50" textAnchor="middle" fontSize="6" fill="#1d9e75" fontWeight="bold" fontFamily="sans-serif">S</text>
            </svg>
          </div>
          {/* Scan line */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, #1d9e75, transparent)",
            animation: "scanLine 1.2s linear infinite alternate",
          }} />
        </div>
        {/* Bottom text */}
        <div style={{
          position: "absolute", bottom: 48, left: 14, right: 14, textAlign: "center",
          fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, color: "#64748b",
          animation: "scanPulse 1.4s ease-in-out infinite",
        }}>
          📷 Pointe ton appareil photo
        </div>
      </div>
    </div>
  );
}

function PhoneCard({ stamps }: { stamps: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
      <div style={{ position: "relative", width: 180, height: 320 }}>
        <svg width="180" height="320" viewBox="0 0 180 320" fill="none">
          <rect x="4" y="4" width="172" height="312" rx="28" fill="#1a1a2e"/>
          <rect x="4" y="4" width="172" height="312" rx="28" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
          <rect x="14" y="28" width="152" height="262" rx="10" fill="#f2f2f7"/>
          <rect x="62" y="10" width="56" height="14" rx="7" fill="#111"/>
        </svg>
        {/* Card content on screen */}
        <div style={{ position: "absolute", top: 42, left: 24, right: 24 }}>
          {/* Loyalty card */}
          <div style={{
            background: "linear-gradient(135deg, #1d9e75, #0d7a5a)",
            borderRadius: 14, padding: "16px 14px", marginBottom: 10,
            boxShadow: "0 4px 16px rgba(29,158,117,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10 }}>☕</span>
              </div>
              <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 12, fontWeight: 700, color: "#fff" }}>Café Lumière</span>
            </div>
            <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 9, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>CARTE FIDÉLITÉ · 10 TAMPONS</div>
            {/* Stamp grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: i < stamps ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10,
                  transition: "all 0.3s",
                }}>
                  {i < stamps ? "☕" : ""}
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 11, color: "#64748b" }}>
            {stamps} tampon{stamps > 1 ? "s" : ""} sur 10 · Plus que {10 - stamps} !
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneStamp() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320, gap: 20 }}>
      <style>{`
        @keyframes stampBounce { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg);opacity:1} 80%{transform:scale(0.9) rotate(0deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes adminPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
      `}</style>
      {/* Admin side */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          background: "#0f172a", borderRadius: 14, padding: "12px 14px", width: 110,
          animation: "adminPulse 1.8s ease-in-out infinite",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 9, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>TABLEAU DE BORD</div>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "rgba(255,255,255,0.8)", marginBottom: 10 }}>Marie D. · 7→8 ☕</div>
          <div style={{
            background: "#1d9e75", borderRadius: 8, padding: "8px 0",
            fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 11, fontWeight: 600, color: "#fff",
            cursor: "pointer",
          }}>
            ✦ Ajouter tampon
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "#94a3b8", marginTop: 8 }}>Le commerçant</div>
      </div>

      {/* Arrow */}
      <div style={{ fontSize: 20 }}>→</div>

      {/* Client phone */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "relative", width: 130, height: 240 }}>
          <svg width="130" height="240" viewBox="0 0 130 240" fill="none">
            <rect x="3" y="3" width="124" height="234" rx="22" fill="#1a1a2e"/>
            <rect x="10" y="20" width="110" height="195" rx="8" fill="#f2f2f7"/>
            <rect x="44" y="8" width="42" height="10" rx="5" fill="#111"/>
          </svg>
          {/* Stamp pop on phone */}
          <div style={{
            position: "absolute", top: 30, left: 12, right: 12,
          }}>
            <div style={{ background: "linear-gradient(135deg, #1d9e75, #0d7a5a)", borderRadius: 10, padding: "10px", marginBottom: 6 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{
                    width: 16, height: 16, borderRadius: "50%",
                    background: i < 8 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8,
                  }}>
                    {i < 8 ? "☕" : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* New stamp badge */}
          <div style={{
            position: "absolute", top: 22, right: 6,
            background: "#1d9e75", color: "#fff",
            borderRadius: "50%", width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700,
            boxShadow: "0 4px 16px rgba(29,158,117,0.5)",
            animation: "stampBounce 0.5s cubic-bezier(0.36,0.07,0.19,0.97) forwards",
          }}>+1</div>
        </div>
        <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "#94a3b8", marginTop: 8, textAlign: "center" }}>Le client</div>
      </div>
    </div>
  );
}

function PhoneSuccess() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
      <style>{`
        @keyframes successPop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes confetti1 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-30px,-40px) rotate(-180deg);opacity:0} }
        @keyframes confetti2 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(30px,-50px) rotate(200deg);opacity:0} }
        @keyframes confetti3 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(10px,-60px) rotate(120deg);opacity:0} }
      `}</style>
      <div style={{ position: "relative", width: 180, height: 320 }}>
        <svg width="180" height="320" viewBox="0 0 180 320" fill="none">
          <rect x="4" y="4" width="172" height="312" rx="28" fill="#1a1a2e"/>
          <rect x="14" y="28" width="152" height="262" rx="10" fill="#f2f2f7"/>
          <rect x="62" y="10" width="56" height="14" rx="7" fill="#111"/>
        </svg>
        {/* Success content */}
        <div style={{ position: "absolute", top: 42, left: 18, right: 18, textAlign: "center" }}>
          {/* Confetti */}
          <div style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)" }}>
            {[
              { color: "#1d9e75", style: { animation: "confetti1 1s ease-out 0.2s forwards" } },
              { color: "#f59e0b", style: { animation: "confetti2 1s ease-out 0.3s forwards" } },
              { color: "#3b82f6", style: { animation: "confetti3 1s ease-out 0.1s forwards" } },
            ].map((c, i) => (
              <div key={i} style={{ position: "absolute", width: 8, height: 8, background: c.color, borderRadius: 2, ...c.style }} />
            ))}
          </div>

          <div style={{
            width: 64, height: 64, background: "#E8F8F3", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "20px auto 14px",
            animation: "successPop 0.5s cubic-bezier(0.36,0.07,0.19,0.97) forwards",
            fontSize: 30,
          }}>✓</div>

          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
            8 tampons sur 10 !
          </div>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>
            Plus que 2 pour ton café offert chez Café Lumière ☕
          </div>

          {/* Progress bar */}
          <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: "80%", background: "linear-gradient(90deg, #1d9e75, #0d7a5a)",
              borderRadius: 4, transition: "width 0.8s ease",
            }} />
          </div>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "#94a3b8", marginTop: 6 }}>
            80% vers ta récompense
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoyaltyFlowMockup() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4);
      setProgress(0);
    }, STEP_DURATION);

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 100 / (STEP_DURATION / 50), 100));
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [step]);

  return (
    <div style={{ width: "100%" }}>
      {/* Step indicators */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" }}>
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => { setStep(i); setProgress(0); }}
            style={{
              flex: 1, maxWidth: 140,
              background: step === i ? "#1d9e75" : "#f1f5f9",
              border: "none", borderRadius: 10,
              padding: "10px 12px", cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "left",
            }}
          >
            <div style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 10, fontWeight: 600,
              color: step === i ? "rgba(255,255,255,0.7)" : "#94a3b8",
              marginBottom: 2,
            }}>
              ÉTAPE {s.num}
            </div>
            <div style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 12, fontWeight: 600,
              color: step === i ? "#fff" : "#374151",
              lineHeight: 1.3,
            }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Progress bar for current step */}
      <div style={{ height: 2, background: "#f1f5f9", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: "#1d9e75", borderRadius: 2,
          transition: "width 0.05s linear",
        }} />
      </div>

      {/* Visual */}
      <div style={{
        background: "#f8fafc", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.06)",
      }}>
        {step === 0 && <PhoneScan />}
        {step === 1 && <PhoneCard stamps={7} />}
        {step === 2 && <PhoneStamp />}
        {step === 3 && <PhoneSuccess />}

        {/* Step description */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid #f0f0f0",
          background: "#fff",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#64748b" }}>
            {STEPS[step].sub}
          </div>
        </div>
      </div>
    </div>
  );
}
