/**
 * Razorpay integration scaffold.
 *
 * Drop in RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env to go live — until then,
 * `isLiveConfigured()` is false and the booking flow falls back to a clearly-labeled
 * sandbox flow that simulates a successful payment without calling any external API.
 */

export function isLiveConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(amountInPaise: number, receipt: string) {
  if (!isLiveConfigured()) {
    throw new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
    }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay order creation failed: ${res.status}`);
  }

  return res.json();
}
