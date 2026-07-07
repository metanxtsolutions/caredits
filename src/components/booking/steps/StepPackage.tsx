"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { getServiceBySlug, type PackageTier } from "@/lib/data/services";
import { getTierPrice } from "@/lib/pricing";
import { tiers, getTierInfo } from "@/lib/data/tiers";
import { addOns } from "@/lib/data/addons";
import { cn } from "@/lib/utils";

export function StepPackage() {
  const { serviceSlug, citySlug, packageTier, addonKeys, toggleAddon, set } = useBookingStore();
  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;

  if (!service) return null;

  const hasPackages = service.premiumAddOn !== null;

  if (!hasPackages) {
    return (
      <div>
        <h2 className="font-display text-4xl text-ink">PACKAGE</h2>
        <div className="mt-8 bg-grey-light p-8 text-center">
          <p className="font-display text-3xl text-ink">CUSTOM QUOTE</p>
          <p className="mt-3 text-grey">
            {service.name} is scoped to your brief — no fixed tiers. We&apos;ll confirm final
            pricing after discussing your requirements in the next steps.
          </p>
        </div>
      </div>
    );
  }

  const activeTierInfo = getTierInfo(packageTier);

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">CHOOSE YOUR PACKAGE</h2>
      <p className="mt-2 text-grey">Premium adds our full cinematic package, including drone coverage.</p>

      <div className="mt-8 flex border-2 border-ink">
        {tiers.map((tierInfo) => {
          const active = packageTier === tierInfo.tier;
          const price = citySlug ? getTierPrice(service, citySlug, tierInfo.tier as PackageTier) : null;
          return (
            <button
              key={tierInfo.tier}
              onClick={() => set("packageTier", tierInfo.tier)}
              className={cn(
                "flex-1 px-4 py-4 text-center transition-colors sm:py-5",
                active ? "bg-ink text-white" : "bg-white text-ink hover:bg-grey-light",
              )}
            >
              <span className="font-label block text-xs font-bold uppercase tracked-tight">
                {tierInfo.label}
              </span>
              {price !== null && (
                <span className="font-display mt-1 block text-2xl sm:text-3xl">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={packageTier}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-5 space-y-2"
        >
          {activeTierInfo.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" />
              {f}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <div className="mt-10 border-t border-border pt-8">
        <h3 className="font-label text-xs font-semibold uppercase tracked text-accent">
          Add Extras <span className="text-grey normal-case">(optional)</span>
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {addOns.map((addOn) => {
            const active = addonKeys.includes(addOn.key);
            return (
              <button
                key={addOn.key}
                onClick={() => toggleAddon(addOn.key)}
                className={cn(
                  "flex items-center justify-between gap-3 border-2 px-4 py-3 text-left transition-colors",
                  active ? "border-ink bg-grey-light" : "border-border hover:border-ink/40",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                      active ? "border-ink bg-ink text-white" : "border-border text-transparent",
                    )}
                  >
                    {active ? <Check className="size-3" /> : <Plus className="size-3" />}
                  </span>
                  <span className="font-label text-xs font-semibold text-ink sm:text-sm">
                    {addOn.label}
                  </span>
                </span>
                <span className="font-label shrink-0 text-xs font-bold text-accent sm:text-sm">
                  +₹{addOn.price.toLocaleString("en-IN")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
