import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Générer un code d'affiliation unique : STAMP-{5 chiffres aléatoires}
function generateAffiliateCode(): string {
  const randomNumbers = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `STAMP-${randomNumbers}`;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Récupérer l'utilisateur actuel
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Chercher si l'enregistrement d'affiliation existe
    const { data: existingAffiliate, error: selectError } = await supabase
      .from("affiliates")
      .select("*")
      .eq("business_id", user.id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching affiliate:", selectError);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des données" },
        { status: 500 }
      );
    }

    // Si l'affilié existe, le retourner
    if (existingAffiliate) {
      return NextResponse.json({
        affiliate_code: existingAffiliate.affiliate_code,
        referrals: existingAffiliate.referrals,
        earnings: existingAffiliate.earnings,
      });
    }

    // Sinon, créer une nouvelle entrée
    const newCode = generateAffiliateCode();

    const { data: newAffiliate, error: insertError } = await supabase
      .from("affiliates")
      .insert({
        business_id: user.id,
        affiliate_code: newCode,
        referrals: 0,
        earnings: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating affiliate:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de la création du profil d'affiliation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      affiliate_code: newAffiliate.affiliate_code,
      referrals: newAffiliate.referrals,
      earnings: newAffiliate.earnings,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
