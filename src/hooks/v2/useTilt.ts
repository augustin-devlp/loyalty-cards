"use client";

import { useRef, useCallback, useEffect } from "react";

export function useTilt(maxAngle: number = 7, perspective: number = 1200) {
  const elementRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const currentAngle = useRef({ x: 0, y: 0 });
  const targetAngle = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    currentAngle.current.x = lerp(currentAngle.current.x, targetAngle.current.x, 0.08);
    currentAngle.current.y = lerp(currentAngle.current.y, targetAngle.current.y, 0.08);
    if (elementRef.current) {
      elementRef.current.style.transform =
        `perspective(${perspective}px) rotateX(${currentAngle.current.x}deg) rotateY(${currentAngle.current.y}deg)`;
    }
    frameRef.current = requestAnimationFrame(animate);
  }, [perspective]);

  useEffect(() => {
    if (isMobile) return;
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [animate, isMobile]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const section = e.currentTarget as HTMLElement;
    const rect = section.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const centered = { x: relX - 0.5, y: relY - 0.5 };
    targetAngle.current = {
      x: -centered.y * maxAngle * 2,
      y: centered.x * maxAngle * 2,
    };
    // Update shine
    const shine = document.getElementById("mockup-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${relX * 100}% ${relY * 100}%,rgba(255,255,255,0.12) 0%,transparent 55%)`;
    }
  }, [isMobile, maxAngle]);

  const handleMouseLeave = useCallback(() => {
    targetAngle.current = { x: 0, y: 0 };
    const shine = document.getElementById("mockup-shine");
    if (shine) shine.style.background = "transparent";
  }, []);

  return { elementRef, handleMouseMove, handleMouseLeave };
}
