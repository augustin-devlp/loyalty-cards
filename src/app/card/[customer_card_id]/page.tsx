import { notFound } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/anon";
import CustomerQRCode from "@/components/CustomerQRCode";
import GoogleWalletButton from "@/components/GoogleWalletButton";

export default async function CustomerCardPage({
  params,
}: {
  params: Promise<{ customer_card_id: string }>;
}) {
  const { customer_card_id } = await params;
  const supabase = createAnonClient();

  const { data: cc } = await supabase
    .from("customer_cards")
    .select(
      `
      id,
      current_stamps,
      current_points,
      rewards_claimed,
      qr_code_value,
      referral_code,
      customers ( first_name, last_name ),
      loyalty_cards (
        id,
        card_name,
        card_type,
        stamps_required,
        reward_threshold,
        reward_description,
        primary_color,
        text_color,
        logo_url,
        stamp_shape,
        card_style,
        businesses ( business_name, plan )
      )
    `
    )
    .eq("id", customer_card_id)
    .single();

  if (!cc) notFound();

  const card = cc.loyalty_cards as unknown as {
    id: string;
    card_name: string;
    card_type: "stamp" | "points";
    stamps_required: number | null;
    reward_threshold: number | null;
    reward_description: string;
    primary_color: string;
    text_color: string;
    logo_url: string | null;
    stamp_shape: string | null;
    card_style: string | null;
    businesses: { business_name: string; plan: string } | null;
  };

  // Fetch active promotion for this card
  const { data: promo } = await supabase
    .from("promotions")
    .select("title, multiplier, end_date")
    .eq("card_id", card.id)
    .eq("is_active", true)
    .lte("start_date", new Date().toISOString())
    .gte("end_date", new Date().toISOString())
    .maybeSingle();

  const customer = cc.customers as unknown as { first_name: string; last_name: string };
  const isPro = card.businesses?.plan === "pro";
  const googleWalletEnabled = !!process.env.GOOGLE_WALLET_CREDENTIALS;

  const bg = card.primary_color;
  const fg = card.text_color;

  const stampsRequired = card.stamps_required ?? 10;
  const rewardThreshold = card.reward_threshold ?? 100;
  const currentStamps = cc.current_stamps ?? 0;
  const currentPoints = cc.current_points ?? 0;

  const stampProgress = Math.min(currentStamps / stampsRequired, 1);
  const pointsProgress = Math.min(currentPoints / rewardThreshold, 1);

  const shape = (card.stamp_shape ?? "circle") as "circle" | "star" | "heart";
  const style = (card.card_style ?? "rounded") as "rounded" | "square" | "modern";
  const borderRadius = style === "square" ? "4px" : style === "modern" ? "12px" : "20px";

  function StampCell({ filled }: { filled: boolean }) {
    if (shape === "star") return (
      <span style={{ fontSize: 28, color: filled ? bg : "#d1d5db", lineHeight: 1 }}>{filled ? "★" : "☆"}</span>
    );
    if (shape === "heart") return (
      <span style={{ fontSize: 28, color: filled ? bg : "#d1d5db", lineHeight: 1 }}>{filled ? "♥" : "♡"}</span>
    );
    return (
      <div
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: `2px solid ${bg}`,
          backgroundColor: filled ? bg : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, color: filled ? fg : bg,
        }}
      >
        {filled ? "✓" : ""}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-sm space-y-5">

        {/* Promo banner */}
        {promo && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-5 py-4 text-center">
            <p className="text-sm font-bold text-amber-800">
              🎁 Promo en cours : {promo.title} — x{promo.multiplier} tampons
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Jusqu&apos;au {new Date(promo.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
            </p>
          </div>
        )}

        {/* Branded card */}
        <div style={{ borderRadius, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          {/* Header */}
          <div
            className="px-6 pt-6 pb-5"
            style={{
              backgroundColor: bg, color: fg,
              ...(style === "modern" ? { background: `linear-gradient(135deg, ${bg} 0%, ${bg}cc 100%)` } : {}),
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {card.logo_url ? (
                <img src={card.logo_url} alt="Logo"
                  className="h-12 w-12 rounded-full object-cover shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                />
              ) : (
                <div className="h-12 w-12 rounded-full shrink-0 flex items-center justify-center text-xl font-bold"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  {card.businesses?.business_name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <p className="font-bold text-base leading-tight">{card.businesses?.business_name}</p>
                <p className="text-sm" style={{ opacity: 0.75 }}>{card.card_name}</p>
              </div>
            </div>

            <p className="text-lg font-semibold">Bonjour, {customer.first_name} !</p>
            <p className="text-sm mt-0.5" style={{ opacity: 0.7 }}>🎁 {card.reward_description}</p>
          </div>

          {/* Progress */}
          <div className="bg-white px-6 py-5">
            {card.card_type === "stamp" ? (
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                  <span>Tampons</span>
                  <span>{currentStamps} / {stampsRequired}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.from({ length: Math.min(stampsRequired, 15) }).map((_, i) => (
                    <StampCell key={i} filled={i < currentStamps} />
                  ))}
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${stampProgress * 100}%`, backgroundColor: bg }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {stampsRequired - currentStamps > 0
                    ? `Plus que ${stampsRequired - currentStamps} tampon(s) pour votre récompense !`
                    : "🎉 Vous avez atteint votre récompense !"}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                  <span>Points</span>
                  <span>{currentPoints} / {rewardThreshold} pts</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pointsProgress * 100}%`, backgroundColor: bg }} />
                </div>
                <p className="text-xs text-gray-400">
                  {rewardThreshold - currentPoints > 0
                    ? `Plus que ${rewardThreshold - currentPoints} points pour votre récompense !`
                    : "🎉 Vous avez atteint votre récompense !"}
                </p>
              </div>
            )}

            {cc.rewards_claimed > 0 && (
              <p className="text-xs text-gray-400 mt-3">Récompenses obtenues : {cc.rewards_claimed}</p>
            )}
          </div>

          {/* Modern bottom bar */}
          {style === "modern" && (
            <div style={{ height: 5, backgroundColor: bg }} />
          )}
        </div>

        {/* QR code */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1 text-center">Mon QR code</h2>
          <p className="text-xs text-gray-400 text-center mb-5">
            Présentez ce QR code au commerçant à chaque achat.
          </p>
          <CustomerQRCode qrCodeValue={cc.qr_code_value} customerCardId={cc.id} />
        </div>

        {/* Referral code (Pro only) */}
        {isPro && cc.referral_code && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <p className="text-xs text-gray-400 mb-1">Votre code parrain</p>
            <p className="text-2xl font-black tracking-widest" style={{ color: bg }}>{cc.referral_code}</p>
            <p className="text-xs text-gray-400 mt-2">Partagez ce code pour gagner 2 tampons bonus !</p>
          </div>
        )}

        {/* Wallet buttons */}
        <div className="space-y-3">
          {/* Apple Wallet — désactivé */}
          <button disabled
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 rounded-xl opacity-40 cursor-not-allowed text-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Ajouter à Apple Wallet
          </button>

          {/* Google Wallet */}
          {googleWalletEnabled ? (
            <GoogleWalletButton customerCardId={cc.id} />
          ) : (
            <button disabled
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl opacity-40 cursor-not-allowed text-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Ajouter à Google Wallet
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
