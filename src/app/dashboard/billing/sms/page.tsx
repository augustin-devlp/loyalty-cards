import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import SmsBillingClient from "./SmsBillingClient";

/**
 * Phase 11 C17 — /dashboard/billing/sms
 * Onglet facturation SMS avec barème dégressif live + usage actuel +
 * projections pour Mehmet / Rialto.
 */
export default async function SmsBillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight md:text-4xl">
            Facturation SMS 📱
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Usage live + barème dégressif. Plus tu envoies, moins c&apos;est
            cher à l&apos;unité.
          </p>
        </header>
        <SmsBillingClient />
      </main>
    </div>
  );
}
