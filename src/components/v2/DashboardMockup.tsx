export default function DashboardMockup() {
  const bars = [45, 60, 75, 55, 80, 65, 100];
  const days = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="v2-hero-mockup v2-float" style={{
      borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
      overflow: "hidden", background: "#FFFFFF",
      maxWidth: 520, width: "100%",
    }}>
      {/* Browser bar */}
      <div style={{
        height: 44, background: "#F3F4F6",
        borderBottom: "1px solid #E5E7EB",
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{
          background: "#fff", borderRadius: 6, padding: "4px 12px",
          fontSize: 12, color: "#9CA3AF", flex: 1, maxWidth: 240,
          margin: "0 auto", textAlign: "center",
          border: "1px solid #E5E7EB",
        }}>
          🔒 cafe-lumiere.stampify.ch
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", height: 340 }}>
        {/* Sidebar */}
        <div style={{
          width: 180, background: "#F9FAFB",
          borderRight: "1px solid #E5E7EB",
          padding: "14px 10px", flexShrink: 0,
        }}>
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
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 8px", borderRadius: 6, marginBottom: 2,
              background: item.active ? "#E8F7F2" : "transparent",
              color: item.active ? "#1d9e75" : "#6B7280",
              fontSize: 11, fontWeight: item.active ? 600 : 400,
            }}>
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "14px 16px", overflow: "hidden" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>Bonjour, Sophie 👋</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Voici vos stats du jour</div>
          </div>

          {/* 2x2 stat grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[
              { v: "247", badge: "+12", label: "clients actifs" },
              { v: "1834", badge: "+89", label: "tampons donnés" },
              { v: "43", badge: "+6", label: "récompenses" },
              { v: "68%", badge: "+4%", label: "taux de retour" },
            ].map(s => (
              <div key={s.label} style={{
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: 8, padding: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.02em" }}>{s.v}</span>
                  <span style={{ fontSize: 9, background: "#ECFDF5", color: "#10B981", borderRadius: 4, padding: "1px 4px", fontWeight: 600 }}>{s.badge}</span>
                </div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Mini chart */}
          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 6 }}>7 derniers jours</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: "2px 2px 0 0",
                  background: i === 6 ? "#1d9e75" : "rgba(29,158,117,0.4)",
                  height: `${(h / 100) * 36}px`,
                }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
              {days.map((d, i) => (
                <div key={i} style={{ flex: 1, fontSize: 8, color: "#9CA3AF", textAlign: "center" }}>{d}</div>
              ))}
            </div>
          </div>

          {/* SMS preview */}
          <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: "#0A0A0A" }}>Campagne SMS</span>
              <span style={{ fontSize: 8, background: "#ECFDF5", color: "#10B981", borderRadius: 4, padding: "1px 4px" }}>En cours</span>
            </div>
            <div style={{ fontSize: 10, color: "#374151", fontStyle: "italic" }}>
              🥐 Viennoiseries -20% ce weekend !<br />
              À demain — Café Lumière
            </div>
            <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>Envoyé à 247 clients</div>
          </div>
        </div>
      </div>
    </div>
  );
}
