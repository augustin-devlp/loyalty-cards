import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "augustin-domenget@stampify.ch";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { businessId } = (await req.json()) as { businessId: string };
  if (!businessId) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const code = String(Math.floor(1000 + Math.random() * 9000));

  const { error } = await supabase
    .from("businesses")
    .update({ activation_code: code })
    .eq("id", businessId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code });
}
