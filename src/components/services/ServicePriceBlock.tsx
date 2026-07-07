"use client";

import { useCityStore } from "@/store/city-store";
import { getCityBySlug, DEFAULT_CITY_SLUG } from "@/lib/data/cities";
import { getBasePrice } from "@/lib/pricing";
import { getDiscountPricing, type Service } from "@/lib/data/services";

export function ServicePriceBlock({ service }: { service: Service }) {
  const { citySlug, customCityName } = useCityStore();
  const effectiveSlug = citySlug === "other" ? "other" : citySlug || DEFAULT_CITY_SLUG;
  const price = getBasePrice(service, effectiveSlug);
  const { originalPrice, percentOff } = getDiscountPricing(price);
  const cityLabel = citySlug === "other" ? customCityName || "your city" : getCityBySlug(citySlug)?.name;

  const hasPackages = service.premiumAddOn !== null;

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-5xl text-ink">₹{price.toLocaleString("en-IN")}</span>
        <span className="text-lg text-grey line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
        <span className="font-label text-xs font-bold text-accent">{percentOff}% OFF</span>
      </div>
      <p className="mt-1 text-xs text-grey">
        Standard price in {cityLabel} · Inclusive of crew &amp; standard editing, excl. GST
      </p>
      {hasPackages && (
        <p className="mt-1 text-xs text-grey">
          Premium: +₹{service.premiumAddOn!.toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
}
