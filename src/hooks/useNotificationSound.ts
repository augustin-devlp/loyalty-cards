"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Génère un "bip-bip" urgent via Web Audio API (pas besoin de fichier MP3).
 * L'AudioContext doit être initialisé par un clic utilisateur (policy
 * browser), d'où le bouton "Activer le son" dans l'UI.
 *
 * Usage :
 *   const sound = useNotificationSound();
 *   sound.init()        // à appeler lors d'un clic user
 *   sound.play()        // joue 3 bips rapides
 *   sound.stop()        // coupe un play en cours
 *   sound.setEnabled(false)  // mute global
 */
export function useNotificationSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const timersRef = useRef<number[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Persist le toggle "son coupé" dans localStorage
    const stored = localStorage.getItem("rialto:sound");
    if (stored === "off") setEnabled(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("rialto:sound", enabled ? "on" : "off");
  }, [enabled]);

  const init = useCallback(() => {
    if (ctxRef.current) return;
    try {
      const AnyWindow = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const AC = AnyWindow.AudioContext || AnyWindow.webkitAudioContext;
      if (!AC) return;
      ctxRef.current = new AC();
      setReady(true);
    } catch (err) {
      console.warn("[sound] AudioContext init failed", err);
    }
  }, []);

  const beep = useCallback(
    (freq: number, at: number, duration = 0.12) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + at);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + at + 0.01);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + at + duration,
      );
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + at);
      osc.stop(ctx.currentTime + at + duration + 0.02);
    },
    [],
  );

  const play = useCallback(() => {
    if (!enabled) return;
    if (!ctxRef.current) init();
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    // 3 bips "sonnerie cuisine" (2 tons alternés)
    for (let i = 0; i < 3; i++) {
      const base = i * 0.45;
      beep(880, base);
      beep(660, base + 0.18, 0.14);
    }
  }, [beep, enabled, init]);

  const stop = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    // Les oscillators créés expirent seuls, rien à faire de plus.
  }, []);

  return { init, play, stop, enabled, setEnabled, ready };
}
