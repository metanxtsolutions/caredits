import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { BlogPostRow } from "@/components/admin/BlogPostRow";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">BLOG</h1>

      <div className="mt-8">
        <BlogPostForm />
      </div>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {posts.map((post) => (
          <BlogPostRow key={post.id} post={post} />
        ))}
        {posts.length === 0 && <p className="py-8 text-center text-grey">No blog posts yet.</p>}
      </div>
    </div>
  );
}
