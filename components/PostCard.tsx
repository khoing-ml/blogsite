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
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-5 hover:shadow-sm transition">
      <h3 className="text-xl font-semibold mb-1"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p className="text-xs text-neutral-500 mb-2">{post.date}{post.readingTime ? ` • ${post.readingTime.text}`: ''}</p>
      {post.summary && <p className="text-sm mb-3">{post.summary}</p>}
      <div className="flex flex-wrap gap-2">
        {post.tags?.map(t => <Tag key={t} tag={t} />)}
      </div>
    </div>
  );
}
