import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Automotive photography tips, behind-the-scenes stories and vehicle launch coverage from the Car Edits team.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="THE BLOG"
        description="Automotive content tips, behind-the-scenes stories and launch coverage from the Car Edits team."
      />
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={0.06 * i}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <PlaceholderMedia id={post.slug} className="aspect-[4/3] w-full" />
                  <div className="mt-5">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-label font-semibold uppercase tracked-tight text-accent">
                        {post.category}
                      </span>
                      <span className="text-grey">{formatDate(post.publishedAt)}</span>
                    </div>
                    <h2 className="font-display mt-3 text-3xl leading-tight text-ink">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-grey">{post.excerpt}</p>
                    <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-ink transition-transform group-hover:translate-x-1">
                      Read More
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
