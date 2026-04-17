"use client";

import { useEffect, useRef, useState } from "react";

const CHART_POINTS = [12, 18, 15, 24, 22, 31, 28, 38];
const W = 320;
const H = 90;
const PAD = 8;

function buildPath(pts: number[]): string {
  const max = Math.max(...pts);
  const xs = pts.map((_, i) => PAD + (i / (pts.length - 1)) * (W - PAD * 2));
  const ys = pts.map(v => H - PAD - (v / max) * (H - PAD * 2));
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  return d;
}

function buildArea(pts: number[]): string {
  const max = Math.max(...pts);
  const xs = pts.map((_, i) => PAD + (i / (pts.length - 1)) * (W - PAD * 2));
  const ys = pts.map(v => H - PAD - (v / max) * (H - PAD * 2));
  let d = `M ${xs[0]} ${H}`;
  d += ` L ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  d += ` L ${xs[xs.length - 1]} ${H} Z`;
  return d;
}

export default function DashboardMockup() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorStep, setCursorStep] = useState(0);

  // Animate chart on viewport entry
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDrawn(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!drawn) return;
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.transition = "stroke-dashoffset 1.5s ease-out";
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = "0";
    });
    const t = setTimeout(() => setShowCursor(true), 1600);
    return () => clearTimeout(t);
  }, [drawn]);

  useEffect(() => {
    if (!showCursor) return;
    const iv = setInterval(() => setCursorStep(s => (s + 1) % 5), 1800);
    return () => clearInterval(iv);
  }, [showCursor]);

  // Cursor waypoints (x%, y% relative to dashboard)
  const waypoints = [
    { x: 30, y: 24 },  // card "67%"
    { x: 65, y: 62 },  // S5 chart point
    { x: 75, y: 24 },  // card "1 842 tampons"
    { x: 82, y: 55 },  // S8 chart point
    { x: 18, y: 24 },  // card "247 clients"
  ];
  const cp = waypoints[cursorStep];

  const path = buildPath(CHART_POINTS);
  const area = buildArea(CHART_POINTS);
  const labels = ["S1","S2","S3","S4","S5","S6","S7","S8"];

  return (
    <div ref={wrapRef} className="dashboard-scale" style={{
      maxWidth: 880,
      height: 480,
      margin: "0 auto",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 38,
        background: "#E8E8E8",
        borderRadius: "12px 12px 0 0",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ef4444","#f59e0b","#22c55e"].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{
          flex: 1,
          background: "#fff",
          borderRadius: 6,
          height: 22,
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          fontSize: 11,
          color: "#9ca3af",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}>
          dashboard.stampify.ch
        </div>
      </div>

      {/* Dashboard body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Sidebar */}
        <div style={{
          width: 200,
          background: "#0f1a15",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "#1d9e75",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff",
              fontFamily: "var(--font-fraunces), serif",
            }}>S</div>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: "var(--font-dm-sans), sans-serif" }}>Stampify</span>
          </div>
          {[
            { label: "Tableau de bord", active: true },
            { label: "Clients", active: false },
            { label: "Tampons", active: false },
            { label: "Campagnes SMS", active: false },
            { label: "Paramètres", active: false },
          ].map((item) => (
            <div key={item.label} style={{
              padding: "10px 16px",
              borderRadius: 8,
              marginBottom: 2,
              background: item.active ? "rgba(29,158,117,0.2)" : "transparent",
              color: item.active ? "#1d9e75" : "rgba(255,255,255,0.55)",
              fontSize: 13,
              fontFamily: "var(--font-dm-sans), sans-serif",
              cursor: "default",
            }}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, background: "#FAFAFA", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "20px 24px 12px", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 18, color: "#0f172a" }}>
              Bonjour, Café Lumière
            </div>
            <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
              Vendredi 18 avril 2026
            </div>
          </div>

          {/* Stat cards 2×2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 24px", flexShrink: 0 }}>
            {[
              { val: "247", unit: " clients actifs", pct: "+12%", label: "Clients actifs" },
              { val: "67%", unit: " taux de retour", pct: "+8%", label: "Taux de retour" },
              { val: "1 842", unit: " tampons", pct: "+23%", label: "Tampons" },
              { val: "3 840", unit: " CHF générés", pct: "+15%", label: "Revenus" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: 12,
                padding: 16,
              }}>
                <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 22, color: "#0f172a" }}>{s.val}</div>
                <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, color: "#22c55e", marginTop: 2 }}>{s.pct} ↑</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ margin: "12px 24px 0", background: "#fff", borderRadius: 12, padding: "14px 16px", flex: 1 }}>
            <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>
              Visites cette semaine
            </div>
            <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((f, i) => (
                <line key={i} x1={PAD} y1={H * f} x2={W - PAD} y2={H * f} stroke="#f0f0f0" strokeWidth="1"/>
              ))}
              {/* Area */}
              <path d={area} fill="rgba(29,158,117,0.06)"/>
              {/* Line */}
              <path ref={pathRef} d={path} fill="none" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, padding: `0 ${PAD}px` }}>
              {labels.map(l => (
                <span key={l} style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "#9ca3af" }}>{l}</span>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div style={{ margin: "12px 24px 12px", background: "#fff", borderRadius: 12, padding: "12px 16px", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
              Activité récente
            </div>
            {[
              { initials: "MD", name: "Marie Dupont", service: "Café noisette", time: "3 min" },
              { initials: "KB", name: "Karim Benali", service: "Croissant", time: "12 min" },
              { initials: "SL", name: "Sophie Laurent", service: "Thé vert", time: "28 min" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 0",
                borderTop: i > 0 ? "1px solid #f5f5f5" : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#E8F8F3", color: "#1d9e75",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                }}>{row.initials}</div>
                <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#374151", flex: 1 }}>{row.name}</span>
                <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#9ca3af" }}>{row.service}</span>
                <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, color: "#9ca3af" }}>Il y a {row.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animated cursor */}
        {showCursor && (
          <div style={{
            position: "absolute",
            left: `${cp.x}%`,
            top: `${cp.y}%`,
            transition: "left 0.8s cubic-bezier(0.4, 0, 0.2, 1), top 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
            zIndex: 10,
          }}>
            <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
              <path d="M0 0L0 20L5 15L8 24L11 23L8 14L14 14Z" fill="#0f172a" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
