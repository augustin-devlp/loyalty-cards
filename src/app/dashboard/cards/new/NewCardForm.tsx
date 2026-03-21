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

interface VariantDef { label: string; primary: string; text: string; }
interface NicheTemplate {
  label: string;
  emoji: string;
  shape: string;
  style: CardStyle;
  defaultReward: string;
  variants: [VariantDef, VariantDef, VariantDef];
}

const NICHE_TEMPLATES: NicheTemplate[] = [
  {
    label: "Boulangerie", emoji: "🥖", shape: "croissant", style: "rounded",
    defaultReward: "1 viennoiserie offerte",
    variants: [
      { label: "Clair",   primary: "#FFF8E7", text: "#7A5C1E" },
      { label: "Coloré",  primary: "#8B6914", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#3E2A00", text: "#F5DEB3" },
    ],
  },
  {
    label: "Café", emoji: "☕", shape: "coffee", style: "rounded",
    defaultReward: "1 café offert",
    variants: [
      { label: "Clair",   primary: "#FFF3E0", text: "#3D1F0F" },
      { label: "Coloré",  primary: "#5D3A1A", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#1A0A04", text: "#FFCC80" },
    ],
  },
  {
    label: "Salon de coiffure", emoji: "✂️", shape: "scissors", style: "rounded",
    defaultReward: "1 coupe offerte",
    variants: [
      { label: "Clair",   primary: "#FCE4EC", text: "#C2185B" },
      { label: "Coloré",  primary: "#C2185B", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#880E4F", text: "#FCE4EC" },
    ],
  },
  {
    label: "Barbershop", emoji: "💈", shape: "scissors", style: "square",
    defaultReward: "1 coupe + barbe offerte",
    variants: [
      { label: "Clair",   primary: "#E8EAF6", text: "#1A1A2E" },
      { label: "Coloré",  primary: "#1A1A2E", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#0D0D1A", text: "#C5CAE9" },
    ],
  },
  {
    label: "Restaurant", emoji: "🍽️", shape: "crown", style: "modern",
    defaultReward: "1 dessert offert",
    variants: [
      { label: "Clair",   primary: "#FFEBEE", text: "#B71C1C" },
      { label: "Coloré",  primary: "#B71C1C", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#4A0000", text: "#FFCDD2" },
    ],
  },
  {
    label: "Pizzeria", emoji: "🍕", shape: "pizza", style: "rounded",
    defaultReward: "1 pizza offerte",
    variants: [
      { label: "Clair",   primary: "#FBE9E7", text: "#E65100" },
      { label: "Coloré",  primary: "#E65100", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#7F2B00", text: "#FFE0B2" },
    ],
  },
  {
    label: "Institut beauté", emoji: "💆", shape: "nail", style: "rounded",
    defaultReward: "1 soin offert",
    variants: [
      { label: "Clair",   primary: "#FCE4EC", text: "#AD1457" },
      { label: "Coloré",  primary: "#AD1457", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#4A0030", text: "#F8BBD9" },
    ],
  },
  {
    label: "Épicerie fine", emoji: "🌿", shape: "leaf", style: "rounded",
    defaultReward: "1 produit offert",
    variants: [
      { label: "Clair",   primary: "#E8F5E9", text: "#2E7D32" },
      { label: "Coloré",  primary: "#2E7D32", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#0A3D0A", text: "#C8E6C9" },
    ],
  },
  {
    label: "Sport / Fitness", emoji: "🏋️", shape: "lightning", style: "square",
    defaultReward: "1 séance offerte",
    variants: [
      { label: "Clair",   primary: "#E3F2FD", text: "#1565C0" },
      { label: "Coloré",  primary: "#1565C0", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#0A2A6E", text: "#BBDEFB" },
    ],
  },
  {
    label: "Sushi", emoji: "🍱", shape: "star", style: "modern",
    defaultReward: "1 plateau offert",
    variants: [
      { label: "Clair",   primary: "#FFEBEE", text: "#D32F2F" },
      { label: "Coloré",  primary: "#D32F2F", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#4A0000", text: "#FFCDD2" },
    ],
  },
  {
    label: "Pressing", emoji: "👔", shape: "house", style: "square",
    defaultReward: "1 article offert",
    variants: [
      { label: "Clair",   primary: "#E1F5FE", text: "#0277BD" },
      { label: "Coloré",  primary: "#0277BD", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#00344A", text: "#B3E5FC" },
    ],
  },
  {
    label: "Fleuriste", emoji: "🌸", shape: "flower", style: "rounded",
    defaultReward: "1 bouquet offert",
    variants: [
      { label: "Clair",   primary: "#F3E5F5", text: "#7B1FA2" },
      { label: "Coloré",  primary: "#7B1FA2", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#2E0040", text: "#E1BEE7" },
    ],
  },
  {
    label: "Toiletteur", emoji: "🐾", shape: "paw", style: "rounded",
    defaultReward: "1 toilettage offert",
    variants: [
      { label: "Clair",   primary: "#FFF8E1", text: "#E65100" },
      { label: "Coloré",  primary: "#FF8F00", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#7F4300", text: "#FFE0B2" },
    ],
  },
  {
    label: "Yoga", emoji: "🧘", shape: "butterfly", style: "modern",
    defaultReward: "1 cours offert",
    variants: [
      { label: "Clair",   primary: "#F1F8E9", text: "#558B2F" },
      { label: "Coloré",  primary: "#558B2F", text: "#FFFFFF" },
      { label: "Sombre",  primary: "#1B4500", text: "#DCEDC8" },
    ],
  },
];

interface NewCardFormProps { userId: string; }

export default function NewCardForm({ userId }: NewCardFormProps) {
  const router = useRouter();

  // Template selection state
  const [selectedNiche, setSelectedNiche] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [cardName, setCardName]                 = useState("");
  const [cardType, setCardType]                 = useState<"stamp" | "points">("stamp");
  const [stampsRequired, setStampsRequired]     = useState(10);
  const [pointsPerPurchase, setPointsPerPurchase] = useState(1);
  const [rewardThreshold, setRewardThreshold]   = useState(100);
  const [rewardDescription, setRewardDescription] = useState("");
  const [welcomeMessage, setWelcomeMessage]     = useState("");
  const [primaryColor, setPrimaryColor]         = useState("#4F46E5");
  const [textColor, setTextColor]               = useState("#FFFFFF");
  const [stampShape, setStampShape]             = useState("circle");
  const [cardStyle, setCardStyle]               = useState<CardStyle>("rounded");
  const [logoFile, setLogoFile]                 = useState<File | null>(null);
  const [logoPreview, setLogoPreview]           = useState<string | null>(null);
  const [bgFile, setBgFile]                     = useState<File | null>(null);
  const [bgPreview, setBgPreview]               = useState<string | null>(null);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState<string | null>(null);

  const niche = selectedNiche !== null ? NICHE_TEMPLATES[selectedNiche] : null;

  const handleNicheSelect = (idx: number) => {
    setSelectedNiche(idx);
    setSelectedVariant(null);
    setShowForm(false);
  };

  const handleVariantSelect = (nicheIdx: number, variantIdx: number) => {
    const t = NICHE_TEMPLATES[nicheIdx];
    const v = t.variants[variantIdx];
    setSelectedVariant(variantIdx);
    setPrimaryColor(v.primary);
    setTextColor(v.text);
    setStampShape(t.shape);
    setCardStyle(t.style);
    if (!rewardDescription) setRewardDescription(t.defaultReward);
    setCardName(`Carte fidélité ${t.label}`);
    setShowForm(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const logoUrl = logoFile ? await uploadFile(supabase, logoFile, "logo") : null;
    const bgUrl   = bgFile   ? await uploadFile(supabase, bgFile,   "bg")   : null;

    if (bgUrl) {
      await supabase.from("businesses").update({ join_background_url: bgUrl }).eq("id", userId);
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
      {/* ── FORM COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Step 1 — Choisir la niche */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-gray-900">1. Choisissez votre activité</p>
              <p className="text-xs text-gray-500 mt-0.5">Démarrez avec un template adapté à votre commerce</p>
            </div>
            {selectedNiche !== null && (
              <button
                type="button"
                onClick={() => { setSelectedNiche(null); setSelectedVariant(null); setShowForm(false); }}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Changer
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {NICHE_TEMPLATES.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => handleNicheSelect(i)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  selectedNiche === i
                    ? "border-indigo-500 bg-indigo-50 text-indigo-800 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/40"
                }`}
              >
                <span className="text-xl shrink-0">{t.emoji}</span>
                <span className="text-xs font-medium leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Choisir le style (variante) */}
        {selectedNiche !== null && (
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-5">
            <p className="text-sm font-bold text-gray-900 mb-3">2. Choisissez le style</p>
            <div className="flex gap-3">
              {NICHE_TEMPLATES[selectedNiche].variants.map((v, vi) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => handleVariantSelect(selectedNiche, vi)}
                  className={`flex-1 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedVariant === vi
                      ? "border-indigo-500 shadow-lg scale-[1.03]"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {/* Color swatch */}
                  <div
                    className="h-14 flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: v.primary, color: v.text }}
                  >
                    {NICHE_TEMPLATES[selectedNiche].emoji}
                  </div>
                  {/* Label */}
                  <div className={`py-2 text-center text-xs font-semibold border-t ${
                    selectedVariant === vi
                      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                      : "bg-white text-gray-600 border-gray-100"
                  }`}>
                    {v.label}
                    <div className="text-[10px] font-normal opacity-60 mt-0.5">{v.primary}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Logo upload (shown after variant selected) */}
        {showForm && (
          <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white p-5">
            <p className="text-sm font-bold text-gray-900 mb-1">
              3. Importez votre logo{" "}
              <span className="font-normal text-gray-400">(optionnel)</span>
            </p>
            <p className="text-xs text-gray-400 mb-4">Apparaît sur la carte et la page d&apos;inscription.</p>
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="h-16 w-16 rounded-full border-2 border-dashed border-gray-300 group-hover:border-indigo-400 flex items-center justify-center overflow-hidden shrink-0 transition-colors">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">📸</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-600 group-hover:underline">
                  {logoPreview ? "Changer le logo" : "Importer mon logo"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, SVG — max 5 Mo</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
              />
            </label>
          </div>
        )}

        {/* Step 4 — Personnalisation (shown after template selected or manual) */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-5">
              <p className="text-sm font-bold text-gray-900">4. Personnalisez votre carte</p>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la carte</label>
                <input
                  type="text" required value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="ex: Carte fidélité Boulangerie"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Message de bienvenue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message de bienvenue <span className="font-normal text-gray-400">(optionnel)</span>
                </label>
                <input
                  type="text" value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="ex: Bienvenue chez nous !"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de carte</label>
                <div className="flex gap-3">
                  {(["stamp", "points"] as const).map((type) => (
                    <button key={type} type="button" onClick={() => setCardType(type)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                        cardType === type
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400"
                      }`}>
                      {type === "stamp" ? "🔖 Tampons" : "⭐ Points"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stamps config */}
              {cardType === "stamp" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tampons pour la récompense</label>
                  <input type="number" required min={1} max={50} value={stampsRequired}
                    onChange={(e) => setStampsRequired(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}

              {/* Points config */}
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
                <input type="text" required value={rewardDescription}
                  onChange={(e) => setRewardDescription(e.target.value)}
                  placeholder="ex: 1 croissant offert"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur texte</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
                    <span className="text-sm text-gray-500 font-mono">{textColor}</span>
                  </div>
                </div>
              </div>

              {/* Stamp shape */}
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
                        cardStyle === s.value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}>
                      <span className="text-lg">{s.icon}</span>
                      <span>{s.label}</span>
                      <span className="text-[10px] opacity-60">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background photo */}
              <div className="rounded-xl border border-dashed border-gray-300 p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Photo de fond — page d&apos;inscription</p>
                  <p className="text-xs text-gray-400 mt-0.5">Partagée entre toutes vos cartes.</p>
                </div>
                <input type="file" accept="image/*"
                  onChange={(e) => handleFileChange(e, setBgFile, setBgPreview)}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                {bgPreview && (
                  <img src={bgPreview} alt="Fond" className="h-24 w-full object-cover rounded-xl border border-gray-200" />
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
              {loading ? "Création en cours…" : "Créer la carte →"}
            </button>
          </form>
        )}

        {/* Lien création manuelle (si aucun template sélectionné) */}
        {!showForm && selectedNiche === null && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-xs text-gray-400 hover:text-indigo-600 transition-colors underline underline-offset-2"
          >
            Créer manuellement sans template
          </button>
        )}

        {/* Manual mode form (no template) */}
        {showForm && selectedNiche === null && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
            )}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-5">
              <p className="text-sm font-bold text-gray-900">Créer une carte</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la carte</label>
                <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)}
                  placeholder="ex: Carte fidélité Boulangerie"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message de bienvenue <span className="font-normal text-gray-400">(optionnel)</span>
                </label>
                <input type="text" value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="ex: Bienvenue chez nous !"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
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
              {cardType === "stamp" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tampons pour la récompense</label>
                  <input type="number" required min={1} max={50} value={stampsRequired}
                    onChange={(e) => setStampsRequired(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description de la récompense</label>
                <input type="text" required value={rewardDescription} onChange={(e) => setRewardDescription(e.target.value)}
                  placeholder="ex: 1 croissant offert"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo (optionnel)</label>
                <input type="file" accept="image/*"
                  onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                {logoPreview && <img src={logoPreview} alt="Logo" className="mt-2 h-14 w-14 rounded-full object-cover border" />}
              </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur texte</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
                    <span className="text-sm text-gray-500 font-mono">{textColor}</span>
                  </div>
                </div>
              </div>
              {cardType === "stamp" && (
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
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
              {loading ? "Création en cours…" : "Créer la carte →"}
            </button>
          </form>
        )}

      </div>

      {/* ── LIVE PREVIEW ── */}
      <div className="xl:w-80 xl:sticky xl:top-8 xl:self-start space-y-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Aperçu en direct</p>
        <CardPreview
          cardName={cardName || (niche ? `Carte fidélité ${niche.label}` : "Ma carte fidélité")}
          cardType={cardType}
          stampsRequired={stampsRequired}
          pointsPerPurchase={pointsPerPurchase}
          rewardThreshold={rewardThreshold}
          rewardDescription={rewardDescription || (niche ? niche.defaultReward : "Récompense")}
          logoUrl={logoPreview}
          primaryColor={primaryColor}
          textColor={textColor}
          stampShape={stampShape}
          cardStyle={cardStyle}
          welcomeMessage={welcomeMessage}
        />
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
