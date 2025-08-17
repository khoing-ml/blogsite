import Link from "next/link";
import Tag from "./Tag";

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  readingTime?: { text: string };
}

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <div className="group relative rounded-md border border-neutral-200 dark:border-neutral-800 p-5 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] bg-white/50 dark:bg-neutral-900/40 hover:bg-white dark:hover:bg-neutral-900 hover:shadow-md hover:-translate-y-0.5 will-change-transform">
      <div className="pointer-events-none absolute inset-0 rounded-md ring-0 group-hover:ring-2 ring-[hsl(var(--accent)/0.15)] group-hover:ring-offset-0 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]" />
      <h3 className="text-xl font-semibold mb-1">
        <Link href={`/blog/${post.slug}`} className="relative inline-block">{post.title}</Link>
      </h3>
      <p className="text-xs text-neutral-500 mb-2 flex flex-wrap gap-2 items-center">
        <span>{post.date}</span>
        {post.readingTime && <span className="text-neutral-400">• {post.readingTime.text}</span>}
      </p>
      {post.summary && <p className="text-sm mb-3 text-neutral-600 dark:text-neutral-300 line-clamp-3">{post.summary}</p>}
      <div className="flex flex-wrap gap-2">
        {post.tags?.map(t => <Tag key={t} tag={t} />)}
      </div>
    </div>
  );
}
