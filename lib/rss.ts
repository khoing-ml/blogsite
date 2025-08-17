import { Feed } from 'feed';
import { listBlogPosts, listResearchLog } from './content';

export interface GenerateFeedOptions {
  siteUrl?: string;
  includeResearchLog?: boolean;
  limit?: number;
}

const FALLBACK_SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://facebook.com';

export async function generateFeed(opts: GenerateFeedOptions = {}) {
  const site = (opts.siteUrl || FALLBACK_SITE).replace(/\/$/, '');
  const limit = opts.limit ?? 50;
  const includeResearch = opts.includeResearchLog ?? true;

  const feed = new Feed({
    title: 'ML Journey',
    description: 'Machine Learning Blog & Research Log',
    id: site,
    link: site,
    language: 'en',
    favicon: site + '/favicon.ico',
    copyright: `${new Date().getFullYear()} ML Journey`
  });

  const [posts, weeks] = await Promise.all([
    listBlogPosts(),
    includeResearch ? listResearchLog() : Promise.resolve([])
  ]);

  // Merge items: blog posts first (already date sorted desc), then research weeks.
  const items: Array<{ id: string; link: string; title: string; date: Date; description?: string; }>= [];
  for (const p of posts) {
    items.push({
      id: `${site}/blog/${p.slug}`,
      link: `${site}/blog/${p.slug}`,
      title: p.title,
      date: new Date(p.date),
      description: p.summary
    });
  }
  for (const w of weeks) {
    // w.slug like year/week-N? Build link to root (/) with anchor if desired.
    items.push({
      id: `${site}/#${w.slug}`,
      link: `${site}/#${w.slug}`,
      title: `Research Log – ${w.title || w.slug}`,
      date: new Date(w.date),
      description: w.summary
    });
  }

  items
    .sort((a,b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit)
    .forEach(it => feed.addItem(it));

  return {
    rss: feed.rss2(),
    atom: feed.atom1(),
    json: feed.json1(),
    etagSource: items.slice(0,10).map(i => i.id + i.date.toISOString()).join('|')
  };
}
