import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import DashboardSection from "@/components/sections/DashboardSection";
import SpaPreviewSection from "@/components/sections/SpaPreviewSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import FeaturesPeekSection from "@/components/sections/FeaturesPeekSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <DashboardSection />
      <SpaPreviewSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FeaturesPeekSection />
      <FinalCTASection />
    </main>
  );
}
