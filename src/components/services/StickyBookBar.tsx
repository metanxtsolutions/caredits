"use client";

import { Button } from "@/components/ui/Button";
import { useCityStore } from "@/store/city-store";
import { DEFAULT_CITY_SLUG } from "@/lib/data/cities";
import { getBasePrice } from "@/lib/pricing";
import type { Service } from "@/lib/data/services";

export function StickyBookBar({ service, ctaLabel }: { service: Service; ctaLabel: string }) {
  const { citySlug } = useCityStore();
  const price = getBasePrice(service, citySlug || DEFAULT_CITY_SLUG);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-3 lg:hidden">
      <Button href={`/book?service=${service.slug}`} variant="primary" arrow className="w-full">
        {ctaLabel} · ₹{price.toLocaleString("en-IN")}
      </Button>
    </div>
  );
}
