import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import AnalyticsDashboardClient from "./AnalyticsDashboardClient";

/**
 * Phase 11 C2 — Dashboard analytics monstrueux RFM-A.
 *
 * 10 sections :
 *   1. KPIs globaux (CA jour/semaine/mois/année + AOV + nb commandes)
 *   2. Courbe revenus 30 jours
 *   3. Distribution horaire (heures de rush)
 *   4. Distribution jours de la semaine
 *   5. Segments RFM (11 segments) + CTA campagne SMS
 *   6. Démographie par tranche d'âge
 *   7. Démographie par genre
 *   8. Top 10 produits
 *   9. Top 10 clients dépensiers
 *   10. Totaux (clients inscrits vs acheteurs)
 */
export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl font-black tracking-tight md:text-4xl">
            Analytics 📊
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue 360° de ton business — clients, revenus, segments, heures de
            pointe. Segmentation RFM-A en temps réel.
          </p>
        </header>

        <AnalyticsDashboardClient />
      </main>
    </div>
  );
}
