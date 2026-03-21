import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createAnonClient } from "@/lib/supabase/anon";

const ISSUER_ID = "3388000000023101309";

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

function getServiceAccount(): ServiceAccountKey | null {
  const creds = process.env.GOOGLE_WALLET_CREDENTIALS;
  if (!creds) return null;
  try {
    return JSON.parse(creds) as ServiceAccountKey;
  } catch {
    return null;
  }
}

/** Normalise une couleur hex en "#RRGGBB" valide. Retourne le fallback si invalide. */
function normalizeHex(color: string | null | undefined, fallback = "#534AB7"): string {
  if (!color) return fallback;
  const hex = color.replace("#", "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(hex)) return `#${hex}`;
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const [r, g, b] = hex.split("");
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerCardId = searchParams.get("customer_card_id");
  if (!customerCardId) {
    return NextResponse.json({ error: "customer_card_id required" }, { status: 400 });
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    return NextResponse.json({ error: "Google Wallet not configured" }, { status: 503 });
  }

  const supabase = createAnonClient();
  const { data: cc } = await supabase
    .from("customer_cards")
    .select(`
      id,
      current_stamps,
      current_points,
      rewards_claimed,
      qr_code_value,
      customers ( first_name, last_name ),
      loyalty_cards (
        id,
        card_name,
        card_type,
        stamps_required,
        reward_threshold,
        reward_description,
        primary_color,
        logo_url,
        businesses ( business_name )
      )
    `)
    .eq("id", customerCardId)
    .single();

  if (!cc) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const customer = cc.customers as unknown as { first_name: string; last_name: string };
  const lc = cc.loyalty_cards as unknown as {
    id: string;
    card_name: string;
    card_type: "stamp" | "points";
    stamps_required: number | null;
    reward_threshold: number | null;
    reward_description: string;
    primary_color: string | null;
    logo_url: string | null;
    businesses: { business_name: string } | null;
  };

  const businessName = lc.businesses?.business_name ?? "Stampify";
  const bgColor = normalizeHex(lc.primary_color);

  const isStamp = lc.card_type === "stamp";
  const stampsRequired = lc.stamps_required ?? 10;
  const rewardThreshold = lc.reward_threshold ?? 100;
  const currentBalance = isStamp ? (cc.current_stamps ?? 0) : (cc.current_points ?? 0);
  const maxBalance = isStamp ? stampsRequired : rewardThreshold;
  const unit = isStamp ? "tampon" : "point";
  const unitPlural = isStamp ? "tampons" : "points";

  // IDs: strip dashes for Google Wallet compatibility
  const classId = `${ISSUER_ID}.loyalty_${lc.id.replace(/-/g, "")}`;
  const objectId = `${ISSUER_ID}.customer_${cc.id.replace(/-/g, "")}`;

  // ── LoyaltyClass — programme de fidélité (template partagé) ─────────────────
  const loyaltyClass = {
    id: classId,

    // Titre principal = nom du commerce
    issuerName: businessName,
    // Sous-titre / nom du programme = nom de la carte
    programName: lc.card_name,

    // Logo : logo du commerce si disponible, sinon icône Stampify
    programLogo: {
      sourceUri: {
        uri: lc.logo_url ?? "https://www.stampify.ch/icon-512.svg",
      },
      contentDescription: {
        defaultValue: { language: "fr", value: businessName },
      },
    },

    // Fond aux couleurs du commerce
    hexBackgroundColor: bgColor,

    // Niveau de récompense affiché sous le programme
    rewardsTierLabel: "Récompense",
    rewardsTier: lc.reward_description,

    // Statut requis pour l'API
    reviewStatus: "UNDER_REVIEW",

    // Blocs texte additionnels visibles sur la carte
    textModulesData: [
      {
        id: "business",
        header: "Commerce",
        body: businessName,
      },
      {
        id: "reward",
        header: "Récompense disponible à",
        body: `${maxBalance} ${unitPlural}`,
      },
    ],
  };

  // ── LoyaltyObject — carte individuelle du client ─────────────────────────────
  const remaining = Math.max(maxBalance - currentBalance, 0);
  const progressLabel = `${currentBalance} / ${maxBalance} ${unitPlural}`;
  const remainingLabel =
    remaining > 0
      ? `Encore ${remaining} ${remaining === 1 ? unit : unitPlural} avant la récompense`
      : `Récompense disponible ! Présentez votre carte.`;

  const loyaltyObject = {
    id: objectId,
    classId,
    state: "ACTIVE",

    // Identité du porteur
    accountName: `${customer.first_name} ${customer.last_name}`,
    accountId: cc.id.slice(0, 8).toUpperCase(),

    // Jauge principale : tampons / points actuels
    loyaltyPoints: {
      balance: { int: currentBalance },
      label: isStamp ? "Tampons" : "Points",
    },

    // Fond aux couleurs du commerce (override sur l'objet pour garantir la couleur)
    hexBackgroundColor: bgColor,

    // Blocs texte : progression détaillée + récompense
    textModulesData: [
      {
        id: "progress",
        header: "Progression",
        body: progressLabel,
      },
      {
        id: "status",
        header: "Statut",
        body: remainingLabel,
      },
      {
        id: "reward",
        header: "🎁 Récompense",
        body: lc.reward_description,
      },
      {
        id: "card_program",
        header: "Programme",
        body: `${lc.card_name} — ${businessName}`,
      },
    ],

    // QR code à présenter au commerçant
    barcode: {
      type: "QR_CODE",
      value: cc.qr_code_value,
      alternateText: "Présenter au commerçant",
    },
  };

  // ── JWT signé RS256 ──────────────────────────────────────────────────────────
  const payload = {
    iss: serviceAccount.client_email,
    aud: "google",
    typ: "savetowallet",
    iat: Math.round(Date.now() / 1000),
    payload: {
      loyaltyClasses: [loyaltyClass],
      loyaltyObjects: [loyaltyObject],
    },
  };

  const token = jwt.sign(payload, serviceAccount.private_key, { algorithm: "RS256" });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return NextResponse.json({ url: saveUrl });
}
