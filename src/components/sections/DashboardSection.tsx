import DashboardMockup from "@/components/DashboardMockup";

export default function DashboardSection() {
  return (
    <section style={{ background: "#FBF8F3", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block",
            background: "#E8F8F3",
            color: "#1d9e75",
            borderRadius: 50,
            padding: "6px 14px",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 13, fontWeight: 500,
            marginBottom: 16,
          }}>
            Tableau de bord en temps réel
          </span>
          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 3.5vw, 44px)",
            color: "#0f172a",
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Sais enfin qui revient et quand.
          </h2>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 17,
            color: "#64748b",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Un tableau de bord simple pour suivre tes clients, tes tampons et tes revenus. En temps réel.
          </p>
        </div>
        <div className="dashboard-outer">
          <div className="dashboard-scale">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
