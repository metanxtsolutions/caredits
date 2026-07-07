import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";

const videos = [
  { id: "v1", title: "Delivery Reel: Midnight Sedan" },
  { id: "v2", title: "Launch Film: The Reveal" },
  { id: "v3", title: "Road Trip: Coastal Convoy" },
];

export function LatestVideos() {
  return (
    <section className="bg-grey-light py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Latest Cuts"
          title="STRAIGHT FROM THE EDIT BAY"
          description="A few of the most recent cinematic reels and launch films we've delivered."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={0.08 * i}>
              <PlaceholderMedia id={v.id} type="video" label={v.title} className="aspect-[9/16] w-full" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
