import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function BrandStory() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[3fr_2fr] lg:items-center">
          <Reveal>
            <PlaceholderMedia
              id="brand-story"
              label="Behind the scenes: Car Edits crew on location"
              className="aspect-[4/3] w-full"
            />
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="EVERY CAR HAS A STORY. WE MAKE SURE IT'S TOLD WELL."
            />
            <Reveal delay={0.2}>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-grey">
                <p>
                  Car Edits started in Kolkata with a simple observation. The most emotional
                  moment in owning a vehicle, the delivery day, was almost always
                  undocumented beyond a shaky phone video.
                </p>
                <p>
                  Today we work with individual owners, dealerships, automotive brands and car
                  clubs across India, bringing a cinematic, editorial eye to every shoot,
                  whether it&apos;s a single delivery or a full monthly content retainer.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/about" variant="dark" arrow>
                  Learn About Us
                </Button>
                <Button href="/portfolio" variant="outline">
                  View Our Work
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
