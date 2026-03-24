import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = ["augustin-domenget@stampify.ch", "augustindomenget@gmail.com"];

export async function POST(req: Request) {
  try {
    // 1. Vérifier la session admin
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("[activate] user email:", user?.email ?? "non connecté");

    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      console.warn("[activate] Accès refusé pour:", user?.email);
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // 2. Parser le body
    let body: { businessId?: string };
    try {
      body = await req.json();
    } catch {
      console.error("[activate] Body JSON invalide");
      return NextResponse.json({ error: "Body invalide" }, { status: 400 });
    }

    const { businessId } = body;
    console.log("[activate] businessId reçu:", businessId);

    if (!businessId) {
      console.error("[activate] businessId manquant");
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // 3. Update via service role key (bypass RLS)
    const adminDb = createAdminClient();

    const { data: updated, error } = await adminDb
      .from("businesses")
      .update({ status: "active", subscription_status: "active", activation_code: null })
      .eq("id", businessId)
      .select("id, business_name, status, subscription_status");

    if (error) {
      console.error("[activate] Erreur Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updated || updated.length === 0) {
      console.error("[activate] Aucune ligne mise à jour — businessId introuvable:", businessId);
      return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
    }

    console.log("[activate] ✅ Activé:", updated[0]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    console.error("[activate] Exception non gérée:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
