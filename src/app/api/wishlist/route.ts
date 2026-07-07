import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  let session;
  try {
    session = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const { serviceSlug } = await req.json();
  if (!serviceSlug) return NextResponse.json({ error: "Missing serviceSlug" }, { status: 400 });

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) return NextResponse.json({ error: "Unknown service" }, { status: 404 });

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_serviceId: { userId: session.id, serviceId: service.id } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ wishlisted: false });
  }

  await prisma.wishlistItem.create({ data: { userId: session.id, serviceId: service.id } });
  return NextResponse.json({ wishlisted: true });
}
