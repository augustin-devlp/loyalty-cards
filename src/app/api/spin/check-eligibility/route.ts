import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { wheelId, phone, frequency } = await req.json() as {
    wheelId?: string;
    phone?: string;
    frequency?: string;
  };

  if (!wheelId || !phone || !frequency) {
    return NextResponse.json({ eligible: false, message: "Paramètres manquants" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ eligible: false, message: "Config manquante" }, { status: 500 });
  }

  // Fetch most recent entry for this phone + wheel using service role (bypasses RLS)
  const res = await fetch(
    `${url}/rest/v1/spin_entries?wheel_id=eq.${wheelId}&phone=eq.${encodeURIComponent(phone)}&select=last_spin_at&order=last_spin_at.desc&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  const rows = await res.json() as Array<{ last_spin_at: string }>;
  const existing = rows?.[0] ?? null;

  if (!existing) {
    return NextResponse.json({ eligible: true });
  }

  const lastSpin = new Date(existing.last_spin_at);
  const now = new Date();

  if (frequency === "once") {
    return NextResponse.json({ eligible: false, message: "Vous avez déjà participé à cette roue." });
  }

  if (frequency === "daily") {
    if (lastSpin.toDateString() === now.toDateString()) {
      return NextResponse.json({ eligible: false, message: "Vous avez déjà joué aujourd'hui. Revenez demain !" });
    }
  }

  if (frequency === "weekly") {
    const diff = (now.getTime() - lastSpin.getTime()) / 86400000;
    if (diff < 7) {
      return NextResponse.json({ eligible: false, message: `Revenez dans ${Math.ceil(7 - diff)} jour(s).` });
    }
  }

  if (frequency === "monthly") {
    const diff = (now.getTime() - lastSpin.getTime()) / 86400000;
    if (diff < 30) {
      return NextResponse.json({ eligible: false, message: `Revenez dans ${Math.ceil(30 - diff)} jour(s).` });
    }
  }

  return NextResponse.json({ eligible: true });
}
