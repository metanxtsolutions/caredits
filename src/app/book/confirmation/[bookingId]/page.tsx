import { notFound } from "next/navigation";
import { CheckCircle2, Calendar, Clock, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getTierInfo } from "@/lib/data/tiers";
import { getAddOnByKey } from "@/lib/data/addons";
import type { PackageTier } from "@/lib/data/services";

const locationLabels: Record<string, string> = {
  DEALERSHIP: "Dealership",
  HOME: "Home Delivery",
  OUTDOOR: "Outdoor Location",
  EVENT_VENUE: "Event Venue",
  CUSTOM: "Custom Location",
};

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });

  if (!booking) notFound();

  const addonKeys: string[] = JSON.parse(booking.addOns || "[]");
  const addonLabels = addonKeys.map((k) => getAddOnByKey(k)?.label).filter(Boolean);

  const locationValue =
    booking.locationType === "DEALERSHIP"
      ? `${locationLabels.DEALERSHIP} · ${booking.city}, ${booking.state}`
      : [
          locationLabels[booking.locationType],
          [
            booking.flatNo,
            booking.areaStreet,
            booking.landmark,
            `${booking.city}${booking.pincode ? ` - ${booking.pincode}` : ""}`,
            booking.state,
          ]
            .filter(Boolean)
            .join(", "),
        ]
          .filter(Boolean)
          .join(" · ");

  return (
    <section className="bg-grey-light py-32 md:py-40">
      <Container className="max-w-2xl">
        <div className="bg-white p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="size-16 text-accent" />
            <h1 className="font-display mt-6 text-5xl text-ink md:text-6xl">BOOKING CONFIRMED</h1>
            <p className="mt-3 text-grey">
              Your booking reference is
              <span className="font-label ml-2 font-bold text-ink">{booking.bookingRef}</span>
            </p>
          </div>

          <div className="mt-10 space-y-4 border-y border-border py-8">
            <Row icon={Calendar} label="Service">
              {booking.service.name} · {getTierInfo(booking.packageTier as PackageTier).label}
            </Row>
            {booking.startTime && booking.endTime ? (
              <Row icon={Clock} label="Date & Time">
                {booking.startTime.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                ·{" "}
                {booking.startTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}{" "}
                to {booking.endTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </Row>
            ) : (
              <Row icon={Clock} label="Scheduling">
                {booking.service.schedulingMode === "contact"
                  ? "Our team will contact you to schedule"
                  : "Schedule will be finalized after discussing your requirements"}
              </Row>
            )}
            {addonLabels.length > 0 && (
              <Row icon={Calendar} label="Add-ons">
                {addonLabels.join(", ")}
              </Row>
            )}
            <Row icon={MapPin} label="Location">
              {locationValue}
            </Row>
            <Row icon={Phone} label="Contact">
              {booking.fullName} · {booking.phone}
              {booking.phoneVerified ? " (verified)" : ""}
            </Row>
          </div>

          <div className="mt-8 bg-grey-light p-6">
            <div className="mb-3 flex items-center justify-between border-b border-border pb-3 text-sm text-grey">
              <span>Subtotal</span>
              <span>₹{booking.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="mb-3 flex items-center justify-between border-b border-border pb-3 text-sm text-grey">
              <span>GST (18%)</span>
              <span>₹{booking.gstAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-label text-sm font-semibold uppercase tracked-tight text-ink">
                Amount Paid
              </span>
              <span className="font-display text-3xl text-ink">
                ₹{booking.advanceAmount.toLocaleString("en-IN")}
                <span className="text-base text-grey"> / ₹{booking.totalAmount.toLocaleString("en-IN")}</span>
              </span>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-grey">
            A confirmation email, SMS and WhatsApp message have been sent to you (in production —
            this demo environment does not send real messages). Our team will reach out before
            your shoot.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/" variant="dark">
              Back to Home
            </Button>
            <Button href="/portfolio" variant="outline">
              View Our Work
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-accent" />
      <div>
        <p className="font-label text-xs font-semibold uppercase tracked text-grey">{label}</p>
        <p className="mt-0.5 text-sm text-ink">{children}</p>
      </div>
    </div>
  );
}
