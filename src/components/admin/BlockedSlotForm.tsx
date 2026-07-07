"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function BlockedSlotForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [wholeDay, setWholeDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("19:00");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toMinutes(hhmm: string) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  async function handleSubmit() {
    if (!date) {
      setError("Please pick a date");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blocked-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateISO: date,
          wholeDay,
          startMinutes: wholeDay ? null : toMinutes(startTime),
          endMinutes: wholeDay ? null : toMinutes(endTime),
          reason,
        }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      setDate("");
      setReason("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-grey-light p-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="admin-input" />
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => setWholeDay(true)}
            className={cn("px-3 py-2.5 text-xs font-semibold uppercase", wholeDay ? "bg-ink text-white" : "border border-border")}
          >
            Whole Day
          </button>
          <button
            onClick={() => setWholeDay(false)}
            className={cn("px-3 py-2.5 text-xs font-semibold uppercase", !wholeDay ? "bg-ink text-white" : "border border-border")}
          >
            Time Range
          </button>
        </div>

        {!wholeDay && (
          <>
            <label className="block">
              <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">From</span>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="admin-input" />
            </label>
            <label className="block">
              <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">To</span>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="admin-input" />
            </label>
          </>
        )}

        <label className="block">
          <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Reason (optional)</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Crew unavailable" className="admin-input" />
        </label>

        <Button variant="dark" disabled={loading || !date} onClick={handleSubmit}>
          {loading ? "Blocking..." : "Block"}
        </Button>
      </div>
      {error && <p className="mt-3 text-sm text-accent">{error}</p>}

      <style jsx>{`
        :global(.admin-input) {
          border: 1px solid var(--color-border);
          background: white;
          padding: 0.65rem 0.85rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.admin-input:focus) {
          border-color: var(--color-ink);
        }
      `}</style>
    </div>
  );
}
