import type { CitySlug, PackageTier, Service } from "@/lib/data/services";
import { getAddOnByKey } from "@/lib/data/addons";

export const GST_RATE = 0.18;
/** Only used when the customer types a custom city outside the 7 priced cities. */
export const OUTSTATION_FALLBACK_FEE = 1999;

export function getBasePrice(service: Service, citySlug: CitySlug | string): number {
  if (citySlug in service.pricingByCity) {
    return service.pricingByCity[citySlug as CitySlug];
  }
  // Custom/"other" city typed by the user, not in the pricing sheet.
  return service.pricingByCity.kolkata + OUTSTATION_FALLBACK_FEE;
}

export function getTierPrice(service: Service, citySlug: CitySlug | string, tier: PackageTier): number {
  const base = getBasePrice(service, citySlug);
  if (tier === "PREMIUM") return base + (service.premiumAddOn ?? 0);
  return base;
}

export function getAddOnsTotal(addonKeys: string[]): number {
  return addonKeys.reduce((sum, key) => sum + (getAddOnByKey(key)?.price ?? 0), 0);
}

export function computeBookingTotal({
  service,
  citySlug,
  tier,
  addonKeys,
}: {
  service: Service;
  citySlug: string;
  tier: PackageTier;
  addonKeys: string[];
}) {
  const basePrice = getBasePrice(service, citySlug);
  const tierPrice = getTierPrice(service, citySlug, tier);
  const addOnsTotal = getAddOnsTotal(addonKeys);
  const subtotal = tierPrice + addOnsTotal;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;
  const isOutstation = !(citySlug in service.pricingByCity);

  return { basePrice, tierPrice, addOnsTotal, subtotal, gst, total, isOutstation };
}
