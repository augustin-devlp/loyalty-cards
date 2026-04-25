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
  customer_email?: string | null;
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
  // Phase 1 checkout refonte
  housing_type?: "house" | "apartment" | null;
  entry_code_1?: string | null;
  entry_code_2?: string | null;
  floor?: string | null;
  apartment_number?: string | null;
  doorbell_name?: string | null;
  payment_method?: "card" | "cash" | "twint" | null;
  payment_card_timing?: "on_delivery" | "remote" | null;
  payment_cash_bills?: number | string | null;
};

type RestaurantData = {
  name: string;
  address: string | null;
  phone: string | null;
};

const styles = StyleSheet.create({
  page: {
    // Padding réduit (28 → 22) pour gagner ~12pt sur la hauteur utile A5
    padding: 22,
    paddingBottom: 18,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    borderBottom: 2,
    borderColor: "#E30613",
    paddingBottom: 10,
    marginBottom: 10,
  },
  title: { fontSize: 26, fontWeight: 700, color: "#E30613", letterSpacing: 2 },
  subtitle: { fontSize: 10, color: "#6b7280", marginTop: 2 },
  orderNumber: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 8,
    color: "#111827",
  },
  section: { marginTop: 10 },
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    fontWeight: 700,
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 1,
  },
  typeBadgeText: {
    color: "#1e40af",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    // Empêche tout break de mot dans le badge
    textOverflow: "ellipsis",
  },
  typePickup: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
  typePickupText: {
    color: "#374151",
  },
  infoBlock: {
    padding: 6,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    marginBottom: 4,
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
  totals: { marginTop: 8, borderTop: 1, borderColor: "#e5e7eb", paddingTop: 5 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    padding: 7,
    backgroundColor: "#111827",
    color: "#ffffff",
    borderRadius: 4,
    fontWeight: 700,
    fontSize: 13,
  },
  payment: {
    marginTop: 8,
    padding: 6,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    fontSize: 9,
    textAlign: "center",
    color: "#78350f",
  },
  // footer : placé dans un bloc wrap=false groupé avec payment pour éviter
  // qu'il bascule seul sur une page 2 blanche. marginTop léger + padding
  // minimal pour coller au contenu précédent.
  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    lineHeight: 1.3,
  },
  // Bloc bas de page : contient payment + notes + footer. wrap={false}
  // empêche un saut de page à l'intérieur — si ça ne rentre pas, tout
  // le bloc glisse sur la page suivante (mieux que de laisser "Merci"
  // seul sur une page blanche).
  bottomBlock: {
    marginTop: 6,
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
            {/* Pas d'emoji : react-pdf ne les rend pas correctement et
                peut provoquer des retours à la ligne moches.
                Texte court en CAPS, tient sur une ligne quelle que soit
                la largeur du badge. */}
            <Text
              style={
                isDelivery
                  ? styles.typeBadgeText
                  : { ...styles.typeBadgeText, ...styles.typePickupText }
              }
            >
              {isDelivery ? "LIVRAISON À DOMICILE" : "RETRAIT EN MAGASIN"}
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
            <Text style={styles.sectionTitle}>
              Adresse de livraison
              {order.housing_type === "house" && " — Maison"}
              {order.housing_type === "apartment" && " — Appartement"}
            </Text>
            <View style={styles.infoBlock}>
              <Text>{order.delivery_address}</Text>
              <Text>
                {order.delivery_postal_code} {order.delivery_city}
              </Text>
              {order.housing_type === "apartment" && (
                <>
                  {(order.entry_code_1 || order.entry_code_2) && (
                    <Text style={{ marginTop: 3, fontWeight: 700 }}>
                      Code(s) entrée :{" "}
                      {[order.entry_code_1, order.entry_code_2]
                        .filter(Boolean)
                        .join(" puis ")}
                    </Text>
                  )}
                  {order.floor && (
                    <Text style={{ marginTop: 1 }}>
                      Étage : {order.floor}
                    </Text>
                  )}
                  {order.apartment_number && (
                    <Text style={{ marginTop: 1 }}>
                      N° appartement / Porte : {order.apartment_number}
                    </Text>
                  )}
                  {order.doorbell_name && (
                    <Text style={{ marginTop: 1 }}>
                      Sonnette : {order.doorbell_name}
                    </Text>
                  )}
                </>
              )}
              {order.delivery_floor_door && !order.apartment_number && (
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
            <View key={idx} wrap={false} style={styles.itemRow}>
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

        {/*
          Bloc bas de page : payment + notes client + footer.
          wrap={false} force le groupe à rester ensemble. Si ça ne rentre
          pas avec les items précédents, tout glisse sur la page suivante
          mais le "Merci de votre commande" ne sera plus jamais seul en
          haut d'une page blanche.
        */}
        <View wrap={false} style={styles.bottomBlock}>
          <View style={styles.payment}>
            {order.payment_method === "card" &&
              order.payment_card_timing === "on_delivery" && (
                <Text>
                  Paiement par CARTE — au livreur (terminal sur place)
                </Text>
              )}
            {order.payment_method === "card" &&
              order.payment_card_timing === "remote" && (
                <Text>
                  Paiement par CARTE — À DISTANCE. Mehmet doit envoyer un
                  lien de paiement au {order.customer_phone} dans les 5 min.
                </Text>
              )}
            {order.payment_method === "cash" && (
              <Text>
                Paiement ESPÈCES — Le client donnera{" "}
                {order.payment_cash_bills
                  ? `${Number(order.payment_cash_bills).toFixed(2)} CHF`
                  : "un montant approximatif"}
                . Préparer la monnaie (rendu :{" "}
                {order.payment_cash_bills
                  ? `${(
                      Number(order.payment_cash_bills) -
                      Number(order.total_amount)
                    ).toFixed(2)} CHF`
                  : "à calculer"}
                ).
              </Text>
            )}
            {order.payment_method === "twint" && (
              <Text>
                Paiement TWINT — au livreur (QR code à montrer à l&apos;arrivée)
              </Text>
            )}
            {!order.payment_method && (
              <Text>
                Paiement sur place : espèces, TWINT ou carte bancaire
              </Text>
            )}
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
            {"  "}·{"  "}Merci de votre commande !
          </Text>
        </View>
      </Page>
    </Document>
  );
}
