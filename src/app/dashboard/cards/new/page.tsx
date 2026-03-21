import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewCardForm from "./NewCardForm";

export default async function NewCardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: biz } = await supabase
    .from("businesses")
    .select("plan")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← Tableau de bord
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium">Nouvelle carte</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Créer une carte de fidélité</h1>
          <p className="text-gray-500 text-sm mt-1">
            Personnalisez votre carte et visualisez l'aperçu en temps réel.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <NewCardForm userId={user.id} plan={biz?.plan ?? null} />
        </div>
      </main>
    </div>
  );
}
