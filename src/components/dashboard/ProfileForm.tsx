"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ProfileForm({
  initial,
}: {
  initial: { name: string; email: string; phone: string | null; city: string; state: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [city, setCity] = useState(initial.city);
  const [state, setState] = useState(initial.state);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, city, state }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] || "Something went wrong");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md space-y-5">
      <label className="block">
        <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">Full Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
      </label>
      <label className="block">
        <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" />
      </label>
      <label className="block">
        <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">Phone</span>
        <input value={initial.phone || "Not set"} disabled className="input" />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">City</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">State</span>
          <input value={state} onChange={(e) => setState(e.target.value)} className="input" />
        </label>
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}
      {saved && <p className="text-sm text-ink">Profile updated.</p>}

      <Button variant="primary" disabled={loading || name.length < 2} onClick={handleSave}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid var(--color-border);
          background: white;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--color-ink);
        }
        :global(.input:disabled) {
          background: var(--color-grey-light);
          color: var(--color-grey);
        }
      `}</style>
    </div>
  );
}
