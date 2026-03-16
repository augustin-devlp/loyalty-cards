interface CardPreviewProps {
  cardName: string;
  cardType: "stamp" | "points";
  stampsRequired?: number;
  pointsPerPurchase?: number;
  rewardThreshold?: number;
  rewardDescription: string;
  logoUrl?: string | null;
  primaryColor: string;
  textColor: string;
}

export default function CardPreview({
  cardName,
  cardType,
  stampsRequired = 10,
  pointsPerPurchase = 1,
  rewardThreshold = 100,
  rewardDescription,
  logoUrl,
  primaryColor,
  textColor,
}: CardPreviewProps) {
  const stampCount = Math.min(Math.max(stampsRequired, 1), 15);

  return (
    <div
      className="rounded-2xl p-6 shadow-xl w-full max-w-sm mx-auto select-none"
      style={{ backgroundColor: primaryColor, color: textColor }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />
          ) : (
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {cardName?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <p className="font-bold text-base leading-tight">
              {cardName || "Nom de la carte"}
            </p>
            <p className="text-xs mt-0.5" style={{ opacity: 0.75 }}>
              {cardType === "stamp" ? "Carte à tampons" : "Carte à points"}
            </p>
          </div>
        </div>
      </div>

      {/* Reward description */}
      <div
        className="rounded-xl px-4 py-3 mb-5 text-sm font-medium"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        🎁 {rewardDescription || "Description de la récompense"}
      </div>

      {/* Card type content */}
      {cardType === "stamp" ? (
        <div>
          <p className="text-xs mb-3" style={{ opacity: 0.7 }}>
            {stampsRequired} tampons pour obtenir la récompense
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: stampCount }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all"
                style={{
                  borderColor: textColor,
                  background: i < 3 ? "rgba(255,255,255,0.3)" : "transparent",
                  opacity: i < 3 ? 1 : 0.45,
                }}
              >
                {i < 3 ? "✓" : ""}
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ opacity: 0.6 }}>
            3 / {stampsRequired} tampons
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs mb-3" style={{ opacity: 0.7 }}>
            {pointsPerPurchase} point(s) par achat · Récompense à {rewardThreshold} pts
          </p>
          <div
            className="rounded-full h-3 overflow-hidden mb-1"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: "30%", background: "rgba(255,255,255,0.7)" }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ opacity: 0.65 }}>
            <span>30 pts</span>
            <span>{rewardThreshold} pts</span>
          </div>
        </div>
      )}
    </div>
  );
}
