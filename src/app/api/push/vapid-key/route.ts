import { NextRequest, NextResponse } from "next/server";
import { rialtoCorsHeaders } from "@/lib/rialtoConstants";

/**
 * GET /api/push/vapid-key
 * Retourne la clé publique VAPID pour que les clients puissent souscrire
 * aux notifications push. CORS Rialto autorisé.
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin"), "GET, OPTIONS"),
  });
}

export async function GET(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"), "GET, OPTIONS");
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null;
  return NextResponse.json(
    { key, configured: Boolean(key) },
    { headers },
  );
}
