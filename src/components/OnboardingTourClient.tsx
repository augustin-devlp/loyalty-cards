"use client";

import { useState } from "react";
import OnboardingTour from "@/components/OnboardingTour";

/**
 * Wrapper client pour OnboardingTour
 * Permet d'intégrer le tour d'onboarding dans les pages serveur
 */
export default function OnboardingTourClient() {
  const [shouldShow, setShouldShow] = useState(true);

  if (!shouldShow) return null;

  return <OnboardingTour onComplete={() => setShouldShow(false)} />;
}
