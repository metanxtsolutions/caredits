import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stats } from "@/components/home/Stats";
import { BrandsWorkedWith } from "@/components/home/BrandsWorkedWith";
import { CtaSection } from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Car Edits is a premium automotive photography and cinematic video production agency based in Kolkata, serving clients PAN India.",
};

const values = [
  {
    title: "Cinematic First",
    description: "Every shoot is treated like a film set. Lighting, motion and pacing matter as much as the vehicle.",
  },
  {
    title: "Speed Matters",
    description: "Content loses value the longer it sits unedited. We deliver fast without cutting corners.",
  },
  {
    title: "Built On Trust",
    description: "Transparent pricing, clear timelines, and a team that shows up when it says it will.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="ABOUT CAR EDITS"
        description="A premium automotive photography and cinematic video production agency, based in Kolkata and working PAN India."
      />

      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[3fr_2fr] lg:items-center">
            <Reveal>
              <PlaceholderMedia id="about-crew" label="Car Edits crew on a delivery shoot" className="aspect-[4/3] w-full" />
            </Reveal>
            <div>
              <SectionHeading eyebrow="Who We Are" title="EVERY CAR HAS A STORY" />
              <Reveal delay={0.15}>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-grey">
                  <p>
                    Car Edits was founded on a simple idea. The delivery moment, the single most
                    emotional touchpoint in owning a vehicle, deserved better than a shaky phone
                    video.
                  </p>
                  <p>
                    Since then we&apos;ve worked with individual car and bike owners, dealerships,
                    automotive brands, influencers and car clubs across India, bringing a
                    cinematic, editorial eye to every shoot.
                  </p>
                  <p>
                    Today our team of photographers, videographers and drone pilots deliver
                    everything from single delivery reels to full monthly content retainers for
                    dealership partners nationwide.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <Stats />

      <section className="bg-grey-light py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="What We Believe" title="OUR VALUES" align="center" className="mx-auto" />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={0.08 * i}>
                <div className="h-full bg-white p-8">
                  <span className="font-display text-5xl text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-label mt-6 text-lg font-bold uppercase tracked-tight text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-grey">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <BrandsWorkedWith />
      <CtaSection />
    </>
  );
}
