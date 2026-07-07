/**
 * Google OAuth (Authorization Code flow), called via raw fetch — no SDK, matching
 * the same dependency-light pattern as src/lib/payments/razorpay.ts. Inert until
 * GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET are set in .env.
 */

export const OAUTH_STATE_COOKIE = "ce_oauth_state";

export function isGoogleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function getRedirectUri(origin: string) {
  const base = process.env.NEXTAUTH_URL || origin;
  return `${base}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(origin: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: getRedirectUri(origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string, origin: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(origin),
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`);
  const { access_token } = await res.json();

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileRes.ok) throw new Error(`Google profile fetch failed: ${profileRes.status}`);
  return profileRes.json() as Promise<{ email: string; name: string; email_verified: boolean }>;
}
