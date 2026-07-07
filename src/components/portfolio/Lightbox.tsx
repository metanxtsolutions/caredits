"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { PortfolioItem } from "@/lib/data/portfolio";

export function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: PortfolioItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white"
      >
        <X className="size-8" />
      </button>

      <button
        aria-label="Previous"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 text-white/50 hover:text-white md:left-8"
      >
        <ChevronLeft className="size-10" />
      </button>

      <div
        className="w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <PlaceholderMedia
          id={item.id}
          type={item.type}
          className="aspect-video w-full"
        />
        <div className="mt-4 flex items-center justify-between text-white">
          <div>
            <p className="font-label text-xs font-semibold uppercase tracked text-accent">
              {item.category}
            </p>
            <h3 className="font-display mt-1 text-2xl">{item.title}</h3>
          </div>
        </div>
      </div>

      <button
        aria-label="Next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 text-white/50 hover:text-white md:right-8"
      >
        <ChevronRight className="size-10" />
      </button>
    </div>
  );
}
