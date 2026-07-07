import { InstagramIcon } from "@/components/ui/SocialIcons";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

const posts = ["ig1", "ig2", "ig3", "ig4", "ig5", "ig6"];

export function InstagramFeed() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="@careditskolkata"
            title="FOLLOW ALONG ON INSTAGRAM"
            description="Reels, behind-the-scenes and every delivery day, posted first."
          />
          <Reveal delay={0.2}>
            <Button
              href={siteConfig.social.instagram}
              variant="outline"
              arrow
              className="shrink-0"
            >
              <InstagramIcon className="size-4" /> Follow Us
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((id, i) => (
            <Reveal key={id} delay={0.04 * i}>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <PlaceholderMedia id={id} type={i % 2 === 0 ? "video" : "photo"} className="aspect-square w-full" />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
