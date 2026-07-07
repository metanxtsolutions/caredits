import { prisma } from "@/lib/prisma";
import type { Service } from "@/lib/data/services";
import { computeAvailableStarts, getBlockMinutes } from "@/lib/scheduling";

/** Real remaining start-time capacity for this service across the next 7 days. */
export async function getWeeklyAvailability(service: Service) {
  const blockMinutes = getBlockMinutes(service, "STANDARD");
  if (!blockMinutes) {
    return { remaining: 0, capacity: 0, isLow: false };
  }

  const rangeStart = new Date();
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + 7);

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
  let remaining = 0;
  let capacity = 0;

  for (let d = 0; d < 7; d++) {
    const dayStart = new Date(rangeStart);
    dayStart.setDate(dayStart.getDate() + d);

    remaining += computeAvailableStarts({ dayStart, blockMinutes, existingBookings: bookings, now }).length;
    capacity += computeAvailableStarts({
      dayStart,
      blockMinutes,
      existingBookings: [],
      now: new Date(0),
    }).length;
  }

  return { remaining, capacity, isLow: capacity > 0 && remaining / capacity < 0.35 };
}
