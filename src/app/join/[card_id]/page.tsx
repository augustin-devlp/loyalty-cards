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
      "id, card_name, card_type, reward_description, primary_color, text_color, logo_url, is_active, business_id"
    )
    .eq("id", card_id)
    .single();

  if (!card || !card.is_active) {
    notFound();
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("business_name")
    .eq("id", card.business_id)
    .single();

  const bg = card.primary_color;
  const fg = card.text_color;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: bg }}
    >
      <div className="w-full max-w-sm">
        {/* Card branded header */}
        <div className="text-center mb-8">
          {card.logo_url ? (
            <img
              src={card.logo_url}
              alt="Logo"
              className="h-20 w-20 rounded-full object-cover mx-auto mb-4 shadow-lg"
            />
          ) : (
            <div
              className="h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-lg"
              style={{ background: "rgba(255,255,255,0.2)", color: fg }}
            >
              {business?.business_name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}

          <h1
            className="text-2xl font-bold"
            style={{ color: fg }}
          >
            {business?.business_name}
          </h1>
          <p
            className="text-sm mt-1 font-medium"
            style={{ color: fg, opacity: 0.8 }}
          >
            {card.card_name}
          </p>

          <div
            className="mt-4 rounded-2xl px-5 py-3 text-sm font-semibold inline-block"
            style={{ background: "rgba(255,255,255,0.2)", color: fg }}
          >
            🎁 {card.reward_description}
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Rejoindre le programme
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Créez votre carte et commencez à cumuler des{" "}
            {card.card_type === "stamp" ? "tampons" : "points"}.
          </p>

          <JoinForm
            cardId={card.id}
            primaryColor={card.primary_color}
            textColor={card.text_color}
          />
        </div>
      </div>
    </div>
  );
}
