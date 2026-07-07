"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export function StepService({ onSelect }: { onSelect: () => void }) {
  const { serviceSlug, set } = useBookingStore();
  const [justSelected, setJustSelected] = useState<string | null>(null);

  function handleSelect(slug: string) {
    set("serviceSlug", slug);
    setJustSelected(slug);
    window.setTimeout(() => onSelect(), 320);
  }

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">SELECT YOUR SERVICE</h2>
      <p className="mt-2 text-grey">Choose the type of shoot you&apos;d like to book.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {services.map((service) => {
          const active = serviceSlug === service.slug;
          const justPicked = justSelected === service.slug;
          return (
            <button
              key={service.slug}
              onClick={() => handleSelect(service.slug)}
              className={cn(
                "relative flex flex-col gap-1.5 border-2 p-3.5 text-left transition-colors sm:gap-2 sm:p-5",
                active ? "border-ink bg-grey-light" : "border-border hover:border-ink/40",
              )}
            >
              {justPicked && (
                <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-accent text-white">
                  <Check className="size-3" />
                </span>
              )}
              <span className="font-display text-xl leading-none text-ink sm:text-2xl">{service.name}</span>
              <span className="hidden text-sm text-grey sm:block">{service.shortDescription}</span>
              <span className="font-label mt-1 text-xs font-bold text-ink sm:mt-2 sm:text-sm">
                From ₹{service.pricingByCity.kolkata.toLocaleString("en-IN")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
