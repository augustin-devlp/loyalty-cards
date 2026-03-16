"use client";

import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";

export default function CustomerQRCode({
  qrCodeValue,
  customerCardId,
}: {
  qrCodeValue: string;
  customerCardId: string;
}) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(qrCodeValue, {
      width: 280,
      margin: 2,
      color: { dark: "#111827", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [qrCodeValue]);

  const handleDownload = useCallback(async () => {
    const dataUrl = await QRCode.toDataURL(qrCodeValue, {
      width: 1200,
      margin: 3,
      color: { dark: "#111827", light: "#FFFFFF" },
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `ma-carte-fidelite-${customerCardId.slice(0, 8)}.png`;
    a.click();
  }, [qrCodeValue, customerCardId]);

  return (
    <div className="flex flex-col items-center gap-4">
      {qrDataUrl ? (
        <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100 inline-block">
          <img src={qrDataUrl} alt="Mon QR code fidélité" className="w-52 h-52" />
        </div>
      ) : (
        <div className="w-60 h-60 rounded-2xl bg-gray-100 animate-pulse" />
      )}
      <p className="text-xs text-gray-400 text-center max-w-xs">
        Présentez ce QR code au commerçant à chaque achat.
      </p>
    </div>
  );
}
