import { listBlogPosts } from "../../lib/content";
import PostCard from "../../components/PostCard";

export const metadata = { title: "Blog" };

export default async function BlogIndex() {
  const posts = await listBlogPosts();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {posts.map(p => <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  );
}
