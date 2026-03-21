import { notFound } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/anon";
import JoinForm from "./JoinForm";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ card_id: string }>;
}) {
  const { card_id } = await params;
  const supabase = createAnonClient();

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select(
      "id, card_name, card_type, reward_description, primary_color, text_color, logo_url, is_active, business_id, stamps_required, reward_threshold, stamp_shape, card_style, welcome_message"
    )
    .eq("id", card_id)
    .single();

  if (!card || !card.is_active) notFound();

  const { data: business } = await supabase
    .from("businesses")
    .select("business_name, plan, subscription_status")
    .eq("id", card.business_id)
    .single();

  const bg = card.primary_color;
  const fg = card.text_color;
  const isPro = business?.plan === "pro" && business?.subscription_status === "active";

  const stampsRequired = card.stamps_required ?? 10;
  const stampCount = Math.min(stampsRequired, 12);
  const shape = (card.stamp_shape ?? "circle") as "circle" | "star" | "heart";
  const style = (card.card_style ?? "rounded") as "rounded" | "square" | "modern";

  const borderRadius =
    style === "square" ? "0px" : style === "modern" ? "12px" : "20px";

  const shapeContent = (filled: boolean) => {
    if (shape === "star") return filled ? "★" : "☆";
    if (shape === "heart") return filled ? "♥" : "♡";
    return filled ? "✓" : "";
  };

  const stampStyle = (filled: boolean): React.CSSProperties => {
    if (shape === "circle") {
      return {
        width: 32, height: 32, borderRadius: "50%",
        border: `2px solid ${fg}`,
        backgroundColor: filled ? "rgba(255,255,255,0.35)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, color: fg,
        opacity: filled ? 1 : 0.35,
      };
    }
    if (shape === "star" || shape === "heart") {
      return {
        width: 32, height: 32, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: shape === "heart" ? 22 : 20,
        color: fg, opacity: filled ? 1 : 0.3,
      };
    }
    return {};
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg }}>

      {/* ── Top section: branded background + card preview ── */}
      <div className="flex-shrink-0 px-4 pt-10 pb-6 flex flex-col items-center">

        {/* Business logo + name */}
        <div className="flex flex-col items-center mb-7">
          {card.logo_url ? (
            <img
              src={card.logo_url}
              alt="Logo"
              className="h-18 w-18 rounded-full object-cover shadow-xl mb-3"
              style={{ width: 72, height: 72, border: `3px solid rgba(255,255,255,0.4)` }}
            />
          ) : (
            <div
              className="flex items-center justify-center text-3xl font-bold shadow-xl mb-3"
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                color: fg, border: `3px solid rgba(255,255,255,0.4)`,
              }}
            >
              {business?.business_name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <h1 className="text-xl font-bold" style={{ color: fg }}>
            {business?.business_name}
          </h1>
          <p className="text-sm mt-0.5 font-medium" style={{ color: fg, opacity: 0.75 }}>
            {card.card_name}
          </p>
        </div>

        {/* Card preview */}
        <div
          className="w-full max-w-xs shadow-2xl overflow-hidden"
          style={{ borderRadius, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
        >
          {/* Reward badge */}
          <div className="px-5 pt-4 pb-3">
            <div
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.25)", color: fg }}
            >
              🎁 {card.reward_description}
            </div>
          </div>

          {/* Stamps grid */}
          {card.card_type === "stamp" ? (
            <div className="px-5 pb-5">
              <p className="text-xs mb-3 font-medium" style={{ color: fg, opacity: 0.7 }}>
                {stampsRequired} tampons pour la récompense
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: stampCount }).map((_, i) => (
                  <div key={i} style={stampStyle(i < 3)}>
                    {shapeContent(i < 3)}
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: fg, opacity: 0.55 }}>
                3 / {stampsRequired} tampons
              </p>
            </div>
          ) : (
            <div className="px-5 pb-5">
              <p className="text-xs mb-3 font-medium" style={{ color: fg, opacity: 0.7 }}>
                Récompense à {card.reward_threshold ?? 100} pts
              </p>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full" style={{ width: "30%", background: "rgba(255,255,255,0.7)" }} />
              </div>
              <p className="text-xs mt-2" style={{ color: fg, opacity: 0.55 }}>30 / {card.reward_threshold ?? 100} pts</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom section: white form ── */}
      <div className="flex-1 bg-white rounded-t-3xl shadow-2xl px-5 pt-7 pb-10">
        <div className="max-w-sm mx-auto">

          {/* Welcome message */}
          {card.welcome_message ? (
            <div className="mb-5 text-center">
              <p className="text-base font-semibold text-gray-800">{card.welcome_message}</p>
            </div>
          ) : (
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Rejoindre le programme</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Cumulez des {card.card_type === "stamp" ? "tampons" : "points"} et débloquez votre récompense.
              </p>
            </div>
          )}

          <JoinForm
            cardId={card.id}
            primaryColor={bg}
            textColor={fg}
            isPro={isPro}
          />
        </div>
      </div>
    </div>
  );
}
