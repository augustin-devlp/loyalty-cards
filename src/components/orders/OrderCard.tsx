"use client";

import { formatCHF, formatZurichHHMM } from "@/lib/orderFormat";
import type { OrderWithItems } from "@/lib/orderTypes";

type SmsState =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "ok"; reference: string | null }
  | { state: "error"; message: string };

type Props = {
  order: OrderWithItems;
  onOpen: () => void;
  sms?: SmsState;
  onResendSms?: () => void;
  children: React.ReactNode;
};

export default function OrderCard({
  order,
  onOpen,
  sms,
  onResendSms,
  children,
}: Props) {
  const createdAt = formatZurichHHMM(order.created_at);
  const pickup = order.requested_pickup_time
    ? formatZurichHHMM(order.requested_pickup_time)
    : "—";
  const itemsText = order.items
    .slice(0, 2)
    .map((it) => `${it.quantity}× ${it.item_name_snapshot}`)
    .join(" · ");
  const extra = order.items.length > 2 ? ` +${order.items.length - 2} plat${order.items.length - 2 > 1 ? "s" : ""}` : "";

  return (
    <article className="group relative mb-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`Détail commande ${order.order_number}`}
      />

      <div className="relative z-10 pointer-events-none">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-bold tracking-tight text-gray-900">
              {order.order_number}
            </div>
            <div className="text-[11px] text-gray-500">Reçue à {createdAt}</div>
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
            🕒 {pickup}
          </span>
        </div>

        <div className="mb-2 text-sm font-medium text-gray-900">
          {order.customer_name}
        </div>
        <a
          href={`tel:${order.customer_phone}`}
          className="pointer-events-auto text-xs text-indigo-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          📞 {order.customer_phone}
        </a>

        <div className="mt-2 text-xs text-gray-600 line-clamp-2">
          {itemsText}
          {extra && <span className="text-gray-400">{extra}</span>}
        </div>

        {order.notes && (
          <div className="mt-2 rounded-md bg-yellow-50 p-2 text-[11px] text-yellow-900">
            📝 {order.notes}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-lg font-black text-red-600">
            {formatCHF(order.total_amount)}
          </span>
          {sms && sms.state !== "idle" && (
            <SmsIndicator sms={sms} onResend={onResendSms} />
          )}
        </div>
      </div>

      <div className="relative z-10 mt-3 flex gap-2 pointer-events-auto">
        {children}
      </div>
    </article>
  );
}

function SmsIndicator({
  sms,
  onResend,
}: {
  sms: SmsState;
  onResend?: () => void;
}) {
  if (sms.state === "sending")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
        📱 …
      </span>
    );
  if (sms.state === "ok")
    return (
      <span
        title={`SMS envoyé${sms.reference ? ` (ref ${sms.reference})` : ""}`}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700"
      >
        📱 ✓
      </span>
    );
  if (sms.state === "error")
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onResend?.();
        }}
        title={`SMS échoué : ${sms.message}. Cliquer pour renvoyer.`}
        className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 hover:bg-red-100"
      >
        📱 ✗ Renvoyer
      </button>
    );
  return null;
}
