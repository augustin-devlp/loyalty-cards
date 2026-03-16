"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CardPreview from "@/components/CardPreview";

interface NewCardFormProps {
  userId: string;
}

export default function NewCardForm({ userId }: NewCardFormProps) {
  const router = useRouter();

  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState<"stamp" | "points">("stamp");
  const [stampsRequired, setStampsRequired] = useState(10);
  const [pointsPerPurchase, setPointsPerPurchase] = useState(1);
  const [rewardThreshold, setRewardThreshold] = useState(100);
  const [rewardDescription, setRewardDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => setLogoPreview(evt.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    let logoUrl: string | null = null;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, logoFile, { upsert: false });

      if (uploadError) {
        setError("Erreur lors de l'upload du logo : " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
      logoUrl = urlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("loyalty_cards")
      .insert({
        business_id: userId,
        card_name: cardName,
        card_type: cardType,
        stamps_required: cardType === "stamp" ? stampsRequired : null,
        points_per_purchase: cardType === "points" ? pointsPerPurchase : null,
        reward_threshold: cardType === "points" ? rewardThreshold : null,
        reward_description: rewardDescription,
        logo_url: logoUrl,
        primary_color: primaryColor,
        text_color: textColor,
        qr_code_value: crypto.randomUUID(),
      })
      .select()
      .single();

    if (insertError) {
      setError("Erreur : " + insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/cards/${data.id}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la carte
          </label>
          <input
            type="text"
            required
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="ex: Carte fidélité Boulangerie"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de carte
          </label>
          <div className="flex gap-3">
            {(["stamp", "points"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCardType(type)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  cardType === type
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400"
                }`}
              >
                {type === "stamp" ? "🔖 Tampons" : "⭐ Points"}
              </button>
            ))}
          </div>
        </div>

        {/* Stamps fields */}
        {cardType === "stamp" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de tampons pour la récompense
            </label>
            <input
              type="number"
              required
              min={1}
              max={50}
              value={stampsRequired}
              onChange={(e) => setStampsRequired(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Points fields */}
        {cardType === "points" && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points par achat
              </label>
              <input
                type="number"
                required
                min={1}
                value={pointsPerPurchase}
                onChange={(e) => setPointsPerPurchase(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil de récompense (pts)
              </label>
              <input
                type="number"
                required
                min={1}
                value={rewardThreshold}
                onChange={(e) => setRewardThreshold(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Reward description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description de la récompense
          </label>
          <input
            type="text"
            required
            value={rewardDescription}
            onChange={(e) => setRewardDescription(e.target.value)}
            placeholder="ex: 1 croissant offert"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Logo upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo du commerce (optionnel)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Aperçu logo"
              className="mt-2 h-14 w-14 rounded-full object-cover border border-gray-200"
            />
          )}
        </div>

        {/* Colors */}
        <div className="flex gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Couleur principale
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              />
              <span className="text-sm text-gray-500 font-mono">{primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Couleur du texte
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              />
              <span className="text-sm text-gray-500 font-mono">{textColor}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Création en cours…" : "Créer la carte"}
        </button>
      </form>

      {/* Live preview */}
      <div className="lg:w-80">
        <p className="text-sm font-medium text-gray-700 mb-3">Aperçu en direct</p>
        <CardPreview
          cardName={cardName}
          cardType={cardType}
          stampsRequired={stampsRequired}
          pointsPerPurchase={pointsPerPurchase}
          rewardThreshold={rewardThreshold}
          rewardDescription={rewardDescription}
          logoUrl={logoPreview}
          primaryColor={primaryColor}
          textColor={textColor}
        />
      </div>
    </div>
  );
}
