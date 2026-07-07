import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
});

export async function PATCH(req: Request) {
  let session;
  try {
    session = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
    },
  });

  const token = await createSessionToken({
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
