/**
 * Send a transactional SMS via Brevo REST API.
 * @param to  Recipient phone — will be normalized to Brevo format (no +, e.g. "33612345678")
 * @param content  SMS text (max 160 chars for a single SMS)
 * @param sender  Alphanumeric 11-char max sender ID. Defaults to "Stampify".
 */
export async function sendSms(
  to: string,
  content: string,
  sender: string = "Stampify",
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  console.log("[brevo] BREVO_API_KEY present:", !!apiKey);

  if (!apiKey) throw new Error("BREVO_API_KEY is not set");

  const recipient = normalizePhone(to);
  console.log(
    "[brevo] sending SMS to recipient:",
    recipient,
    "| sender:",
    sender,
    "| content length:",
    content.length,
  );

  const payload = {
    sender,
    recipient,
    content,
    type: "transactional",
  };

  const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const responseText = await res.text();
  console.log("[brevo] SMS API response status:", res.status, "| body:", responseText);

  if (!res.ok) {
    // Phase 10 C2A : enrichir l'erreur avec le status + parsed body
    // pour que le catch appelant puisse inspecter response.data.code,
    // response.status, etc. (detection credits exhausted notamment).
    const err = new Error(
      `Brevo SMS error (${res.status}): ${responseText}`,
    ) as Error & {
      response?: { status: number; data?: Record<string, unknown> };
      responseBody?: string;
    };
    err.responseBody = responseText;
    try {
      const parsed = JSON.parse(responseText) as Record<string, unknown>;
      err.response = { status: res.status, data: parsed };
    } catch {
      err.response = { status: res.status, data: { raw: responseText } };
    }
    throw err;
  }
}

/**
 * Send a transactional email via Brevo REST API.
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not set");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      sender: { name: "Stampify", email: "noreply@stampify.ch" },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo email error (${res.status}): ${err}`);
  }
}

/**
 * Normalise un numéro au format Brevo (E.164 sans "+"). Délègue à la
 * lib libphonenumber-js pour gérer CH + FR + international correctement.
 */
import { toBrevoPhone } from "./phone";

export function normalizePhone(phone: string): string {
  const n = toBrevoPhone(phone);
  console.log("[brevo] normalizePhone:", phone, "→", n);
  return n;
}
