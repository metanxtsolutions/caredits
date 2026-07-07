import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { fromDateKey } from "@/lib/date";

const createSchema = z.object({
  dateISO: z.string().min(1),
  wholeDay: z.boolean(),
  startMinutes: z.number().nullable().optional(),
  endMinutes: z.number().nullable().optional(),
  reason: z.string().optional(),
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

  const blocked = await prisma.blockedSlot.create({
    data: {
      date: fromDateKey(parsed.data.dateISO),
      startMinutes: parsed.data.wholeDay ? null : parsed.data.startMinutes,
      endMinutes: parsed.data.wholeDay ? null : parsed.data.endMinutes,
      reason: parsed.data.reason || null,
    },
  });

  return NextResponse.json({ id: blocked.id }, { status: 201 });
}
