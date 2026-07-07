import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { howItWorks } from "@/lib/data/stats";

export function HowItWorks() {
  return (
    <section className="bg-ink py-24 text-white md:py-32">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="BOOK IN UNDER TWO MINUTES"
          description="Four simple steps stand between you and a cinematic shoot."
          dark
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4 bg-white/10">
          {howItWorks.map((step, i) => (
            <Reveal key={step.step} delay={0.08 * i} className="bg-ink p-8">
              <span className="font-display text-6xl text-accent">{step.step}</span>
              <h3 className="font-label mt-6 text-lg font-bold uppercase tracked-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{step.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-12 flex justify-center">
          <Button href="/book" size="lg" variant="primary" arrow>
            Book Your Shoot
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
