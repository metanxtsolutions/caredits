import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-28 md:py-36">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(90% 120% at 50% 100%, #1c1c1c 0%, #0a0a0a 70%)",
        }}
      />
      <Container className="relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <Badge variant="outline" dot>
            Limited Slots Available
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display mt-8 max-w-4xl text-6xl leading-[0.88] text-white sm:text-7xl md:text-8xl">
            READY TO CAPTURE YOUR DRIVE?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-white/60">
            Starts from ₹{siteConfig.startingPrice.toLocaleString("en-IN")}. Book online in
            under two minutes. Pick your slot and we&apos;ll handle the rest.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/book" size="lg" variant="primary" arrow>
              Reserve Your Slot
            </Button>
            <Button href="/pricing" size="lg" variant="outline-light">
              Compare Packages
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
