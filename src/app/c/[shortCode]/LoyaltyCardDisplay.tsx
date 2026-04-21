"use client";

/**
 * Page publique /c/[shortCode] — affichage carte fidélité avec QR.
 * Mobile-first, plein écran, optimisée pour être montrée à la caisse.
 * Pas d'authent : le short_code est le secret (8 chars alphanum).
 */

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type CardData = {
  id: string;
  current_stamps: number;
  rewards_claimed: number;
  qr_code_value: string;
  short_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  card_name: string;
  reward_description: string;
  stamps_required: number;
};

export default function LoyaltyCardDisplay({ card }: { card: CardData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(
      canvas,
      card.qr_code_value,
      {
        width: 280,
        margin: 1,
        color: {
          dark: "#1A1A1A",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      },
      (err) => {
        if (err) console.error("[qr-render] failed", err);
        else {
          canvas.toBlob((blob) => {
            if (blob) setDownloadUrl(URL.createObjectURL(blob));
          });
        }
      },
    );
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.qr_code_value]);

  const total = card.stamps_required;
  const filled = Math.min(card.current_stamps, total);
  const remaining = Math.max(0, total - filled);
  const progressPercent = Math.round((filled / total) * 100);

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#F9F1E4] via-[#F9F1E4] to-[#EFE4CE] pb-10">
      <div className="mx-auto max-w-md px-4 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="36" height="36" viewBox="0 0 32 32" aria-hidden>
              <circle cx="16" cy="16" r="15" fill="#C73E1D" />
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Georgia, serif"
                fontSize="18"
                fontWeight="700"
                fill="#F9F1E4"
              >
                R
              </text>
            </svg>
            <div>
              <div
                className="text-xl font-bold leading-tight text-[#1A1A1A]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Rialto
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#C73E1D]">
                Carte fidélité
              </div>
            </div>
          </div>
          <span className="rounded-full border border-[#E8E3D8] bg-white px-2.5 py-1 text-[10px] font-mono font-semibold text-[#6B6B6B]">
            #{card.short_code}
          </span>
        </header>

        {/* Card principale */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-[#C73E1D] text-white shadow-[0_20px_50px_-10px_rgba(199,62,29,0.35)]">
          <div className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#E6A12C]">
                  Bonjour
                </div>
                <div
                  className="mt-1 text-2xl font-bold leading-tight"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {card.first_name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  Tampons
                </div>
                <div
                  className="text-4xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {filled}
                  <span className="text-xl text-white/60">/{total}</span>
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#E6A12C] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-white/90">
              {remaining > 0 ? (
                <>
                  Encore <strong>{remaining}</strong>{" "}
                  {remaining === 1 ? "tampon" : "tampons"} pour obtenir{" "}
                  <strong>{card.reward_description.toLowerCase()}</strong>.
                </>
              ) : (
                <>
                  🎉 Carte complète ! Montrez-la pour obtenir votre récompense.
                </>
              )}
            </p>
          </div>
        </section>

        {/* QR code */}
        <section className="mt-5 rounded-3xl bg-white p-6 shadow-[0_4px_12px_-4px_rgba(26,26,26,0.1)]">
          <div className="mb-4 text-center">
            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Montrez ce QR code
            </h2>
            <p className="mt-0.5 text-xs text-[#6B6B6B]">
              Le restaurant scanne = 1 tampon ajouté
            </p>
          </div>

          <div className="flex justify-center">
            <div className="rounded-2xl border-2 border-[#E8E3D8] bg-white p-3">
              <canvas
                ref={canvasRef}
                className="block"
                aria-label="QR code carte fidélité"
              />
            </div>
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`rialto-fidelite-${card.short_code}.png`}
              className="mt-4 block w-full rounded-full border border-[#E8E3D8] px-5 py-3 text-center text-sm font-semibold text-[#1A1A1A] transition hover:border-[#1A1A1A]"
            >
              ⬇ Télécharger le QR code
            </a>
          )}
        </section>

        {/* Infos pratiques */}
        <section className="mt-5 rounded-2xl border border-[#E8E3D8] bg-white p-5 text-sm text-[#1A1A1A]">
          <div className="flex items-start gap-3">
            <div className="shrink-0 text-xl">💡</div>
            <div>
              <div
                className="font-semibold"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Comment utiliser ta carte ?
              </div>
              <ol className="mt-2 space-y-1 text-xs text-[#6B6B6B]">
                <li>
                  <span className="font-semibold text-[#1A1A1A]">1.</span>{" "}
                  Commande en ligne ou en magasin
                </li>
                <li>
                  <span className="font-semibold text-[#1A1A1A]">2.</span> Montre
                  ton QR code au comptoir
                </li>
                <li>
                  <span className="font-semibold text-[#1A1A1A]">3.</span> Le
                  restaurant scanne = 1 tampon ajouté
                </li>
                <li>
                  <span className="font-semibold text-[#1A1A1A]">4.</span> À {total}{" "}
                  tampons : {card.reward_description.toLowerCase()}
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Ajouter au téléphone (iOS Add to Home Screen hint) */}
        <section className="mt-5 rounded-2xl bg-[#1A1A1A] p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="shrink-0 text-xl">📱</div>
            <div>
              <div
                className="font-semibold"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Gardez votre carte à portée de main
              </div>
              <p className="mt-1 text-xs text-white/80">
                Ajoutez cette page à votre écran d&apos;accueil pour y accéder
                en 1 clic. Sur iPhone :{" "}
                <span className="inline-flex items-center gap-1 font-semibold">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Partager
                </span>{" "}
                → &quot;Sur l&apos;écran d&apos;accueil&quot;.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-6 text-center text-[10px] text-[#6B6B6B]">
          Propulsé par{" "}
          <a
            href="https://stampify.ch"
            className="font-semibold text-[#C73E1D]"
          >
            Stampify
          </a>
          {" · "}
          Av. de Béthusy 29, Lausanne
        </footer>
      </div>
    </main>
  );
}
