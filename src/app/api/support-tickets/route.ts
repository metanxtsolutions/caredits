import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const supportTicketSchema = z.object({
  subject: z.string().min(3, "Please enter a subject"),
  message: z.string().min(10, "Please share a few details"),
});

export async function POST(req: Request) {
  let session;
  try {
    session = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const parsed = supportTicketSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const ticket = await prisma.supportTicket.create({
    data: { userId: session.id, subject: parsed.data.subject, message: parsed.data.message },
  });

  return NextResponse.json({ id: ticket.id }, { status: 201 });
}
