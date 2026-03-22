import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["augustin-domenget@stampify.ch", "augustindomenget@gmail.com"];

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    console.log("[generate-code] Accès refusé :", user?.email);
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { businessId } = (await req.json()) as { businessId: string };
  if (!businessId) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const code = String(Math.floor(1000 + Math.random() * 9000));

  console.log(`[generate-code] Génération code=${code} pour businessId=${businessId}`);

  const { data: updated, error } = await supabase
    .from("businesses")
    .update({ activation_code: code })
    .eq("id", businessId)
    .select("id");

  if (error) {
    console.error("[generate-code] Erreur Supabase :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!updated || updated.length === 0) {
    console.error("[generate-code] Aucune ligne mise à jour — businessId introuvable :", businessId);
    return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
  }

  console.log(`[generate-code] Code sauvegardé avec succès (businessId=${businessId})`);
  return NextResponse.json({ code });
}
