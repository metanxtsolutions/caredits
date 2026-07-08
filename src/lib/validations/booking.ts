import { z } from "zod";

export const bookingSchema = z.object({
  serviceSlug: z.string().min(1),
  citySlug: z.string().min(1),
  packageTier: z.enum(["STANDARD", "PREMIUM"]),
  addonKeys: z.array(z.string()).default([]),

  dateISO: z.string().nullable().optional(),
  startMinutes: z.number().nullable().optional(),

  locationType: z.enum(["DEALERSHIP", "HOME", "OUTDOOR", "EVENT_VENUE", "CUSTOM"]),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  flatNo: z.string().optional(),
  areaStreet: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().optional(),
  addressType: z.enum(["HOME", "WORK", "OTHER"]).optional(),

  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  phoneVerified: z.boolean().optional(),
  email: z.string().email("Please enter a valid email"),
  vehicleBrand: z.string().min(1, "Please enter the vehicle brand"),
  vehicleModel: z.string().min(1, "Please enter the vehicle model"),
  notes: z.string().optional(),
  paymentOption: z.enum(["50", "100"]),
  couponCode: z.string().nullable().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
