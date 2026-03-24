"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CardPreview from "@/components/CardPreview";
import StampShapePicker from "@/components/StampShapePicker";

type CardStyle = "rounded" | "square" | "modern";

const CARD_STYLES: { value: CardStyle; label: string; desc: string; icon: string }[] = [
  { value: "rounded", label: "Arrondi",  desc: "Coins doux",      icon: "▢" },
  { value: "square",  label: "Carré",    desc: "Angles nets",     icon: "■" },
  { value: "modern",  label: "Moderne",  desc: "Bande + dégradé", icon: "◈" },
];

interface Card {
  id: string;
  card_name: string;
  card_type: "stamp" | "points";
  stamps_required: number | null;
  points_per_purchase: number | null;
  reward_threshold: number | null;
  reward_description: string;
  welcome_message: string | null;
  primary_color: string;
  text_color: string;
  logo_url: string | null;
  stamp_shape: string;
  card_style: string;
  is_active: boolean;
}

export default function EditCardForm({
  card,
  userId,
  currentBgUrl,
}: {
  card: Card;
  userId: string;
  currentBgUrl?: string | null;
}) {
  const router = useRouter();
  const [cardName, setCardName] = useState(card.card_name);
  const [rewardDescription, setRewardDescription] = useState(card.reward_description);
  const [welcomeMessage, setWelcomeMessage] = useState(card.welcome_message ?? "");
  const [stampsRequired, setStampsRequired] = useState(card.stamps_required ?? 10);
  const [pointsPerPurchase, setPointsPerPurchase] = useState(card.points_per_purchase ?? 1);
  const [rewardThreshold, setRewardThreshold] = useState(card.reward_threshold ?? 100);
  const [primaryColor, setPrimaryColor] = useState(card.primary_color);
  const [textColor, setTextColor] = useState(card.text_color);
  const [stampShape, setStampShape] = useState(card.stamp_shape ?? "circle");
  const [cardStyle, setCardStyle] = useState<CardStyle>((card.card_style ?? "rounded") as CardStyle);
  const [logoPreview, setLogoPreview] = useState<string | null>(card.logo_url);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(currentBgUrl ?? null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => setPreview(evt.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadFile = async (
    supabase: ReturnType<typeof createClient>,
    file: File,
    prefix: string
  ): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${prefix}-${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("logos").upload(path, file, { upsert: false });
    if (uploadError) return null;
    return supabase.storage.from("logos").getPublicUrl(path).data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    let logoUrl = card.logo_url;
    if (logoFile) {
      const url = await uploadFile(supabase, logoFile, "logo");
      if (url) logoUrl = url;
    }

    if (bgFile) {
      const url = await uploadFile(supabase, bgFile, "bg");
      if (url) {
        await supabase.from("businesses").update({ join_background_url: url }).eq("id", userId);
      }
    }

    const { error: updateError } = await supabase
      .from("loyalty_cards")
      .update({
        card_name: cardName,
        reward_description: rewardDescription,
        welcome_message: welcomeMessage.trim() || null,
        stamps_required: card.card_type === "stamp" ? stampsRequired : card.stamps_required,
        points_per_purchase: card.card_type === "points" ? pointsPerPurchase : card.points_per_purchase,
        reward_threshold: card.card_type === "points" ? rewardThreshold : card.reward_threshold,
        primary_color: primaryColor,
        text_color: textColor,
        stamp_shape: stampShape,
        card_style: cardStyle,
        logo_url: logoUrl,
      })
      .eq("id", card.id);

    if (updateError) {
      setError("Erreur : " + updateError.message);
    } else {
      setSuccess(true);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-10">
      {/* ── FORM ── */}
      <form onSubmit={handleSave} className="flex-1 space-y-5 min-w-0">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">✓ Modifications enregistrées.</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la carte</label>
          <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message de bienvenue <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input type="text" value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="ex: Bienvenue chez nous !"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Récompense</label>
          <input type="text" required value={rewardDescription} onChange={(e) => setRewardDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {card.card_type === "stamp" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tampons requis</label>
            <input type="number" min={1} max={50} value={stampsRequired} onChange={(e) => setStampsRequired(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        )}

        {card.card_type === "points" && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Points par achat</label>
              <input type="number" min={1} value={pointsPerPurchase} onChange={(e) => setPointsPerPurchase(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seuil (pts)</label>
              <input type="number" min={1} value={rewardThreshold} onChange={(e) => setRewardThreshold(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {logoPreview && (
            <img src={logoPreview} alt="Logo" className="mt-2 h-14 w-14 rounded-full object-cover border border-gray-200" />
          )}
        </div>

        {/* Background photo */}
        <div className="rounded-xl border border-dashed border-gray-300 p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Photo de fond — page d&apos;inscription</p>
            <p className="text-xs text-gray-400 mt-0.5">Partagée entre toutes vos cartes.</p>
          </div>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBgFile, setBgPreview)}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
          {bgPreview && (
            <img src={bgPreview} alt="Fond" className="mt-1 h-20 w-full object-cover rounded-xl border border-gray-200" />
          )}
        </div>

        <div className="flex gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
            <div className="flex items-center gap-2">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
              <span className="text-sm font-mono text-gray-500">{primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur texte</label>
            <div className="flex items-center gap-2">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
              <span className="text-sm font-mono text-gray-500">{textColor}</span>
            </div>
          </div>
        </div>

        {card.card_type === "stamp" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forme des tampons</label>
            <StampShapePicker value={stampShape} onChange={setStampShape} />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Style de la carte</label>
          <div className="flex gap-2">
            {CARD_STYLES.map((s) => (
              <button key={s.value} type="button" onClick={() => setCardStyle(s.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-colors ${
                  cardStyle === s.value ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}>
                <span className="text-lg">{s.icon}</span>
                <span>{s.label}</span>
                <span className="text-[10px] opacity-60">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
          {loading ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>

      {/* ── LIVE PREVIEW ── */}
      <div className="xl:w-80 xl:sticky xl:top-8 xl:self-start space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Aperçu en direct</p>
          <CardPreview
            cardName={cardName}
            cardType={card.card_type}
            stampsRequired={stampsRequired}
            pointsPerPurchase={pointsPerPurchase}
            rewardThreshold={rewardThreshold}
            rewardDescription={rewardDescription}
            logoUrl={logoPreview}
            primaryColor={primaryColor}
            textColor={textColor}
            stampShape={stampShape}
            cardStyle={cardStyle}
            welcomeMessage={welcomeMessage}
          />
        </div>
        {bgPreview && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Aperçu fond /join</p>
            <img src={bgPreview} alt="Fond" className="w-full h-24 object-cover rounded-xl opacity-80" />
          </div>
        )}
      </div>
    </div>
  );
}
