import { NextRequest, NextResponse } from "next/server";
import { generateFeed } from "../../lib/rss";

export const revalidate = 3600; // Re-generate feed at most once per hour (ISR for route handlers)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = (searchParams.get('format') || 'rss').toLowerCase();
  const includeResearch = searchParams.get('research') !== 'false';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const { rss, atom, json, etagSource } = await generateFeed({ includeResearchLog: includeResearch, siteUrl });

  const etag = 'W/"' + Buffer.from(etagSource).toString('base64').slice(0, 32) + '"';
  const ifNoneMatch = req.headers.get('if-none-match');
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, { status: 304 });
  }

  let body: string;
  let contentType: string;
  switch (format) {
    case 'atom':
      body = atom; contentType = 'application/atom+xml; charset=utf-8'; break;
    case 'json':
      body = json; contentType = 'application/feed+json; charset=utf-8'; break;
    case 'rss':
    default:
      body = rss; contentType = 'application/rss+xml; charset=utf-8'; break;
  }

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=600',
      'ETag': etag
    }
  });
}
