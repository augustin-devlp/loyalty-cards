import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import StocksPageClient from "./StocksPageClient";

/**
 * Phase 11 C8 — /dashboard/stocks
 * Toggle de rupture de stock par plat, avec auto-réactivation optionnelle
 * (ex: fin de journée).
 */
export default async function StocksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight md:text-4xl">
            Stocks 📦
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Marque un plat comme épuisé en un clic. Réactivation auto à la
            fin de service si tu choisis &quot;demain&quot;.
          </p>
        </header>

        <StocksPageClient userId={user.id} />
      </main>
    </div>
  );
}
