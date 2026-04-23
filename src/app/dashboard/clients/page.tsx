import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import ClientsPageClient from "./ClientsPageClient";

/**
 * Phase 11 C3 — /dashboard/clients
 * Liste clients + détail (orders, SMS logs, promo codes, carte fidélité).
 */
export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight md:text-4xl">
            Clients 👥
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue détaillée de ta base clients — commandes, SMS envoyés, codes
            promo actifs, carte fidélité.
          </p>
        </header>

        <ClientsPageClient />
      </main>
    </div>
  );
}
