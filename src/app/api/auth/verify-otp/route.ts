import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpSchema } from "@/lib/validations/auth";
import { DEMO_OTP } from "@/lib/otp";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = verifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { phone, code, name } = parsed.data;

  if (code !== DEMO_OTP) {
    return NextResponse.json({ error: "Incorrect code. Try the demo OTP shown above." }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    if (!name) {
      return NextResponse.json({ error: "Please enter your name to create an account." }, { status: 400 });
    }
    user = await prisma.user.create({
      data: { phone, name, phoneVerified: true, role: "CUSTOMER" },
    });
  } else if (!user.phoneVerified) {
    user = await prisma.user.update({ where: { id: user.id }, data: { phoneVerified: true } });
  }

  const token = await createSessionToken({
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
  });

  const res = NextResponse.json({ id: user.id, name: user.name, role: user.role });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
