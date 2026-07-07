"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AddPhotographerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/photographers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setName("");
      setPhone("");
      setEmail("");
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
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="admin-input" />
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Phone</span>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="admin-input" />
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Email (optional)</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="admin-input" />
      </label>
      <Button variant="dark" disabled={loading || name.length < 2 || phone.length < 10} onClick={handleSubmit}>
        {loading ? "Adding..." : "Add Photographer"}
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
