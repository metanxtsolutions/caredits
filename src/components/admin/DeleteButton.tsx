"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({ url, confirmMessage }: { url: string; confirmMessage: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    await fetch(url, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-sm text-grey hover:text-accent">
      Delete
    </button>
  );
}
