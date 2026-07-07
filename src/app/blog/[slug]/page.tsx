import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { CtaSection } from "@/components/home/CtaSection";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <>
      <PageHero eyebrow={post.category.toUpperCase()} title={post.title.toUpperCase()} />
      <section className="bg-white py-20 md:py-28">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="font-label mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracked-tight text-grey hover:text-ink"
          >
            <ArrowLeft className="size-4" /> Back to Blog
          </Link>

          <p className="mb-8 text-sm text-grey">{formatDate(post.publishedAt)}</p>

          <PlaceholderMedia id={post.slug} className="aspect-video w-full" />

          <div className="prose mt-10 space-y-6">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink/80">
                {para}
              </p>
            ))}
          </div>
        </Container>
      </section>
      <CtaSection />
    </>
  );
}
