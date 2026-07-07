import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, phone, subject, message } = parsed.data;

  const contactMessage = await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, subject: subject || null, message },
  });

  return NextResponse.json({ id: contactMessage.id }, { status: 201 });
}
