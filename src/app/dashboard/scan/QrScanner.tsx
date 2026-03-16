"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const ELEMENT_ID = "html5qr-scan-region";

export default function QrScanner({ onScan }: { onScan: (value: string) => void }) {
  const hasScanned = useRef(false);
  const onScanRef = useRef(onScan);
  // Keep ref in sync without re-running the effect
  useEffect(() => { onScanRef.current = onScan; });

  useEffect(() => {
    hasScanned.current = false;
    const scanner = new Html5Qrcode(ELEMENT_ID);

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (hasScanned.current) return;
          hasScanned.current = true;
          onScanRef.current(decodedText);
        },
        () => {} // ignore per-frame decode errors
      )
      .catch((err) => console.error("Erreur caméra :", err));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-b-2xl">
      <div id={ELEMENT_ID} className="w-full" />
    </div>
  );
}
