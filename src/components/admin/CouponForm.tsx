"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CouponForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("");
  const [amountOff, setAmountOff] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          percentOff: percentOff ? Number(percentOff) : null,
          amountOff: amountOff ? Number(amountOff) : null,
          maxUses: maxUses ? Number(maxUses) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setCode("");
      setPercentOff("");
      setAmountOff("");
      setMaxUses("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3 bg-grey-light p-5">
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Code</span>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SAVE10" className="admin-input" />
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">% Off</span>
        <input value={percentOff} onChange={(e) => setPercentOff(e.target.value)} type="number" placeholder="10" className="admin-input w-20" />
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">₹ Off</span>
        <input value={amountOff} onChange={(e) => setAmountOff(e.target.value)} type="number" placeholder="500" className="admin-input w-24" />
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Max Uses</span>
        <input value={maxUses} onChange={(e) => setMaxUses(e.target.value)} type="number" placeholder="100" className="admin-input w-24" />
      </label>
      <Button variant="dark" disabled={loading || code.length < 3} onClick={handleSubmit}>
        {loading ? "Adding..." : "Create Coupon"}
      </Button>
      {error && <p className="w-full text-sm text-accent">{error}</p>}

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
