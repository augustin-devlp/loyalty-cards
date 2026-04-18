"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RIALTO_ID } from "@/lib/constants";

// ── Icons ─────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="3" height="3" /><rect x="14" y="7" width="3" height="3" />
      <rect x="7" y="14" width="3" height="3" /><rect x="14" y="14" width="3" height="3" />
    </svg>
  );
}
function StatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function WheelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    </svg>
  );
}
function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}
function SmsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function PromoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BillingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function AppearanceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 0 20" /><line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function MarketplaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M7 13L5.4 5" />
    </svg>
  );
}
function ClickCollectIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M21 10V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10" />
      <path d="M1 6h22v4H1z" />
      <line x1="12" y1="6" x2="12" y2="22" />
    </svg>
  );
}
function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────

type NavLink = { href: string; label: string; icon: React.ReactNode; exact?: boolean };

const OWNER_LINKS: NavLink[] = [
  { href: "/dashboard",               label: "Tableau de bord",  icon: <HomeIcon />,       exact: true },
  { href: "/dashboard/commandes",     label: "Commandes",        icon: <OrdersIcon /> },
  { href: "/dashboard/cards",         label: "Mes cartes",       icon: <CardIcon /> },
  { href: "/dashboard/scan",          label: "Scanner",          icon: <ScanIcon /> },
  { href: "/dashboard/stats",         label: "Statistiques",     icon: <StatsIcon /> },
  { href: "/dashboard/reservations",  label: "Réservations",     icon: <CalendarIcon /> },
  { href: "/dashboard/spin-wheel",    label: "Roue",             icon: <WheelIcon /> },
  { href: "/dashboard/lottery",       label: "Loterie",          icon: <GiftIcon /> },
  { href: "/dashboard/sms",           label: "SMS",              icon: <SmsIcon /> },
  { href: "/dashboard/menu",          label: "Menu",             icon: <MenuIcon /> },
  { href: "/dashboard/promotions",    label: "Promotions",       icon: <PromoIcon /> },
  { href: "/dashboard/gift-cards",    label: "Cartes cadeaux",   icon: <GiftIcon /> },
  { href: "/dashboard/marketplace",   label: "Marketplace",      icon: <MarketplaceIcon /> },
  { href: "/dashboard/click-collect", label: "Click & Collect",  icon: <ClickCollectIcon /> },
  { href: "/dashboard/team",          label: "Équipe",           icon: <TeamIcon /> },
  { href: "/dashboard/billing",       label: "Facturation",      icon: <BillingIcon /> },
  { href: "/dashboard/appearance",    label: "Apparence",        icon: <AppearanceIcon /> },
  { href: "/dashboard/establishments",label: "Établissements",   icon: <BuildingIcon /> },
  { href: "/dashboard/settings",      label: "Paramètres",       icon: <SettingsIcon /> },
];

const EMPLOYEE_LINKS: NavLink[] = [
  { href: "/dashboard/scan", label: "Scanner", icon: <ScanIcon /> },
];

// divider before these indices (recalculés suite à l'ajout de "Commandes" en position 1)
const DIVIDERS_AT = new Set([5, 14]);

function isActive(link: NavLink, pathname: string) {
  if (link.exact) return pathname === link.href;
  return pathname.startsWith(link.href);
}

