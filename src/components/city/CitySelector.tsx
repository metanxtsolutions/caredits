"use client";

import { useState } from "react";
import { MapPin, X, Check } from "lucide-react";
import { cities, getCityBySlug } from "@/lib/data/cities";
import { useCityStore } from "@/store/city-store";
import { cn } from "@/lib/utils";

export function useSelectedCityName() {
  const { citySlug, customCityName } = useCityStore();
  if (citySlug === "other" && customCityName) return customCityName;
  return getCityBySlug(citySlug)?.name || "Kolkata";
}

export function CitySelector({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const cityName = useSelectedCityName();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "font-label inline-flex items-center gap-2 text-xs font-semibold uppercase tracked-tight text-ink",
          className,
        )}
      >
        <MapPin className="size-4 text-accent" />
        Serving in <span className="text-accent">{cityName}</span>
        <span className="text-grey underline">Change</span>
      </button>

      {open && <CityModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CityModal({ onClose }: { onClose: () => void }) {
  const { citySlug, setCity, setCustomCity } = useCityStore();
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(citySlug === "other");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl text-ink">SELECT YOUR CITY</h3>
          <button onClick={onClose} aria-label="Close">
            <X className="size-6 text-grey" />
          </button>
        </div>
        <p className="mt-1 text-sm text-grey">
          We have a dedicated crew and standard pricing in these cities.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {cities.map((city) => {
            const active = citySlug === city.slug;
            return (
              <button
                key={city.slug}
                onClick={() => {
                  setCity(city.slug);
                  onClose();
                }}
                className={cn(
                  "flex items-center justify-between gap-2 border-2 px-4 py-3 text-left text-sm font-semibold transition-colors",
                  active ? "border-ink bg-grey-light" : "border-border hover:border-ink/40",
                )}
              >
                {city.name}
                {active && <Check className="size-4 text-accent" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <button
            onClick={() => setShowCustom((v) => !v)}
            className="font-label text-xs font-semibold uppercase tracked-tight text-accent"
          >
            Somewhere else in India?
          </button>
          {showCustom && (
            <div className="mt-3 flex gap-2">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter your city"
                className="flex-1 border border-border px-4 py-3 text-sm outline-none focus:border-ink"
              />
              <button
                onClick={() => {
                  if (!customInput.trim()) return;
                  setCustomCity(customInput.trim());
                  onClose();
                }}
                className="bg-ink px-5 text-sm font-semibold text-white"
              >
                Confirm
              </button>
            </div>
          )}
          <p className="mt-3 text-xs text-grey">
            We serve PAN India. Outstation shoots include a travel fee shown at booking.
          </p>
        </div>
      </div>
    </div>
  );
}
