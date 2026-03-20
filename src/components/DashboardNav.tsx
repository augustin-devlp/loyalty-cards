"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const links = [
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
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <header
      className="border-b"
      style={{ background: "var(--dash-nav-bg)", borderColor: "var(--dash-border)" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="text-base font-bold hover:opacity-80 transition-opacity shrink-0"
            style={{ color: "var(--dash-text)" }}
          >
            Loyalty Cards
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
