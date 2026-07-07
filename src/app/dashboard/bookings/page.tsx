import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<string, "solid" | "outline" | "light"> = {
  PENDING: "outline",
  CONFIRMED: "solid",
  ASSIGNED: "solid",
  COMPLETED: "light",
  CANCELLED: "outline",
  REJECTED: "outline",
};

export default async function DashboardBookingsPage() {
  const session = await requireUser();

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">MY BOOKINGS</h1>

      {bookings.length === 0 && (
        <div className="mt-8 bg-grey-light p-8 text-center">
          <p className="text-grey">You haven&apos;t booked a shoot yet.</p>
          <Link href="/book" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
            Book your first shoot
          </Link>
        </div>
      )}

      <div className="mt-8 divide-y divide-border border-y border-border">
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/dashboard/bookings/${booking.id}`}
            className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-label text-xs font-semibold uppercase tracked text-grey">{booking.bookingRef}</p>
              <p className="mt-0.5 font-display text-xl text-ink">{booking.service.name}</p>
              <p className="mt-0.5 text-sm text-grey">
                {booking.startTime ? formatDate(booking.startTime) : "Schedule to be confirmed"} · {booking.city}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="font-display text-lg text-ink">{formatINR(booking.totalAmount)}</span>
              <Badge variant={statusVariant[booking.status] || "outline"}>{booking.status}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
