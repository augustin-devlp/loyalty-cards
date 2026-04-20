/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

type SelectedOption = { group?: string; name: string };
type Item = {
  quantity: number;
  item_name_snapshot: string;
  item_price_snapshot: number | string;
  selected_options: SelectedOption[];
  subtotal: number | string;
  notes: string | null;
};

type OrderData = {
  order_number: string;
  created_at: string;
  fulfillment_type: "pickup" | "delivery";
  customer_name: string;
  customer_phone: string;
  payer_phone: string | null;
  delivery_address: string | null;
  delivery_postal_code: string | null;
  delivery_city: string | null;
  delivery_floor_door: string | null;
  delivery_instructions: string | null;
  delivery_fee: number | string;
  total_amount: number | string;
  notes: string | null;
  requested_pickup_time: string | null;
};

type RestaurantData = {
  name: string;
  address: string | null;
  phone: string | null;
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    borderBottom: 2,
    borderColor: "#E30613",
    paddingBottom: 12,
    marginBottom: 12,
  },
  title: { fontSize: 28, fontWeight: 700, color: "#E30613", letterSpacing: 2 },
  subtitle: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  orderNumber: {
    fontSize: 22,
    fontWeight: 700,
    marginTop: 10,
    color: "#111827",
  },
  section: { marginTop: 12 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  label: { color: "#6b7280" },
  value: { fontWeight: 700 },
  typeBadge: {
    marginTop: 6,
    padding: 6,
    borderRadius: 4,
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    fontWeight: 700,
    textAlign: "center",
  },
  typePickup: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
  infoBlock: {
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#e5e7eb",
    paddingBottom: 4,
    marginBottom: 4,
    fontSize: 9,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  col1: { width: "10%" },
  col2: { width: "55%" },
  col3: { width: "15%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  itemRow: { flexDirection: "row", paddingVertical: 5, borderBottom: 0.5, borderColor: "#f3f4f6" },
  itemName: { fontWeight: 700 },
  itemOptions: { color: "#6b7280", fontSize: 9, marginTop: 1 },
  totals: { marginTop: 10, borderTop: 1, borderColor: "#e5e7eb", paddingTop: 6 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    padding: 8,
    backgroundColor: "#111827",
    color: "#ffffff",
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 14,
  },
  payment: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    fontSize: 10,
    textAlign: "center",
    color: "#78350f",
  },
  footer: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
  },
});

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-CH", {
      timeZone: "Europe/Zurich",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function fmtCHF(v: number | string): string {
  return `${Number(v).toFixed(2)} CHF`;
}

export function OrderReceipt({
  order,
  items,
  restaurant,
}: {
  order: OrderData;
  items: Item[];
  restaurant: RestaurantData;
}) {
  const subtotal = items.reduce((s, it) => s + Number(it.subtotal), 0);
  const fee = Number(order.delivery_fee ?? 0);
  const total = Number(order.total_amount);
  const isDelivery = order.fulfillment_type === "delivery";

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>RIALTO</Text>
          <Text style={styles.subtitle}>
            {restaurant.address ?? "Av. de Béthusy 29, 1012 Lausanne"} ·{" "}
            {restaurant.phone ?? "+41 21 312 64 60"}
          </Text>
          <Text style={styles.orderNumber}>
            Commande {order.order_number}
          </Text>
          <Text style={{ ...styles.subtitle, marginTop: 2 }}>
            {formatDateTime(order.created_at)}
          </Text>
          <View
            style={
              isDelivery
                ? styles.typeBadge
                : { ...styles.typeBadge, ...styles.typePickup }
            }
          >
            <Text>
              {isDelivery ? "🚴 Livraison à domicile" : "🏪 Retrait en magasin"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <View style={styles.infoBlock}>
            <Text style={styles.value}>{order.customer_name}</Text>
            <Text>{order.customer_phone}</Text>
            {order.payer_phone && order.payer_phone !== order.customer_phone && (
              <Text style={{ color: "#b45309", marginTop: 2 }}>
                Payeur : {order.payer_phone}
              </Text>
            )}
          </View>
        </View>

        {isDelivery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
            <View style={styles.infoBlock}>
              <Text>{order.delivery_address}</Text>
              <Text>
                {order.delivery_postal_code} {order.delivery_city}
              </Text>
              {order.delivery_floor_door && (
                <Text style={{ marginTop: 2 }}>
                  Étage / porte : {order.delivery_floor_door}
                </Text>
              )}
              {order.delivery_instructions && (
                <Text style={{ marginTop: 2, fontStyle: "italic" }}>
                  « {order.delivery_instructions} »
                </Text>
              )}
            </View>
          </View>
        )}

        {!isDelivery && order.requested_pickup_time && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Heure de retrait</Text>
            <View style={styles.infoBlock}>
              <Text style={styles.value}>
                {new Date(order.requested_pickup_time).toLocaleTimeString(
                  "fr-CH",
                  {
                    timeZone: "Europe/Zurich",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Qté</Text>
            <Text style={styles.col2}>Article</Text>
            <Text style={styles.col3}>P.U.</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          {items.map((it, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.col1}>{it.quantity}×</Text>
              <View style={styles.col2}>
                <Text style={styles.itemName}>{it.item_name_snapshot}</Text>
                {Array.isArray(it.selected_options) &&
                  it.selected_options.length > 0 && (
                    <Text style={styles.itemOptions}>
                      {it.selected_options.map((o) => o.name).join(", ")}
                    </Text>
                  )}
                {it.notes && (
                  <Text style={styles.itemOptions}>« {it.notes} »</Text>
                )}
              </View>
              <Text style={styles.col3}>
                {Number(it.item_price_snapshot).toFixed(2)}
              </Text>
              <Text style={styles.col4}>{fmtCHF(it.subtotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Sous-total</Text>
            <Text>{fmtCHF(subtotal)}</Text>
          </View>
          {isDelivery && (
            <View style={styles.totalRow}>
              <Text style={styles.label}>Frais de livraison</Text>
              <Text>{fmtCHF(fee)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text>TOTAL</Text>
            <Text>{fmtCHF(total)}</Text>
          </View>
        </View>

        <View style={styles.payment}>
          <Text>
            Paiement sur place : espèces, TWINT ou carte bancaire
          </Text>
        </View>

        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes du client</Text>
            <View style={styles.infoBlock}>
              <Text>{order.notes}</Text>
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          Rialto · {restaurant.address ?? "Av. de Béthusy 29, 1012 Lausanne"}
          {"\n"}Tél : {restaurant.phone ?? "+41 21 312 64 60"}
          {"\n\n"}Merci de votre commande !
        </Text>
      </Page>
    </Document>
  );
}
