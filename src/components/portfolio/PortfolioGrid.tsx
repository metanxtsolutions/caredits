"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Lightbox } from "@/components/portfolio/Lightbox";
import { portfolioCategories, portfolioItems, type PortfolioCategory } from "@/lib/data/portfolio";
import { cn } from "@/lib/utils";

export function PortfolioGrid() {
  const [category, setCategory] = useState<PortfolioCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return portfolioItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const activeItem = activeIndex !== null ? filtered[activeIndex] : null;

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          {(["All", ...portfolioCategories] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "font-label px-4 py-2.5 text-xs font-semibold uppercase tracked-tight transition-colors",
                category === cat ? "bg-ink text-white" : "bg-grey-light text-ink hover:bg-ink/10",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-grey" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search portfolio..."
            className="w-full border border-border bg-white py-3 pr-4 pl-11 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-grey">No results found. Try a different filter.</p>
      ) : (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "group mb-4 block w-full break-inside-avoid text-left",
                item.aspect === "portrait" && "aspect-[3/4]",
                item.aspect === "landscape" && "aspect-[4/3]",
                item.aspect === "square" && "aspect-square",
              )}
            >
              <PlaceholderMedia
                id={item.id}
                type={item.type}
                label={item.title}
                className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
      )}

      {activeItem && (
        <Lightbox
          item={activeItem}
          onClose={() => setActiveIndex(null)}
          onPrev={() =>
            setActiveIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null))
          }
          onNext={() => setActiveIndex((i) => (i !== null ? (i + 1) % filtered.length : null))}
        />
      )}
    </div>
  );
}
