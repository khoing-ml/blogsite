import { listBlogPosts } from './content';

export async function buildSearchIndex() {
  const posts = await listBlogPosts();
  return posts.map(p => ({
    slug: p.slug,
    title: p.title,
    tags: p.tags || [],
    summary: p.summary || '',
    date: p.date
  }));
}
