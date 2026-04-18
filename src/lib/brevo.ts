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

  if (n.startsWith("+")) {
    // +33612345678 → 33612345678  /  +41761234567 → 41761234567
    n = n.slice(1);
  } else if (n.startsWith("0")) {
    // 0612345678 → 33612345678  (French local format)
    n = "33" + n.slice(1);
  } else if (/^[67]\d{8}$/.test(n)) {
    // 9 digits starting with 6 or 7 = French mobile without leading 0 or country code
    // e.g. "676549599" → "33676549599"
    n = "33" + n;
  }

  console.log("[brevo] normalizePhone:", phone, "→", n);
  return n;
}
