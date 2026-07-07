"use client";

import { useState } from "react";
import { Building2, Home, TreePine, PartyPopper, MapPinned, Lock } from "lucide-react";
import { useBookingStore, type LocationType, type AddressType } from "@/store/booking-store";
import { cn } from "@/lib/utils";

const options: { value: LocationType; label: string; description: string; icon: typeof Building2 }[] = [
  { value: "DEALERSHIP", label: "Dealership", description: "At the dealership showroom", icon: Building2 },
  { value: "HOME", label: "Home Delivery", description: "At your home address", icon: Home },
  { value: "OUTDOOR", label: "Outdoor Location", description: "An outdoor location of your choice", icon: TreePine },
  { value: "EVENT_VENUE", label: "Event Venue", description: "A launch or corporate event venue", icon: PartyPopper },
  { value: "CUSTOM", label: "Custom Location", description: "Specify a custom location", icon: MapPinned },
];

const addressTypes: { value: AddressType; label: string; icon: typeof Home }[] = [
  { value: "HOME", label: "Home", icon: Home },
  { value: "WORK", label: "Work", icon: Building2 },
  { value: "OTHER", label: "Other", icon: MapPinned },
];

export function StepLocation({ onDealershipSelected }: { onDealershipSelected: () => void }) {
  const s = useBookingStore();
  const { set } = s;
  const [justPicked, setJustPicked] = useState<LocationType | null>(null);

  function handlePick(value: LocationType) {
    set("locationType", value);
    if (value === "DEALERSHIP") {
      setJustPicked(value);
      window.setTimeout(() => onDealershipSelected(), 320);
    }
  }

  const needsAddress = s.locationType && s.locationType !== "DEALERSHIP";

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">WHERE IS YOUR SHOOT?</h2>
      <p className="mt-2 text-grey">Tell us where our crew should meet you.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {options.map(({ value, label, description, icon: Icon }) => {
          const active = s.locationType === value || justPicked === value;
          return (
            <button
              key={value}
              onClick={() => handlePick(value)}
              className={cn(
                "flex flex-col items-center gap-2 border-2 p-4 text-center transition-colors sm:gap-3 sm:p-6",
                active ? "border-ink bg-grey-light" : "border-border hover:border-ink/40",
                value === "EVENT_VENUE" && "col-span-2 sm:col-span-1",
              )}
            >
              <Icon className={cn("size-6 sm:size-7", active ? "text-accent" : "text-ink")} />
              <span className="font-label text-xs font-bold uppercase tracked-tight text-ink sm:text-sm">
                {label}
              </span>
              <span className="hidden text-xs text-grey sm:block">{description}</span>
            </button>
          );
        })}
      </div>

      {s.locationType === "DEALERSHIP" && (
        <div className="mt-8 flex items-center gap-3 bg-grey-light p-5">
          <Building2 className="size-5 shrink-0 text-accent" />
          <p className="text-sm text-ink">
            We&apos;ll meet you at a dealership showroom in{" "}
            <span className="font-semibold">
              {s.city}, {s.state}
            </span>
            . Wrong city? Use the city selector above to change it.
          </p>
        </div>
      )}

      {needsAddress && (
        <div className="mt-8 space-y-5 border-t border-border pt-8">
          <h3 className="font-label text-xs font-semibold uppercase tracked text-accent">
            Address Details
          </h3>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Flat / House No.">
              <input
                value={s.flatNo}
                onChange={(e) => set("flatNo", e.target.value)}
                placeholder="Flat 204, Sunrise Apartments"
                className="input"
              />
            </Field>
            <Field label="Area / Street">
              <input
                value={s.areaStreet}
                onChange={(e) => set("areaStreet", e.target.value)}
                placeholder="Salt Lake, Sector V"
                className="input"
              />
            </Field>
          </div>

          <Field label="Landmark (optional)">
            <input
              value={s.landmark}
              onChange={(e) => set("landmark", e.target.value)}
              placeholder="Near City Mall..."
              className="input"
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="City">
              <div className="relative">
                <input
                  value={s.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="input pr-9"
                />
                <Lock className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-grey" />
              </div>
              <span className="mt-1.5 block text-xs text-grey">
                Matches the city selector above — change it there if needed.
              </span>
            </Field>
            <Field label="Pincode">
              <input
                value={s.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                placeholder="700091"
                inputMode="numeric"
                maxLength={6}
                className="input"
              />
            </Field>
          </div>

          <div>
            <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">
              Address Type
            </span>
            <div className="flex gap-3">
              {addressTypes.map(({ value, label, icon: Icon }) => {
                const active = s.addressType === value;
                return (
                  <button
                    key={value}
                    onClick={() => set("addressType", value)}
                    className={cn(
                      "flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold transition-colors",
                      active ? "border-ink bg-ink text-white" : "border-border hover:border-ink/40",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-3">
            <button
              role="switch"
              aria-checked={s.saveAddress}
              onClick={() => set("saveAddress", !s.saveAddress)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                s.saveAddress ? "bg-accent" : "bg-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                  s.saveAddress ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
            <span className="text-sm text-ink">Save this address for future bookings</span>
          </label>
        </div>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid var(--color-border);
          background: white;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--color-ink);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}
