"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { toDateKey, fromDateKey } from "@/lib/date";
import { cn } from "@/lib/utils";

type DayAvailability = { remaining: number; totalPossible: number };
type Start = { startMinutes: number; label: string; endLabel: string };

export function StepDateTime({ onTimeSelected }: { onTimeSelected: () => void }) {
  const { dateISO, serviceSlug, packageTier, startMinutes, startLabel, endLabel, set } = useBookingStore();
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({});
  const [starts, setStarts] = useState<Start[] | null>(null);
  const [loadingStarts, setLoadingStarts] = useState(false);
  const [justPicked, setJustPicked] = useState<number | null>(null);

  useEffect(() => {
    if (!serviceSlug) return;
    fetch(`/api/availability/week?service=${serviceSlug}&tier=${packageTier}`)
      .then((res) => res.json())
      .then((data) => setAvailability(data.days || {}));
  }, [serviceSlug, packageTier]);

  useEffect(() => {
    if (!dateISO || !serviceSlug) return;
    setLoadingStarts(true);
    setStarts(null);
    fetch(`/api/availability?service=${serviceSlug}&tier=${packageTier}&date=${dateISO}`)
      .then((res) => res.json())
      .then((data) => setStarts(data.starts))
      .finally(() => setLoadingStarts(false));
  }, [dateISO, serviceSlug, packageTier]);

  const days = useMemo(() => {
    const list: { date: Date; iso: string }[] = [];
    for (let i = 0; i <= 21; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      list.push({ date: d, iso: toDateKey(d) });
    }
    return list;
  }, []);

  function pickDate(iso: string) {
    set("dateISO", iso);
    set("startMinutes", null);
    set("startLabel", null);
    set("endLabel", null);
  }

  function pickStart(start: Start) {
    set("startMinutes", start.startMinutes);
    set("startLabel", start.label);
    set("endLabel", start.endLabel);
    setJustPicked(start.startMinutes);
    window.setTimeout(() => onTimeSelected(), 320);
  }

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">SELECT DATE &amp; TIME</h2>
      <p className="mt-2 text-grey">Choose an available date, then pick your start time.</p>

      <div className="no-scrollbar mt-8 flex gap-3 overflow-x-auto pb-2">
        {days.map(({ date, iso }, i) => {
          const active = dateISO === iso;
          const avail = availability[iso];
          const soldOut = avail && avail.remaining === 0;
          const fillingFast =
            avail && avail.remaining > 0 && avail.totalPossible > 0 && avail.remaining / avail.totalPossible <= 0.25;

          const dayLabel =
            i === 0 ? "TODAY" : i === 1 ? "TMRW" : date.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();

          return (
            <button
              key={iso}
              disabled={soldOut}
              onClick={() => pickDate(iso)}
              className={cn(
                "relative flex w-16 shrink-0 flex-col items-center gap-1 border-2 py-3 transition-colors sm:w-20 sm:py-4",
                active ? "border-ink bg-ink text-white" : "border-border hover:border-ink/40",
                soldOut && "cursor-not-allowed opacity-40",
              )}
            >
              {fillingFast && !active && (
                <span className="font-label absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-accent px-1.5 py-0.5 text-[8px] font-bold uppercase tracked-tight text-white">
                  Filling Fast
                </span>
              )}
              <span className="font-label text-[9px] font-semibold uppercase tracked-tight opacity-60 sm:text-[10px]">
                {dayLabel}
              </span>
              <span className="font-display text-2xl leading-none sm:text-3xl">{date.getDate()}</span>
              <span className="font-label text-[9px] font-semibold uppercase tracked-tight opacity-60 sm:text-[10px]">
                {date.toLocaleDateString("en-IN", { month: "short" })}
              </span>
              {soldOut && (
                <span className="font-label text-[7px] font-bold uppercase tracked-tight text-accent sm:text-[8px]">
                  Sold Out
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {dateISO && (
          <motion.div
            key={dateISO}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-8 border-t border-border pt-8"
          >
            <p className="font-label text-xs font-semibold uppercase tracked text-accent">
              Available Starts for{" "}
              {fromDateKey(dateISO).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>

            {loadingStarts && <p className="mt-4 text-grey">Loading available times...</p>}
            {!loadingStarts && starts && starts.length === 0 && (
              <p className="mt-4 text-grey">No start times available on this date. Please choose another date.</p>
            )}
            {!loadingStarts && starts && starts.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
                {starts.map((st) => {
                  const active = startMinutes === st.startMinutes || justPicked === st.startMinutes;
                  return (
                    <button
                      key={st.startMinutes}
                      onClick={() => pickStart(st)}
                      className={cn(
                        "flex flex-col items-center gap-1 border-2 py-3 text-sm transition-colors sm:gap-1.5 sm:py-4",
                        active ? "border-ink bg-ink text-white" : "border-border hover:border-ink/40",
                      )}
                    >
                      <Clock className="size-4" />
                      <span className="font-label font-semibold">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {startMinutes != null && (
              <div className="mt-5 bg-grey-light p-4">
                <p className="font-label text-xs font-semibold uppercase tracked text-accent">
                  Estimated Shoot Duration
                </p>
                <p className="mt-1 text-sm text-ink">
                  {startLabel} to approximately {endLabel}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
