/**
 * Send a transactional SMS via Brevo REST API.
 * @param to  Recipient phone in E.164 format (e.g. "+33612345678")
 * @param content  SMS text (max 160 chars for a single SMS)
 */
export async function sendSms(to: string, content: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not set");

  const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: "Stampify",
      recipient: to,
      content,
      type: "transactional",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo SMS error (${res.status}): ${err}`);
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
 * Normalize a phone number to E.164.
 * Strips spaces and dashes. Does not validate the number itself.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-().]/g, "");
}
