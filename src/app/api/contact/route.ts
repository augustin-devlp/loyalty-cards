import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { firstname, email, description } = await req.json();

    if (!firstname || !email || !description) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Send email via Brevo (Sendinblue) API
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey && brevoKey !== "REPLACE_WITH_YOUR_BREVO_API_KEY") {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Stampify Contact", email: "no-reply@stampify.ch" },
          to: [{ email: "augustindom999@gmail.com", name: "Augustin" }],
          subject: `Devis sur mesure — ${firstname}`,
          htmlContent: `
            <h2>Nouveau devis sur mesure — Stampify</h2>
            <p><strong>Prénom :</strong> ${firstname}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Description du projet :</strong></p>
            <p>${description.replace(/\n/g, "<br>")}</p>
            <hr>
            <p style="color:#666;font-size:12px;">Envoyé depuis stampify.ch/subscribe</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
