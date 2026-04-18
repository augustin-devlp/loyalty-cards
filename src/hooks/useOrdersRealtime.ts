"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderRow, OrderItemRow, OrderWithItems } from "@/lib/orderTypes";

type Handlers = {
  onInsert?: (order: OrderRow) => void;
  onUpdate?: (order: OrderRow, oldStatus: string | null) => void;
};

/**
 * Hook principal du Kanban : fetch initial + subscription Supabase Realtime
 * sur orders + order_items pour un restaurant donné.
 *
 * `onInsert` est appelé à chaque nouvelle commande → utile pour jouer un son,
 * afficher un toast, etc.
 */
export function useOrdersRealtime(
  restaurantId: string | null,
  handlers?: Handlers,
) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const refresh = useCallback(async () => {
    if (!restaurantId) return;
    const sb = createClient();
    const { data: rows } = await sb
      .from("orders")
      .select(
        "id, restaurant_id, order_number, customer_name, customer_phone, requested_pickup_time, status, total_amount, notes, created_at, updated_at",
      )
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(300);

    const list = (rows ?? []) as OrderRow[];
    const ids = list.map((o) => o.id);
    const { data: items } = ids.length
      ? await sb
          .from("order_items")
          .select(
            "id, order_id, menu_item_id, item_name_snapshot, item_price_snapshot, quantity, selected_options, subtotal, notes",
          )
          .in("order_id", ids)
      : { data: [] as OrderItemRow[] };

    const byOrder: Record<string, OrderItemRow[]> = {};
    for (const it of items ?? []) {
      (byOrder[it.order_id] ??= []).push(it as OrderItemRow);
    }

    setOrders(list.map((o) => ({ ...o, items: byOrder[o.id] ?? [] })));
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) return;
    void refresh();

    const sb = createClient();
    const channel = sb
      .channel(`orders-rt-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const next = payload.new as OrderRow;
          handlersRef.current?.onInsert?.(next);
          void refresh();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const next = payload.new as OrderRow;
          const prev = payload.old as Partial<OrderRow>;
          handlersRef.current?.onUpdate?.(next, prev.status ?? null);
          void refresh();
        },
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      sb.removeChannel(channel);
    };
  }, [restaurantId, refresh]);

  return { orders, loading, connected, refresh };
}
