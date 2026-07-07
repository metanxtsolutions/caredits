import { prisma } from "@/lib/prisma";
import { AdminBookingRow } from "@/components/admin/AdminBookingRow";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ highlight?: string }>;
}) {
  const { highlight } = await searchParams;

  const [bookings, photographers] = await Promise.all([
    prisma.booking.findMany({
      include: { service: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.user.findMany({ where: { role: "PHOTOGRAPHER" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">BOOKINGS</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 pr-4 font-label text-xs font-semibold uppercase tracked text-grey">Booking</th>
              <th className="pb-2 pr-4 font-label text-xs font-semibold uppercase tracked text-grey">Customer</th>
              <th className="pb-2 pr-4 font-label text-xs font-semibold uppercase tracked text-grey">City</th>
              <th className="pb-2 pr-4 font-label text-xs font-semibold uppercase tracked text-grey">Date</th>
              <th className="pb-2 pr-4 font-label text-xs font-semibold uppercase tracked text-grey">Amount</th>
              <th className="pb-2 pr-4 font-label text-xs font-semibold uppercase tracked text-grey">Status</th>
              <th className="pb-2 font-label text-xs font-semibold uppercase tracked text-grey">Photographer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((booking) => (
              <AdminBookingRow
                key={booking.id}
                booking={{
                  id: booking.id,
                  bookingRef: booking.bookingRef,
                  fullName: booking.fullName,
                  city: booking.city,
                  startTime: booking.startTime?.toISOString() || null,
                  totalAmount: booking.totalAmount,
                  status: booking.status,
                  photographerId: booking.photographerId,
                  serviceName: booking.service.name,
                }}
                photographers={photographers}
                highlighted={booking.id === highlight}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
