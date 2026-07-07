import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { isGoogleConfigured, buildGoogleAuthUrl, OAUTH_STATE_COOKIE } from "@/lib/google-auth";

export async function GET(req: Request) {
  const { origin } = new URL(req.url);

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(`${origin}/login?google=unconfigured`);
  }

  const state = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(buildGoogleAuthUrl(origin, state));
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
