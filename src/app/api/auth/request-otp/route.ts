import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestOtpSchema } from "@/lib/validations/auth";
import { DEMO_OTP } from "@/lib/otp";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });

  // Sandbox mode: no real SMS provider configured, so we just log the demo code.
  console.log(`[sandbox] OTP for ${parsed.data.phone}: ${DEMO_OTP}`);

  return NextResponse.json({ isNewUser: !existing });
}
