import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getServiceBySlug } from "@/lib/data/services";
import { getBlockMinutes, isStartTimeAvailable } from "@/lib/scheduling";
import { fromDateKey } from "@/lib/date";
import { notifyBookingRescheduled } from "@/lib/notifications";

const RESCHEDULE_CUTOFF_MS = 24 * 60 * 60 * 1000;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let session;
  try {
    session = await requireUser();
  } catch {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({ where: { id }, include: { service: true } });
  if (!booking || booking.customerId !== session.id) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (["CANCELLED", "REJECTED", "COMPLETED"].includes(booking.status)) {
    return NextResponse.json({ error: "This booking can no longer be rescheduled" }, { status: 400 });
  }
  if (booking.startTime && booking.startTime.getTime() - Date.now() < RESCHEDULE_CUTOFF_MS) {
    return NextResponse.json(
      { error: "Reschedules must be made at least 24 hours before your shoot" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const { dateISO, startMinutes } = body as { dateISO?: string; startMinutes?: number };
  if (!dateISO || startMinutes == null) {
    return NextResponse.json({ error: "A date and start time are required" }, { status: 400 });
  }

  const service = getServiceBySlug(booking.service.slug);
  if (!service || service.schedulingMode !== "slot") {
    return NextResponse.json({ error: "This service cannot be rescheduled online" }, { status: 400 });
  }

  const blockMinutes = getBlockMinutes(service, booking.packageTier);
  const dayStart = fromDateKey(dateISO);
  const newStartTime = new Date(dayStart);
  newStartTime.setMinutes(startMinutes);
  const newEndTime = new Date(newStartTime);
  newEndTime.setMinutes(newStartTime.getMinutes() + blockMinutes);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const [existingBookings, blockedSlots] = await Promise.all([
    prisma.booking.findMany({
      where: {
        id: { not: booking.id },
        startTime: { gte: dayStart, lt: dayEnd },
        status: { notIn: ["CANCELLED", "REJECTED"] },
      },
      select: { startTime: true, endTime: true },
    }),
    prisma.blockedSlot.findMany({
      where: { date: { gte: dayStart, lt: dayEnd } },
      select: { startMinutes: true, endMinutes: true },
    }),
  ]);

  const available = isStartTimeAvailable({
    dayStart,
    startMinutes,
    blockMinutes,
    existingBookings: existingBookings.filter((b) => b.startTime && b.endTime) as {
      startTime: Date;
      endTime: Date;
    }[],
    now: new Date(),
    blockedRanges: blockedSlots,
  });

  if (!available) {
    return NextResponse.json({ error: "That time is no longer available. Please pick another." }, { status: 409 });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { startTime: newStartTime, endTime: newEndTime },
  });

  notifyBookingRescheduled({
    fullName: booking.fullName,
    phone: booking.phone,
    email: booking.email,
    bookingRef: booking.bookingRef,
    serviceName: booking.service.name,
    startTime: newStartTime,
  }).catch((err) => console.error("Reschedule notification failed:", err));

  return NextResponse.json({ ok: true });
}
