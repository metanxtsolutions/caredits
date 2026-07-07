"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CouponRow({
  coupon,
}: {
  coupon: {
    id: string;
    code: string;
    percentOff: number | null;
    amountOff: number | null;
    maxUses: number | null;
    usedCount: number;
    active: boolean;
  };
}) {
  const router = useRouter();

  async function toggleActive() {
    await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    });
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete coupon ${coupon.code}?`)) return;
    await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="font-display text-xl text-ink">{coupon.code}</p>
        <p className="text-sm text-grey">
          {coupon.percentOff ? `${coupon.percentOff}% off` : coupon.amountOff ? `₹${coupon.amountOff} off` : "No discount set"}
          {coupon.maxUses ? ` · ${coupon.usedCount}/${coupon.maxUses} used` : ` · ${coupon.usedCount} used`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleActive}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold uppercase tracked-tight",
            coupon.active ? "bg-ink text-white" : "border border-border text-grey",
          )}
        >
          {coupon.active ? "Active" : "Inactive"}
        </button>
        <button onClick={handleDelete} className="text-sm text-grey hover:text-accent">
          Delete
        </button>
      </div>
    </div>
  );
}
