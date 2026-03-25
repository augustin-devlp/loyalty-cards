"use client";

import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";
import SmsSendModal from "@/components/SmsSendModal";

interface Props {
  cardId: string;
  cardName?: string;
  businessName?: string;
}

export default function QRCodeSection({ cardId, cardName = "", businessName = "" }: Props) {
  const [joinUrl, setJoinUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const url = `${base}/join/${cardId}`;
    setJoinUrl(url);
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: { dark: "#111827", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [cardId]);

  const handleDownload = useCallback(async () => {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const url = `${base}/join/${cardId}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 1200,
      margin: 3,
      color: { dark: "#111827", light: "#FFFFFF" },
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode-fidelite-${cardId.slice(0, 8)}.png`;
    a.click();

    // Track QR download for onboarding step 2
    fetch("/api/businesses/qr-downloaded", { method: "POST" }).catch(() => null);
  }, [cardId]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [joinUrl]);

  const whatsappMessage = `Rejoignez notre programme fidélité ${businessName ? `${businessName} ` : ""}! Scannez ce QR code ou cliquez ici : ${joinUrl}`;

  const handleCopyMessage = useCallback(async () => {
    await navigator.clipboard.writeText(whatsappMessage);
    setMsgCopied(true);
    setTimeout(() => setMsgCopied(false), 2500);
  }, [whatsappMessage]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">QR code de la carte</h2>
        <p className="text-sm text-gray-500">
          Affichez ce QR code dans votre commerce. Vos clients le scannent pour obtenir
          leur carte de fidélité.
        </p>
      </div>

      {/* QR code */}
      <div className="flex justify-center">
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
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
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

      {/* Partager — WhatsApp message + SMS */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Partager la carte
        </p>

        {/* WhatsApp / SMS message */}
        <div className="bg-gray-50 rounded-xl p-4 mb-3">
          <p className="text-xs text-gray-500 mb-2">Message pré-rédigé (WhatsApp / SMS)</p>
          <p className="text-sm text-gray-700 leading-relaxed">{whatsappMessage}</p>
          <button
            onClick={handleCopyMessage}
            className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold border transition-all ${
              msgCopied
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-white border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-700"
            }`}
          >
            {msgCopied ? "Message copié !" : "Copier le message"}
          </button>
        </div>

        {/* Send SMS button */}
        <SmsSendModal cardId={cardId} cardName={cardName} businessName={businessName} />
      </div>
    </div>
  );
}
