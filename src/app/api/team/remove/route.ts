import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { employee_id } = await req.json() as { employee_id: string };
  if (!employee_id) return NextResponse.json({ error: "employee_id requis" }, { status: 400 });

  // RLS ensures business_id = auth.uid(), so only the owner can delete their employees
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", employee_id)
    .eq("business_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
