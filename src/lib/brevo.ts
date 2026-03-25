/**
 * Send a transactional SMS via Brevo REST API.
 * @param to  Recipient phone — will be normalized to Brevo format (no +, e.g. "33612345678")
 * @param content  SMS text (max 160 chars for a single SMS)
 */
export async function sendSms(to: string, content: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  console.log("[brevo] BREVO_API_KEY present:", !!apiKey);

  if (!apiKey) throw new Error("BREVO_API_KEY is not set");

  const recipient = normalizePhone(to);
  console.log("[brevo] sending SMS to recipient:", recipient, "| content length:", content.length);

  const payload = {
    sender: "Stampify",
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
    throw new Error(`Brevo SMS error (${res.status}): ${responseText}`);
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
 * Normalize a phone number to Brevo format: digits only, no +, no leading 0.
 * Examples:
 *   "+33 6 12 34 56 78" → "33612345678"
 *   "0612345678"        → "33612345678"  (French mobile, 0 replaced by 33)
 *   "+41 76 123 45 67"  → "41761234567"
 */
export function normalizePhone(phone: string): string {
  // Strip all spaces, dashes, dots, parentheses
  let n = phone.replace(/[\s\-().]/g, "");

  // Remove leading + (Brevo wants no + prefix)
  if (n.startsWith("+")) {
    n = n.slice(1);
  }
  // French/Swiss local format: starts with 06, 07, 04... → prepend country code 33
  else if (n.startsWith("0")) {
    n = "33" + n.slice(1);
  }

  console.log("[brevo] normalizePhone:", phone, "→", n);
  return n;
}
