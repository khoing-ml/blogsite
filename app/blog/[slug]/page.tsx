import { notFound } from "next/navigation";
import { getBlogPost, listBlogSlugs, listBlogPosts } from "../../../lib/content";
import MDXContent from "../../../components/MDXComponents";
import Link from 'next/link';
import dynamic from 'next/dynamic';
const CopyLinkButton = dynamic(() => import('../../../components/CopyLinkButton'), { ssr: false });
const ReadingProgress = dynamic(() => import('../../../components/ReadingProgress'), { ssr: false });

interface Params { slug: string }

export async function generateStaticParams() {
  const slugs = await listBlogSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = await getBlogPost(params.slug);
  if (!post) return notFound();
  const all = await listBlogPosts();
  const idx = all.findIndex(p => p.slug === params.slug);
  const newer = idx > 0 ? all[idx - 1] : null; // previous in sorted desc list
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const headings = (post.meta as any).headings || [];

  return (
  <div className="relative space-y-12 w-full px-4 sm:px-6 lg:px-10 xl:px-16 xl:pr-[0px]">
      <ReadingProgress />
  <div className="flex flex-col gap-10">
        <div className="flex-1 min-w-0 space-y-10">
          <header className="space-y-6 relative">
            <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 relative">
              <Link href="/blog" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition">← All Posts</Link>
              {post.meta.tags && post.meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.meta.tags.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-900/60 backdrop-blur text-[10px] uppercase tracking-wide">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {post.meta.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500 relative">
              <time dateTime={post.meta.date}>{post.meta.date}</time>
              {post.meta.readingTime?.text && <span>• {post.meta.readingTime.text}</span>}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />
          </header>
          <article id="article-root" className="prose prose-neutral dark:prose-invert max-w-[90ch] xl:max-w-[100ch] 2xl:max-w-[105ch]">
            <MDXContent>{post.content}</MDXContent>
          </article>
          <footer className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between gap-4 text-xs text-neutral-500">
            <p>Published {post.meta.date}</p>
            <div className="flex gap-3"><CopyLinkButton /></div>
          </footer>
        </div>
      </div>
      {/* Right rail (second sidebar) */}
      <div className="hidden xl:block fixed top-0 right-0 h-full w-[300px] pr-4 pointer-events-none">
        <div className="h-full flex flex-col pt-24 pb-10 overflow-hidden">
          <div className="flex-1 overflow-auto pointer-events-auto">
            <div className="pl-2 border-l border-neutral-200 dark:border-neutral-800 space-y-6 ml-2">
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-sm p-4 space-y-5 shadow-sm">
                {post.meta.summary && (
                  <section className="space-y-2">
                    <h2 className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">Summary</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">{post.meta.summary}</p>
                  </section>
                )}
                <section className="space-y-2">
                  <h2 className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">Meta</h2>
                  <ul className="text-neutral-600 dark:text-neutral-400 text-[11px] space-y-1">
                    <li><span className="text-neutral-400">Date:</span> {post.meta.date}</li>
                    {post.meta.readingTime?.text && <li><span className="text-neutral-400">Reading:</span> {post.meta.readingTime.text}</li>}
                    {post.meta.tags && post.meta.tags.length > 0 && <li><span className="text-neutral-400">Tags:</span> {post.meta.tags.join(', ')}</li>}
                  </ul>
                </section>
                {headings.length > 0 && (
                  <section className="space-y-2">
                    <h2 className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">On this page</h2>
                    <ul className="space-y-1 text-[11px] max-h-52 overflow-auto pr-1">
                      {headings.map((h: any) => (
                        <li key={h.id} className={h.level === 2 ? 'pl-2' : h.level === 3 ? 'pl-4' : ''}>
                          <a
                            href={`#${h.id}`}
                            className={`block rounded px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition ${h.level === 1 ? 'font-semibold text-neutral-700 dark:text-neutral-300' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                <section className="space-y-3">
                  <h2 className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">Navigation</h2>
                  <div className="flex flex-col gap-2 text-[11px]">
                    {newer && <Link href={`/blog/${newer.slug}`} className="group flex items-start gap-2">← <span className="underline decoration-dotted group-hover:decoration-solid transition underline-offset-2 truncate">{newer.title}</span></Link>}
                    {older && <Link href={`/blog/${older.slug}`} className="group flex items-start gap-2"><span className="underline decoration-dotted group-hover:decoration-solid transition underline-offset-2 truncate">{older.title}</span> →</Link>}
                    {!newer && !older && <p className="text-neutral-400 text-xs">No other posts</p>}
                  </div>
                </section>
                <div className="pt-2"><CopyLinkButton /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
