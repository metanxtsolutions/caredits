import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ wishlisted: false });

  const { searchParams } = new URL(req.url);
  const serviceSlug = searchParams.get("serviceSlug");
  if (!serviceSlug) return NextResponse.json({ wishlisted: false });

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) return NextResponse.json({ wishlisted: false });

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_serviceId: { userId: session.id, serviceId: service.id } },
  });

  return NextResponse.json({ wishlisted: Boolean(existing) });
}
