import { NextResponse } from "next/server";

const ADMIN_PIN = "0808";

/** PostgREST count via Content-Range header (no row data returned) */
async function countTable(
  baseUrl: string,
  table: string,
  hdrs: Record<string, string>,
): Promise<number> {
  const res = await fetch(`${baseUrl}/rest/v1/${table}?select=id`, {
    headers: { ...hdrs, Prefer: "count=exact", Range: "0-0" },
  });
  const cr = res.headers.get("content-range") ?? "";
  const m = cr.match(/\/(\d+)$/);
  return m ? parseInt(m[1]) : 0;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as { pin?: string };

  if (body.pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Code incorrect" }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Config manquante" }, { status: 500 });
  }

  const hdrs: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  const [bizRes, upgradeRes, totalCustomers, totalCards, totalTx] = await Promise.all([
    fetch(
      `${url}/rest/v1/businesses?select=id,business_name,email,country,plan,subscription_status,status,phone,activation_code,created_at&order=created_at.desc`,
      { headers: hdrs },
    ),
    fetch(
      `${url}/rest/v1/upgrade_requests?select=id,business_name,business_email,business_phone,current_plan,requested_item,request_type,created_at&status=eq.pending&order=created_at.desc`,
      { headers: hdrs },
    ),
    countTable(url, "customers", hdrs),
    countTable(url, "customer_cards", hdrs),
    countTable(url, "transactions", hdrs),
  ]);

  const businesses    = await bizRes.json();
  const upgradeRequests = await upgradeRes.json();

  return NextResponse.json({
    businesses:     Array.isArray(businesses)     ? businesses     : [],
    upgradeRequests: Array.isArray(upgradeRequests) ? upgradeRequests : [],
    totalCustomers,
    totalCards,
    totalTx,
  });
}
