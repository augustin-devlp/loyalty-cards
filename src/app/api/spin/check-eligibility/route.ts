import { NextResponse } from "next/server";

// ── Helpers ───────────────────────────────────────────────────────────────────

interface Play {
  last_spin_at: string;
  reward_won: string | null;
}

/** Human-readable date for the next eligible participation */
function nextEligibleMessage(frequency: string, firstPlayAt: string, now: Date): string {
  const first = new Date(firstPlayAt);

  if (frequency === "daily") {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return `Vous avez déjà participé. Revenez le ${next.toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
    })}.`;
  }

  if (frequency === "weekly") {
    const next = new Date(first.getTime() + 7 * 24 * 3600 * 1000);
    return `Vous avez déjà participé. Revenez le ${next.toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
    })}.`;
  }

  if (frequency === "monthly") {
    const next = new Date(first.getTime() + 30 * 24 * 3600 * 1000);
    return `Vous avez déjà participé. Revenez le ${next.toLocaleDateString("fr-FR", {
      day: "numeric", month: "long",
    })}.`;
  }

  return "Vous avez déjà participé.";
}

// ── Route ─────────────────────────────────────────────────────────────────────

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

  // ── Determine start of the current period ──────────────────────────────────
  const now = new Date();
  let since: string | null = null;

  if (frequency === "daily") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    since = d.toISOString();
  } else if (frequency === "weekly") {
    since = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
  } else if (frequency === "monthly") {
    since = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();
  }
  // "once" → no filter → fetch all plays ever

  // ── Fetch plays from Supabase using service role (bypass RLS) ─────────────
  let apiUrl =
    `${url}/rest/v1/spin_entries` +
    `?wheel_id=eq.${wheelId}` +
    `&phone=eq.${encodeURIComponent(phone)}` +
    `&select=last_spin_at,reward_won` +
    `&order=last_spin_at.asc`;

  if (since) apiUrl += `&last_spin_at=gte.${encodeURIComponent(since)}`;

  const res = await fetch(apiUrl, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const plays = await res.json() as Play[];

  // ── 0 plays → always eligible ─────────────────────────────────────────────
  if (!Array.isArray(plays) || plays.length === 0) {
    return NextResponse.json({ eligible: true });
  }

  // ── "once" → blocked after any play ──────────────────────────────────────
  if (frequency === "once") {
    return NextResponse.json({
      eligible: false,
      message: "Vous avez déjà participé à cette roue.",
    });
  }

  // ── daily / weekly / monthly ──────────────────────────────────────────────

  // A win in the period → immediately blocked
  const hasWin = plays.some(p => p.reward_won !== null && p.reward_won.trim() !== "");
  if (hasWin) {
    return NextResponse.json({
      eligible: false,
      message: nextEligibleMessage(frequency, plays[0].last_spin_at, now),
    });
  }

  // 2+ plays (all losses) → used up the one replay → blocked
  if (plays.length >= 2) {
    return NextResponse.json({
      eligible: false,
      message: nextEligibleMessage(frequency, plays[0].last_spin_at, now),
    });
  }

  // Exactly 1 play with no reward → eligible for the one allowed replay
  return NextResponse.json({ eligible: true });
}
