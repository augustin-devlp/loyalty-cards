import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { referralCode, newBusinessId } = await request.json();

    if (!referralCode || !newBusinessId) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // Trouver l'affilié qui a ce code
    const { data: affiliate, error: findError } = await supabase
      .from("affiliates")
      .select("id, business_id, referrals, earnings")
      .eq("affiliate_code", referralCode)
      .single();

    if (findError) {
      console.error("Affiliate not found:", findError);
      return NextResponse.json(
        { error: "Code de parrainage invalide" },
        { status: 404 }
      );
    }

    // Incrémenter les stats du parrain
    // +1 referral et +1 month (earnings)
    const { error: updateError } = await supabase
      .from("affiliates")
      .update({
        referrals: affiliate.referrals + 1,
        earnings: affiliate.earnings + 1, // 1 mois gratuit
      })
      .eq("id", affiliate.id);

    if (updateError) {
      console.error("Error updating affiliate:", updateError);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour" },
        { status: 500 }
      );
    }

    // TODO: Logique future pour appliquer le 1 mois gratuit au parrain
    // (par ex. mettre à jour trial_end ou ajouter du crédit)

    return NextResponse.json({
      success: true,
      message: "Parrainage traité avec succès",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
