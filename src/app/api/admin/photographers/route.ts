import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2, "Please enter a name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
  if (existing) {
    return NextResponse.json({ error: "A user with this phone number already exists" }, { status: 400 });
  }

  const photographer = await prisma.user.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      role: "PHOTOGRAPHER",
    },
  });

  return NextResponse.json({ id: photographer.id }, { status: 201 });
}
