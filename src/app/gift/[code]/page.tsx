import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function GiftCardPage({ params }: Props) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: card } = await supabase
    .from("gift_cards")
    .select("code, amount, is_used, used_at, business_id")
    .eq("code", code.toUpperCase())
    .single();

  let businessName = "Stampify";
  if (card?.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("business_name")
      .eq("id", card.business_id)
      .single();
    if (business?.business_name) {
      businessName = business.business_name;
    }
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Code introuvable</h1>
          <p className="text-gray-500 text-sm">Ce code cadeau n&apos;existe pas ou est invalide.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-indigo-600 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="font-black text-xl text-gray-900">{businessName}</span>
        </div>

        {card.is_used ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-xl font-black text-gray-900 mb-2">Carte déjà utilisée</h1>
            <p className="text-gray-500 text-sm">
              Cette carte cadeau de <strong>{card.amount}€</strong> a déjà été utilisée
              {card.used_at && ` le ${new Date(card.used_at).toLocaleDateString("fr-FR")}`}.
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🎁</div>
            <h1 className="text-xl font-black text-gray-900 mb-2">Carte cadeau valide</h1>
            <div className="bg-indigo-50 rounded-2xl p-6 my-6">
              <p className="text-4xl font-black text-indigo-700">{card.amount}€</p>
              <p className="text-xs text-indigo-400 mt-1 font-mono tracking-widest">{card.code}</p>
            </div>
            <p className="text-gray-500 text-sm">
              Présentez ce code en caisse pour l&apos;utiliser.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
