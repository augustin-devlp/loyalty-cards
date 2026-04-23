import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/cron/reactivate-stocks
 * Cron 5 min — réactive auto les plats dont auto_reactivate_at < now().
 */
export async function GET(req: NextRequest) {
  const isCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = req.headers.get("x-cron-secret");
  const validSecret = process.env.CRON_SECRET ?? "rialto-cron-2026";
  if (!isCron && cronSecret !== validSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: toReactivate } = await admin
    .from("menu_items")
    .select("id, name")
    .eq("is_out_of_stock", true)
    .not("out_of_stock_auto_reactivate_at", "is", null)
    .lte("out_of_stock_auto_reactivate_at", now);

  const count = (toReactivate ?? []).length;
  if (count > 0) {
    await admin
      .from("menu_items")
      .update({
        is_out_of_stock: false,
        out_of_stock_since: null,
        out_of_stock_reason: null,
        out_of_stock_auto_reactivate_at: null,
      })
      .in(
        "id",
        (toReactivate ?? []).map((i) => i.id as string),
      );
  }

  return NextResponse.json({
    ok: true,
    reactivated: count,
    items: (toReactivate ?? []).map((i) => i.name),
  });
}
