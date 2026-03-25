import { createAnonClient } from "@/lib/supabase/anon";
import { NextRequest, NextResponse } from "next/server";

interface SpinReward {
  id: string;
  label: string;
  color: string;
  probability: number;
}

function pickReward(rewards: SpinReward[]): SpinReward {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const reward of rewards) {
    cumulative += reward.probability;
    if (rand <= cumulative) return reward;
  }
  return rewards[rewards.length - 1];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ business_id: string }> }
) {
  const { business_id } = await params;
  const supabase = createAnonClient();

  try {
    const body = await request.json() as { phone: string; first_name: string };

    if (!body.phone || !body.first_name) {
      return NextResponse.json(
        { error: "Prénom et téléphone requis" },
        { status: 400 }
      );
    }

    // Fetch active wheel for this business
    const { data: wheel, error: wheelError } = await supabase
      .from("spin_wheels")
      .select("id, is_active, frequency")
      .eq("business_id", business_id)
      .eq("is_active", true)
      .single();

    if (wheelError || !wheel) {
      return NextResponse.json(
        { error: "La roue n'est pas disponible pour le moment" },
        { status: 404 }
      );
    }

    // Check anti-duplicate based on frequency
    const { data: existingEntries } = await supabase
      .from("spin_entries")
      .select("id, last_spin_at")
      .eq("wheel_id", wheel.id)
      .eq("phone", body.phone)
      .order("last_spin_at", { ascending: false })
      .limit(1);

    const lastEntry = existingEntries?.[0] ?? null;

    if (lastEntry) {
      const lastSpinAt = new Date(lastEntry.last_spin_at);
      const now = new Date();

      if (wheel.frequency === "once") {
        return NextResponse.json(
          { error: "Vous avez déjà participé" },
          { status: 409 }
        );
      }

      if (wheel.frequency === "daily") {
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (lastSpinAt >= todayMidnight) {
          const tomorrow = new Date(todayMidnight);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return NextResponse.json(
            { error: "Revenez demain", next_spin_at: tomorrow.toISOString() },
            { status: 409 }
          );
        }
      }

      if (wheel.frequency === "weekly") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (lastSpinAt >= sevenDaysAgo) {
          const nextSpin = new Date(lastSpinAt.getTime() + 7 * 24 * 60 * 60 * 1000);
          const daysLeft = Math.ceil((nextSpin.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          return NextResponse.json(
            {
              error: `Revenez dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`,
              next_spin_at: nextSpin.toISOString(),
            },
            { status: 409 }
          );
        }
      }

      if (wheel.frequency === "monthly") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (lastSpinAt >= thirtyDaysAgo) {
          const nextSpin = new Date(lastSpinAt.getTime() + 30 * 24 * 60 * 60 * 1000);
          const daysLeft = Math.ceil((nextSpin.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          return NextResponse.json(
            {
              error: `Revenez dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`,
              next_spin_at: nextSpin.toISOString(),
            },
            { status: 409 }
          );
        }
      }
    }

    // Fetch rewards/segments
    const { data: rewards, error: rewardsError } = await supabase
      .from("spin_rewards")
      .select("id, label, color, probability")
      .eq("wheel_id", wheel.id);

    if (rewardsError || !rewards || rewards.length === 0) {
      return NextResponse.json(
        { error: "Aucun segment configuré" },
        { status: 500 }
      );
    }

    // Pick a reward based on probabilities
    const won = pickReward(rewards as SpinReward[]);

    // Insert spin entry
    const { error: insertError } = await supabase
      .from("spin_entries")
      .insert({
        wheel_id: wheel.id,
        phone: body.phone,
        first_name: body.first_name,
        reward_won: won.label,
        last_spin_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Error inserting spin entry:", insertError);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    return NextResponse.json({ reward: won.label, reward_id: won.id });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
