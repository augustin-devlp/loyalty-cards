import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_PIN = "0808";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { businessId?: string; pin?: string };

    // Auth: PIN-only (no Supabase session required)
    if (body.pin !== ADMIN_PIN) {
      console.warn("[generate-code] Accès refusé — PIN incorrect");
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { businessId } = body;
    console.log("[generate-code] businessId reçu:", businessId);

    if (!businessId) {
      console.error("[generate-code] businessId manquant");
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // Generate 4-digit code
    const code = String(Math.floor(1000 + Math.random() * 9000));
    console.log(`[generate-code] code généré: ${code} pour businessId: ${businessId}`);

    // Update via service role key (bypass RLS)
    const adminDb = createAdminClient();
    const { data: updated, error } = await adminDb
      .from("businesses")
      .update({ activation_code: code })
      .eq("id", businessId)
      .select("id, business_name");

    if (error) {
      console.error("[generate-code] Erreur Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updated || updated.length === 0) {
      console.error("[generate-code] Aucune ligne mise à jour — businessId introuvable:", businessId);
      return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
    }

    console.log(`[generate-code] ✅ Code ${code} sauvegardé pour:`, updated[0]);
    return NextResponse.json({ code });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    console.error("[generate-code] Exception non gérée:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
