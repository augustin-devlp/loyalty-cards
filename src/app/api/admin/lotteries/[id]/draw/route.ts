import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notifyAllClubMembers } from "@/lib/notifyAll";
import {
  RIALTO_CARD_ID,
  RIALTO_RESTAURANT_ID,
} from "@/lib/rialtoConstants";
import { renderTemplate, TEMPLATE_META } from "@/lib/smsTemplates";
import { sendSms } from "@/lib/brevo";

/**
 * POST /api/admin/lotteries/[id]/draw
 *
 * Tire au sort UN gagnant parmi les lottery_entries de la loterie.
 * Actions :
 *   1. Select random entry
 *   2. Update : is_winner=true + claim_token unique (RIALTO-WIN-XXXXXX)
 *   3. Update lottery : is_active=false + draw_date=now
 *   4. SMS au gagnant (template lottery_result_winner)
 *   5. SMS batch aux perdants (template lottery_result_loser)
 *
 * Auth : session Supabase.
 */

function generateClaimToken(template: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = (n: number) => {
    let r = "";
    for (let i = 0; i < n; i++) {
      r += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return r;
  };
  return template.replace(/\{RANDOM(\d+)\}/g, (_, n) => random(Number(n)));
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const lotteryId = params.id;

  // 1) Charge la loterie + vérifie qu'elle est active
  const { data: lottery } = await admin
    .from("lotteries")
    .select("id, business_id, title, prize_description, is_active, claim_token_template")
    .eq("id", lotteryId)
    .maybeSingle();

  if (!lottery) {
    return NextResponse.json(
      { error: "Loterie introuvable" },
      { status: 404 },
    );
  }
  if (!lottery.is_active) {
    return NextResponse.json(
      { error: "Cette loterie a déjà été tirée ou désactivée" },
      { status: 409 },
    );
  }

  // 2) Liste des entries
  const { data: entries } = await admin
    .from("lottery_entries")
    .select("id, ticket_number, customer_id, phone, first_name")
    .eq("lottery_id", lotteryId);

  if (!entries || entries.length === 0) {
    return NextResponse.json(
      { error: "Aucune participation pour cette loterie" },
      { status: 400 },
    );
  }

  // 3) Tire au sort 1 gagnant
  const winnerIdx = Math.floor(Math.random() * entries.length);
  const winner = entries[winnerIdx];

  const claimToken = generateClaimToken(
    (lottery.claim_token_template as string) ?? "RIALTO-WIN-{RANDOM6}",
  );

  // 4) Marque le gagnant
  await admin
    .from("lottery_entries")
    .update({
      is_winner: true,
      claim_token: claimToken,
    })
    .eq("id", winner.id);

  // 5) Désactive la loterie (draw done)
  await admin
    .from("lotteries")
    .update({
      is_active: false,
      draw_date: new Date().toISOString(),
    })
    .eq("id", lotteryId);

  // 6) SMS au gagnant
  const lotteryUrl =
    (process.env.NEXT_PUBLIC_RIALTO_URL ??
      "https://rialto-lausanne.vercel.app") + "/rialto-club/loterie";

  if (winner.phone) {
    void (async () => {
      try {
        const { data: tmpl } = await admin
          .from("sms_templates")
          .select("content, enabled")
          .eq("restaurant_id", RIALTO_RESTAURANT_ID)
          .eq("template_key", "lottery_result_winner")
          .maybeSingle();
        const effective =
          tmpl && tmpl.enabled !== false
            ? tmpl
            : {
                content: TEMPLATE_META.lottery_result_winner.defaultContent,
                enabled: true,
              };
        const content = renderTemplate(effective.content, {
          customer_name: (winner.first_name as string) ?? "",
          prize_description: (lottery.prize_description as string) ?? "",
          ticket_number: String(winner.ticket_number ?? 0).padStart(4, "0"),
          lottery_url: lotteryUrl,
        });
        try {
          await sendSms(winner.phone as string, content, "Rialto");
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.toLowerCase().includes("sender") || msg.includes("400")) {
            await sendSms(winner.phone as string, content, "Stampify");
          } else throw err;
        }
        console.log(
          `[draw] winner SMS sent to ${winner.phone} ticket=${winner.ticket_number}`,
        );
      } catch (err) {
        console.error("[draw] winner SMS failed", err);
      }
    })();
  }

  // 7) SMS batch aux perdants (exclu le gagnant)
  const excludeIds: string[] = [];
  if (winner.customer_id) excludeIds.push(winner.customer_id as string);

  void notifyAllClubMembers({
    business_id: lottery.business_id as string,
    restaurant_id: RIALTO_RESTAURANT_ID,
    card_id: RIALTO_CARD_ID,
    template_key: "lottery_result_loser",
    exclude_customer_ids: excludeIds,
    context_builder: (c) => ({
      customer_name: c.first_name ?? "",
      winner_ticket: String(winner.ticket_number ?? 0).padStart(4, "0"),
    }),
  }).then(
    (result) => {
      console.log(
        `[draw] loser SMS batch sent=${result.sent}/${result.total_targeted}`,
      );
    },
    (err) => {
      console.error("[draw] loser SMS batch failed", err);
    },
  );

  return NextResponse.json({
    ok: true,
    winner: {
      entry_id: winner.id,
      ticket_number: winner.ticket_number,
      first_name: winner.first_name,
      claim_token: claimToken,
    },
    total_entries: entries.length,
  });
}
