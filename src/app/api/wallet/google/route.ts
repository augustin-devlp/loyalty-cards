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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerCardId = searchParams.get("customer_card_id");
  if (!customerCardId) return NextResponse.json({ error: "customer_card_id required" }, { status: 400 });

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
    primary_color: string;
    logo_url: string | null;
    businesses: { business_name: string } | null;
  };

  const classId = `${ISSUER_ID}.loyalty_${lc.id.replace(/-/g, "")}`;
  const objectId = `${ISSUER_ID}.customer_${cc.id.replace(/-/g, "")}`;
  const businessName = lc.businesses?.business_name ?? "Stampify";

  // Hex color without '#' for Google Wallet (must be 6-digit hex)
  const hexColor = (lc.primary_color ?? "#534AB7").replace("#", "");
  const rgbHex = hexColor.length === 6 ? hexColor : "534AB7";
  const r = parseInt(rgbHex.slice(0, 2), 16);
  const g = parseInt(rgbHex.slice(2, 4), 16);
  const b = parseInt(rgbHex.slice(4, 6), 16);

  const loyaltyClass = {
    id: classId,
    issuerName: businessName,
    programName: lc.card_name,
    programLogo: lc.logo_url
      ? {
          sourceUri: { uri: lc.logo_url },
          contentDescription: { defaultValue: { language: "fr", value: lc.card_name } },
        }
      : {
          sourceUri: { uri: "https://www.stampify.ch/icon-512.svg" },
          contentDescription: { defaultValue: { language: "fr", value: "Stampify" } },
        },
    rewardsTierLabel: "Récompense",
    rewardsTier: lc.reward_description,
    reviewStatus: "UNDER_REVIEW",
    hexBackgroundColor: `#${rgbHex}`,
    heroImage: {
      sourceUri: { uri: "https://www.stampify.ch/icon-512.svg" },
      contentDescription: { defaultValue: { language: "fr", value: "Stampify" } },
    },
    textModulesData: [
      {
        id: "reward_info",
        header: "Récompense",
        body: lc.reward_description,
      },
    ],
  };

  const isStamp = lc.card_type === "stamp";
  const stampsRequired = lc.stamps_required ?? 10;
  const rewardThreshold = lc.reward_threshold ?? 100;
  const currentBalance = isStamp ? cc.current_stamps : cc.current_points;
  const maxBalance = isStamp ? stampsRequired : rewardThreshold;

  const loyaltyObject = {
    id: objectId,
    classId,
    state: "ACTIVE",
    accountId: cc.id,
    accountName: `${customer.first_name} ${customer.last_name}`,
    loyaltyPoints: {
      balance: { int: currentBalance },
      label: isStamp ? "Tampons" : "Points",
    },
    secondaryLoyaltyPoints: {
      balance: { int: maxBalance },
      label: isStamp ? "Tampons requis" : "Seuil",
    },
    textModulesData: [
      {
        id: "reward_desc",
        header: "Votre récompense",
        body: lc.reward_description,
      },
    ],
    barcode: {
      type: "QR_CODE",
      value: cc.qr_code_value,
      alternateText: cc.qr_code_value.slice(0, 8).toUpperCase(),
    },
    hexBackgroundColor: `#${rgbHex}`,
    heroImage: {
      sourceUri: { uri: "https://www.stampify.ch/icon-512.svg" },
      contentDescription: { defaultValue: { language: "fr", value: "Stampify" } },
    },
    // Suppress unused fields
    infoModuleData: {
      labelValueRows: [
        {
          columns: [
            { label: "Commerce", value: businessName },
            { label: "Programme", value: lc.card_name },
          ],
        },
      ],
    },
    // Color from RGB
    cardColorHex: `#${rgbHex}`,
    // Custom color object for newer API
    hexBorderColor: `rgb(${r},${g},${b})`,
  };

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
