"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function BlogPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, excerpt, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] || "Something went wrong");
      setTitle("");
      setCategory("");
      setExcerpt("");
      setContent("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 bg-grey-light p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input w-full" />
        </label>
        <label className="block">
          <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Category</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Photography Tips" className="admin-input w-full" />
        </label>
      </div>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Excerpt</span>
        <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="admin-input w-full" />
      </label>
      <label className="block">
        <span className="font-label mb-1.5 block text-xs font-semibold uppercase tracked-tight text-ink">Content</span>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="admin-input w-full resize-none" />
      </label>
      <Button variant="dark" disabled={loading || title.length < 3} onClick={handleSubmit}>
        {loading ? "Publishing..." : "Publish Post"}
      </Button>
      {error && <p className="text-sm text-accent">{error}</p>}

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
