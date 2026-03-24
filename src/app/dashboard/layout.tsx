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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isBillingPage = pathname === "/dashboard/billing";

  let accent = "#534AB7";
  let dark   = false;

  // ── Is this user a business owner? ────────────────────────────────────────
  const { data: business } = await supabase
    .from("businesses")
    .select("subscription_status, theme_color, theme_dark")
    .eq("id", user.id)
    .single();

  if (business) {
    accent = business.theme_color ?? "#534AB7";
    dark   = business.theme_dark  ?? false;

    if (!isBillingPage && business.subscription_status !== "active") {
      redirect("/subscribe");
    }
  } else {
    // ── Not a business owner — check if accepted employee ─────────────────
    // Auto-link by email in case this is the employee's first login after email confirmation
    await supabase.rpc("auto_accept_invite_by_email");

    const { data: employee } = await supabase
      .from("employees")
      .select("id, business_id")
      .eq("auth_user_id", user.id)
      .eq("invite_accepted", true)
      .single();

    if (!employee) redirect("/login");

    // Employees can only access the scanner
    if (!pathname.startsWith("/dashboard/scan")) {
      redirect("/dashboard/scan");
    }

    // Fetch employer's theme
    const { data: empBusiness } = await supabase
      .from("businesses")
      .select("theme_color, theme_dark")
      .eq("id", employee.business_id)
      .single();

    accent = empBusiness?.theme_color ?? "#534AB7";
    dark   = empBusiness?.theme_dark  ?? false;
  }

  return (
    <>
      <ThemeApplier accent={accent} dark={dark} />
      <div className="pb-16 md:pb-0" style={{ minHeight: "100vh", background: "var(--dash-bg)", color: "var(--dash-text)" }}>
        {children}
      </div>
    </>
  );
}
