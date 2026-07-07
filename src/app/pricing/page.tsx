import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CitySelector } from "@/components/city/CitySelector";
import { PricingTable } from "@/components/pricing/PricingTable";
import { FaqPreview } from "@/components/home/FaqPreview";
import { CtaSection } from "@/components/home/CtaSection";
import { services } from "@/lib/data/services";
import { addOns } from "@/lib/data/addons";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent per-city pricing for automotive photography and video production. Standard and Premium packages starting from ₹499.",
};

export default function PricingPage() {
  const tieredServices = services.filter((s) => s.premiumAddOn !== null);
  const customService = services.find((s) => s.premiumAddOn === null);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="TRANSPARENT PRICING"
        description="No hidden costs. Premium adds our full cinematic package, including drone coverage."
      />

      <section className="bg-white py-16">
        <Container>
          <CitySelector />
        </Container>
      </section>

      <section className="bg-white pb-20 md:pb-28">
        <Container>
          <PricingTable services={tieredServices} />

          {customService && (
            <Reveal className="mt-8">
              <div className="flex flex-col items-start justify-between gap-4 bg-grey-light p-8 sm:flex-row sm:items-center">
                <div>
                  <Badge variant="dark" className="mb-3 w-fit">
                    Scoped to Brief
                  </Badge>
                  <h3 className="font-display text-3xl text-ink">{customService.name}</h3>
                  <p className="mt-2 max-w-lg text-sm text-grey">{customService.description}</p>
                </div>
                <Button href={`/book?service=${customService.slug}`} variant="dark" arrow className="shrink-0">
                  {customService.ctaLabel}
                </Button>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      <section className="bg-grey-light py-20 md:py-28">
        <Container>
          <h2 className="font-display text-4xl text-ink md:text-5xl">ADD-ONS</h2>
          <p className="mt-3 max-w-lg text-grey">
            Extend any package with these optional add-ons at booking.
          </p>
          <div className="mt-10 divide-y divide-border border-y border-border bg-white">
            {addOns.map((addOn) => (
              <div key={addOn.key} className="flex items-center justify-between px-6 py-5">
                <span className="font-label text-sm font-semibold text-ink">{addOn.label}</span>
                <span className="font-display text-2xl text-accent">
                  +₹{addOn.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-grey">Prices shown are exclusive of GST (18%), added at checkout.</p>
        </Container>
      </section>

      <FaqPreview />
      <CtaSection />
    </>
  );
}
