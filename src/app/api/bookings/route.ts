import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations/booking";
import { generateBookingRef } from "@/lib/booking-ref";
import { getServiceBySlug } from "@/lib/data/services";
import { computeBookingTotal } from "@/lib/pricing";
import { checkCoupon } from "@/lib/coupons";
import { fromDateKey } from "@/lib/date";
import { getBlockMinutes, isStartTimeAvailable } from "@/lib/scheduling";
import { getSession } from "@/lib/auth";
import { notifyBookingConfirmed } from "@/lib/notifications";

export async function POST(request: Request) {
  const session = await getSession();
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const service = getServiceBySlug(data.serviceSlug);

  if (!service) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 });
  }

  const preDiscountPricing = computeBookingTotal({
    service,
    citySlug: data.citySlug,
    tier: data.packageTier,
    addonKeys: data.addonKeys,
  });
  const subtotalBeforeDiscount = preDiscountPricing.tierPrice + preDiscountPricing.addOnsTotal;

  const blockMinutes = getBlockMinutes(service, data.packageTier);
  const needsSlot = service.schedulingMode === "slot";

  if (needsSlot && (!data.dateISO || data.startMinutes == null)) {
    return NextResponse.json({ error: "A date and start time are required" }, { status: 400 });
  }

  let startTime: Date | null = null;
  let endTime: Date | null = null;

  if (needsSlot) {
    const dayStart = fromDateKey(data.dateISO!);
    startTime = new Date(dayStart);
    startTime.setMinutes(data.startMinutes!);
    endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + blockMinutes);
  }

  try {
    const dbService = await prisma.service.findUnique({ where: { slug: data.serviceSlug } });
    if (!dbService) {
      return NextResponse.json({ error: "Service not found" }, { status: 400 });
    }

    const booking = await prisma.$transaction(async (tx) => {
      if (needsSlot && startTime && endTime) {
        const dayStart = new Date(startTime);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const existingBookings = await tx.booking.findMany({
          where: {
            startTime: { gte: dayStart, lt: dayEnd },
            status: { notIn: ["CANCELLED", "REJECTED"] },
          },
          select: { startTime: true, endTime: true },
        });

        const blockedSlots = await tx.blockedSlot.findMany({
          where: { date: { gte: dayStart, lt: dayEnd } },
          select: { startMinutes: true, endMinutes: true },
        });

        const stillAvailable = isStartTimeAvailable({
          dayStart,
          startMinutes: data.startMinutes!,
          blockMinutes,
          existingBookings: existingBookings.filter((b) => b.startTime && b.endTime) as {
            startTime: Date;
            endTime: Date;
          }[],
          now: new Date(),
          blockedRanges: blockedSlots,
        });

        if (!stillAvailable) {
          throw new Error("SLOT_UNAVAILABLE");
        }
      }

      let appliedCoupon: { percentOff: number | null; amountOff: number | null } | null = null;
      let couponCode: string | null = null;

      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
        const result = checkCoupon(coupon, subtotalBeforeDiscount);
        if (!result.valid) {
          throw new Error(`COUPON_INVALID:${result.error}`);
        }
        appliedCoupon = result.coupon;
        couponCode = result.coupon.code;
        await tx.coupon.update({ where: { id: result.coupon.id }, data: { usedCount: { increment: 1 } } });
      }

      const pricing = computeBookingTotal({
        service,
        citySlug: data.citySlug,
        tier: data.packageTier,
        addonKeys: data.addonKeys,
        coupon: appliedCoupon,
      });
      const advanceAmount =
        data.paymentOption === "100" ? pricing.total : Math.round(pricing.total / 2);

      let bookingRef = generateBookingRef();
      for (let attempt = 0; attempt < 5; attempt++) {
        const existing = await tx.booking.findUnique({ where: { bookingRef } });
        if (!existing) break;
        bookingRef = generateBookingRef();
      }

      return tx.booking.create({
        data: {
          bookingRef,
          customerId: session?.id,
          fullName: data.fullName,
          phone: data.phone,
          phoneVerified: Boolean(data.phoneVerified),
          email: data.email,
          city: data.city,
          citySlug: data.citySlug,
          state: data.state,
          vehicleBrand: data.vehicleBrand,
          vehicleModel: data.vehicleModel,
          notes: data.notes || null,
          serviceId: dbService.id,
          packageTier: data.packageTier,
          addOns: JSON.stringify(data.addonKeys),
          startTime,
          endTime,
          locationType: data.locationType,
          flatNo: data.flatNo || null,
          areaStreet: data.areaStreet || null,
          landmark: data.landmark || null,
          pincode: data.pincode || null,
          addressType: data.addressType || null,
          subtotal: pricing.subtotal,
          gstAmount: pricing.gst,
          totalAmount: pricing.total,
          advanceAmount,
          couponCode,
        },
      });
    });

    notifyBookingConfirmed({
      fullName: booking.fullName,
      phone: booking.phone,
      email: booking.email,
      bookingRef: booking.bookingRef,
      serviceName: service.name,
      startTime: booking.startTime,
    }).catch((err) => console.error("Booking confirmation notification failed:", err));

    return NextResponse.json(
      {
        id: booking.id,
        bookingRef: booking.bookingRef,
        totalAmount: booking.totalAmount,
        advanceAmount: booking.advanceAmount,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_UNAVAILABLE") {
      return NextResponse.json(
        { error: "This time slot was just booked. Please pick another start time." },
        { status: 409 },
      );
    }
    if (err instanceof Error && err.message.startsWith("COUPON_INVALID:")) {
      return NextResponse.json(
        { error: `${err.message.slice("COUPON_INVALID:".length)}. Please remove it and try again.` },
        { status: 409 },
      );
    }
    throw err;
  }
}
