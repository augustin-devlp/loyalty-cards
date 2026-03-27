import { NextResponse } from "next/server";

const ADMIN_PIN = "0808";

export async function POST(req: Request) {
  const { businessId, pin } = await req.json() as { businessId?: string; pin?: string };

  // Auth: PIN-only (no Supabase session required)
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  if (!businessId) {
    return NextResponse.json({ error: "businessId manquant" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Variables d'environnement manquantes" }, { status: 500 });
  }

  const res = await fetch(`${url}/rest/v1/businesses?id=eq.${businessId}`, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status: "active", subscription_status: "active" }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[activate] Supabase REST error:", res.status, text);
    return NextResponse.json({ error: text || `HTTP ${res.status}` }, { status: 500 });
  }

  console.log(`[activate] ✅ Business ${businessId} activated`);
  return NextResponse.json({ success: true });
}
