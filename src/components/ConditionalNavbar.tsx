"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/subscribe") || pathname.startsWith("/admin") || pathname.startsWith("/shop");
  if (hidden) return null;
  return <Navbar />;
}
