import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export async function PortfolioPreview() {
  const preview = await prisma.portfolioItem.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 7,
  });

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our Work"
            title="A GLIMPSE INTO THE PORTFOLIO"
            description="Cars, bikes, dealerships, drone films and more. Every frame shot on brief."
          />
          <Reveal delay={0.2}>
            <Button href="/portfolio" variant="outline" arrow className="shrink-0">
              View Full Portfolio
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[180px]">
          {preview.map((item, i) => {
            const spanClass =
              i === 0
                ? "col-span-2 row-span-2"
                : i === 3
                  ? "col-span-2 md:row-span-2"
                  : "col-span-1";
            return (
              <Reveal key={item.id} delay={0.04 * i} className={spanClass}>
                <PlaceholderMedia
                  id={item.id}
                  type={item.type as "photo" | "video"}
                  label={item.title}
                  className="h-full min-h-[140px] w-full"
                />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
