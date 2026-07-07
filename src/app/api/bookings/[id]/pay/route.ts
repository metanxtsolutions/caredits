import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLiveConfigured } from "@/lib/payments/razorpay";
import { notifyPaymentReceived } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { service: true } });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const isFullPayment = booking.advanceAmount >= booking.totalAmount;
  const amount = booking.advanceAmount;

  // Live Razorpay orders would be created here and the checkout handled client-side.
  // Without live keys configured, we simulate a successful sandbox payment so the
  // booking flow can be demoed end-to-end.
  const live = isLiveConfigured();

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: "RAZORPAY",
      amount,
      status: isFullPayment ? "PAID_FULL" : "PAID_PARTIAL",
      providerRef: live ? null : `SANDBOX-${Date.now()}`,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: isFullPayment ? "PAID_FULL" : "PAID_PARTIAL",
      status: "CONFIRMED",
    },
  });

  notifyPaymentReceived({
    fullName: booking.fullName,
    phone: booking.phone,
    email: booking.email,
    bookingRef: booking.bookingRef,
    serviceName: booking.service.name,
    startTime: booking.startTime,
    amount,
  }).catch((err) => console.error("Payment notification failed:", err));

  return NextResponse.json({ success: true, paymentId: payment.id, live });
}
