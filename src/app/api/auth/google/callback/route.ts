import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeGoogleCode, OAUTH_STATE_COOKIE } from "@/lib/google-auth";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${OAUTH_STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(`${url.origin}/login?google=error`);
  }

  try {
    const profile = await exchangeGoogleCode(code, url.origin);
    if (!profile.email) throw new Error("Google profile missing email");

    let user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: profile.email, name: profile.name || profile.email, role: "CUSTOMER" },
      });
    }

    const token = await createSessionToken({
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.redirect(`${url.origin}/dashboard`);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return NextResponse.redirect(`${url.origin}/login?google=error`);
  }
}
