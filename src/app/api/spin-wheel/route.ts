import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Try to get the existing wheel
    const { data: wheel, error: wheelError } = await supabase
      .from("spin_wheels")
      .select("*")
      .eq("business_id", user.id)
      .single();

    if (wheelError && wheelError.code !== "PGRST116") {
      console.error("Error fetching spin wheel:", wheelError);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    if (wheel) {
      // Fetch associated rewards/segments
      const { data: rewards, error: rewardsError } = await supabase
        .from("spin_rewards")
        .select("*")
        .eq("wheel_id", wheel.id)
        .order("created_at", { ascending: true });

      if (rewardsError) {
        console.error("Error fetching spin rewards:", rewardsError);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }

      return NextResponse.json({ wheel, rewards: rewards ?? [] });
    }

    // Create a new wheel with default segments
    const { data: newWheel, error: insertError } = await supabase
      .from("spin_wheels")
      .insert({
        business_id: user.id,
        is_active: false,
        frequency: "once",
      })
      .select()
      .single();

    if (insertError || !newWheel) {
      console.error("Error creating spin wheel:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de la création de la roue" },
        { status: 500 }
      );
    }

    // Insert default segments
    const defaultRewards = [
      { wheel_id: newWheel.id, label: "10% de réduction", color: "#534AB7", probability: 30 },
      { wheel_id: newWheel.id, label: "Café offert", color: "#7C3AED", probability: 20 },
      { wheel_id: newWheel.id, label: "Perdu", color: "#9CA3AF", probability: 50 },
    ];

    const { data: rewards, error: rewardsInsertError } = await supabase
      .from("spin_rewards")
      .insert(defaultRewards)
      .select();

    if (rewardsInsertError) {
      console.error("Error creating default rewards:", rewardsInsertError);
    }

    return NextResponse.json({ wheel: newWheel, rewards: rewards ?? [] });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      is_active?: boolean;
      frequency?: string;
      segments?: Array<{ label: string; color: string; probability: number }>;
    };

    // Get the wheel for this business
    const { data: wheel, error: wheelError } = await supabase
      .from("spin_wheels")
      .select("id")
      .eq("business_id", user.id)
      .single();

    if (wheelError || !wheel) {
      return NextResponse.json({ error: "Roue introuvable" }, { status: 404 });
    }

    // Build wheel update payload
    const wheelUpdate: Record<string, unknown> = {};
    if (body.is_active !== undefined) wheelUpdate.is_active = body.is_active;
    if (body.frequency !== undefined) wheelUpdate.frequency = body.frequency;

    if (Object.keys(wheelUpdate).length > 0) {
      const { error: updateError } = await supabase
        .from("spin_wheels")
        .update(wheelUpdate)
        .eq("id", wheel.id);

      if (updateError) {
        console.error("Error updating spin wheel:", updateError);
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
      }
    }

    // Update segments if provided
    if (body.segments !== undefined) {
      // Validate total probability = 100
      const total = body.segments.reduce((sum, s) => sum + s.probability, 0);
      if (Math.round(total) !== 100) {
        return NextResponse.json(
          { error: "La somme des probabilités doit être égale à 100%" },
          { status: 400 }
        );
      }

      if (body.segments.length > 8) {
        return NextResponse.json(
          { error: "Maximum 8 segments autorisés" },
          { status: 400 }
        );
      }

      // Delete existing rewards and re-insert
      const { error: deleteError } = await supabase
        .from("spin_rewards")
        .delete()
        .eq("wheel_id", wheel.id);

      if (deleteError) {
        console.error("Error deleting rewards:", deleteError);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }

      const newRewards = body.segments.map((s) => ({
        wheel_id: wheel.id,
        label: s.label,
        color: s.color,
        probability: s.probability,
      }));

      const { error: insertError } = await supabase
        .from("spin_rewards")
        .insert(newRewards);

      if (insertError) {
        console.error("Error inserting rewards:", insertError);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
