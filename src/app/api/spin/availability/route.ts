import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_BUSINESS_ID,
  RIALTO_SPIN_WHEEL_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";

/**
 * GET /api/spin/availability?customer_id=X&business_id=Y
 *
 * Calcule l'état d'accès à la roue pour un customer (Phase 7 refonte).
 *
 * 5 états exclusifs :
 *
 *   A  can_spin=true   Peut tourner la roue maintenant
 *   B  review_required Doit laisser un avis Google d'abord
 *   C  frequency_wait  A déjà tourné, doit attendre (mode frequency)
 *   D  wrong_day       Pas le bon jour (mode weekdays)
 *   E  disabled        Roue désactivée / pas de roue programmée
 *
 * Corrige les bugs Phase 6 :
 *   - Plus de "36500 jours" (fallback cassé de once→days)
 *   - Plus de "1 commande requise avec 0" (logique requires_order_since
 *     retirée sur décision Augustin)
 *
 * Retourne :
 *   {
 *     state, can_spin, config_mode, message,
 *     last_prize: { code, description, used, expires_at } | null,
 *     wait_info: { next_available_date, days_remaining } | null,
 *     frequency_days, allowed_weekdays,
 *     require_google_review
 *   }
 */

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

type State = "A" | "B" | "C" | "D" | "E";

