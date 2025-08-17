"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface Entry { slug: string; title: string; tags: string[]; summary: string; date: string; }

export default function SearchClient() {
  const [data, setData] = useState<Entry[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const res = await fetch(`${base}/search-index.json`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed');
        const json: Entry[] = await res.json();
        if (active) setData(json);
      } catch {
        if (active) setData([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data.slice(0, 30);
    return data.filter(e => (
      e.title.toLowerCase().includes(term) ||
      e.summary.toLowerCase().includes(term) ||
      e.tags.some(t => t.toLowerCase().includes(term))
    ));
  }, [q, data]);

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">Type to filter blog posts. Matching against titles, summaries, and tags.</p>
        <div className="relative max-w-md">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur px-3 py-2 pr-9 text-sm outline-none focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/0.3)] transition"
            autoFocus
            aria-label="Search posts"
          />
          {q && (
            <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition text-xs font-medium" aria-label="Clear search">Clear</button>
          )}
        </div>
      </header>

      {loading && <p className="text-xs text-neutral-500">Loading index…</p>}
      {!loading && filtered.length === 0 && <p className="text-sm text-neutral-500">No matches.</p>}

      <ul className="space-y-4">
        {filtered.map(e => (
          <li key={e.slug} className="group rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 p-4 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:shadow-md">
            <Link href={`/blog/${e.slug}`} className="font-semibold text-sm tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] group-hover:scale-110 transition" />
              {e.title}
            </Link>
            <p className="mt-1 text-[11px] text-neutral-500 flex flex-wrap gap-2 items-center">
              <span>{e.date}</span>
              {e.tags.slice(0,4).map(t => <span key={t} className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] uppercase tracking-wide text-neutral-600 dark:text-neutral-400">{t}</span>)}
            </p>
            {e.summary && <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{e.summary}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
