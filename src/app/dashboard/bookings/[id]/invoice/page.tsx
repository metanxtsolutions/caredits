import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatINR } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { PrintButton } from "@/components/dashboard/PrintButton";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser();

  const booking = await prisma.booking.findUnique({ where: { id }, include: { service: true } });
  if (!booking || booking.customerId !== session.id) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="font-display text-3xl text-ink">INVOICE</h1>
        <PrintButton />
      </div>

      <div className="mt-8 border border-border p-8">
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div>
            <p className="font-display text-2xl text-ink">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-grey">{siteConfig.location}</p>
            <p className="text-sm text-grey">{siteConfig.email}</p>
          </div>
          <div className="text-right">
            <p className="font-label text-xs font-semibold uppercase tracked text-grey">Invoice</p>
            <p className="mt-1 text-sm text-ink">{booking.bookingRef}</p>
            <p className="text-sm text-grey">{formatDate(booking.createdAt)}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="font-label text-xs font-semibold uppercase tracked text-grey">Billed To</p>
            <p className="mt-1 text-sm text-ink">{booking.fullName}</p>
            <p className="text-sm text-grey">{booking.phone}</p>
            <p className="text-sm text-grey">{booking.email}</p>
          </div>
          <div className="text-right">
            <p className="font-label text-xs font-semibold uppercase tracked text-grey">Service</p>
            <p className="mt-1 text-sm text-ink">{booking.service.name}</p>
            <p className="text-sm text-grey">{booking.packageTier}</p>
          </div>
        </div>

        <div className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
          <div className="flex justify-between">
            <span className="text-grey">Subtotal</span>
            <span className="text-ink">{formatINR(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-grey">GST (18%)</span>
            <span className="text-ink">{formatINR(booking.gstAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 font-semibold">
            <span className="text-ink">Total</span>
            <span className="text-ink">{formatINR(booking.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-grey">
            <span>Advance Paid</span>
            <span>{formatINR(booking.advanceAmount)}</span>
          </div>
          <div className="flex justify-between text-grey">
            <span>Balance Due</span>
            <span>{formatINR(booking.totalAmount - booking.advanceAmount)}</span>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-xs text-grey">
          Payment status: {booking.paymentStatus}. This is a system-generated invoice for {siteConfig.name}.
        </p>
      </div>
    </div>
  );
}
