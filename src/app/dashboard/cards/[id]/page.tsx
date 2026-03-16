import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CardPreview from "@/components/CardPreview";
import QRCodeSection from "@/components/QRCodeSection";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("*")
    .eq("id", id)
    .single();

  if (!card) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← Tableau de bord
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium">{card.card_name}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Preview */}
          <div className="lg:w-80">
            <p className="text-sm font-medium text-gray-700 mb-3">Aperçu client</p>
            <CardPreview
              cardName={card.card_name}
              cardType={card.card_type}
              stampsRequired={card.stamps_required ?? 10}
              pointsPerPurchase={card.points_per_purchase ?? 1}
              rewardThreshold={card.reward_threshold ?? 100}
              rewardDescription={card.reward_description}
              logoUrl={card.logo_url}
              primaryColor={card.primary_color}
              textColor={card.text_color}
            />
          </div>

          {/* Details */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{card.card_name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {card.card_type === "stamp" ? "Carte à tampons" : "Carte à points"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  card.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {card.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Récompense" value={card.reward_description} />
              {card.card_type === "stamp" ? (
                <Detail
                  label="Tampons requis"
                  value={`${card.stamps_required} tampons`}
                />
              ) : (
                <>
                  <Detail
                    label="Points par achat"
                    value={`${card.points_per_purchase} pt(s)`}
                  />
                  <Detail
                    label="Seuil de récompense"
                    value={`${card.reward_threshold} pts`}
                  />
                </>
              )}
              <Detail label="Couleur principale" value={card.primary_color}>
                <span
                  className="inline-block w-4 h-4 rounded-full border border-gray-200 ml-1.5 align-middle"
                  style={{ backgroundColor: card.primary_color }}
                />
              </Detail>
              <Detail label="Couleur du texte" value={card.text_color}>
                <span
                  className="inline-block w-4 h-4 rounded-full border border-gray-200 ml-1.5 align-middle"
                  style={{ backgroundColor: card.text_color }}
                />
              </Detail>
              <div className="col-span-2">
                <Detail label="Identifiant QR code" value={card.qr_code_value} mono />
              </div>
              <Detail
                label="Créée le"
                value={new Date(card.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
            </div>
          </div>
        </div>

        {/* QR code section */}
        <QRCodeSection cardId={card.id} />
      </main>
    </div>
  );
}

function Detail({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className={`text-gray-800 ${mono ? "font-mono text-xs break-all" : "font-medium"}`}>
        {value}
        {children}
      </p>
    </div>
  );
}
