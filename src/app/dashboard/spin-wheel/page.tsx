import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import SpinWheelClient from "./SpinWheelClient";

export default async function SpinWheelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch or create the spin wheel for this business
  let wheel: {
    id: string;
    business_id: string;
    is_active: boolean;
    frequency: string;
  } | null = null;

  const { data: existingWheel, error: wheelError } = await supabase
    .from("spin_wheels")
    .select("id, business_id, is_active, frequency")
    .eq("business_id", user.id)
    .single();

  if (wheelError && wheelError.code !== "PGRST116") {
    console.error("Error fetching spin wheel:", wheelError);
  }

  if (existingWheel) {
    wheel = existingWheel;
  } else {
    // Create a new wheel
    const { data: newWheel, error: createError } = await supabase
      .from("spin_wheels")
      .insert({
        business_id: user.id,
        is_active: false,
        frequency: "once",
      })
      .select("id, business_id, is_active, frequency")
      .single();

    if (createError || !newWheel) {
      console.error("Error creating spin wheel:", createError);
    } else {
      wheel = newWheel;

      // Insert default segments
      await supabase.from("spin_rewards").insert([
        { wheel_id: newWheel.id, label: "10% de réduction", color: "#534AB7", probability: 30 },
        { wheel_id: newWheel.id, label: "Café offert", color: "#7C3AED", probability: 20 },
        { wheel_id: newWheel.id, label: "Perdu", color: "#9CA3AF", probability: 50 },
      ]);
    }
  }

  // Fetch rewards/segments
  const { data: rewards } = wheel
    ? await supabase
        .from("spin_rewards")
        .select("id, label, color, probability")
        .eq("wheel_id", wheel.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  if (!wheel) {
    return (
      <div className="min-h-screen">
        <DashboardNav />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-medium">
              Impossible de charger la roue de la fortune. Veuillez réessayer.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main>
        <SpinWheelClient
          wheel={wheel}
          rewards={rewards ?? []}
          businessId={user.id}
        />
      </main>
    </div>
  );
}
