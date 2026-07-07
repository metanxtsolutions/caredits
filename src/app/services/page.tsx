import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { CtaSection } from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Car and bike delivery shoots, vehicle launch events, drone cinematography, corporate events and monthly content retainers. Professional automotive production across India.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="SERVICES"
        description="Seven ways to make your vehicle's story worth sharing, from a single delivery shoot to a full monthly retainer."
      />
      <section className="bg-grey-light py-20 md:py-28">
        <Container>
          <ServicesGrid />
        </Container>
      </section>
      <CtaSection />
    </>
  );
}
