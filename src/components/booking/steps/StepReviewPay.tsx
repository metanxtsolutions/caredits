"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, CreditCard, Smartphone, Landmark, ShieldCheck } from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { getServiceBySlug } from "@/lib/data/services";
import { getAddOnByKey } from "@/lib/data/addons";
import { computeBookingTotal } from "@/lib/pricing";
import { fromDateKey } from "@/lib/date";
import { getTierInfo } from "@/lib/data/tiers";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const locationLabels: Record<string, string> = {
  DEALERSHIP: "Dealership",
  HOME: "Home Delivery",
  OUTDOOR: "Outdoor Location",
  EVENT_VENUE: "Event Venue",
  CUSTOM: "Custom Location",
};

const methods = [
  { key: "razorpay", label: "Razorpay", icon: ShieldCheck },
  { key: "upi", label: "UPI", icon: Smartphone },
  { key: "cards", label: "Cards", icon: CreditCard },
  { key: "netbanking", label: "Net Banking", icon: Landmark },
  { key: "wallets", label: "Wallets", icon: Wallet },
];

export function StepReviewPay({ onEdit }: { onEdit: (step: number) => void }) {
  const router = useRouter();
  const s = useBookingStore();
  const [method, setMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = s.serviceSlug ? getServiceBySlug(s.serviceSlug) : undefined;
  const hasPackages = service?.premiumAddOn !== null;

  const pricing =
    service && s.citySlug
      ? computeBookingTotal({ service, citySlug: s.citySlug, tier: s.packageTier, addonKeys: s.addonKeys })
      : null;

  const totalAmount = pricing?.total ?? 0;
  const advanceAmount = s.paymentOption === "100" ? totalAmount : Math.round(totalAmount / 2);

  const addressValue =
    s.locationType === "DEALERSHIP"
      ? `${locationLabels.DEALERSHIP} · ${s.city}, ${s.state}`
      : [
          s.locationType ? locationLabels[s.locationType] : null,
          [s.flatNo, s.areaStreet, s.landmark, `${s.city}${s.pincode ? ` - ${s.pincode}` : ""}`, s.state]
            .filter(Boolean)
            .join(", "),
        ]
          .filter(Boolean)
          .join(" · ");

  const rows: { label: string; value: string; step: number }[] = [
    { label: "Service", value: service?.name || "-", step: 1 },
    { label: "City", value: s.city || "-", step: 1 },
    { label: "Package", value: hasPackages ? getTierInfo(s.packageTier).label : "Custom Quote", step: 2 },
    {
      label: "Add-ons",
      value:
        s.addonKeys.length > 0
          ? s.addonKeys.map((k) => getAddOnByKey(k)?.label).filter(Boolean).join(", ")
          : "None",
      step: 2,
    },
    {
      label: "Date & Time",
      value: s.dateISO
        ? `${fromDateKey(s.dateISO).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · ${s.startLabel ?? ""}${s.endLabel ? ` → ${s.endLabel}` : ""}`
        : service?.schedulingMode === "slot"
          ? "-"
          : service?.schedulingMode === "contact"
            ? "Our team will contact you to schedule"
            : "To be finalized after discussion",
      step: 3,
    },
    { label: "Location", value: addressValue || "-", step: 4 },
    {
      label: "Customer",
      value: `${s.fullName || "-"} · ${s.phone || "-"}${s.phoneVerified ? " (verified)" : ""} · ${s.email || "-"}`,
      step: 5,
    },
    { label: "Vehicle", value: `${s.vehicleBrand || "-"} ${s.vehicleModel || ""}`, step: 5 },
  ];

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: s.serviceSlug,
          citySlug: s.citySlug,
          packageTier: s.packageTier,
          addonKeys: s.addonKeys,
          dateISO: s.dateISO,
          startMinutes: s.startMinutes,
          locationType: s.locationType,
          city: s.city,
          state: s.state,
          flatNo: s.flatNo,
          areaStreet: s.areaStreet,
          landmark: s.landmark,
          pincode: s.pincode,
          addressType: s.addressType,
          fullName: s.fullName,
          phone: s.phone,
          phoneVerified: s.phoneVerified,
          email: s.email,
          vehicleBrand: s.vehicleBrand,
          vehicleModel: s.vehicleModel,
          notes: s.notes,
          paymentOption: s.paymentOption,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Could not create booking");
      }

      const payRes = await fetch(`/api/bookings/${bookingData.id}/pay`, { method: "POST" });
      if (!payRes.ok) throw new Error("Payment failed");

      s.set("bookingId", bookingData.id);
      s.set("bookingRef", bookingData.bookingRef);

      router.push(`/book/confirmation/${bookingData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">REVIEW &amp; PAY</h2>
      <p className="mt-2 text-grey">Check the details below, then complete your booking.</p>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <p className="font-label text-xs font-semibold uppercase tracked text-grey">{row.label}</p>
              <p className="mt-0.5 truncate text-sm text-ink">{row.value}</p>
            </div>
            <button
              onClick={() => onEdit(row.step)}
              className="font-label shrink-0 text-xs font-semibold uppercase tracked-tight text-accent hover:underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {pricing && (
        <div className="mt-6 bg-grey-light p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-grey">{hasPackages ? getTierInfo(s.packageTier).label : "Base"} price</span>
              <span className="text-ink">₹{pricing.tierPrice.toLocaleString("en-IN")}</span>
            </div>
            {pricing.addOnsTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-grey">Add-ons</span>
                <span className="text-ink">₹{pricing.addOnsTotal.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-grey">GST (18%)</span>
              <span className="text-ink">₹{pricing.gst.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-label text-sm font-semibold uppercase tracked-tight text-ink">Grand Total</span>
            <span className="font-display text-3xl text-ink">₹{pricing.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {s.notes && (
        <p className="mt-4 text-sm text-grey">
          <span className="font-semibold text-ink">Notes: </span>
          {s.notes}
        </p>
      )}

      <div className="mt-10 border-t border-border pt-8">
        <h3 className="font-label text-xs font-semibold uppercase tracked text-accent">Payment</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["50", "100"] as const).map((opt) => {
            const active = s.paymentOption === opt;
            const amount = opt === "100" ? totalAmount : Math.round(totalAmount / 2);
            return (
              <button
                key={opt}
                onClick={() => s.set("paymentOption", opt)}
                className={cn(
                  "flex flex-col items-start gap-1 border-2 p-5 text-left transition-colors",
                  active ? "border-ink bg-grey-light" : "border-border hover:border-ink/40",
                )}
              >
                <span className="font-label text-xs font-semibold uppercase tracked text-accent">
                  {opt === "100" ? "Full Payment" : "50% Advance"}
                </span>
                <span className="font-display text-2xl text-ink">₹{amount.toLocaleString("en-IN")}</span>
                <span className="text-xs text-grey">
                  {opt === "100"
                    ? "Pay the full amount now"
                    : `Remaining ₹${(totalAmount - amount).toLocaleString("en-IN")} due on shoot day`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {methods.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={cn(
                "flex flex-col items-center gap-1.5 border-2 py-3 text-[11px] font-semibold transition-colors",
                method === key ? "border-ink bg-grey-light" : "border-border hover:border-ink/40",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 bg-grey-light p-4 text-xs text-grey">
          <ShieldCheck className="size-4 shrink-0 text-accent" />
          Sandbox mode: no real payment provider is connected yet. This simulates a successful
          payment so you can test the full booking flow end to end.
        </div>

        {error && <p className="mt-4 text-sm text-accent">{error}</p>}

        <Button
          onClick={handlePay}
          disabled={loading}
          variant="primary"
          arrow
          className="mt-6 w-full sm:w-auto"
        >
          {loading ? "Processing..." : `Pay ₹${advanceAmount.toLocaleString("en-IN")} Now`}
        </Button>
      </div>
    </div>
  );
}
