import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import ScanPage from "./ScanPage";

export default async function ScanRoute() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <DashboardNav />

      <main className="max-w-lg mx-auto">
        <ScanPage />
      </main>
    </div>
  );
}
