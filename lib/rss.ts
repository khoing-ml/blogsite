import { Feed } from 'feed';
import { listBlogPosts } from './content';

const SITE_URL = 'https://example.com'; // Update later

export async function generateFeed() {
  const feed = new Feed({
    title: 'ML Journey',
    description: 'Machine Learning Blog & Research Log',
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    favicon: SITE_URL + '/favicon.ico',
    copyright: `${new Date().getFullYear()} ML Journey`
  });
  const posts = await listBlogPosts();
  posts.slice(0, 50).forEach(p => {
    feed.addItem({
      id: SITE_URL + '/blog/' + p.slug,
      link: SITE_URL + '/blog/' + p.slug,
      title: p.title,
      date: new Date(p.date),
      description: p.summary
    });
  });
  return feed.rss2();
}