const ISO_WEEKDAY_LABELS = [
  "",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

function isoWeekday(d: Date): number {
  // JS getDay(): 0=dim, 1=lun, ... 6=sam
  // On veut ISO : 1=lun, ..., 7=dim
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

function daysBetween(iso: string | Date, nowMs: number): number {
  const t = typeof iso === "string" ? new Date(iso).getTime() : iso.getTime();
  return Math.max(0, Math.floor((nowMs - t) / (24 * 60 * 60 * 1000)));
}

function isSameDay(iso: string | Date, other: Date): boolean {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return (
    d.getFullYear() === other.getFullYear() &&
    d.getMonth() === other.getMonth() &&
    d.getDate() === other.getDate()
  );
}

function formatDateFR(d: Date): string {
  return d.toLocaleDateString("fr-CH", {
    day: "numeric",
    month: "long",
  });
}

/** Cherche le prochain jour ISO parmi `allowed` à partir de `from`. */
function nextAllowedWeekday(
  from: Date,
  allowed: number[],
): { date: Date; days_remaining: number } | null {
  if (!allowed.length) return null;
  for (let offset = 0; offset <= 14; offset++) {
    const candidate = new Date(from);
    candidate.setDate(from.getDate() + offset);
    if (allowed.includes(isoWeekday(candidate))) {
      return { date: candidate, days_remaining: offset };
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const url = new URL(req.url);
  const customerId = url.searchParams.get("customer_id");
  const phoneArg = url.searchParams.get("phone");
  const wheelId = url.searchParams.get("wheel_id") ?? RIALTO_SPIN_WHEEL_ID;
  const businessId =
    url.searchParams.get("business_id") ?? RIALTO_BUSINESS_ID;

  if (!customerId && !phoneArg) {
    return NextResponse.json(
      { error: "customer_id ou phone requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();

  // 1) Config de la roue
  const { data: wheel } = await admin
    .from("spin_wheels")
    .select(
      "id, is_active, config_mode, frequency_days, allowed_weekdays, require_google_review, segments",
    )
    .eq("id", wheelId)
    .maybeSingle();

  // État E : pas de roue ou désactivée
  if (
    !wheel ||
    !wheel.is_active ||
    wheel.config_mode === "disabled" ||
    (wheel.config_mode === "frequency" && wheel.frequency_days === null)
  ) {
    return NextResponse.json(
      {
        state: "E" as State,
        can_spin: false,
        config_mode: (wheel?.config_mode as string) ?? "disabled",
        message:
          "Il n'y a pas de roue prévue pour l'instant. Tu seras prévenu par SMS quand une sera lancée.",
        last_prize: null,
        wait_info: null,
        frequency_days: null,
        allowed_weekdays: [],
        require_google_review: !!wheel?.require_google_review,
      },
      { headers },
    );
  }

  const configMode = (wheel.config_mode as "frequency" | "weekdays") ?? "frequency";
  const frequencyDays: number | null =
    typeof wheel.frequency_days === "number" ? wheel.frequency_days : null;
  const allowedWeekdays: number[] = Array.isArray(wheel.allowed_weekdays)
    ? (wheel.allowed_weekdays as number[])
    : [];

  // 2) Customer + phone
  let phone = phoneArg ?? null;
  let effectiveCustomerId = customerId;
  if (customerId && !phone) {
    const { data: c } = await admin
      .from("customers")
      .select("phone")
      .eq("id", customerId)
      .maybeSingle();
    phone = (c?.phone as string | undefined) ?? null;
  } else if (!customerId && phone) {
    // Lookup customer via phone pour vérifier claim Google
    const { data: c } = await admin
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    effectiveCustomerId = (c?.id as string) ?? null;
  }

  // 3) Dernière spin
  const { data: lastSpinRow } = phone
    ? await admin
        .from("spin_entries")
        .select("id, last_spin_at, reward_won, promo_code_id")
        .eq("wheel_id", wheelId)
        .eq("phone", phone)
        .order("last_spin_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const lastSpinAt = lastSpinRow?.last_spin_at
    ? new Date(lastSpinRow.last_spin_at as string)
    : null;

  // 4) Dernier prix (rappel code promo)
  let lastPrize: {
    code: string;
    description: string;
    used: boolean;
    expires_at: string | null;
  } | null = null;

  if (lastSpinRow?.promo_code_id) {
    const { data: promo } = await admin
      .from("promo_codes")
      .select(
        "code, discount_type, discount_value, free_item_label, uses_count, max_uses, valid_until",
      )
      .eq("id", lastSpinRow.promo_code_id)
      .maybeSingle();
    if (promo) {
      const used =
        Number(promo.uses_count ?? 0) >= Number(promo.max_uses ?? 1);
      lastPrize = {
        code: (promo.code as string) ?? "",
        description:
          promo.discount_type === "percent"
            ? `-${promo.discount_value}% sur ta commande`
            : promo.discount_type === "fixed"
              ? `-${promo.discount_value} CHF`
              : (promo.free_item_label as string) ?? "Article offert",
        used,
        expires_at: (promo.valid_until as string) ?? null,
      };
    }
  } else if (lastSpinRow?.reward_won) {
    lastPrize = {
      code: "",
      description: lastSpinRow.reward_won as string,
      used: false,
      expires_at: null,
    };
  }

  const now = new Date();
  const nowMs = now.getTime();

  // 5) Review gate (ÉTAT B) — s'applique AVANT la logique de fréquence/weekdays
  if (wheel.require_google_review && effectiveCustomerId) {
    const { data: claim } = await admin
      .from("google_review_claims")
      .select("id, expires_at")
      .eq("customer_id", effectiveCustomerId)
      .eq("business_id", businessId)
      .gt("expires_at", now.toISOString())
      .order("claimed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!claim) {
      return NextResponse.json(
        {
          state: "B" as State,
          can_spin: false,
          config_mode: configMode,
          message: "Laisse un avis Google pour débloquer la roue",
          last_prize: lastPrize,
          wait_info: null,
          frequency_days: frequencyDays,
          allowed_weekdays: allowedWeekdays,
          require_google_review: true,
        },
        { headers },
      );
    }
  }

  // 6) Mode FREQUENCY
  if (configMode === "frequency") {
    // Pas de dernière spin → peut tourner
    if (!lastSpinAt) {
      return NextResponse.json(
        {
          state: "A" as State,
          can_spin: true,
          config_mode: "frequency",
          message: "C'est parti, tourne la roue !",
          last_prize: null,
          wait_info: null,
          frequency_days: frequencyDays,
          allowed_weekdays: [],
          require_google_review: !!wheel.require_google_review,
        },
        { headers },
      );
    }

    const days = daysBetween(lastSpinAt, nowMs);
    if (frequencyDays !== null && days < frequencyDays) {
      const daysRemaining = frequencyDays - days;
      const nextDate = new Date(nowMs + daysRemaining * 24 * 60 * 60 * 1000);
      const dateFR = formatDateFR(nextDate);
      return NextResponse.json(
        {
          state: "C" as State,
          can_spin: false,
          config_mode: "frequency",
          message: `Tu as déjà tourné la roue. Prochaine chance le ${dateFR} (dans ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""})`,
          last_prize: lastPrize,
          wait_info: {
            next_available_date: nextDate.toISOString(),
            days_remaining: daysRemaining,
          },
          frequency_days: frequencyDays,
          allowed_weekdays: [],
          require_google_review: !!wheel.require_google_review,
        },
        { headers },
      );
    }

    // État A : peut tourner
    return NextResponse.json(
      {
        state: "A" as State,
        can_spin: true,
        config_mode: "frequency",
        message: "C'est parti, tourne la roue !",
        last_prize: null,
        wait_info: null,
        frequency_days: frequencyDays,
        allowed_weekdays: [],
        require_google_review: !!wheel.require_google_review,
      },
      { headers },
    );
  }

  // 7) Mode WEEKDAYS
  if (configMode === "weekdays") {
    if (!allowedWeekdays.length) {
      // Aucun jour coché = équivalent disabled
      return NextResponse.json(
        {
          state: "E" as State,
          can_spin: false,
          config_mode: "weekdays",
          message:
            "Il n'y a pas de roue prévue pour l'instant. Tu seras prévenu par SMS quand une sera lancée.",
          last_prize: lastPrize,
          wait_info: null,
          frequency_days: null,
          allowed_weekdays: [],
          require_google_review: !!wheel.require_google_review,
        },
        { headers },
      );
    }

    const todayIso = isoWeekday(now);
    const isTodayAllowed = allowedWeekdays.includes(todayIso);
    const alreadySpunToday =
      lastSpinAt !== null && isSameDay(lastSpinAt, now);

    // État D : pas le bon jour OU déjà spin aujourd'hui
    if (!isTodayAllowed || alreadySpunToday) {
      // Cherche le prochain jour autorisé
      const searchFrom = alreadySpunToday
        ? new Date(nowMs + 24 * 60 * 60 * 1000)
        : now;
      const next = nextAllowedWeekday(searchFrom, allowedWeekdays);
      const allowedLabel = allowedWeekdays
        .map((d) => ISO_WEEKDAY_LABELS[d])
        .join(", ");
      const msg = next
        ? `La roue est disponible le ${allowedLabel}. Prochain créneau : ${ISO_WEEKDAY_LABELS[isoWeekday(next.date)]} ${formatDateFR(next.date)}`
        : `La roue est disponible le ${allowedLabel}`;

      return NextResponse.json(
        {
          state: "D" as State,
          can_spin: false,
          config_mode: "weekdays",
          message: msg,
          last_prize: lastPrize,
          wait_info: next
            ? {
                next_available_date: next.date.toISOString(),
                days_remaining: next.days_remaining,
              }
            : null,
          frequency_days: null,
          allowed_weekdays: allowedWeekdays,
          require_google_review: !!wheel.require_google_review,
        },
        { headers },
      );
    }

    // État A : jour valide + pas encore spin aujourd'hui
    return NextResponse.json(
      {
        state: "A" as State,
        can_spin: true,
        config_mode: "weekdays",
        message: "C'est parti, tourne la roue !",
        last_prize: null,
        wait_info: null,
        frequency_days: null,
        allowed_weekdays: allowedWeekdays,
        require_google_review: !!wheel.require_google_review,
      },
      { headers },
    );
  }

  // Fallback safe : on ne devrait jamais arriver ici, config_mode check exhaustif
  return NextResponse.json(
    {
      state: "E" as State,
      can_spin: false,
      config_mode: configMode,
      message:
        "Il n'y a pas de roue prévue pour l'instant. Tu seras prévenu par SMS quand une sera lancée.",
      last_prize: null,
      wait_info: null,
      frequency_days: null,
      allowed_weekdays: [],
      require_google_review: false,
    },
    { headers },
  );
}
