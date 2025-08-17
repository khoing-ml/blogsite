"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export interface NoteItem { slug: string; title: string; summary?: string; date?: string; readingTime?: { text: string }; }

function groupByMonth(notes: NoteItem[]) {
  const groups: Record<string, NoteItem[]> = {};
  for (const n of notes) {
    const key = n.date ? n.date.slice(0,7) : 'Undated';
    groups[key] ||= [];
    groups[key].push(n);
  }
  return Object.entries(groups)
    .sort((a,b) => (a[0] < b[0] ? 1 : -1))
    .map(([k, list]) => ({ key: k, notes: list }));
}

export default function NotesBrowser({ notes }: { notes: NoteItem[] }) {
  const PAGE_SIZE = 20;
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  // Reset to first page when filter changes
  useEffect(() => { setPage(1); }, [q]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter(n =>
      n.title.toLowerCase().includes(term) ||
      (n.summary || '').toLowerCase().includes(term)
    );
  }, [q, notes]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const ta = a.date ? Date.parse(a.date) : 0;
      const tb = b.date ? Date.parse(b.date) : 0;
      return tb - ta; // newest first
    });
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paged = sorted.slice(start, start + PAGE_SIZE);

  const grouped = useMemo(() => groupByMonth(paged), [paged]);

  function goto(p: number) { setPage(Math.min(Math.max(1, p), totalPages)); }

  return (
    <div className="space-y-10">
      <div className="relative max-w-md">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Filter notes..."
          aria-label="Filter notes"
          className="w-full rounded-md border border-neutral-300 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur px-3 py-2 pr-9 text-sm outline-none focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent)/0.3)] transition"
        />
        {q && <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xs" aria-label="Clear">Clear</button>}
        <p className="mt-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{filtered.length} note{filtered.length === 1 ? '' : 's'} • Page {currentPage} of {totalPages}</p>
      </div>
      {grouped.map(g => (
        <section key={g.key} className="space-y-4">
          <h2 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]" /> {g.key === 'Undated' ? 'Undated' : g.key}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {g.notes.map(n => (
              <Link key={n.slug} href={`/notes/${n.slug}`} className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-2 mb-1">
                  <span className="w-1.5 h-1.5 mt-1 rounded-full bg-[hsl(var(--accent))] group-hover:scale-110 transition" />
                  <h3 className="font-medium text-sm tracking-tight leading-snug">{n.title}</h3>
                </div>
                {n.summary && <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 flex-1">{n.summary}</p>}
                <div className="mt-2 text-[10px] flex items-center gap-2 text-neutral-500 dark:text-neutral-500">
                  {n.date && <span>{n.date}</span>}
                  {n.readingTime?.text && <span>• {n.readingTime.text}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-neutral-500">No notes match your query.</p>
      )}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 items-start">
          <nav className="flex items-center gap-2 text-xs font-medium" aria-label="Pagination">
            <button
              onClick={() => goto(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed bg-white/60 dark:bg-neutral-900/40 hover:border-[hsl(var(--accent))] transition"
            >Prev</button>
            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
              const p = i + 1;
              if (p > 6 && totalPages > 7) {
                return <span key="ellipsis" className="px-1 text-neutral-400">…</span>;
              }
              return (
                <button
                  key={p}
                  onClick={() => goto(p)}
                  className={`min-w-[2rem] h-8 rounded-md border text-sm transition ${p === currentPage ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.15)] font-semibold' : 'border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 hover:border-[hsl(var(--accent))]'}`}
                >{p}</button>
              );
            })}
            {totalPages > 7 && (
              <button
                onClick={() => goto(totalPages)}
                className={`min-w-[2rem] h-8 rounded-md border text-sm transition ${currentPage === totalPages ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.15)] font-semibold' : 'border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 hover:border-[hsl(var(--accent))]'}`}
              >{totalPages}</button>
            )}
            <button
              onClick={() => goto(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed bg-white/60 dark:bg-neutral-900/40 hover:border-[hsl(var(--accent))] transition"
            >Next</button>
          </nav>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Showing {sorted.length === 0 ? 0 : start + 1}–{Math.min(start + PAGE_SIZE, sorted.length)} of {sorted.length}</p>
        </div>
      )}
    </div>
  );
}
