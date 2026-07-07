import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { portfolioCategories, portfolioItems } from "@/lib/data/portfolio";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A curated visual gallery of Car Edits' cinematic automotive photography and video production, organised by category.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Lookbook"
        title="GALLERY"
        description="A curated look, organised by category. Visit the Portfolio page for the full searchable archive."
      />
      <div className="bg-ink-deep">
        {portfolioCategories.map((category, i) => {
          const items = portfolioItems.filter((item) => item.category === category);
          if (items.length === 0) return null;
          return (
            <section
              key={category}
              className={i % 2 === 0 ? "bg-ink-deep py-16 md:py-20" : "bg-surface-1 py-16 md:py-20"}
            >
              <Container>
                <Reveal className="mb-8 flex items-end justify-between">
                  <h2 className="font-display text-4xl text-white md:text-5xl">
                    {category.toUpperCase()}
                  </h2>
                  <span className="font-label text-xs font-semibold uppercase tracked text-white/40">
                    {items.length} {items.length === 1 ? "piece" : "pieces"}
                  </span>
                </Reveal>
                <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
                  {items.map((item) => (
                    <PlaceholderMedia
                      key={item.id}
                      id={item.id}
                      type={item.type}
                      label={item.title}
                      className="aspect-[4/3] w-72 shrink-0 md:w-80"
                    />
                  ))}
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section className="bg-white py-24 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-display text-5xl text-ink md:text-6xl">WANT THE FULL ARCHIVE?</h2>
          <p className="mt-4 max-w-lg text-grey">
            Browse, filter and search every shoot we&apos;ve delivered on the full Portfolio page.
          </p>
          <Button href="/portfolio" variant="dark" arrow className="mt-8">
            View Full Portfolio
          </Button>
        </Container>
      </section>
    </>
  );
}
