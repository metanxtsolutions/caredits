import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "ASSIGNED", "COMPLETED", "CANCELLED", "REJECTED"]).optional(),
  photographerId: z.string().nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...(parsed.data.status && { status: parsed.data.status }),
      ...(parsed.data.photographerId !== undefined && { photographerId: parsed.data.photographerId }),
    },
  });

  return NextResponse.json({ ok: true, booking });
}
