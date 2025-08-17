#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Feed } from 'feed';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const RESEARCH_DIR = path.join(process.cwd(), 'content', 'research-log');
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '') || 'https://example.com';

async function walk(dir) {
  let ents = [];
  try { ents = await fs.readdir(dir, { withFileTypes: true }); } catch { return []; }
  const files = [];
  for (const e of ents) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(full));
    else if (e.isFile() && /\.mdx?$/.test(e.name)) files.push(full);
  }
  return files;
}
function blogSlug(fp) {
  const rel = path.relative(BLOG_DIR, fp);
  const parts = rel.split(path.sep);
  if (parts[parts.length-1].startsWith('index.')) parts.pop();
  return parts.join('/').replace(/\.mdx?$/, '');
}

async function loadBlogPosts() {
  const files = await walk(BLOG_DIR);
  const items = [];
  for (const f of files) {
    const raw = await fs.readFile(f, 'utf8');
    const { data, content } = matter(raw);
    if (data.draft) continue;
    const slug = blogSlug(f);
    const date = typeof data.date === 'string' ? data.date : (data.date ? new Date(data.date).toISOString().slice(0,10) : '');
    items.push({ slug, title: data.title || slug, date, summary: data.summary });
  }
  return items.sort((a,b) => (a.date < b.date ? 1 : -1));
}
async function loadResearch() {
  const files = await walk(RESEARCH_DIR);
  const weeks = [];
  for (const f of files) {
    if (!/week-\d+\.mdx?$/.test(f)) continue;
    const raw = await fs.readFile(f, 'utf8');
    const { data } = matter(raw);
    const slug = path.relative(RESEARCH_DIR, f).replace(/\.mdx?$/, '');
    const date = typeof data.date === 'string' ? data.date : (data.date ? new Date(data.date).toISOString().slice(0,10) : '');
    weeks.push({ slug, title: data.title || slug, date, summary: data.summary });
  }
  return weeks.sort((a,b) => (a.date < b.date ? 1 : -1));
}

const [posts, weeks] = await Promise.all([loadBlogPosts(), loadResearch()]);
const feed = new Feed({
  title: 'ML Journey',
  description: 'Machine Learning Blog & Research Log',
  id: SITE,
  link: SITE,
  language: 'en',
  favicon: SITE + '/favicon.ico',
  copyright: `${new Date().getFullYear()} ML Journey`
});

const items = [];
for (const p of posts) items.push({
  id: `${SITE}/blog/${p.slug}`,
  link: `${SITE}/blog/${p.slug}`,
  title: p.title,
  date: new Date(p.date),
  description: p.summary
});
for (const w of weeks) items.push({
  id: `${SITE}/#${w.slug}`,
  link: `${SITE}/#${w.slug}`,
  title: `Research Log – ${w.title}`,
  date: new Date(w.date),
  description: w.summary
});
items.sort((a,b) => (a.date < b.date ? 1 : -1)).slice(0, 50).forEach(it => feed.addItem(it));

await fs.writeFile(path.join(process.cwd(), 'public', 'feed.rss'), feed.rss2(), 'utf8');
await fs.writeFile(path.join(process.cwd(), 'public', 'atom.xml'), feed.atom1(), 'utf8');
await fs.writeFile(path.join(process.cwd(), 'public', 'feed.json'), feed.json1(), 'utf8');
console.log('Generated feeds with', items.length, 'items');
