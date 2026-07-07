import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/lib/data/services";

export function FeaturedServices() {
  const featured = services.filter((s) => s.featured);

  return (
    <section className="bg-grey-light py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="SERVICES BUILT FOR EVERY SHOOT"
            description="From a single delivery reel to a full monthly retainer, pick the coverage that fits."
          />
          <Reveal delay={0.2}>
            <Button href="/services" variant="outline" arrow className="shrink-0">
              All Services
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => (
            <Reveal key={service.slug} delay={0.05 * i}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
