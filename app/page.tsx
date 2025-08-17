import { listAllContent } from "../lib/content";
import PostCard from "../components/PostCard";
import Timeline from "../components/Timeline";

export default async function Home() {
  const { blogPosts, researchLog } = await listAllContent();
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="mt-4 leading-relaxed">I'm documenting my journey in machine learning: foundational concepts, papers, experiments, and weekly reflections.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        <div className="space-y-6">
          {blogPosts.slice(0, 5).map(p => <PostCard key={p.slug} post={p} />)}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Research Log</h2>
        <Timeline entries={researchLog.slice(0,5)} />
      </section>
    </div>
  );
}
