"use client";

import { useCityStore } from "@/store/city-store";
import { DEFAULT_CITY_SLUG } from "@/lib/data/cities";
import { getTierPrice } from "@/lib/pricing";
import { tiers } from "@/lib/data/tiers";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Service } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export function PricingTable({ services }: { services: Service[] }) {
  const { citySlug } = useCityStore();
  const effectiveCity = citySlug || DEFAULT_CITY_SLUG;

  return (
    <div className="space-y-6">
      {services.map((service, i) => (
        <Reveal key={service.slug} delay={0.04 * i}>
          <div className="border border-border p-6 md:p-8">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-3xl text-ink">{service.name}</h3>
                <p className="text-sm text-grey">{service.duration}</p>
              </div>
              <Button href={`/book?service=${service.slug}`} variant="outline" arrow className="shrink-0">
                Book This Service
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {tiers.map((tierInfo) => {
                const price = getTierPrice(service, effectiveCity, tierInfo.tier);
                return (
                  <div
                    key={tierInfo.tier}
                    className={cn(
                      "flex flex-col gap-1 p-5",
                      tierInfo.highlighted ? "bg-ink text-white" : "bg-grey-light text-ink",
                    )}
                  >
                    {tierInfo.highlighted && (
                      <Badge variant="solid" className="mb-1 w-fit">
                        Recommended
                      </Badge>
                    )}
                    <span className="font-label text-xs font-semibold uppercase tracked-tight opacity-70">
                      {tierInfo.label}
                    </span>
                    <span className="font-display text-3xl">₹{price.toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
