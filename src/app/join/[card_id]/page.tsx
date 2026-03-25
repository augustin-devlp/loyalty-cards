import { notFound } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/anon";
import { getShape } from "@/lib/stampShapes";
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
    .select("business_name, plan, subscription_status, join_background_url, country")
    .eq("id", card.business_id)
    .single();

  // Check active spin wheel and lottery for Pro/Business plans
  const isPro = business?.plan === "pro" || business?.plan === "business";
  let hasActiveSpin = false;
  let hasActiveLottery = false;
  if (isPro) {
    const { data: wheel } = await supabase
      .from("spin_wheels")
      .select("is_active")
      .eq("business_id", card.business_id)
      .maybeSingle();
    hasActiveSpin = wheel?.is_active ?? false;

    const { count: lotteryCount } = await supabase
      .from("lotteries")
      .select("id", { count: "exact", head: true })
      .eq("business_id", card.business_id)
      .eq("is_active", true);
    hasActiveLottery = (lotteryCount ?? 0) > 0;
  }

  const bg = card.primary_color;
  const fg = card.text_color;

  const stampsRequired = card.stamps_required ?? 10;
  const stampCount = Math.min(stampsRequired, 12);
  const shape = card.stamp_shape ?? "circle";
  const style = (card.card_style ?? "rounded") as "rounded" | "square" | "modern";
  const shapeData = getShape(shape);

  const borderRadius =
    style === "square" ? "4px" : style === "modern" ? "12px" : "20px";

  const joinBg = business?.join_background_url ?? null;

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Top branded section ── */}
      <div
        className="flex-shrink-0 flex flex-col items-center px-4 pt-10 pb-6 relative"
        style={{
          backgroundColor: bg,
          ...(joinBg ? {
            backgroundImage: `url("${joinBg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : {}),
        }}
      >
        {/* Overlay tint when background photo is set */}
        {joinBg && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: bg, opacity: 0.65 }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Business identity */}
          <div className="flex flex-col items-center mb-7">
            {card.logo_url ? (
              <img src={card.logo_url} alt="Logo"
                className="object-cover shadow-xl mb-3"
                style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid rgba(255,255,255,0.5)` }}
              />
            ) : (
              <div
                className="flex items-center justify-center text-3xl font-bold shadow-xl mb-3"
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)", color: fg,
                  border: `3px solid rgba(255,255,255,0.4)`,
                }}
              >
                {business?.business_name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <h1 className="text-xl font-bold" style={{ color: fg }}>{business?.business_name}</h1>
            <p className="text-sm mt-0.5 font-medium" style={{ color: fg, opacity: 0.8 }}>{card.card_name}</p>
          </div>

          {/* Card preview */}
          <div
            className="w-full max-w-xs shadow-2xl overflow-hidden"
            style={{ borderRadius, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <div className="px-5 pt-4 pb-2">
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.25)", color: fg }}>
                🎁 {card.reward_description}
              </div>
            </div>

            {card.card_type === "stamp" ? (
              <div className="px-5 pb-5">
                <p className="text-xs mb-3 font-medium" style={{ color: fg, opacity: 0.75 }}>
                  {stampsRequired} tampons pour la récompense
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: stampCount }).map((_, i) => (
                    <div key={i} style={{ opacity: i < 3 ? 1 : 0.3 }}>
                      {shape === "circle" ? (
                        <div style={{
                          width: 30, height: 30, borderRadius: "50%",
                          border: `2px solid ${fg}`,
                          backgroundColor: i < 3 ? "rgba(255,255,255,0.4)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, fontWeight: 700, color: fg,
                        }}>
                          {i < 3 ? "✓" : ""}
                        </div>
                      ) : (
                        <svg viewBox="0 0 24 24" width={30} height={30}
                          style={{ color: fg, display: "block" }}
                          dangerouslySetInnerHTML={{ __html: shapeData.svg }} />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: fg, opacity: 0.55 }}>
                  3 / {stampsRequired} tampons
                </p>
              </div>
            ) : (
              <div className="px-5 pb-5">
                <p className="text-xs mb-3" style={{ color: fg, opacity: 0.75 }}>
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
      </div>

      {/* ── Gamification buttons ── */}
      {(hasActiveSpin || hasActiveLottery) && (
        <div className="bg-white/10 backdrop-blur-sm px-5 py-3 flex gap-2 justify-center">
          {hasActiveSpin && (
            <a
              href={`/spin/${card.business_id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.9)", color: bg }}
            >
              🎰 Tenter ma chance
            </a>
          )}
          {hasActiveLottery && (
            <a
              href={`/lottery/${card.business_id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.9)", color: bg }}
            >
              🎁 Participer à la loterie
            </a>
          )}
        </div>
      )}

      {/* ── White form section ── */}
      <div className="flex-1 bg-white rounded-t-3xl shadow-2xl px-5 pt-7 pb-10 -mt-4 relative z-10">
        <div className="max-w-sm mx-auto">
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
            country={business?.country ?? "FR"}
          />
        </div>
      </div>
    </div>
  );
}
