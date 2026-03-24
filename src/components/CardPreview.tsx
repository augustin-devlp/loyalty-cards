import { getShape } from "@/lib/stampShapes";

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
  stampShape?: string;
  cardStyle?: "rounded" | "square" | "modern";
  welcomeMessage?: string;
}

function StampCell({
  filled,
  shape,
  color,
}: {
  filled: boolean;
  shape: string;
  color: string;
}) {
  const shapeData = getShape(shape);

  if (shape === "circle") {
    return (
      <div
        style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${color}`,
          backgroundColor: filled ? color : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: filled ? "#fff" : color,
          opacity: filled ? 1 : 0.3,
        }}
      >
        {filled ? "✓" : ""}
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={28} height={28}
      style={{ flexShrink: 0, color, opacity: filled ? 1 : 0.2 }}
      dangerouslySetInnerHTML={{ __html: shapeData.svg }}
    />
  );
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
  stampShape = "circle",
  cardStyle = "rounded",
  welcomeMessage,
}: CardPreviewProps) {
  const stampCount = Math.min(Math.max(stampsRequired, 1), 12);

  const borderRadius =
    cardStyle === "square" ? "4px" :
    cardStyle === "modern" ? "12px" :
    "20px";

  const isModern = cardStyle === "modern";

  return (
    <div
      className="w-full max-w-xs mx-auto select-none shadow-xl overflow-hidden"
      style={{ borderRadius }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          backgroundColor: primaryColor,
          color: textColor,
          ...(isModern ? { background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)` } : {}),
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo"
              style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
                background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: textColor,
            }}>
              {cardName?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2, color: textColor }}>
              {cardName || "Nom de la carte"}
            </p>
            <p style={{ fontSize: 11, opacity: 0.7, marginTop: 2, color: textColor }}>
              {cardType === "stamp" ? "Carte à tampons" : "Carte à points"}
            </p>
          </div>
        </div>

        {welcomeMessage && (
          <p style={{ fontSize: 11, opacity: 0.8, fontStyle: "italic", marginBottom: 6, color: textColor }}>
            &ldquo;{welcomeMessage}&rdquo;
          </p>
        )}

        <div className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)", color: textColor }}>
          🎁 {rewardDescription || "Récompense à gagner"}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4">
        {cardType === "stamp" ? (
          <div>
            <p className="text-xs text-gray-500 mb-3">
              {stampsRequired} tampons pour la récompense
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: stampCount }).map((_, i) => (
                <StampCell key={i} filled={i < 3} shape={stampShape} color={primaryColor} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2.5">3 / {stampsRequired} tampons</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-500 mb-2.5">
              {pointsPerPurchase} pt(s)/achat · Seuil : {rewardThreshold} pts
            </p>
            <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
              <div className="h-full rounded-full" style={{ width: "30%", backgroundColor: primaryColor }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30 pts</span>
              <span>{rewardThreshold} pts</span>
            </div>
          </div>
        )}
      </div>

      {isModern && <div style={{ height: 5, backgroundColor: primaryColor, opacity: 0.5 }} />}
    </div>
  );
}
