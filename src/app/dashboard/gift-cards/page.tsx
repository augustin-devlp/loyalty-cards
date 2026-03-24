import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import GiftCardsClient from "./GiftCardsClient";

export default async function GiftCardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cards } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <GiftCardsClient initialCards={cards ?? []} />
      </main>
    </div>
  );
}
