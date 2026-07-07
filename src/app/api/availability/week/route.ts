import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServiceBySlug } from "@/lib/data/services";
import type { PackageTier } from "@/lib/data/services";
import { toDateKey } from "@/lib/date";
import { computeAvailableStarts, getBlockMinutes } from "@/lib/scheduling";

const DAYS_AHEAD = 21;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceSlug = searchParams.get("service");
  const tier = (searchParams.get("tier") || "STANDARD") as PackageTier;

  if (!serviceSlug) {
    return NextResponse.json({ error: "Missing service" }, { status: 400 });
  }

  const service = getServiceBySlug(serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  }

  const blockMinutes = getBlockMinutes(service, tier);
  if (!blockMinutes) {
    return NextResponse.json({ days: {}, schedulingMode: service.schedulingMode });
  }

  const rangeStart = new Date();
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + DAYS_AHEAD + 1);

  const existingBookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: rangeStart, lt: rangeEnd },
      status: { notIn: ["CANCELLED", "REJECTED"] },
    },
    select: { startTime: true, endTime: true },
  });

  const bookings = existingBookings.filter((b) => b.startTime && b.endTime) as {
    startTime: Date;
    endTime: Date;
  }[];

  const now = new Date();
  const days: Record<string, { remaining: number; totalPossible: number }> = {};

  for (let d = 0; d <= DAYS_AHEAD; d++) {
    const dayStart = new Date(rangeStart);
    dayStart.setDate(dayStart.getDate() + d);

    const starts = computeAvailableStarts({ dayStart, blockMinutes, existingBookings: bookings, now });
    const totalPossible = computeAvailableStarts({
      dayStart,
      blockMinutes,
      existingBookings: [],
      now: new Date(0), // ignore lead-time so totalPossible reflects the full day's capacity
    }).length;

    days[toDateKey(dayStart)] = { remaining: starts.length, totalPossible };
  }

  return NextResponse.json({ days, schedulingMode: service.schedulingMode });
}
