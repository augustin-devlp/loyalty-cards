import HeroOrbs from "@/components/v2/HeroOrbs";
import DashboardMockup from "@/components/v2/DashboardMockup";
import MarqueeBar from "@/components/v2/MarqueeBar";
import FeatureGrid from "@/components/v2/FeatureGrid";
import HowItWorks from "@/components/v2/HowItWorks";
import StatsSection from "@/components/v2/StatsSection";
import BeforeAfter from "@/components/v2/BeforeAfter";
import DemoGrid from "@/components/v2/DemoGrid";
import Testimonials from "@/components/v2/Testimonials";
import PricingCard from "@/components/v2/PricingCard";
import PoinzComparison from "@/components/v2/PoinzComparison";
import FAQ from "@/components/v2/FAQ";
import FinalCTA from "@/components/v2/FinalCTA";
import Link from "next/link";

export default function V2Page() {
  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "#FFFFFF", padding: "100px 24px" }}>
        <HeroOrbs />

        <div className="v2-hero-grid" style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "55% 45%",
          gap: 80, alignItems: "center",
          position: "relative", zIndex: 1,
        }}>
          {/* Left - text */}
          <div>
            {/* Badge */}
            <div className="v2-animate" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.25)",
              borderRadius: 980, padding: "6px 14px 6px 8px",
              marginBottom: 24,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#1d9e75",
                animation: "v2-pulse 2s ease-in-out infinite",
                flexShrink: 0,
                display: "inline-block",
              }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#1d9e75" }}>
                Livraison en 48h garantie
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "clamp(36px,5.5vw,72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 24 }}>
              <span className="v2-hero-line v2-hero-line-1" style={{ display: "block" }}>Vos clients</span>
              <span className="v2-hero-line v2-hero-line-2" style={{ display: "block" }}>
                <span className="v2-underline-word">reviennent.</span>
              </span>
              <span className="v2-hero-line v2-hero-line-3" style={{ display: "block" }}>À chaque fois.</span>
            </h1>

            {/* Subtitle */}
            <p className="v2-hero-subtitle" style={{ fontSize: "clamp(16px,1.5vw,19px)", fontWeight: 400, lineHeight: 1.65, color: "#6B7280", maxWidth: 460, marginBottom: 40 }}>
              Site vitrine professionnel + carte fidélité digitale + plaquette NFC gravée en bois.
              990 CHF, une fois. Livré en 48 heures.
            </p>

            {/* CTAs */}
            <div className="v2-hero-btns" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <Link href="/v2/subscribe" style={{
                display: "inline-flex", alignItems: "center",
                background: "#1d9e75", color: "#fff",
                borderRadius: 980, height: 52, padding: "0 28px",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                whiteSpace: "nowrap",
              }}>
                Obtenir mon site → 990 CHF
              </Link>
              <Link href="/v2/demos" style={{
                display: "inline-flex", alignItems: "center",
                background: "transparent", color: "#0A0A0A",
                border: "1.5px solid #E5E7EB",
                borderRadius: 980, height: 52, padding: "0 24px",
                fontSize: 15, fontWeight: 500, textDecoration: "none",
                whiteSpace: "nowrap",
              }}>
                Voir les démos →
              </Link>
            </div>

            {/* Metrics */}
            <p className="v2-hero-metrics" style={{ fontSize: 13, color: "#9CA3AF" }}>
              990 CHF · Paiement unique · 48h garanties · 100% propriétaire
            </p>

            {/* Social proof */}
            <div className="v2-hero-social" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #1d9e75, #0D7A5A)",
                color: "#fff", fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>SM</div>
              <div>
                <p style={{ fontSize: 14, color: "#6B7280", fontStyle: "italic", lineHeight: 1.5 }}>
                  &ldquo;Stampify m&rsquo;a livré en 2 jours ce que j&rsquo;ai abandonné après 3h sur Wix.&rdquo;
                </p>
                <p style={{ fontSize: 13, color: "#F59E0B", marginTop: 2 }}>★★★★★</p>
              </div>
            </div>
          </div>

          {/* Right - mockup */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <DashboardMockup />
          </div>
        </div>
      </section>

      <MarqueeBar />

      {/* FEATURES */}
      <section id="features" style={{ background: "#FFFFFF", padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Fonctionnalités</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Tout ce dont votre commerce<br />a besoin. En une seule commande.
            </h2>
            <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 560, margin: "0 auto" }}>
              Vous n&rsquo;avez pas besoin d&rsquo;une agence web, d&rsquo;un logiciel de fidélité, et d&rsquo;un outil SMS. Stampify livre tout en un seul package.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#F9FAFB", padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Simple et rapide</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              De zéro à votre site<br />en 48 heures.
            </h2>
            <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 480, margin: "0 auto" }}>
              Pas de réunion. Pas de cahier des charges. Un échange WhatsApp, et on s&rsquo;occupe de tout le reste.
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#FFFFFF", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <StatsSection />
        </div>
      </section>

      {/* AVANT/APRÈS */}
      <section style={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <BeforeAfter />
        </div>
      </section>

      {/* DEMOS */}
      <section style={{ background: "#FFFFFF", padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Exemples réels</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Voyez le résultat<br />avant de commander.
            </h2>
            <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 520, margin: "0 auto" }}>
              Chaque démo ci-dessous est un vrai site créé avec Stampify. Vous pouvez l&rsquo;explorer comme le feraient vos clients.
            </p>
          </div>
          <DemoGrid />
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/v2/demos" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "#0A0A0A",
              border: "1.5px solid #E5E7EB",
              borderRadius: 980, height: 48, padding: "0 28px",
              fontSize: 15, fontWeight: 500, textDecoration: "none",
            }}>
              Voir toutes les démos →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "#F9FAFB", padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Témoignages</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Ce que disent nos commerçants.
            </h2>
            <p style={{ fontSize: 18, color: "#6B7280" }}>
              Des vrais commerçants suisses romands qui utilisent Stampify au quotidien.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: "#FFFFFF", padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Tarif</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Un investissement unique.<br />Zéro abonnement.
            </h2>
            <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 480, margin: "0 auto" }}>
              Vous payez une fois. C&rsquo;est à vous pour toujours. Domaine, hébergement, tout inclus dès le premier jour.
            </p>
          </div>
          <PricingCard />
        </div>
      </section>

      {/* POINZ */}
      <section style={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Comparatif</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Pourquoi Stampify<br />plutôt que Poinz ?
            </h2>
            <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 520, margin: "0 auto" }}>
              Poinz est gratuit. Mais c&rsquo;est leur logo qui s&rsquo;affiche partout, pas le vôtre. Votre fidélité ne vous appartient pas.
            </p>
          </div>
          <PoinzComparison />
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#FFFFFF", padding: "100px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", marginBottom: 56 }}>
            Questions fréquentes
          </h2>
          <FAQ />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
