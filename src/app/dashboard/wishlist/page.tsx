import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServiceBySlug } from "@/lib/data/services";
import { WishlistButton } from "@/components/dashboard/WishlistButton";

export default async function WishlistPage() {
  const session = await requireUser();

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">WISHLIST</h1>

      {items.length === 0 && (
        <div className="mt-8 bg-grey-light p-8 text-center">
          <p className="text-grey">You haven&apos;t saved any services yet.</p>
          <Link href="/services" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
            Browse services
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const service = getServiceBySlug(item.service.slug);
          if (!service) return null;
          return (
            <div key={item.id} className="flex items-start justify-between gap-4 border border-border p-5">
              <div className="min-w-0">
                <p className="font-display text-xl text-ink">{service.name}</p>
                <p className="mt-1 text-sm text-grey">{service.tagline}</p>
                <Link href={`/services/${service.slug}`} className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
                  View service
                </Link>
              </div>
              <WishlistButton serviceSlug={service.slug} initialWishlisted />
            </div>
          );
        })}
      </div>
    </div>
  );
}
