import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { BookingActions } from "@/components/dashboard/BookingActions";

const CANCEL_CUTOFF_MS = 24 * 60 * 60 * 1000;

export default async function DashboardBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser();

  const booking = await prisma.booking.findUnique({ where: { id }, include: { service: true } });
  if (!booking || booking.customerId !== session.id) notFound();

  const isFinal = ["CANCELLED", "REJECTED", "COMPLETED"].includes(booking.status);
  const withinCutoff = Boolean(booking.startTime && booking.startTime.getTime() - Date.now() < CANCEL_CUTOFF_MS);
  const canModify = !isFinal && !withinCutoff;

  return (
    <div>
      <Link href="/dashboard/bookings" className="text-sm text-grey hover:text-ink">
        ← Back to bookings
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl text-ink">{booking.service.name}</h1>
        <Badge variant={booking.status === "CANCELLED" || booking.status === "REJECTED" ? "outline" : "solid"}>
          {booking.status}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-grey">{booking.bookingRef}</p>

      <div className="mt-8 divide-y divide-border border-y border-border">
        <Row label="Date & Time" value={booking.startTime ? `${formatDate(booking.startTime)} · ${booking.startTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "To be scheduled"} />
        <Row label="Package" value={booking.packageTier} />
        <Row label="Location" value={`${booking.city}, ${booking.state}`} />
        <Row label="Vehicle" value={`${booking.vehicleBrand} ${booking.vehicleModel}`} />
        <Row label="Subtotal" value={formatINR(booking.subtotal)} />
        <Row label="GST" value={formatINR(booking.gstAmount)} />
        <Row label="Total" value={formatINR(booking.totalAmount)} />
        <Row label="Advance Paid" value={formatINR(booking.advanceAmount)} />
      </div>

      {booking.notes && (
        <p className="mt-4 text-sm text-grey">
          <span className="font-semibold text-ink">Notes: </span>
          {booking.notes}
        </p>
      )}

      <Link href={`/dashboard/bookings/${booking.id}/invoice`} className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">
        View Invoice
      </Link>

      <BookingActions
        bookingId={booking.id}
        serviceSlug={booking.service.slug}
        tier={booking.packageTier}
        canModify={canModify}
        isSlotBased={Boolean(booking.startTime)}
      />

      {isFinal || !withinCutoff ? null : (
        <p className="mt-4 text-xs text-grey">
          Reschedules and cancellations must be made at least 24 hours before your shoot.
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="font-label text-xs font-semibold uppercase tracked text-grey">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}
