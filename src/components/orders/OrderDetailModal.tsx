"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCHF, formatZurichDateTime, formatZurichHHMM } from "@/lib/orderFormat";
import type { OrderStatusHistoryRow, OrderWithItems } from "@/lib/orderTypes";
import type { OrderStatus } from "@/lib/constants";

type Props = {
  order: OrderWithItems;
  onClose: () => void;
  onStatusChange: (next: OrderStatus) => Promise<void>;
  onCancel: () => Promise<void>;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nouvelle",
  accepted: "Acceptée",
  preparing: "En préparation",
  ready: "Prête",
  completed: "Récupérée",
  cancelled: "Annulée",
};

export default function OrderDetailModal({ order, onClose, onStatusChange, onCancel }: Props) {
  const [history, setHistory] = useState<OrderStatusHistoryRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data } = await sb
        .from("order_status_history")
        .select("id, order_id, old_status, new_status, changed_at, changed_by")
        .eq("order_id", order.id)
        .order("changed_at", { ascending: true });
      setHistory((data ?? []) as OrderStatusHistoryRow[]);
    })();
  }, [order.id]);

  const handle = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <header className="flex items-start justify-between border-b border-gray-100 p-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Commande · {STATUS_LABELS[order.status]}
            </div>
            <h3 className="mt-1 text-2xl font-black tracking-tight">
              {order.order_number}
            </h3>
            <div className="mt-1 text-xs text-gray-500">
              Passée le {formatZurichDateTime(order.created_at)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 rounded-full p-2 text-gray-400 transition hover:bg-gray-50"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Infos client */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Client
            </h4>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="font-semibold">{order.customer_name}</div>
              <a
                href={`tel:${order.customer_phone}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                📞 {order.customer_phone}
              </a>
              <div className="mt-2 text-sm text-gray-700">
                Heure de retrait demandée :{" "}
                <strong>{formatZurichHHMM(order.requested_pickup_time)}</strong>
              </div>
              {order.notes && (
                <div className="mt-2 rounded-md bg-yellow-50 p-2 text-sm text-yellow-900">
                  <strong>Notes :</strong> {order.notes}
                </div>
              )}
            </div>
          </section>

          {/* Items */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Articles ({order.items.length})
            </h4>
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
              {order.items.map((it) => (
                <li key={it.id} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {it.quantity}× {it.item_name_snapshot}
                      </div>
                      {Array.isArray(it.selected_options) &&
                        it.selected_options.length > 0 && (
                          <div className="mt-0.5 text-xs text-gray-500">
                            {it.selected_options.map((o) => o.name).join(", ")}
                          </div>
                        )}
                      {it.notes && (
                        <div className="mt-0.5 text-xs italic text-gray-500">
                          « {it.notes} »
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCHF(it.subtotal)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-900 p-3 text-white">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-black">
                {formatCHF(order.total_amount)}
              </span>
            </div>
          </section>

          {/* Historique */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Historique
            </h4>
            <ol className="space-y-1 text-xs text-gray-600">
              {history.map((h) => (
                <li key={h.id} className="flex justify-between">
                  <span>
                    {h.old_status
                      ? `${STATUS_LABELS[h.old_status]} → ${STATUS_LABELS[h.new_status]}`
                      : `Créée (${STATUS_LABELS[h.new_status]})`}
                  </span>
                  <span>{formatZurichDateTime(h.changed_at)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-gray-100 p-4">
          {order.status === "new" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => handle(() => onStatusChange("accepted"))}
                className="flex-1 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                ✓ Accepter
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handle(onCancel)}
                className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                ✗ Refuser
              </button>
            </>
          )}
          {order.status === "accepted" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => handle(() => onStatusChange("preparing"))}
              className="flex-1 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              → En préparation
            </button>
          )}
          {order.status === "preparing" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => handle(() => onStatusChange("ready"))}
              className="flex-1 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              → Prête
            </button>
          )}
          {order.status === "ready" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => handle(() => onStatusChange("completed"))}
              className="flex-1 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
            >
              ✓ Récupérée
            </button>
          )}
          {!["completed", "cancelled", "new"].includes(order.status) && (
            <button
              type="button"
              disabled={busy}
              onClick={() => handle(onCancel)}
              className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Annuler
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
