/**
 * SMS sending via the Twilio REST API, called with raw fetch — no SDK, matching the
 * same dependency-light pattern as src/lib/payments/razorpay.ts. Inert in sandbox mode
 * until TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_SMS_FROM are set in .env.
 */

export function isSmsConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SMS_FROM);
}

export async function sendSms({ to, body }: { to: string; body: string }) {
  if (!isSmsConfigured()) {
    console.log(`[sandbox] would SMS ${to}: "${body}"`);
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
      body: new URLSearchParams({ To: to, From: process.env.TWILIO_SMS_FROM!, Body: body }),
    },
  );
  if (!res.ok) throw new Error(`Twilio SMS send failed: ${res.status}`);
}
