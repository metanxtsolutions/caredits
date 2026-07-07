import type { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { testimonials } from "@/lib/data/testimonials";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read what car owners, bike owners, dealerships and brands across India say about working with Car Edits.",
};

const avgRating = (
  testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
).toFixed(1);

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Client Stories"
        title="REVIEWS"
        description="Real feedback from car owners, bike owners, dealerships and brands we've worked with across India."
      />

      <section className="bg-white py-16">
        <Container className="flex flex-wrap items-center gap-10">
          <div className="flex items-center gap-4">
            <span className="font-display text-6xl text-ink">{avgRating}</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 text-accent" fill="currentColor" />
                ))}
              </div>
              <p className="mt-1 text-sm text-grey">Based on {testimonials.length}+ client reviews</p>
            </div>
          </div>
          <Button
            href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi! I'd like to leave a review for Car Edits.")}`}
            variant="outline"
          >
            Write a Review
          </Button>
        </Container>
      </section>

      <section className="bg-grey-light py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={0.05 * i}>
                <div className="flex h-full flex-col bg-white p-8">
                  <Quote className="size-8 text-accent" fill="currentColor" />
                  <p className="mt-5 flex-1 text-lg leading-relaxed text-ink/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <div>
                      <p className="font-label text-sm font-bold text-ink">{t.name}</p>
                      <p className="text-xs text-grey">{t.role}</p>
                      {t.vehicle && (
                        <p className="mt-0.5 text-xs text-accent">{t.vehicle}</p>
                      )}
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="size-4 text-accent" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
