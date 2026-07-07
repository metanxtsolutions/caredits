"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatINR } from "@/lib/utils";

const statuses = ["PENDING", "CONFIRMED", "ASSIGNED", "COMPLETED", "CANCELLED", "REJECTED"] as const;

export function AdminBookingRow({
  booking,
  photographers,
  highlighted,
}: {
  booking: {
    id: string;
    bookingRef: string;
    fullName: string;
    city: string;
    startTime: string | null;
    totalAmount: number;
    status: string;
    photographerId: string | null;
    serviceName: string;
  };
  photographers: { id: string; name: string }[];
  highlighted: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [photographerId, setPhotographerId] = useState(booking.photographerId || "");
  const [saving, setSaving] = useState(false);

  async function update(patch: { status?: string; photographerId?: string | null }) {
    setSaving(true);
    try {
      await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className={highlighted ? "bg-grey-light" : undefined}>
      <td className="py-3 pr-4">
        <p className="font-semibold text-ink">{booking.bookingRef}</p>
        <p className="text-xs text-grey">{booking.serviceName}</p>
      </td>
      <td className="py-3 pr-4 text-sm text-ink">{booking.fullName}</td>
      <td className="py-3 pr-4 text-sm text-grey">{booking.city}</td>
      <td className="py-3 pr-4 text-sm text-grey">{booking.startTime ? formatDate(booking.startTime) : "-"}</td>
      <td className="py-3 pr-4 text-sm text-ink">{formatINR(booking.totalAmount)}</td>
      <td className="py-3 pr-4">
        <select
          value={status}
          disabled={saving}
          onChange={(e) => {
            setStatus(e.target.value);
            update({ status: e.target.value });
          }}
          className="border border-border bg-white px-2 py-1.5 text-xs font-semibold"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="py-3">
        <select
          value={photographerId}
          disabled={saving}
          onChange={(e) => {
            setPhotographerId(e.target.value);
            update({ photographerId: e.target.value || null });
          }}
          className="border border-border bg-white px-2 py-1.5 text-xs font-semibold"
        >
          <option value="">Unassigned</option>
          {photographers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}
