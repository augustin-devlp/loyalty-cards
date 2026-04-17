import HeroSection from "@/components/v5/HeroSection";
import MarqueeBar from "@/components/v5/MarqueeBar";
import FeatureGrid from "@/components/v5/FeatureGrid";
import HowItWorks from "@/components/v5/HowItWorks";
import StatsSection from "@/components/v5/StatsSection";
import BeforeAfter from "@/components/v5/BeforeAfter";
import DemoGrid from "@/components/v5/DemoGrid";
import Testimonials from "@/components/v5/Testimonials";
import PricingCard from "@/components/v5/PricingCard";
import PoinzComparison from "@/components/v5/PoinzComparison";
import FAQ from "@/components/v5/FAQ";
import FinalCTA from "@/components/v5/FinalCTA";
import ScrollProgress from "@/components/v5/ScrollProgress";
import AnimationInit from "@/components/v5/AnimationInit";
import Link from "next/link";

export default function V5Page() {
  return (
    <>
      <ScrollProgress />
      <AnimationInit />

      {/* HERO */}
      <HeroSection />

      <MarqueeBar />

      {/* FEATURES */}
      <section id="features" style={{ background: "#FFFFFF", padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div data-animate="fade-up" style={{ textAlign: "center", marginBottom: 64 }}>
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
          <div data-animate="fade-up" style={{ textAlign: "center", marginBottom: 80 }}>
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
          <div data-animate="fade-up" style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Exemples réels</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Voyez le résultat<br />avant de commander.
            </h2>
            <p style={{ fontSize: 18, color: "#6B7280", maxWidth: 520, margin: "0 auto" }}>
              Chaque démo ci-dessous est un vrai site créé avec Stampify. Vous pouvez l&rsquo;explorer comme le feraient vos clients.
            </p>
          </div>
          <DemoGrid />
          <div data-animate="fade-up" style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/v5/demos" style={{
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
          <div data-animate="fade-up" style={{ textAlign: "center", marginBottom: 64 }}>
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
          <div data-animate="fade-up" style={{ textAlign: "center", marginBottom: 64 }}>
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
          <div data-animate="fade-up" style={{ textAlign: "center", marginBottom: 56 }}>
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
          <h2 data-animate="fade-up" style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", marginBottom: 56 }}>
            Questions fréquentes
          </h2>
          <FAQ />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
