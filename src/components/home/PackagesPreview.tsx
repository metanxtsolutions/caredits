import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { tiers } from "@/lib/data/tiers";
import { cn } from "@/lib/utils";

export function PackagesPreview() {
  return (
    <section className="bg-grey-light py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="TWO TIERS. ONE STANDARD OF QUALITY."
          description="Premium adds our full cinematic package, including drone coverage. Pricing varies by city, starting from ₹499."
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:mx-auto md:max-w-3xl">
          {tiers.map((tier, i) => (
            <Reveal key={tier.tier} delay={0.08 * i}>
              <div
                className={cn(
                  "flex h-full flex-col p-8",
                  tier.highlighted ? "bg-ink text-white" : "bg-white text-ink",
                )}
              >
                {tier.highlighted && (
                  <Badge variant="solid" className="mb-4 w-fit">
                    Recommended
                  </Badge>
                )}
                <h3 className="font-display text-4xl">{tier.label}</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", tier.highlighted ? "text-white/50" : "text-grey")}>
                  {tier.blurb}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span className={tier.highlighted ? "text-white/80" : "text-ink/80"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/pricing"
                  variant={tier.highlighted ? "primary" : "dark"}
                  arrow
                  className="mt-8 w-full"
                >
                  See Pricing By Service
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
