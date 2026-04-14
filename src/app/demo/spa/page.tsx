"use client";
import Link from "next/link";
import DemoBanner from "@/components/DemoBanner";

export default function SpaDemoPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8", fontFamily: "sans-serif" }}>
      <DemoBanner />

      <header style={{ background: "white", borderBottom: "1px solid #E2D9CC", padding: "0 24px" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/demo" style={{ fontSize: 14, color: "#6B6259", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            ← Toutes les démos
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🧖</span>
            <span style={{ fontWeight: 700, color: "#1A1410", fontSize: 14 }}>L'Essence Spa</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🧖</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: "#1A1410", marginBottom: 12 }}>L'Essence Spa</h1>
        <p style={{ color: "#6B6259", fontSize: 16, marginBottom: 40 }}>Institut de beauté · Lausanne</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 600, margin: "0 auto 48px" }}>
          {["Soins du visage", "Massages bien-être", "Épilation", "Manucure & Pédicure"].map(service => (
            <div key={service} style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #E2D9CC" }}>
              <div style={{ fontWeight: 600, color: "#1A1410", fontSize: 15 }}>{service}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 32, maxWidth: 360, margin: "0 auto", border: "1px solid #E2D9CC" }}>
          <div style={{ fontSize: 14, color: "#6B6259", marginBottom: 8 }}>Carte fidélité</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1A1410", marginBottom: 16 }}>L'Essence Spa</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
            {[0,1,2,3,4,5,6,7,9].map(i => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: i < 4 ? "#3D31B0" : "#EEF0FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i < 4 && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8l3 3L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#6B6259" }}>4/9 tampons — encore 5 pour votre soin offert</p>
        </div>
      </div>
    </div>
  );
}
