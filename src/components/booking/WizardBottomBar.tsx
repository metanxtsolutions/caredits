"use client";

import { useBookingStore, TOTAL_STEPS } from "@/store/booking-store";
import { getServiceBySlug } from "@/lib/data/services";
import { computeBookingTotal } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";

export function WizardBottomBar({
  canProceed,
  onContinue,
}: {
  canProceed: boolean;
  onContinue: () => void;
}) {
  const s = useBookingStore();
  const service = s.serviceSlug ? getServiceBySlug(s.serviceSlug) : undefined;

  const pricing =
    service && s.citySlug
      ? computeBookingTotal({ service, citySlug: s.citySlug, tier: s.packageTier, addonKeys: s.addonKeys })
      : null;

  if (!pricing && s.step < 2) return null;

  const isFinalStep = s.step === TOTAL_STEPS;

  return (
    <div className="sticky bottom-0 z-30 -mx-6 mt-10 border-t border-border bg-white/95 px-6 py-4 backdrop-blur-sm sm:mx-0">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div>
          {pricing ? (
            <>
              <p className="font-label text-[10px] font-semibold uppercase tracked-tight text-grey">
                Estimated Total
              </p>
              <p className="font-display text-2xl text-ink">₹{pricing.total.toLocaleString("en-IN")}</p>
            </>
          ) : (
            <p className="text-sm text-grey">Select a service to see pricing</p>
          )}
        </div>
        {!isFinalStep && (
          <Button variant="primary" arrow disabled={!canProceed} onClick={onContinue} className="shrink-0">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
