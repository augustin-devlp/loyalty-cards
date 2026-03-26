import { NextResponse } from "next/server";

// ── Helpers ───────────────────────────────────────────────────────────────────

interface Play {
  last_spin_at: string;
  reward_won: string | null;
}

/**
 * Normalize a phone number identically on server and client.
 * Strips everything except the leading + and digits.
 * "+33 6 12-34-56 78" → "+33612345678"
 */
function normalizePhone(p: string): string {
  return p.replace(/[^+\d]/g, "");
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
  const { wheelId, phone: rawPhone, frequency } = await req.json() as {
    wheelId?: string;
    phone?: string;
    frequency?: string;
  };

  if (!wheelId || !rawPhone || !frequency) {
    return NextResponse.json({ eligible: false, message: "Paramètres manquants" }, { status: 400 });
  }

  // ── Normalize phone — same logic as client normalizePhone() ───────────────
  const phone = normalizePhone(rawPhone);
  console.log("[check-eligibility] rawPhone:", rawPhone, "→ normalized:", phone, "| wheelId:", wheelId, "| frequency:", frequency);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ eligible: false, message: "Config manquante" }, { status: 500 });
  }

  // ── Determine start of the current period ─────────────────────────────────
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
  // "once" → no time filter → fetch all plays ever

  // ── Fetch plays from Supabase (service role bypasses RLS) ─────────────────
  // Use encodeURIComponent on the phone so + is sent as %2B, not as a space
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

  console.log("[check-eligibility] plays found:", Array.isArray(plays) ? plays.length : "error", plays);

  // ── 0 plays → always eligible ─────────────────────────────────────────────
  if (!Array.isArray(plays) || plays.length === 0) {
    return NextResponse.json({ eligible: true });
  }

  // ── "once" → blocked after any play (even a single loss) ─────────────────
  if (frequency === "once") {
    return NextResponse.json({
      eligible: false,
      message: "Vous avez déjà participé à cette roue.",
    });
  }

  // ── daily / weekly / monthly ──────────────────────────────────────────────

  // Safety net: 2+ plays in period → always block, no exceptions
  if (plays.length >= 2) {
    console.log("[check-eligibility] BLOCKED — 2+ plays in period");
    return NextResponse.json({
      eligible: false,
      message: nextEligibleMessage(frequency, plays[0].last_spin_at, now),
    });
  }

  // 1 play in period: check if it was a win
  const hasWin = plays.some(p => p.reward_won !== null && p.reward_won.trim() !== "");
  if (hasWin) {
    console.log("[check-eligibility] BLOCKED — won in period:", plays[0].reward_won);
    return NextResponse.json({
      eligible: false,
      message: nextEligibleMessage(frequency, plays[0].last_spin_at, now),
    });
  }

  // Exactly 1 play with no reward → eligible for the one allowed replay
  console.log("[check-eligibility] ELIGIBLE — 1 loss, replay allowed");
  return NextResponse.json({ eligible: true });
}
