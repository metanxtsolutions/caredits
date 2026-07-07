"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((faq, i) => {
        const open = openIndex === i;
        return (
          <Reveal key={faq.question} delay={0.02 * i}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-label text-base font-semibold text-ink md:text-lg">
                {faq.question}
              </span>
              <Plus
                className={cn(
                  "size-5 shrink-0 text-accent transition-transform duration-300",
                  open && "rotate-45",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl text-sm leading-relaxed text-grey">{faq.answer}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
