"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "./LogoutButton";

const OWNER_LINKS = [
  {
    href: "/dashboard/scan",
    label: "Scanner",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <rect x="7" y="7" width="3" height="3" /><rect x="14" y="7" width="3" height="3" />
        <rect x="7" y="14" width="3" height="3" /><rect x="14" y="14" width="3" height="3" />
      </svg>
    ),
  },
  {
    href: "/dashboard/stats",
    label: "Statistiques",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    href: "/dashboard/team",
    label: "Équipe",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/dashboard/billing",
    label: "Facturation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/appearance",
    label: "Apparence",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20" />
        <path d="M12 2c2.76 0 5 4.48 5 10s-2.24 10-5 10" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    href: "/dashboard/promotions",
    label: "Promos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    href: "/dashboard/establishments",
    label: "Établissements",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Paramètres",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const EMPLOYEE_LINKS = [
  {
    href: "/dashboard/scan",
    label: "Scanner",
    icon: OWNER_LINKS[0].icon,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [isEmployee, setIsEmployee] = useState(false);

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

  const links = isEmployee ? EMPLOYEE_LINKS : OWNER_LINKS;

  return (
    <header
      className="border-b"
      style={{ background: "var(--dash-nav-bg)", borderColor: "var(--dash-border)" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect width="28" height="28" rx="7" fill="#534AB7"/>
              {/* bulle de conversation */}
              <path d="M6 7C6 5.9 6.9 5 8 5H20C21.1 5 22 5.9 22 7V17C22 18.1 21.1 19 20 19H16L12 23V19H8C6.9 19 6 18.1 6 17V7Z" fill="white" fillOpacity="0.15"/>
              <path d="M6 7C6 5.9 6.9 5 8 5H20C21.1 5 22 5.9 22 7V17C22 18.1 21.1 19 20 19H16L12 23V19H8C6.9 19 6 18.1 6 17V7Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              {/* silhouette personne */}
              <circle cx="14" cy="10.5" r="2" fill="white"/>
              <path d="M10 17C10 14.8 11.8 13 14 13C16.2 13 18 14.8 18 17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-base font-black" style={{ color: "#534AB7" }}>Stampify</span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
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
                </Link>
              );
            })}
          </nav>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
