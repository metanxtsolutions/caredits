import Link from "next/link";
import { IndianRupee, CalendarClock, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatINR } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const [revenue, statusCounts, upcoming, photographerCount] = await Promise.all([
    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: { in: ["PAID_FULL", "PAID_PARTIAL"] } },
    }),
    prisma.booking.groupBy({ by: ["status"], _count: true }),
    prisma.booking.findMany({
      where: { status: { notIn: ["CANCELLED", "REJECTED"] }, startTime: { gte: new Date() } },
      include: { service: true },
      orderBy: { startTime: "asc" },
      take: 6,
    }),
    prisma.user.count({ where: { role: "PHOTOGRAPHER" } }),
  ]);

  const countByStatus = Object.fromEntries(statusCounts.map((s) => [s.status, s._count]));
  const totalBookings = statusCounts.reduce((sum, s) => sum + s._count, 0);

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">ADMIN OVERVIEW</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatINR(revenue._sum.totalAmount || 0)} />
        <StatCard icon={CalendarClock} label="Total Bookings" value={String(totalBookings)} />
        <StatCard icon={Users} label="Photographers" value={String(photographerCount)} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(["PENDING", "CONFIRMED", "ASSIGNED", "COMPLETED", "CANCELLED", "REJECTED"] as const).map((status) => (
          <div key={status} className="bg-grey-light p-4 text-center">
            <p className="font-display text-2xl text-ink">{countByStatus[status] || 0}</p>
            <p className="font-label text-[10px] font-semibold uppercase tracked-tight text-grey">{status}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-label text-xs font-semibold uppercase tracked text-accent">Upcoming Shoots</h2>
        {upcoming.length === 0 && <p className="mt-4 text-sm text-grey">No upcoming shoots scheduled.</p>}
        <div className="mt-4 divide-y divide-border border-y border-border">
          {upcoming.map((booking) => (
            <Link
              key={booking.id}
              href={`/admin/bookings?highlight=${booking.id}`}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink">{booking.service.name}</p>
                <p className="text-sm text-grey">{booking.fullName} · {booking.city}</p>
              </div>
              <p className="shrink-0 text-sm text-grey">
                {booking.startTime ? formatDate(booking.startTime) : "-"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border p-5">
      <Icon className="size-5 text-accent" />
      <p className="font-display mt-3 text-3xl text-ink">{value}</p>
      <p className="font-label text-xs font-semibold uppercase tracked-tight text-grey">{label}</p>
    </div>
  );
}
