import { create } from "zustand";
import type { PackageTier } from "@/lib/data/services";

export type LocationType = "DEALERSHIP" | "HOME" | "OUTDOOR" | "EVENT_VENUE" | "CUSTOM";
export type AddressType = "HOME" | "WORK" | "OTHER";

export const TOTAL_STEPS = 6;

/** Step 1 Service · 2 Package+Add-ons · 3 Date&Time · 4 Location · 5 Details · 6 Review&Pay.
 *  City is ambient (always editable via header chip), not a numbered step. */
export const STEP_LABELS = ["Service", "Package", "Date & Time", "Location", "Details", "Review & Pay"];

type BookingState = {
  step: number;
  serviceSlug: string | null;
  citySlug: string | null;
  packageTier: PackageTier;
  addonKeys: string[];

  dateISO: string | null;
  startMinutes: number | null;
  startLabel: string | null;
  endLabel: string | null;

  locationType: LocationType | null;
  city: string;
  state: string;
  flatNo: string;
  areaStreet: string;
  landmark: string;
  pincode: string;
  addressType: AddressType;
  saveAddress: boolean;

  fullName: string;
  phone: string;
  phoneVerified: boolean;
  email: string;
  vehicleBrand: string;
  vehicleModel: string;
  notes: string;
  paymentOption: "50" | "100";

  bookingId: string | null;
  bookingRef: string | null;

  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  toggleAddon: (key: string) => void;
  set: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void;
  reset: () => void;
};

const initialState = {
  step: 1,
  serviceSlug: null,
  citySlug: null,
  packageTier: "STANDARD" as const,
  addonKeys: [] as string[],

  dateISO: null,
  startMinutes: null,
  startLabel: null,
  endLabel: null,

  locationType: null,
  city: "",
  state: "",
  flatNo: "",
  areaStreet: "",
  landmark: "",
  pincode: "",
  addressType: "HOME" as const,
  saveAddress: false,

  fullName: "",
  phone: "",
  phoneVerified: false,
  email: "",
  vehicleBrand: "",
  vehicleModel: "",
  notes: "",
  paymentOption: "50" as const,
  bookingId: null,
  bookingRef: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  next: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS) })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  toggleAddon: (key) =>
    set((s) => ({
      addonKeys: s.addonKeys.includes(key)
        ? s.addonKeys.filter((k) => k !== key)
        : [...s.addonKeys, key],
    })),
  set: (key, value) => set({ [key]: value } as Partial<BookingState>),
  reset: () => set(initialState),
}));
