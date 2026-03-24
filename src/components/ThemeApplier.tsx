"use client";

import { useEffect } from "react";
import { buildThemeVars } from "@/lib/themes";

interface ThemeApplierProps {
  accent: string;
  dark: boolean;
}

export default function ThemeApplier({ accent, dark }: ThemeApplierProps) {
  useEffect(() => {
    const vars = buildThemeVars(accent, dark);
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [accent, dark]);

  return null;
}
