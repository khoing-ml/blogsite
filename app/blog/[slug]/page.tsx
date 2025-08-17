import { notFound } from "next/navigation";
import { getBlogPost, listBlogSlugs } from "../../../lib/content";
import MDXContent from "../../../components/MDXComponents";

interface Params { slug: string }

export async function generateStaticParams() {
  const slugs = await listBlogSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = await getBlogPost(params.slug);
  if (!post) return notFound();
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{post.meta.title}</h1>
      <p className="text-sm text-neutral-500">{post.meta.date} • {post.meta.readingTime?.text}</p>
  <MDXContent>{post.content}</MDXContent>
    </article>
  );
}
