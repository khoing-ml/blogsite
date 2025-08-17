import { listAllContent } from "../lib/content";
import PostCard from "../components/PostCard";
import Timeline from "../components/Timeline";
import Hero from "../components/Hero";

export default async function Home() {
  const { blogPosts, researchLog } = await listAllContent();
  return (
    <div className="space-y-16">
      <Hero />
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        <div className="space-y-6">
          {blogPosts.slice(0, 5).map(p => <PostCard key={p.slug} post={p} />)}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Research Log</h2>
        <Timeline entries={researchLog.slice(0,5)} />
      </section>
    </div>
  );
}
