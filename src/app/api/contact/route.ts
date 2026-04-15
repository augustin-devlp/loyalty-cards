import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, description } = await request.json();
    // Log for now — configure email service (Resend/SendGrid) with env vars
    console.log("Contact form:", { name, email, description });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
