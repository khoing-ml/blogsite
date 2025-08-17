import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Link from 'next/link';

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
  return { meta: { title: data.title || slug, date: data.date || '' }, content: mdxContent };
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
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Link href="/notes" className="text-[11px] font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition">← All Notes</Link>
        <h1 className="text-2xl font-bold tracking-tight">{note.meta.title}</h1>
        {note.meta.date && <p className="text-xs text-neutral-500 dark:text-neutral-500">{note.meta.date}</p>}
        <hr className="border-neutral-200 dark:border-neutral-800" />
      </header>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {note.content}
      </article>
    </div>
  );
}
