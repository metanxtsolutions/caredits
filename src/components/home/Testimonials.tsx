import { Star, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { testimonials } from "@/lib/data/testimonials";

export function Testimonials() {
  return (
    <section className="bg-ink py-24 text-white md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Client Stories" title="TRUSTED ACROSS INDIA" dark />
          <Reveal delay={0.2}>
            <Button href="/reviews" variant="outline-light" arrow className="shrink-0">
              Read All Reviews
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.name} delay={0.08 * i}>
              <div className="flex h-full flex-col bg-surface-1 p-8">
                <Quote className="size-8 text-accent" fill="currentColor" />
                <p className="mt-5 flex-1 text-lg leading-relaxed text-white/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="font-label text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
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
  );
}
