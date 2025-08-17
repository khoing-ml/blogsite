import { NextResponse } from "next/server";
import { generateFeed } from "../../lib/rss";

export async function GET() {
  const xml = await generateFeed();
  return new NextResponse(xml, { headers: { "Content-Type": "application/rss+xml" } });
}
