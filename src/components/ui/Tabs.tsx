"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
}: {
  tabs: { label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={cn(
              "font-label shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold uppercase tracked-tight transition-colors",
              active === i ? "border-accent text-ink" : "border-transparent text-grey hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6">{tabs[active].content}</div>
    </div>
  );
}
