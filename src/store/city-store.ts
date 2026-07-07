import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CITY_SLUG } from "@/lib/data/cities";

type CityState = {
  citySlug: string;
  customCityName: string | null; // set when the user picks "Other city"
  setCity: (slug: string) => void;
  setCustomCity: (name: string) => void;
};

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      citySlug: DEFAULT_CITY_SLUG,
      customCityName: null,
      setCity: (slug) => set({ citySlug: slug, customCityName: null }),
      setCustomCity: (name) => set({ citySlug: "other", customCityName: name }),
    }),
    { name: "car-edits-city" },
  ),
);
