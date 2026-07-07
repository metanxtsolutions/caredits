import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { notifyBookingCancelled } from "@/lib/notifications";

const CANCEL_CUTOFF_MS = 24 * 60 * 60 * 1000;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    return NextResponse.json({ error: "This booking can no longer be cancelled" }, { status: 400 });
  }
  if (booking.startTime && booking.startTime.getTime() - Date.now() < CANCEL_CUTOFF_MS) {
    return NextResponse.json(
      { error: "Cancellations must be made at least 24 hours before your shoot" },
      { status: 400 },
    );
  }

  await prisma.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } });

  notifyBookingCancelled({
    fullName: booking.fullName,
    phone: booking.phone,
    email: booking.email,
    bookingRef: booking.bookingRef,
    serviceName: booking.service.name,
    startTime: booking.startTime,
  }).catch((err) => console.error("Cancellation notification failed:", err));

  return NextResponse.json({ ok: true });
}
