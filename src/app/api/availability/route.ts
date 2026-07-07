import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServiceBySlug } from "@/lib/data/services";
import type { PackageTier } from "@/lib/data/services";
import { fromDateKey } from "@/lib/date";
import { computeAvailableStarts, getBlockMinutes } from "@/lib/scheduling";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceSlug = searchParams.get("service");
  const tier = (searchParams.get("tier") || "STANDARD") as PackageTier;
  const dateParam = searchParams.get("date");

  if (!serviceSlug || !dateParam) {
    return NextResponse.json({ error: "Missing service or date" }, { status: 400 });
  }

  const service = getServiceBySlug(serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  }

  const blockMinutes = getBlockMinutes(service, tier);
  if (!blockMinutes) {
    return NextResponse.json({ starts: [], schedulingMode: service.schedulingMode });
  }

  const dayStart = fromDateKey(dateParam);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const existingBookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: dayStart, lt: dayEnd },
      status: { notIn: ["CANCELLED", "REJECTED"] },
    },
    select: { startTime: true, endTime: true },
  });

  const starts = computeAvailableStarts({
    dayStart,
    blockMinutes,
    existingBookings: existingBookings.filter((b) => b.startTime && b.endTime) as {
      startTime: Date;
      endTime: Date;
    }[],
    now: new Date(),
  });

  return NextResponse.json({ starts, schedulingMode: service.schedulingMode });
}
