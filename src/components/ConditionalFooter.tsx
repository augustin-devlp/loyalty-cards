"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/subscribe") || pathname.startsWith("/admin") || pathname.startsWith("/shop");
  if (hidden) return null;
  return <Footer />;
}
