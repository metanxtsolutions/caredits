import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { Service } from "@/lib/data/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col bg-white transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
    >
      <PlaceholderMedia id={service.slug} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-7">
        <span className="font-label text-[11px] font-semibold uppercase tracked text-accent">
          {service.tagline}
        </span>
        <h3 className="font-display mt-2 text-3xl leading-none text-ink">{service.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-grey">{service.shortDescription}</p>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="font-label text-sm font-bold text-ink">
            From ₹{service.pricingByCity.kolkata.toLocaleString("en-IN")}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-ink transition-transform group-hover:translate-x-1">
            Explore
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
