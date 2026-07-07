"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function WishlistButton({
  serviceSlug,
  initialWishlisted,
}: {
  serviceSlug: string;
  /** Omit when the parent can't determine this without breaking static generation (e.g. ISR pages) — the button self-fetches instead. */
  initialWishlisted?: boolean;
}) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted ?? false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (initialWishlisted !== undefined) return;
    fetch(`/api/wishlist/status?serviceSlug=${serviceSlug}`)
      .then((res) => res.json())
      .then((data) => setWishlisted(data.wishlisted))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  async function handleToggle() {
    const previous = wishlisted;
    setWishlisted(!previous);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?next=/services");
          return;
        }
        throw new Error("Failed");
      }
      startTransition(() => router.refresh());
    } catch {
      setWishlisted(previous);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
        wishlisted ? "border-accent bg-accent/10 text-accent" : "border-border text-grey hover:border-ink hover:text-ink",
      )}
    >
      <Heart className={cn("size-4", wishlisted && "fill-current")} />
    </button>
  );
}
