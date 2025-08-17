#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'blog');

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
function slugFromFile(fp) {
  const rel = path.relative(contentDir, fp);
  if (rel.startsWith('..')) return '';
  const parts = rel.split(path.sep);
  if (parts[parts.length-1].startsWith('index.')) parts.pop();
  return parts.join('/').replace(/\.mdx?$/, '');
}

const files = await walk(contentDir);
const items = [];
for (const f of files) {
  const raw = await fs.readFile(f, 'utf8');
  const { data, content } = matter(raw);
  if (data.draft) continue;
  const slug = slugFromFile(f);
  if (!slug) continue;
  const date = typeof data.date === 'string' ? data.date : (data.date ? new Date(data.date).toISOString().slice(0,10) : '');
  items.push({
    slug,
    title: data.title || slug,
    tags: data.tags || [],
    summary: data.summary || '',
    date
  });
}
items.sort((a,b) => (a.date < b.date ? 1 : -1));
await fs.writeFile(path.join(process.cwd(), 'public', 'search-index.json'), JSON.stringify(items, null, 2));
console.log('Wrote search-index.json with', items.length, 'entries');
