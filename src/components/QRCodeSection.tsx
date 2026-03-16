"use client";

import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";

export default function QRCodeSection({ cardId }: { cardId: string }) {
  const [joinUrl, setJoinUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/join/${cardId}`;
    setJoinUrl(url);
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: { dark: "#111827", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [cardId]);

  const handleDownload = useCallback(async () => {
    const url = `${window.location.origin}/join/${cardId}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 1200,
      margin: 3,
      color: { dark: "#111827", light: "#FFFFFF" },
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode-fidelite-${cardId.slice(0, 8)}.png`;
    a.click();
  }, [cardId]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [joinUrl]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1">QR code de la carte</h2>
      <p className="text-sm text-gray-500 mb-6">
        Affichez ce QR code dans votre commerce. Vos clients le scannent pour obtenir
        leur carte de fidélité.
      </p>

      {/* QR code */}
      <div className="flex justify-center mb-6">
        {qrDataUrl ? (
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-inner inline-block">
            <img
              src={qrDataUrl}
              alt="QR code carte de fidélité"
              className="w-56 h-56"
            />
          </div>
        ) : (
          <div className="w-64 h-64 rounded-2xl bg-gray-100 animate-pulse" />
        )}
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={!qrDataUrl}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
      >
        Télécharger le QR code (PNG haute résolution)
      </button>

      {/* Copy link */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Lien à partager (email, SMS…)
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 truncate font-mono">
            {joinUrl || `…/join/${cardId}`}
          </code>
          <button
            onClick={handleCopy}
            className={`shrink-0 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
              copied
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>
    </div>
  );
}
