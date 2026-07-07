import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const createSchema = z.object({
  code: z.string().min(3, "Please enter a code").transform((v) => v.toUpperCase()),
  percentOff: z.number().int().min(1).max(100).nullable().optional(),
  amountOff: z.number().int().min(1).nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  expiresAt: z.string().nullable().optional(),
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

  const existing = await prisma.coupon.findUnique({ where: { code: parsed.data.code } });
  if (existing) {
    return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 400 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: parsed.data.code,
      percentOff: parsed.data.percentOff || null,
      amountOff: parsed.data.amountOff || null,
      maxUses: parsed.data.maxUses || null,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return NextResponse.json({ id: coupon.id }, { status: 201 });
}
