"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { portfolioCategories } from "@/lib/data/portfolio";

export function PortfolioItemForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(portfolioCategories[0]);
  const [type, setType] = useState<"photo" | "video">("photo");
  const [aspect, setAspect] = useState<"portrait" | "landscape" | "square">("landscape");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, type, aspect }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      setTitle("");
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
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
          {portfolioCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Type</span>
        <select value={type} onChange={(e) => setType(e.target.value as "photo" | "video")} className="admin-input">
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Aspect</span>
        <select value={aspect} onChange={(e) => setAspect(e.target.value as "portrait" | "landscape" | "square")} className="admin-input">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
          <option value="square">Square</option>
        </select>
      </label>
      <Button variant="dark" disabled={loading || title.length < 2} onClick={handleSubmit}>
        {loading ? "Adding..." : "Add Item"}
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
