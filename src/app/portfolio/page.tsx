import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { CtaSection } from "@/components/home/CtaSection";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse Car Edits' portfolio of car, bike, luxury vehicle, dealership, commercial and drone automotive content shot across India.",
};

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="PORTFOLIO"
        description="Every category, every angle. Filter by category or search to find exactly the kind of shoot you're picturing."
      />
      <section className="bg-white py-20 md:py-28">
        <Container>
          <PortfolioGrid items={items} />
        </Container>
      </section>
      <CtaSection />
    </>
  );
}
