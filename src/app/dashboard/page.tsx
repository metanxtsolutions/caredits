import Link from "next/link";
import { CalendarClock, Heart, LifeBuoy } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const session = await requireUser();

  const [upcomingCount, totalCount, wishlistCount, nextBooking] = await Promise.all([
    prisma.booking.count({
      where: { customerId: session.id, status: { notIn: ["CANCELLED", "REJECTED"] }, startTime: { gte: new Date() } },
    }),
    prisma.booking.count({ where: { customerId: session.id } }),
    prisma.wishlistItem.count({ where: { userId: session.id } }),
    prisma.booking.findFirst({
      where: { customerId: session.id, status: { notIn: ["CANCELLED", "REJECTED"] }, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      include: { service: true },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">OVERVIEW</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarClock} label="Upcoming Shoots" value={upcomingCount} />
        <StatCard icon={CalendarClock} label="Total Bookings" value={totalCount} />
        <StatCard icon={Heart} label="Wishlisted Services" value={wishlistCount} />
      </div>

      {nextBooking && (
        <div className="mt-8 border border-border p-6">
          <p className="font-label text-xs font-semibold uppercase tracked text-accent">Next Shoot</p>
          <p className="mt-2 font-display text-2xl text-ink">{nextBooking.service.name}</p>
          <p className="mt-1 text-sm text-grey">
            {nextBooking.startTime ? formatDate(nextBooking.startTime) : "Schedule to be confirmed"} · {nextBooking.city}
          </p>
          <Link href={`/dashboard/bookings/${nextBooking.id}`} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
            View booking
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/dashboard/bookings" className="flex items-center gap-3 border border-border p-5 hover:border-ink">
          <CalendarClock className="size-5 text-accent" />
          <span className="text-sm font-semibold text-ink">View all bookings</span>
        </Link>
        <Link href="/dashboard/support" className="flex items-center gap-3 border border-border p-5 hover:border-ink">
          <LifeBuoy className="size-5 text-accent" />
          <span className="text-sm font-semibold text-ink">Get support</span>
        </Link>
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
  value: number;
}) {
  return (
    <div className="bg-grey-light p-5">
      <Icon className="size-5 text-accent" />
      <p className="font-display mt-3 text-3xl text-ink">{value}</p>
      <p className="font-label text-xs font-semibold uppercase tracked-tight text-grey">{label}</p>
    </div>
  );
}
