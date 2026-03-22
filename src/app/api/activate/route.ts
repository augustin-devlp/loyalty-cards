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

  const { data: biz } = await supabase
    .from("businesses")
    .select("id, activation_code, status")
    .eq("id", user.id)
    .single();

  if (!biz) {
    return NextResponse.json(
      { error: "Commerce introuvable" },
      { status: 404 }
    );
  }

  if (biz.status === "active") {
    return NextResponse.json({ ok: true, alreadyActive: true });
  }

  if (!biz.activation_code || biz.activation_code !== code) {
    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  }

  const { error } = await supabase
    .from("businesses")
    .update({ status: "active", activation_code: null })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
