"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { toDateKey, fromDateKey } from "@/lib/date";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Start = { startMinutes: number; label: string; endLabel: string };

export function RescheduleWidget({
  bookingId,
  serviceSlug,
  tier,
  onClose,
}: {
  bookingId: string;
  serviceSlug: string;
  tier: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [starts, setStarts] = useState<Start[] | null>(null);
  const [loadingStarts, setLoadingStarts] = useState(false);
  const [selected, setSelected] = useState<Start | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => {
    const list: { date: Date; iso: string }[] = [];
    for (let i = 0; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      list.push({ date: d, iso: toDateKey(d) });
    }
    return list;
  }, []);

  useEffect(() => {
    if (!dateISO) return;
    setLoadingStarts(true);
    setSelected(null);
    fetch(`/api/availability?service=${serviceSlug}&tier=${tier}&date=${dateISO}`)
      .then((res) => res.json())
      .then((data) => setStarts(data.starts))
      .finally(() => setLoadingStarts(false));
  }, [dateISO, serviceSlug, tier]);

  async function handleConfirm() {
    if (!dateISO || !selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateISO, startMinutes: selected.startMinutes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 border border-border p-5">
      <p className="font-label text-xs font-semibold uppercase tracked text-accent">Pick a new date</p>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-2">
        {days.map(({ date, iso }, i) => {
          const active = dateISO === iso;
          const dayLabel =
            i === 0 ? "TODAY" : i === 1 ? "TMRW" : date.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();
          return (
            <button
              key={iso}
              onClick={() => setDateISO(iso)}
              className={cn(
                "flex w-14 shrink-0 flex-col items-center gap-0.5 border-2 py-2 text-xs transition-colors",
                active ? "border-ink bg-ink text-white" : "border-border hover:border-ink/40",
              )}
            >
              <span className="font-label text-[8px] font-semibold uppercase opacity-60">{dayLabel}</span>
              <span className="font-display text-lg leading-none">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      {dateISO && (
        <div className="mt-4">
          <p className="font-label text-xs font-semibold uppercase tracked text-accent">
            Available starts for{" "}
            {fromDateKey(dateISO).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {loadingStarts && <p className="mt-3 text-sm text-grey">Loading...</p>}
          {!loadingStarts && starts && starts.length === 0 && (
            <p className="mt-3 text-sm text-grey">No start times available on this date.</p>
          )}
          {!loadingStarts && starts && starts.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {starts.map((st) => (
                <button
                  key={st.startMinutes}
                  onClick={() => setSelected(st)}
                  className={cn(
                    "flex flex-col items-center gap-1 border-2 py-2.5 text-xs transition-colors",
                    selected?.startMinutes === st.startMinutes ? "border-ink bg-ink text-white" : "border-border hover:border-ink/40",
                  )}
                >
                  <Clock className="size-3.5" />
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-accent">{error}</p>}

      <div className="mt-5 flex gap-3">
        <Button variant="primary" disabled={!selected || submitting} onClick={handleConfirm}>
          {submitting ? "Confirming..." : "Confirm New Time"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
