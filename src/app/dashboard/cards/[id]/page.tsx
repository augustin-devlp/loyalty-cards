import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import QRCodeSection from "@/components/QRCodeSection";
import EditCardForm from "./EditCardForm";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("*")
    .eq("id", id)
    .eq("business_id", user.id)
    .single();

  if (!card) notFound();

  return (
    <div>
      <DashboardNav />
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm transition-colors" style={{ color: "var(--dash-muted)" }}>
            ← Tableau de bord
          </Link>
          <span style={{ color: "var(--dash-border)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>{card.card_name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>{card.card_name}</h1>
            <p className="text-sm mt-1" style={{ color: "var(--dash-muted)" }}>
              {card.card_type === "stamp" ? "Carte à tampons" : "Carte à points"}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              card.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {card.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* QR code section */}
        <QRCodeSection cardId={card.id} />

        {/* Edit form */}
        <div className="rounded-2xl border p-8 shadow-sm" style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: "var(--dash-text)" }}>
            Modifier la carte
          </h2>
          <EditCardForm
            card={{
              id: card.id,
              card_name: card.card_name,
              card_type: card.card_type,
              stamps_required: card.stamps_required,
              points_per_purchase: card.points_per_purchase,
              reward_threshold: card.reward_threshold,
              reward_description: card.reward_description,
              welcome_message: card.welcome_message ?? null,
              primary_color: card.primary_color,
              text_color: card.text_color,
              logo_url: card.logo_url ?? null,
              stamp_shape: card.stamp_shape ?? "circle",
              card_style: card.card_style ?? "rounded",
              is_active: card.is_active,
            }}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  );
}
