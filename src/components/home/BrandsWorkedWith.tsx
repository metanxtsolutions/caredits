import { Container } from "@/components/ui/Container";
import { brandsWorkedWith } from "@/lib/data/testimonials";

export function BrandsWorkedWith() {
  return (
    <section className="border-y border-border bg-white py-14">
      <Container>
        <p className="font-label mb-8 text-center text-xs font-semibold uppercase tracked text-grey">
          Trusted By Dealerships &amp; Brands Across India
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          {brandsWorkedWith.map((brand) => (
            <span
              key={brand}
              className="font-display text-2xl text-ink/30 transition-colors hover:text-ink/60 md:text-3xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
