"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CardPreview from "@/components/CardPreview";
import StampShapePicker from "@/components/StampShapePicker";

interface NewCardFormProps {
  userId: string;
}

type CardStyle = "rounded" | "square" | "modern";

const CARD_STYLES: { value: CardStyle; label: string; desc: string; icon: string }[] = [
  { value: "rounded", label: "Arrondi",  desc: "Coins doux",        icon: "▢" },
  { value: "square",  label: "Carré",    desc: "Angles nets",       icon: "■" },
  { value: "modern",  label: "Moderne",  desc: "Bande + dégradé",   icon: "◈" },
];

export default function NewCardForm({ userId }: NewCardFormProps) {
  const router = useRouter();

  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState<"stamp" | "points">("stamp");
  const [stampsRequired, setStampsRequired] = useState(10);
  const [pointsPerPurchase, setPointsPerPurchase] = useState(1);
  const [rewardThreshold, setRewardThreshold] = useState(100);
  const [rewardDescription, setRewardDescription] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [stampShape, setStampShape] = useState("circle");
  const [cardStyle, setCardStyle] = useState<CardStyle>("rounded");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(path, file, { upsert: false });
    if (uploadError) return null;
    return supabase.storage.from("logos").getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const logoUrl = logoFile ? await uploadFile(supabase, logoFile, "logo") : null;
    const bgUrl   = bgFile   ? await uploadFile(supabase, bgFile,   "bg")   : null;

    if (bgUrl) {
      await supabase
        .from("businesses")
        .update({ join_background_url: bgUrl })
        .eq("id", userId);
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
        welcome_message: welcomeMessage.trim() || null,
        logo_url: logoUrl,
        primary_color: primaryColor,
        text_color: textColor,
        stamp_shape: stampShape,
        card_style: cardStyle,
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
    <div className="flex flex-col xl:flex-row gap-10">
      {/* ── FORM ── */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6 min-w-0">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la carte</label>
          <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)}
            placeholder="ex: Carte fidélité Boulangerie"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {/* Message de bienvenue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message de bienvenue <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input type="text" value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="ex: Bienvenue chez nous, profitez de vos avantages !"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p className="text-xs text-gray-400 mt-1">Affiché sur la page d&apos;inscription client</p>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de carte</label>
          <div className="flex gap-3">
            {(["stamp", "points"] as const).map((type) => (
              <button key={type} type="button" onClick={() => setCardType(type)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  cardType === type ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400"
                }`}>
                {type === "stamp" ? "🔖 Tampons" : "⭐ Points"}
              </button>
            ))}
          </div>
        </div>

        {/* Stamps */}
        {cardType === "stamp" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tampons pour la récompense</label>
            <input type="number" required min={1} max={50} value={stampsRequired}
              onChange={(e) => setStampsRequired(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        )}

        {/* Points */}
        {cardType === "points" && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Points par achat</label>
              <input type="number" required min={1} value={pointsPerPurchase}
                onChange={(e) => setPointsPerPurchase(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seuil récompense (pts)</label>
              <input type="number" required min={1} value={rewardThreshold}
                onChange={(e) => setRewardThreshold(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        )}

        {/* Reward */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description de la récompense</label>
          <input type="text" required value={rewardDescription} onChange={(e) => setRewardDescription(e.target.value)}
            placeholder="ex: 1 croissant offert"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo du commerce (optionnel)</label>
          <input type="file" accept="image/*"
            onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {logoPreview && (
            <img src={logoPreview} alt="Logo" className="mt-2 h-14 w-14 rounded-full object-cover border border-gray-200" />
          )}
        </div>

        {/* Background photo for join page */}
        <div className="rounded-xl border border-dashed border-gray-300 p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Photo de fond — page d&apos;inscription</p>
            <p className="text-xs text-gray-400 mt-0.5">Affichée derrière l&apos;aperçu carte sur la page /join. Partagée entre toutes vos cartes.</p>
          </div>
          <input type="file" accept="image/*"
            onChange={(e) => handleFileChange(e, setBgFile, setBgPreview)}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
          {bgPreview && (
            <img src={bgPreview} alt="Fond" className="mt-2 h-24 w-full object-cover rounded-xl border border-gray-200" />
          )}
        </div>

        {/* Colors */}
        <div className="flex gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
            <div className="flex items-center gap-2">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
              <span className="text-sm text-gray-500 font-mono">{primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur du texte</label>
            <div className="flex items-center gap-2">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
              <span className="text-sm text-gray-500 font-mono">{textColor}</span>
            </div>
          </div>
        </div>

        {/* Stamp shape picker (stamp cards only) */}
        {cardType === "stamp" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forme des tampons</label>
            <StampShapePicker value={stampShape} onChange={setStampShape} />
          </div>
        )}

        {/* Card style */}
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
          {loading ? "Création en cours…" : "Créer la carte"}
        </button>
      </form>

      {/* ── LIVE PREVIEW ── */}
      <div className="xl:w-80 xl:sticky xl:top-8 xl:self-start">
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
          stampShape={stampShape}
          cardStyle={cardStyle}
          welcomeMessage={welcomeMessage}
        />
        {bgPreview && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Aperçu fond /join</p>
            <img src={bgPreview} alt="Fond" className="w-full h-24 object-cover rounded-xl opacity-80" />
          </div>
        )}
      </div>
    </div>
  );
}
