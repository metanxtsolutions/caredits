import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/faqs/FaqAccordion";
import { CtaSection } from "@/components/home/CtaSection";
import { faqs } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about booking, pricing, scheduling, locations and payments for Car Edits automotive shoots.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="FREQUENTLY ASKED"
        description="Everything you need to know before booking. Can't find your answer? Reach out on WhatsApp or email."
      />
      <section className="bg-white py-20 md:py-28">
        <Container className="max-w-4xl">
          <FaqAccordion items={faqs} />
        </Container>
      </section>
      <CtaSection />
    </>
  );
}
