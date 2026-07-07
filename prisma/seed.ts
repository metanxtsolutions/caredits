import { PrismaClient } from "@prisma/client";
import { services } from "../src/lib/data/services";
import { portfolioItems } from "../src/lib/data/portfolio";
import { testimonials } from "../src/lib/data/testimonials";
import { blogPosts } from "../src/lib/data/blog";

const prisma = new PrismaClient();

async function main() {
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        shortDescription: s.shortDescription,
        description: s.description,
        features: JSON.stringify(s.features),
        deliverables: JSON.stringify(s.deliverables),
        duration: s.duration,
        blockMinutes: s.blockMinutes,
        blockMinutesByTier: s.blockMinutesByTier ? JSON.stringify(s.blockMinutesByTier) : null,
        pricingByCity: JSON.stringify(s.pricingByCity),
        premiumAddOn: s.premiumAddOn,
        schedulingMode: s.schedulingMode,
        featured: s.featured,
      },
    });
  }

  for (const item of portfolioItems) {
    await prisma.portfolioItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        category: item.category,
        type: item.type,
        aspect: item.aspect,
      },
    });
  }

  // Reviews have no natural unique key, so clear the seeded set before re-inserting
  // to keep re-running this script idempotent (avoids duplicate/inflated review counts).
  await prisma.review.deleteMany({ where: { source: "SITE" } });
  for (const t of testimonials) {
    await prisma.review.create({
      data: {
        name: t.name,
        role: t.role,
        rating: t.rating,
        quote: t.quote,
        vehicle: t.vehicle,
      },
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content.join("\n\n"),
        category: post.category,
        publishedAt: new Date(post.date),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
