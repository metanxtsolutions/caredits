"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useBookingStore, TOTAL_STEPS } from "@/store/booking-store";
import { useCityStore } from "@/store/city-store";
import { useSelectedCityName } from "@/components/city/CitySelector";
import { getCityBySlug } from "@/lib/data/cities";
import { getServiceBySlug } from "@/lib/data/services";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { WizardBottomBar } from "@/components/booking/WizardBottomBar";
import { CitySelector } from "@/components/city/CitySelector";
import { StepService } from "@/components/booking/steps/StepService";
import { StepPackage } from "@/components/booking/steps/StepPackage";
import { StepDateTime } from "@/components/booking/steps/StepDateTime";
import { StepLocation } from "@/components/booking/steps/StepLocation";
import { StepDetails } from "@/components/booking/steps/StepDetails";
import { StepReviewPay } from "@/components/booking/steps/StepReviewPay";

type State = ReturnType<typeof useBookingStore.getState>;

/** Date & Time (step 3) only applies to services scheduled via a start-time slot. */
function isStepApplicable(step: number, s: State) {
  if (step !== 3) return true;
  const service = s.serviceSlug ? getServiceBySlug(s.serviceSlug) : undefined;
  return service?.schedulingMode === "slot";
}

function nextApplicableStep(current: number, direction: 1 | -1, s: State) {
  let step = current + direction;
  while (step >= 1 && step <= TOTAL_STEPS && !isStepApplicable(step, s)) {
    step += direction;
  }
  return Math.min(Math.max(step, 1), TOTAL_STEPS);
}

function canProceed(step: number, s: State) {
  switch (step) {
    case 1:
      return Boolean(s.serviceSlug);
    case 2:
      return true; // tier defaults to STANDARD; add-ons optional
    case 3:
      return Boolean(s.dateISO && s.startMinutes != null);
    case 4:
      if (!s.locationType) return false;
      if (s.locationType === "DEALERSHIP") return Boolean(s.city && s.state);
      return Boolean(s.flatNo && s.areaStreet && s.city && s.state && s.pincode.length >= 6);
    case 5:
      return Boolean(
        s.fullName && s.phone.length >= 10 && s.email.includes("@") && s.vehicleBrand && s.vehicleModel,
      );
    default:
      return true;
  }
}

export function BookingWizard() {
  const s = useBookingStore();
  const searchParams = useSearchParams();
  const cityStore = useCityStore();
  const selectedCityName = useSelectedCityName();

  useEffect(() => {
    const service = searchParams.get("service");
    const tier = searchParams.get("tier");
    if (service) s.set("serviceSlug", service);
    if (tier === "STANDARD" || tier === "PREMIUM") s.set("packageTier", tier);

    // Seed city/state from the ambient (globally persisted) city selection.
    if (!s.citySlug) {
      s.set("citySlug", cityStore.citySlug);
      s.set("city", selectedCityName);
      const cityData = getCityBySlug(cityStore.citySlug);
      if (cityData) s.set("state", cityData.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the booking's city in sync if the user changes the ambient city selector mid-flow.
  useEffect(() => {
    s.set("citySlug", cityStore.citySlug);
    s.set("city", selectedCityName);
    const cityData = getCityBySlug(cityStore.citySlug);
    s.set("state", cityData ? cityData.state : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityStore.citySlug, cityStore.customCityName]);

  const ready = canProceed(s.step, s);
  const stepContentRef = useRef<HTMLDivElement>(null);

  // Move focus to the new step's content on every transition — keeps screen
  // reader / keyboard users oriented without relying on a full page navigation.
  useEffect(() => {
    stepContentRef.current?.focus({ preventScroll: true });
  }, [s.step]);

  function goNext() {
    s.setStep(nextApplicableStep(s.step, 1, s));
  }
  function goBack() {
    s.setStep(nextApplicableStep(s.step, -1, s));
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1">
          <StepIndicator step={s.step} onBack={goBack} />
        </div>
        <CitySelector className="shrink-0 self-start sm:self-auto" />
      </div>

      <div ref={stepContentRef} tabIndex={-1} className="mt-10 min-h-[420px] outline-none">
        {s.step === 1 && <StepService onSelect={goNext} />}
        {s.step === 2 && <StepPackage />}
        {s.step === 3 && <StepDateTime onTimeSelected={goNext} />}
        {s.step === 4 && <StepLocation onDealershipSelected={goNext} />}
        {s.step === 5 && <StepDetails />}
        {s.step === 6 && <StepReviewPay onEdit={(step) => s.setStep(step)} />}
      </div>

      <WizardBottomBar canProceed={ready} onContinue={goNext} />
    </div>
  );
}
