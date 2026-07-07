import type { PackageTier, Service } from "@/lib/data/services";

/** Single shared crew resource, matches "photographer is occupied" business rule. */
export const BUSINESS_START_MIN = 9 * 60; // 9:00 AM
export const BUSINESS_END_MIN = 19 * 60; // 7:00 PM
export const SLOT_STEP_MIN = 30;
export const LEAD_TIME_MIN = 120; // don't offer same-day starts within the next 2 hours

export function getBlockMinutes(service: Pick<Service, "blockMinutes" | "blockMinutesByTier">, tier: PackageTier) {
  const override = service.blockMinutesByTier?.[tier];
  if (override) return override;
  return service.blockMinutes ?? 0;
}

export function minutesToLabel(minutes: number) {
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${period}`;
}

export function labelToMinutes(label: string) {
  const match = label.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  const mins = Number(match[2]);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + mins;
}

type ExistingBooking = { startTime: Date; endTime: Date };

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Every candidate start time for a given day + required duration that doesn't
 * overlap an existing booking (single shared crew, no double-booking).
 */
export function computeAvailableStarts({
  dayStart,
  blockMinutes,
  existingBookings,
  now,
}: {
  dayStart: Date;
  blockMinutes: number;
  existingBookings: ExistingBooking[];
  now: Date;
}) {
  const isToday = dayStart.toDateString() === now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const results: { startMinutes: number; label: string; endLabel: string }[] = [];

  for (
    let startMin = BUSINESS_START_MIN;
    startMin + blockMinutes <= BUSINESS_END_MIN;
    startMin += SLOT_STEP_MIN
  ) {
    if (isToday && startMin - nowMinutes < LEAD_TIME_MIN) continue;

    const candidateStart = new Date(dayStart);
    candidateStart.setMinutes(startMin);
    const candidateEnd = new Date(candidateStart);
    candidateEnd.setMinutes(candidateStart.getMinutes() + blockMinutes);

    const isBusy = existingBookings.some((b) =>
      overlaps(candidateStart, candidateEnd, b.startTime, b.endTime),
    );

    if (!isBusy) {
      results.push({
        startMinutes: startMin,
        label: minutesToLabel(startMin),
        endLabel: minutesToLabel(startMin + blockMinutes),
      });
    }
  }

  return results;
}

export function isStartTimeAvailable({
  dayStart,
  startMinutes,
  blockMinutes,
  existingBookings,
  now,
}: {
  dayStart: Date;
  startMinutes: number;
  blockMinutes: number;
  existingBookings: ExistingBooking[];
  now: Date;
}) {
  const candidateStart = new Date(dayStart);
  candidateStart.setMinutes(startMinutes);
  const candidateEnd = new Date(candidateStart);
  candidateEnd.setMinutes(candidateStart.getMinutes() + blockMinutes);

  if (candidateStart.getTime() - now.getTime() < LEAD_TIME_MIN * 60 * 1000 && candidateStart.toDateString() === now.toDateString()) {
    return false;
  }

  return !existingBookings.some((b) => overlaps(candidateStart, candidateEnd, b.startTime, b.endTime));
}
