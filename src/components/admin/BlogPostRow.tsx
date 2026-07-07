"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";

export function BlogPostRow({
  post,
}: {
  post: { id: string; title: string; category: string; published: boolean };
}) {
  const router = useRouter();

  async function togglePublished() {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="font-semibold text-ink">{post.title}</p>
        <p className="text-sm text-grey">{post.category}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={togglePublished}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold uppercase tracked-tight",
            post.published ? "bg-ink text-white" : "border border-border text-grey",
          )}
        >
          {post.published ? "Published" : "Draft"}
        </button>
        <DeleteButton url={`/api/admin/blog/${post.id}`} confirmMessage={`Delete "${post.title}"?`} />
      </div>
    </div>
  );
}
