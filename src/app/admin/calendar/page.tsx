import { prisma } from "@/lib/prisma";
import { BlockedSlotForm } from "@/components/admin/BlockedSlotForm";
import { BlockedSlotRow } from "@/components/admin/BlockedSlotRow";

export default async function AdminCalendarPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const blockedSlots = await prisma.blockedSlot.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">CALENDAR</h1>
      <p className="mt-2 text-grey">Block out dates or time ranges when the crew is unavailable.</p>

      <div className="mt-8">
        <BlockedSlotForm />
      </div>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {blockedSlots.map((slot) => (
          <BlockedSlotRow
            key={slot.id}
            slot={{
              id: slot.id,
              date: slot.date.toISOString(),
              startMinutes: slot.startMinutes,
              endMinutes: slot.endMinutes,
              reason: slot.reason,
            }}
          />
        ))}
        {blockedSlots.length === 0 && <p className="py-8 text-center text-grey">No blocked dates upcoming.</p>}
      </div>
    </div>
  );
}
