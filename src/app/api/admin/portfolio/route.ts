import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(2, "Please enter a title"),
  category: z.string().min(1, "Please pick a category"),
  type: z.enum(["photo", "video"]),
  aspect: z.enum(["portrait", "landscape", "square"]),
  featured: z.boolean().optional(),
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

  const item = await prisma.portfolioItem.create({ data: parsed.data });
  return NextResponse.json({ id: item.id }, { status: 201 });
}
