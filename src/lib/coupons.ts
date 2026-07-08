import type { Coupon } from "@prisma/client";
import { computeDiscount } from "@/lib/pricing";

export type CouponCheckResult =
  | { valid: true; coupon: Coupon; discount: number }
  | { valid: false; error: string };

/** Single source of truth for "is this coupon usable right now" — used by both
 *  the public validate endpoint and the booking-creation transaction (which
 *  never trusts a client-supplied discount and re-checks from scratch). */
export function checkCoupon(coupon: Coupon | null, subtotal: number): CouponCheckResult {
  if (!coupon) return { valid: false, error: "Coupon code not found" };
  if (!coupon.active) return { valid: false, error: "This coupon is no longer active" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, error: "This coupon has expired" };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }

  const discount = computeDiscount(subtotal, coupon);
  return { valid: true, coupon, discount };
}
