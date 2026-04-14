"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardNav from "@/components/DashboardNav";

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "done";

interface Reservation {
  id: string;
  commerce_id: string;
  service_name: string;
  service_price: number;
  client_firstname: string;
  client_lastname: string;
  client_phone: string;
  client_email: string;
  reservation_date: string;
  reservation_time: string;
  note: string | null;
  status: ReservationStatus;
  created_at: string;
}

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  done: "Terminée",
};

const STATUS_COLORS: Record<ReservationStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: "#FFF8E6", text: "#B45309", dot: "#F59E0B" },
  confirmed: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  cancelled: { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444" },
  done: { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatTime(timeStr: string) {
  return timeStr.slice(0, 5);
}

function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().split("T")[0];
}

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ReservationStatus>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(new Date().toISOString().split("T")[0]);

  const supabase = createClient();

  const fetchReservations = useCallback(async () => {
    const next7 = getNext7Days();
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .gte("reservation_date", next7[0])
      .lte("reservation_date", next7[6])
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true });
    if (!error && data) setReservations(data as Reservation[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchReservations();

    // Realtime subscription
    const channel = supabase
      .channel("reservations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => {
        fetchReservations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchReservations, supabase]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    setUpdating(id);
    await supabase.from("reservations").update({ status }).eq("id", id);
    setUpdating(null);
    fetchReservations();
  };

  const next7Days = getNext7Days();

  const filteredByDay = reservations.filter((r) => r.reservation_date === selectedDay);
  const filtered = filter === "all" ? filteredByDay : filteredByDay.filter((r) => r.status === filter);

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const todayCount = reservations.filter((r) => isToday(r.reservation_date) && r.status !== "cancelled").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--dash-bg)" }}>
      <DashboardNav />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 28, fontWeight: 700, color: "var(--dash-text)", margin: 0, letterSpacing: "-0.01em" }}>
              Réservations
            </h1>
            <p style={{ color: "var(--dash-muted)", fontSize: 14, marginTop: 4 }}>
              {pendingCount > 0 ? (
                <span style={{ color: "#B45309", fontWeight: 600 }}>{pendingCount} en attente</span>
              ) : (
                "Aucune réservation en attente"
              )}
              {" · "}
              {todayCount} aujourd&apos;hui
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
          {(["pending", "confirmed", "done", "cancelled"] as ReservationStatus[]).map((s) => {
            const count = reservations.filter((r) => r.status === s).length;
            const colors = STATUS_COLORS[s];
            return (
              <div
                key={s}
                onClick={() => setFilter(filter === s ? "all" : s)}
                style={{
                  background: filter === s ? colors.bg : "var(--dash-card)",
                  border: `1.5px solid ${filter === s ? colors.dot : "var(--dash-border)"}`,
                  borderRadius: 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.dot }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: filter === s ? colors.text : "var(--dash-muted)" }}>
                    {STATUS_LABELS[s]}
                  </span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: filter === s ? colors.text : "var(--dash-text)" }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day selector (7-day strip) */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
          {next7Days.map((day) => {
            const d = new Date(day + "T00:00:00");
            const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
            const count = reservations.filter((r) => r.reservation_date === day && r.status !== "cancelled").length;
            const isSelected = day === selectedDay;
            const today = isToday(day);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  minWidth: 64,
                  padding: "10px 8px",
                  borderRadius: 10,
                  border: `1.5px solid ${isSelected ? "var(--dash-accent)" : "var(--dash-border)"}`,
                  background: isSelected ? "var(--dash-accent-sub)" : "var(--dash-card)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 600, color: isSelected ? "var(--dash-accent)" : "var(--dash-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {today ? "Auj." : dayNames[d.getDay()]}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: isSelected ? "var(--dash-accent)" : "var(--dash-text)", marginTop: 2 }}>
                  {d.getDate()}
                </div>
                {count > 0 && (
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: isSelected ? "var(--dash-accent)" : "var(--dash-border)", color: isSelected ? "white" : "var(--dash-text)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "4px auto 0" }}>
                    {count}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Day heading */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--dash-text)", margin: 0 }}>
            {isToday(selectedDay) ? "Aujourd'hui" : formatDate(selectedDay)}
          </h2>
          <p style={{ fontSize: 13, color: "var(--dash-muted)", marginTop: 2 }}>
            {filtered.length === 0 ? "Aucune réservation" : `${filtered.length} réservation${filtered.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Reservation list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 64, color: "var(--dash-muted)" }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "var(--dash-card)", border: "1.5px solid var(--dash-border)", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <p style={{ color: "var(--dash-muted)", fontSize: 15 }}>Aucune réservation ce jour-là</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((r) => {
              const colors = STATUS_COLORS[r.status];
              const isUpdating = updating === r.id;
              return (
                <div
                  key={r.id}
                  style={{
                    background: "var(--dash-card)",
                    border: "1.5px solid var(--dash-border)",
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                    opacity: isUpdating ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {/* Time */}
                  <div style={{ minWidth: 48, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--dash-text)", lineHeight: 1 }}>
                      {formatTime(r.reservation_time)}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, height: 40, background: "var(--dash-border)", flexShrink: 0 }} />

                  {/* Client + service info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--dash-text)" }}>
                        {r.client_firstname} {r.client_lastname}
                      </span>
                      <span
                        style={{
                          background: colors.bg,
                          color: colors.text,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {STATUS_LABELS[r.status]}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--dash-muted)" }}>
                      {r.service_name} · <strong style={{ color: "var(--dash-text)" }}>CHF {r.service_price}</strong>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 12, color: "var(--dash-muted)" }}>
                      <a href={`tel:${r.client_phone}`} style={{ color: "var(--dash-accent)", textDecoration: "none" }}>
                        {r.client_phone}
                      </a>
                      <span>·</span>
                      <a href={`mailto:${r.client_email}`} style={{ color: "var(--dash-accent)", textDecoration: "none" }}>
                        {r.client_email}
                      </a>
                    </div>
                    {r.note && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "var(--dash-muted)", background: "var(--dash-bg)", borderRadius: 6, padding: "4px 8px", display: "inline-block" }}>
                        💬 {r.note}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  {r.status === "pending" && (
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => updateStatus(r.id, "confirmed")}
                        disabled={isUpdating}
                        style={{ padding: "8px 14px", background: "#ECFDF5", color: "#065F46", border: "1px solid #10B981", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "cancelled")}
                        disabled={isUpdating}
                        style={{ padding: "8px 14px", background: "#FEF2F2", color: "#991B1B", border: "1px solid #EF4444", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                  {r.status === "confirmed" && (
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => updateStatus(r.id, "done")}
                        disabled={isUpdating}
                        style={{ padding: "8px 14px", background: "#F3F4F6", color: "#374151", border: "1px solid #9CA3AF", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Terminé ✓
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "cancelled")}
                        disabled={isUpdating}
                        style={{ padding: "8px 14px", background: "#FEF2F2", color: "#991B1B", border: "1px solid #EF4444", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                  {(r.status === "cancelled" || r.status === "done") && (
                    <button
                      onClick={() => updateStatus(r.id, "pending")}
                      disabled={isUpdating}
                      style={{ padding: "8px 14px", background: "var(--dash-bg)", color: "var(--dash-muted)", border: "1px solid var(--dash-border)", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
                    >
                      Remettre
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
