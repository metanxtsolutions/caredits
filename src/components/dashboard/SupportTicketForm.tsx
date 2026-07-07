"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function SupportTicketForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] || "Something went wrong");
      setSubject("");
      setMessage("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 bg-grey-light p-6">
      <label className="block">
        <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">Subject</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What do you need help with?" className="input" />
      </label>
      <label className="block">
        <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Share the details" className="input resize-none" />
      </label>
      {error && <p className="text-sm text-accent">{error}</p>}
      <Button variant="primary" disabled={loading || subject.length < 3 || message.length < 10} onClick={handleSubmit}>
        {loading ? "Sending..." : "Submit Ticket"}
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
      `}</style>
    </div>
  );
}
