import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { code } = (await req.json()) as { code: string };
  if (!code) {
    return NextResponse.json({ error: "Code manquant" }, { status: 400 });
  }

  console.log(`[activate] Tentative activation — userId=${user.id} code="${code}"`);

  const { data: biz } = await supabase
    .from("businesses")
    .select("id, activation_code, status, subscription_status")
    .eq("id", user.id)
    .single();

  if (!biz) {
    console.error("[activate] Commerce introuvable pour userId :", user.id);
    return NextResponse.json(
      { error: "Commerce introuvable" },
      { status: 404 }
    );
  }

  console.log(`[activate] Business trouvé — status="${biz.status}" subscription_status="${biz.subscription_status}" activation_code="${biz.activation_code}"`);

  if (biz.status === "active") {
    console.log("[activate] Commerce déjà actif (status=active)");
    return NextResponse.json({ ok: true, alreadyActive: true });
  }

  if (!biz.activation_code || biz.activation_code !== code) {
    console.log(`[activate] Code invalide — attendu="${biz.activation_code}" reçu="${code}"`);
    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  }

  // Met à jour status ET subscription_status pour que dashboard/layout.tsx
  // autorise l'accès (layout vérifie subscription_status !== "active")
  const { error } = await supabase
    .from("businesses")
    .update({ status: "active", subscription_status: "active", activation_code: null })
    .eq("id", user.id);

  if (error) {
    console.error("[activate] Erreur Supabase lors de l'activation :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`[activate] Commerce activé avec succès — userId=${user.id}`);
  return NextResponse.json({ ok: true });
}
