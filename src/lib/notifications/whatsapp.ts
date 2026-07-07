/**
 * WhatsApp sending via Twilio's WhatsApp Business API, called with raw fetch — no SDK.
 * Inert in sandbox mode until TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_WHATSAPP_FROM
 * are set in .env.
 */

export function isWhatsAppConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
}

export async function sendWhatsApp({ to, body }: { to: string; body: string }) {
  if (!isWhatsAppConfigured()) {
    console.log(`[sandbox] would WhatsApp ${to}: "${body}"`);
    return;
  }

  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: `whatsapp:${to}`,
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        Body: body,
      }),
    },
  );
  if (!res.ok) throw new Error(`Twilio WhatsApp send failed: ${res.status}`);
}
