import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/pricing",
    "/gallery",
    "/reviews",
    "/faqs",
    "/contact",
    "/blog",
    "/book",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/cancellation-policy",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${siteConfig.url}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const posts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  const blogRoutes = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
