import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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

  // Allow /dashboard/billing even without an active subscription
  // so the user can manage/renew their plan
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isBillingPage = pathname === "/dashboard/billing";

  if (!isBillingPage) {
    const { data: business } = await supabase
      .from("businesses")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    if (!business || business.subscription_status !== "active") {
      redirect("/subscribe");
    }
  }

  return <>{children}</>;
}
