import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import ThemeApplier from "@/components/ThemeApplier";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isBillingPage = pathname === "/dashboard/billing";

  const { data: business } = await supabase
    .from("businesses")
    .select("subscription_status, theme_color, theme_dark")
    .eq("id", user.id)
    .single();

  if (!isBillingPage) {
    if (!business || business.subscription_status !== "active") {
      redirect("/subscribe");
    }
  }

  const accent = business?.theme_color ?? "#534AB7";
  const dark   = business?.theme_dark  ?? false;

  return (
    <>
      <ThemeApplier accent={accent} dark={dark} />
      <div style={{ minHeight: "100vh", background: "var(--dash-bg)", color: "var(--dash-text)" }}>
        {children}
      </div>
    </>
  );
}
