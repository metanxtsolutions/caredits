"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { minutesToLabel } from "@/lib/scheduling";

export function BlockedSlotRow({
  slot,
}: {
  slot: { id: string; date: string; startMinutes: number | null; endMinutes: number | null; reason: string | null };
}) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/admin/blocked-slots/${slot.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="font-semibold text-ink">{formatDate(slot.date)}</p>
        <p className="text-sm text-grey">
          {slot.startMinutes == null ? "Whole day" : `${minutesToLabel(slot.startMinutes)} – ${minutesToLabel(slot.endMinutes || 0)}`}
          {slot.reason ? ` · ${slot.reason}` : ""}
        </p>
      </div>
      <button onClick={handleDelete} className="text-sm text-grey hover:text-accent">
        Remove
      </button>
    </div>
  );
}
