"use client";

import { useEffect, useRef, useState } from "react";

const CLIENTS = ["Marie D.", "Jean-Paul L.", "Sophie M.", "Karim B.", "Céline V.", "Thomas R."];

export default function DashboardMockup() {
  const bars = [45, 60, 75, 55, 80, 65, 100];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const [chartReady, setChartReady] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifExiting, setNotifExiting] = useState(false);
  const [nameIdx, setNameIdx] = useState(0);
  const [smsTyping, setSmsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setChartReady(true), 600);
        setTimeout(() => setSmsTyping(true), 1800);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const showNotif = () => {
      setNotifVisible(true);
      setTimeout(() => {
        setNotifExiting(true);
        setTimeout(() => { setNotifVisible(false); setNotifExiting(false); }, 400);
      }, 2800);
    };
    const first = setTimeout(showNotif, 1800);
    const interval = setInterval(() => {
      setNameIdx(prev => (prev + 1) % CLIENTS.length);
      showNotif();
    }, 7000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="v2-hero-mockup v2-float"
      style={{
        borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)",
        // ITER 31 — green ambient glow: mockup feels bathed in orb light
        boxShadow: "0 32px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04), 0 0 60px rgba(29,158,117,0.09)",
        overflow: "hidden", background: "#FFFFFF",
        maxWidth: 520, width: "100%",
        position: "relative",
        willChange: "transform",
      }}
    >
      {/* Browser bar */}
      <div style={{ height: 44, background: "#F3F4F6", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#9CA3AF", flex: 1, maxWidth: 240, margin: "0 auto", textAlign: "center", border: "1px solid #E5E7EB" }}>
          🔒 cafe-lumiere.stampify.ch
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", height: 340 }}>
        {/* Sidebar */}
        <div style={{ width: 180, background: "#F9FAFB", borderRight: "1px solid #E5E7EB", padding: "14px 10px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #E5E7EB" }}>
            <span style={{ fontSize: 16 }}>☕</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0A0A0A" }}>Café Lumière</span>
          </div>
          {[
            { icon: "📊", label: "Dashboard", active: true },
            { icon: "📋", label: "Clients", active: false },
            { icon: "📣", label: "Campagnes", active: false },
            { icon: "🎟️", label: "Carte fidélité", active: false },
            { icon: "⚙️", label: "Paramètres", active: false },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 8px", borderRadius: 6, marginBottom: 2, background: item.active ? "#E8F7F2" : "transparent", color: item.active ? "#1d9e75" : "#6B7280", fontSize: 11, fontWeight: item.active ? 600 : 400 }}>
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "14px 16px", overflow: "hidden", position: "relative" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>Bonjour, Sophie 👋</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Voici vos stats du jour</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[
              { v: "247", badge: "+12", label: "clients actifs" },
              { v: "1834", badge: "+89", label: "tampons donnés" },
              { v: "43", badge: "+6", label: "récompenses" },
              { v: "68%", badge: "+4%", label: "taux de retour" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.02em" }}>{s.v}</span>
                  <span style={{ fontSize: 9, background: "#ECFDF5", color: "#10B981", borderRadius: 4, padding: "1px 4px", fontWeight: 600 }}>{s.badge}</span>
                </div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 6 }}>7 derniers jours</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: "2px 2px 0 0",
                  background: i === 6 ? "#1d9e75" : "rgba(29,158,117,0.4)",
                  height: chartReady ? `${(h / 100) * 36}px` : "0px",
                  transition: `height 0.55s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s`,
                }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
              {days.map((d, i) => (
                <div key={i} style={{ flex: 1, fontSize: 8, color: "#9CA3AF", textAlign: "center" }}>{d}</div>
              ))}
            </div>
          </div>

          {/* SMS */}
          <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: "#0A0A0A" }}>Campagne SMS</span>
              <span style={{ fontSize: 8, background: "#ECFDF5", color: "#10B981", borderRadius: 4, padding: "1px 4px" }}>En cours</span>
            </div>
            <div style={{
              fontSize: 10, color: "#374151", fontStyle: "italic",
              overflow: "hidden", whiteSpace: "nowrap",
              width: smsTyping ? "100%" : "0",
              transition: smsTyping ? "width 1.6s steps(36,end)" : "none",
              borderRight: smsTyping ? "2px solid #1d9e75" : "none",
            }}>
              🥐 Viennoiseries -20% ce weekend !
            </div>
            <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>Envoyé à 247 clients</div>
          </div>

          {/* Notification popup */}
          {notifVisible && (
            <div style={{
              position: "absolute", bottom: 12, right: 12,
              background: "white", borderRadius: 10, padding: "10px 14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.06)",
              borderLeft: "3px solid #1d9e75", fontSize: 11, maxWidth: 180,
              animation: notifExiting
                ? "notifSlideOut 0.35s ease-in forwards"
                : "notifSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
              zIndex: 10,
            }}>
              <div style={{ fontWeight: 600, color: "#0A0A0A", marginBottom: 2 }}>🎟️ Nouveau tampon !</div>
              <div style={{ color: "#6B7280" }}>{CLIENTS[nameIdx]} vient de scanner</div>
              <div style={{ color: "#9CA3AF", fontSize: 10, marginTop: 3 }}>Il y a 2 secondes</div>
            </div>
          )}
        </div>
      </div>

      {/* Shine overlay for tilt effect */}
      <div id="mockup-shine" style={{ position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none", zIndex: 10, background: "transparent" }} />
    </div>
  );
}
