import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["augustin-domenget@stampify.ch", "augustindomenget@gmail.com"];

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { businessId } = await req.json() as { businessId?: string };
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

  return NextResponse.json({ success: true });
}
