/** Local-timezone-safe date key, e.g. "2026-07-10". Avoids the UTC-shift bug of toISOString(). */
export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parses a "YYYY-MM-DD" key as local midnight, not UTC midnight. */
export function fromDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Parses a "09:00 AM" style label into minutes since midnight. */
export function parseTimeLabel(label: string) {
  const match = label.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

export function isSameLocalDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b);
}
