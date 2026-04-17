"use client";

import { useState, useEffect, useCallback } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = (scrollTop / docHeight) * 100;
    setProgress(Math.min(Math.max(pct, 0), 100));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  return (
    <div aria-hidden="true" style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: "2px", zIndex: 9999, pointerEvents: "none",
      background: "transparent",
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg,#1d9e75 0%,#0D7A5A 100%)",
        transition: "width 0.06s linear",
        boxShadow: "0 0 6px rgba(29,158,117,0.55),0 0 12px rgba(29,158,117,0.25)",
      }} />
    </div>
  );
}