const GREEN = "#1d9e75";
const GREEN_BG = "#e8f5ef";
const BORDER = "#f0ede8";

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isEmployee, setIsEmployee] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [newOrders, setNewOrders] = useState(0);

  // Load collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  // Sync collapsed state to body class + localStorage
  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

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

  // Live badge pour nouvelles commandes Rialto
  useEffect(() => {
    const supabase = createClient();
    const fetchNew = async () => {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("restaurant_id", RIALTO_ID)
        .eq("status", "new");
      setNewOrders(count ?? 0);
    };
    fetchNew();
    const channel = supabase
      .channel("nav-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${RIALTO_ID}`,
        },
        fetchNew,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const links = isEmployee ? EMPLOYEE_LINKS : OWNER_LINKS;
  const isHome = pathname === "/dashboard";
  const isCards = pathname.startsWith("/dashboard/cards");
  const isScan = pathname.startsWith("/dashboard/scan");
  const isStats = pathname.startsWith("/dashboard/stats");
  const tabActive = "flex flex-col items-center justify-center gap-0.5 flex-1 py-2";
  const tabInactive = "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-gray-400";

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="fixed left-0 top-0 h-full hidden md:flex flex-col z-30 overflow-hidden"
        style={{
          width: collapsed ? 64 : 256,
          background: "#ffffff",
          borderRight: `1px solid ${BORDER}`,
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center px-4 py-5 shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}`, height: 64, gap: collapsed ? 0 : 12 }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: GREEN }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M8 10C8 8.34 9.34 7 11 7H17C18.66 7 20 8.34 20 10V16C20 17.66 18.66 19 17 19H15.5L14 21.5L12.5 19H11C9.34 19 8 17.66 8 16V10Z" fill="white"/>
              <circle cx="14" cy="12" r="2.5" fill={GREEN}/>
              <path d="M10.5 17C10.5 15.07 12.07 13.5 14 13.5C15.93 13.5 17.5 15.07 17.5 17" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span
            className="font-bold text-base text-gray-900 whitespace-nowrap overflow-hidden"
            style={{
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : 160,
              transition: "opacity 0.2s, max-width 0.25s",
            }}
          >
            Stampify
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {links.map((link, idx) => {
            const active = isActive(link, pathname);
            const badgeCount =
              link.href === "/dashboard/reservations"
                ? pendingReservations
                : link.href === "/dashboard/commandes"
                  ? newOrders
                  : 0;
            const showBadge = badgeCount > 0;
            const isOrdersBadge = link.href === "/dashboard/commandes";
            const showDivider = DIVIDERS_AT.has(idx) && !isEmployee;
            return (
              <div key={link.href}>
                {showDivider && <div className="my-2 mx-1" style={{ borderTop: `1px solid ${BORDER}` }} />}
                <Link
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className="flex items-center rounded-xl text-sm font-medium transition-colors relative"
                  style={{
                    gap: collapsed ? 0 : 12,
                    padding: collapsed ? "10px 0" : "10px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: active ? GREEN_BG : "transparent",
                    color: active ? GREEN : "#6b7280",
                  }}
                >
                  {link.icon}
                  {!collapsed && (
                    <span className="flex-1 whitespace-nowrap">{link.label}</span>
                  )}
                  {!collapsed && showBadge && (
                    <span
                      className={`flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold ${
                        isOrdersBadge ? "animate-pulse" : ""
                      }`}
                      style={{ background: "#EF4444", color: "white" }}
                    >
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                  {collapsed && showBadge && (
                    <span
                      className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                        isOrdersBadge ? "animate-pulse" : ""
                      }`}
                      style={{ background: "#EF4444" }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer: logout + collapse toggle */}
        <div className="px-2 pb-4 pt-2 shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={handleLogout}
            title={collapsed ? "Se déconnecter" : undefined}
            className="flex items-center rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 w-full transition-colors mt-2"
            style={{
              gap: collapsed ? 0 : 12,
              padding: collapsed ? "10px 0" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <LogoutIcon />
            {!collapsed && <span className="whitespace-nowrap">Se déconnecter</span>}
          </button>

          {/* Collapse toggle button */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center justify-center w-full mt-2 rounded-xl transition-colors"
            style={{
              height: 32,
              color: "#9ca3af",
              background: "transparent",
            }}
            aria-label={collapsed ? "Déplier le menu" : "Réduire le menu"}
            title={collapsed ? "Déplier" : "Réduire"}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16">
          <Link href="/dashboard" className={isHome && !isCards ? tabActive : tabInactive} style={isHome && !isCards ? { color: GREEN } : undefined}>
            <HomeIcon /><span className="text-[10px] font-semibold">Accueil</span>
          </Link>
          <Link href="/dashboard/cards" className={isCards ? tabActive : tabInactive} style={isCards ? { color: GREEN } : undefined}>
            <CardIcon /><span className="text-[10px] font-semibold">Cartes</span>
          </Link>
          <Link href="/dashboard/scan" className={isScan ? tabActive : tabInactive} style={isScan ? { color: GREEN } : undefined}>
            <ScanIcon /><span className="text-[10px] font-semibold">Scanner</span>
          </Link>
          <Link href="/dashboard/stats" className={isStats ? tabActive : tabInactive} style={isStats ? { color: GREEN } : undefined}>
            <StatsIcon /><span className="text-[10px] font-semibold">Stats</span>
          </Link>
          <button
            onClick={() => setDrawerOpen(true)}
            className={`${drawerOpen ? tabActive : tabInactive} relative`}
            style={drawerOpen ? { color: GREEN } : undefined}
          >
            <MenuIcon />
            <span className="text-[10px] font-semibold">Menu</span>
            {newOrders > 0 && (
              <span
                className="absolute top-1 right-5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white animate-pulse"
                style={{ background: "#EF4444" }}
              >
                {newOrders > 9 ? "9+" : newOrders}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setDrawerOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl" style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 pb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Navigation</p>
              {links.map((link) => {
                const active = isActive(link, pathname);
                const badgeCount =
                  link.href === "/dashboard/reservations"
                    ? pendingReservations
                    : link.href === "/dashboard/commandes"
                      ? newOrders
                      : 0;
                const showBadge = badgeCount > 0;
                return (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-colors"
                    style={active ? { background: GREEN_BG, color: GREEN } : { color: "#374151" }}
                  >
                    {link.icon}
                    {link.label}
                    {showBadge && (
                      <span className="ml-auto flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold" style={{ background: "#EF4444", color: "white" }}>
                        {badgeCount > 9 ? "9+" : badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="my-2 border-t border-gray-100" />
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm text-red-500 w-full hover:bg-red-50 transition-colors">
                <LogoutIcon />Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
