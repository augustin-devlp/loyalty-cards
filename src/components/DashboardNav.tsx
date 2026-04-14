"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"} aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"} aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"} aria-hidden>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="3" height="3" /><rect x="14" y="7" width="3" height="3" />
      <rect x="7" y="14" width="3" height="3" /><rect x="14" y="14" width="3" height="3" />
    </svg>
  );
}

function StatsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"} aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"} aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function AppearanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 0 20" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}

function PromoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function EstablishmentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ── Desktop nav links ─────────────────────────────────────────────────────────

const OWNER_LINKS = [
  { href: "/dashboard/scan", label: "Scanner", icon: <ScanIcon className="w-4 h-4" /> },
  { href: "/dashboard/stats", label: "Statistiques", icon: <StatsIcon className="w-4 h-4" /> },
  { href: "/dashboard/reservations", label: "Réservations", icon: <CalendarIcon /> },
  { href: "/dashboard/spin-wheel", label: "Roue", icon: <PromoIcon /> },
  { href: "/dashboard/lottery", label: "Loterie", icon: <GiftIcon /> },
  { href: "/dashboard/team", label: "Équipe", icon: <TeamIcon /> },
  { href: "/dashboard/billing", label: "Facturation", icon: <BillingIcon /> },
  { href: "/dashboard/appearance", label: "Apparence", icon: <AppearanceIcon /> },
  { href: "/dashboard/promotions", label: "Promos", icon: <PromoIcon /> },
  { href: "/dashboard/establishments", label: "Établissements", icon: <EstablishmentIcon /> },
  { href: "/dashboard/gift-cards", label: "Cartes cadeaux", icon: <GiftIcon /> },
  { href: "/dashboard/settings", label: "Paramètres", icon: <SettingsIcon /> },
];

const EMPLOYEE_LINKS = [
  { href: "/dashboard/scan", label: "Scanner", icon: <ScanIcon className="w-4 h-4" /> },
];

// Drawer uses the same list as desktop — single source of truth.

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isEmployee, setIsEmployee] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingReservations, setPendingReservations] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("employees")
        .select("id")
        .eq("auth_user_id", user.id)
        .eq("invite_accepted", true)
        .maybeSingle();
      setIsEmployee(!!data);
    });
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const fetchPending = async () => {
      const today = new Date().toISOString().split("T")[0];
      const next7 = new Date();
      next7.setDate(next7.getDate() + 7);
      const { count } = await supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .gte("reservation_date", today)
        .lte("reservation_date", next7.toISOString().split("T")[0]);
      setPendingReservations(count ?? 0);
    };
    fetchPending();
    const channel = supabase
      .channel("nav-reservations")
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, fetchPending)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const desktopLinks = isEmployee ? EMPLOYEE_LINKS : OWNER_LINKS;

  // Bottom tab active state helpers
  const isHome = pathname === "/dashboard";
  const isCards = pathname.startsWith("/dashboard/cards");
  const isScan = pathname.startsWith("/dashboard/scan");
  const isStats = pathname.startsWith("/dashboard/stats");

  const tabActive = "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-[#534AB7]";
  const tabInactive = "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-gray-400";

  return (
    <>
      {/* ── Desktop top header (hidden on mobile) ────────────────────────── */}
      <header
        className="border-b hidden md:block"
        style={{ background: "var(--dash-nav-bg)", borderColor: "var(--dash-border)" }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="28" height="28" rx="8" fill="#534AB7"/>
                <path d="M8 10C8 8.34 9.34 7 11 7H17C18.66 7 20 8.34 20 10V16C20 17.66 18.66 19 17 19H15.5L14 21.5L12.5 19H11C9.34 19 8 17.66 8 16V10Z" fill="white"/>
                <circle cx="14" cy="12" r="2.5" fill="#534AB7"/>
                <path d="M10.5 17C10.5 15.07 12.07 13.5 14 13.5C15.93 13.5 17.5 15.07 17.5 17" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-base font-bold" style={{ color: "#534AB7" }}>Stampify</span>
            </Link>
            <nav className="flex items-center gap-1">
              {desktopLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                const showBadge = link.href === "/dashboard/reservations" && pendingReservations > 0;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={
                      active
                        ? { background: "var(--dash-accent-sub)", color: "var(--dash-accent)" }
                        : { color: "var(--dash-muted)" }
                    }
                  >
                    {link.icon}
                    {link.label}
                    {showBadge && (
                      <span className="ml-1 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold" style={{ background: "#EF4444", color: "white" }}>
                        {pendingReservations > 9 ? "9+" : pendingReservations}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium transition"
            style={{ color: "var(--dash-muted)" }}
          >
            Se déconnecter
          </button>
        </div>
      </header>

      {/* ── Mobile bottom navigation bar ────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16">
          {/* Accueil */}
          <Link href="/dashboard" className={isHome && !isCards ? tabActive : tabInactive}>
            <HomeIcon />
            <span className="text-[10px] font-semibold">Accueil</span>
          </Link>

          {/* Cartes */}
          <Link href="/dashboard" className={isCards ? tabActive : tabInactive}>
            <CardIcon />
            <span className="text-[10px] font-semibold">Cartes</span>
          </Link>

          {/* Scanner */}
          <Link href="/dashboard/scan" className={isScan ? tabActive : tabInactive}>
            <ScanIcon />
            <span className="text-[10px] font-semibold">Scanner</span>
          </Link>

          {/* Stats */}
          <Link href="/dashboard/stats" className={isStats ? tabActive : tabInactive}>
            <StatsIcon />
            <span className="text-[10px] font-semibold">Stats</span>
          </Link>

          {/* Menu */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={drawerOpen ? tabActive : tabInactive}
          >
            <MenuIcon />
            <span className="text-[10px] font-semibold">Menu</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl"
            style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="px-4 pb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
                Navigation
              </p>
              {desktopLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                const showBadge = link.href === "/dashboard/reservations" && pendingReservations > 0;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-colors"
                    style={
                      active
                        ? { background: "#eef2ff", color: "#534AB7" }
                        : { color: "#374151" }
                    }
                  >
                    {link.icon}
                    {link.label}
                    {showBadge && (
                      <span className="ml-auto flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold" style={{ background: "#EF4444", color: "white" }}>
                        {pendingReservations > 9 ? "9+" : pendingReservations}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm text-red-600 w-full hover:bg-red-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
