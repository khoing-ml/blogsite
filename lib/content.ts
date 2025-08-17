import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface PostMeta { slug: string; title: string; date: string; tags?: string[]; summary?: string; readingTime?: { text: string }; [k: string]: any }

async function walk(dir: string): Promise<string[]> {
  const ents = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of ents) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(full));
    else if (e.isFile() && /\.mdx?$/.test(e.name)) files.push(full);
  }
  return files;
}

function slugFromFile(fp: string): string {
  const rel = path.relative(path.join(CONTENT_DIR, 'blog'), fp);
  if (rel.startsWith('..')) return '';
  const parts = rel.split(path.sep);
  if (parts.length > 1 && parts[parts.length -1].toLowerCase().startsWith('index.')) {
    parts.pop();
  }
  return parts.join('/').replace(/\.mdx?$/, '');
}

export async function listBlogPosts(): Promise<PostMeta[]> {
  const blogRoot = path.join(CONTENT_DIR, 'blog');
  try {
    const files = await walk(blogRoot);
    const posts: PostMeta[] = [];
    for (const f of files) {
      const raw = await fs.readFile(f, 'utf-8');
  const { data, content } = matter(raw, { engines: { yaml: s => require('js-yaml').load(s, { schema: require('js-yaml').DEFAULT_SCHEMA }) } });
      if (data.draft) continue;
      const slug = slugFromFile(f);
      if (!slug) continue;
  const dateStr = typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().slice(0,10);
  posts.push({ slug, title: data.title, date: dateStr, tags: data.tags || [], summary: data.summary, readingTime: readingTime(content), ...data });
    }
    return posts.sort((a,b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}

export async function listBlogSlugs(): Promise<string[]> {
  const posts = await listBlogPosts();
  return posts.map(p => p.slug);
}

export async function getBlogPost(slug: string) {
  const base = path.join(CONTENT_DIR, 'blog');
  // Support folder/index.mdx or file.mdx
  const candidates = [
    path.join(base, slug, 'index.mdx'),
    path.join(base, slug + '.mdx')
  ];
  for (const c of candidates) {
    try {
      const raw = await fs.readFile(c, 'utf-8');
  const { data, content } = matter(raw, { engines: { yaml: s => require('js-yaml').load(s, { schema: require('js-yaml').DEFAULT_SCHEMA }) } });
      const { content: mdxContent } = await compileMDX({
        source: content,
        options: {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
          }
        }
      });
  const dateStr = typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().slice(0,10);
  const meta: PostMeta = { slug, title: data.title, date: dateStr, tags: data.tags || [], summary: data.summary, readingTime: readingTime(content), ...data };
      return { meta, content: mdxContent };
    } catch { /* continue */ }
  }
  return null;
}

export async function listResearchLog() {
  const dir = path.join(CONTENT_DIR, 'research-log');
  try {
    const files = (await walk(dir)).filter(f => /week-\d+\.mdx?$/.test(f));
    const entries = await Promise.all(files.map(async f => {
      const raw = await fs.readFile(f, 'utf-8');
      const { data } = matter(raw);
      const slug = path.relative(dir, f).replace(/\.mdx?$/, '');
  const dateStr = typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().slice(0,10);
  return { slug, title: data.title || slug, date: dateStr, week: data.week, year: data.year, summary: data.summary };
    }));
    return entries.sort((a,b) => (a.date < b.date ? 1 : -1));
  } catch { return []; }
}

export async function listAllContent() {
  const [blogPosts, researchLog] = await Promise.all([
    listBlogPosts(),
    listResearchLog()
  ]);
  return { blogPosts, researchLog };
}

// Simple flat listing for notes (non-nested MDX in content/notes)
export async function listNotes() {
  const dir = path.join(CONTENT_DIR, 'notes');
  try {
    const files = await fs.readdir(dir);
    const notes = await Promise.all(files.filter(f => /\.mdx?$/.test(f)).map(async f => {
      const full = path.join(dir, f);
      const raw = await fs.readFile(full, 'utf-8');
      const { data, content } = matter(raw);
      const slug = f.replace(/\.mdx?$/, '');
      const dateStr = typeof data.date === 'string' ? data.date : (data.date ? new Date(data.date).toISOString().slice(0,10) : '');
      return { slug, title: data.title || slug, date: dateStr, summary: data.summary, readingTime: readingTime(content) };
    }));
    return notes.sort((a,b) => (a.date < b.date ? 1 : -1));
  } catch { return []; }
}
