import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';
import readingTime from 'reading-time';
import { listNotes } from '../../../lib/content';
import dynamic from 'next/dynamic';
const CopyLinkButton = dynamic(() => import('../../../components/CopyLinkButton'), { ssr: false });

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');

async function getNote(slug: string) {
  const file = path.join(NOTES_DIR, slug + '.mdx');
  const raw = await fs.readFile(file, 'utf-8');
  const { data, content } = matter(raw);
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]] }
    }
  });
  const dateStr = data.date ? (typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().slice(0,10)) : '';
  return { meta: { title: data.title || slug, date: dateStr, summary: data.summary || '', tags: data.tags || [], readingTime: readingTime(content) }, content: mdxContent };
}

export async function generateStaticParams() {
  const files = await fs.readdir(NOTES_DIR);
  return files.filter(f => /\.mdx?$/.test(f)).map(f => ({ slug: f.replace(/\.mdx?$/, '') }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { meta } = await getNote(params.slug);
  return { title: meta.title + ' – Notes' };
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  const note = await getNote(params.slug);
  const all = await listNotes(); // sorted desc by date
  const idx = all.findIndex(n => n.slug === params.slug);
  const newer = idx > 0 ? all[idx - 1] : null; // previous in list = newer
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
          <Link href="/notes" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition">← All Notes</Link>
          {note.meta.tags && note.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.meta.tags.map((t: string) => (
                <span key={t} className="px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 text-[10px] uppercase tracking-wide">{t}</span>
              ))}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight leading-tight">{note.meta.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500">
          {note.meta.date && <time dateTime={note.meta.date}>{note.meta.date}</time>}
          {note.meta.readingTime?.text && <span>• {note.meta.readingTime.text}</span>}
          {note.meta.summary && <span className="hidden sm:inline text-neutral-400">{note.meta.summary}</span>}
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />
      </header>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {note.content}
        </article>
        <aside className="mt-10 lg:mt-0 space-y-6 text-sm">
          {note.meta.summary && (
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm p-4 leading-relaxed">
              <h2 className="text-xs font-semibold tracking-wider uppercase mb-2 text-neutral-500 dark:text-neutral-400">Summary</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs">{note.meta.summary}</p>
            </div>
          )}
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm p-4 space-y-2">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">Meta</h2>
            <ul className="text-neutral-600 dark:text-neutral-400 text-xs space-y-1">
              {note.meta.date && <li><span className="text-neutral-400">Date:</span> {note.meta.date}</li>}
              {note.meta.readingTime?.text && <li><span className="text-neutral-400">Reading:</span> {note.meta.readingTime.text}</li>}
              {note.meta.tags && note.meta.tags.length > 0 && <li><span className="text-neutral-400">Tags:</span> {note.meta.tags.join(', ')}</li>}
            </ul>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm p-4 space-y-3">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">Navigation</h2>
            <div className="flex flex-col gap-2">
              {newer && <Link href={`/notes/${newer.slug}`} className="group text-xs font-medium flex items-start gap-2">← <span className="underline decoration-dotted group-hover:decoration-solid transition underline-offset-2 max-w-[14rem] truncate">{newer.title}</span></Link>}
              {older && <Link href={`/notes/${older.slug}`} className="group text-xs font-medium flex items-start gap-2"><span className="underline decoration-dotted group-hover:decoration-solid transition underline-offset-2 max-w-[14rem] truncate">{older.title}</span> →</Link>}
              {!newer && !older && <p className="text-neutral-400 text-xs">No other notes</p>}
            </div>
          </div>
        </aside>
      </div>
      <footer className="pt-8 border-t border-neutral-200 dark:border-neutral-800 mt-12 flex flex-col sm:flex-row justify-between gap-4 text-xs text-neutral-500">
        <p>Last updated {note.meta.date || '—'}</p>
  <div className="flex gap-3"><CopyLinkButton /></div>
      </footer>
    </div>
  );
}
