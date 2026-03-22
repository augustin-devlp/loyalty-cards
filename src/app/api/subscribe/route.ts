import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/brevo";

const ADMIN_EMAIL = "augustin-domenget@stampify.ch";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { plan, phone, country } = (await req.json()) as {
    plan: string;
    phone?: string;
    country?: string;
  };

  if (!plan || !["essential", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const { data: biz } = await supabase
    .from("businesses")
    .select("business_name, email, country, status")
    .eq("id", user.id)
    .single();

  if (!biz) {
    return NextResponse.json(
      { error: "Commerce introuvable" },
      { status: 404 }
    );
  }

  if (biz.status === "active") {
    return NextResponse.json(
      { error: "Abonnement déjà actif" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("businesses")
    .update({ plan, phone: phone ?? null, status: "pending" })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bizCountry = (biz.country ?? country ?? "FR") as string;
  const planLabel = plan === "pro" ? "Pro" : "Essentiel";
  const isCH = bizCountry === "CH";
  const price =
    plan === "pro" ? (isCH ? 79 : 49) : isCH ? 29 : 19;
  const currency = isCH ? "CHF" : "€";

  try {
    await sendEmail(
      ADMIN_EMAIL,
      `🆕 Nouveau commerçant en attente : ${biz.business_name}`,
      `<p><strong>Nouveau commerçant en attente d'activation !</strong></p>
      <ul>
        <li><strong>Commerce :</strong> ${biz.business_name}</li>
        <li><strong>Forfait :</strong> ${planLabel} — ${price} ${currency}/mois</li>
        <li><strong>Email :</strong> ${biz.email}</li>
        <li><strong>Téléphone :</strong> ${phone ?? "Non renseigné"}</li>
      </ul>
      <p><a href="https://stampify.ch/admin">Aller dans l'admin →</a></p>`
    );
  } catch {
    // Ne pas bloquer si l'email échoue
  }

  return NextResponse.json({ ok: true });
}
