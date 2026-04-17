import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import DemoSection from '@/components/DemoSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ForWhoSection from '@/components/ForWhoSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <DemoSection />
      <PricingSection />
      <TestimonialsSection />
      <ForWhoSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
