/**
 * Client Supabase avec la service role key — bypasse la RLS.
 * À utiliser UNIQUEMENT dans les routes API côté serveur après vérification admin.
 * Ne jamais exposer côté client.
 */
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "[admin-client] SUPABASE_SERVICE_ROLE_KEY manquant — ajoutez-le dans .env.local et dans les variables Vercel"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
