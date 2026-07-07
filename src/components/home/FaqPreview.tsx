"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { faqs } from "@/lib/data/faqs";
import { cn } from "@/lib/utils";

export function FaqPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 md:py-32">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Questions"
          title="FREQUENTLY ASKED"
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 divide-y divide-border border-y border-border">
          {faqs.slice(0, 6).map((faq, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={faq.question} delay={0.03 * i}>
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
                  style={{ display: "grid" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl text-sm leading-relaxed text-grey">{faq.answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <Button href="/faqs" variant="outline" arrow>
            View All FAQs
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
