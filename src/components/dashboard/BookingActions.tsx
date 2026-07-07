"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { RescheduleWidget } from "@/components/dashboard/RescheduleWidget";

export function BookingActions({
  bookingId,
  serviceSlug,
  tier,
  canModify,
  isSlotBased,
}: {
  bookingId: string;
  serviceSlug: string;
  tier: string;
  canModify: boolean;
  isSlotBased: boolean;
}) {
  const router = useRouter();
  const [showReschedule, setShowReschedule] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!confirm("Cancel this booking? This can't be undone.")) return;
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setCancelling(false);
    }
  }

  if (!canModify) return null;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex flex-wrap gap-3">
        {isSlotBased && (
          <Button variant="outline" onClick={() => setShowReschedule((v) => !v)}>
            {showReschedule ? "Close" : "Reschedule"}
          </Button>
        )}
        <Button variant="ghost" disabled={cancelling} onClick={handleCancel}>
          {cancelling ? "Cancelling..." : "Cancel Booking"}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-accent">{error}</p>}

      {showReschedule && (
        <RescheduleWidget
          bookingId={bookingId}
          serviceSlug={serviceSlug}
          tier={tier}
          onClose={() => setShowReschedule(false)}
        />
      )}
    </div>
  );
}
