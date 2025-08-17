import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'Projects – Khoi Nguyen' };

interface RepoMeta { name: string; description?: string; url: string; topics?: string[]; stars?: number; }

// Placeholder static list; can be swapped for GitHub API fetch via route handler or build-time.
const repos: RepoMeta[] = [
  { name: 'ml-lab-notes', description: 'Structured notes & small experiments for ML fundamentals.', url: 'https://github.com/khoing-ml', topics: ['notes','learning','ml'] },
  { name: 'nn-from-scratch', description: 'Educational neural network layers & training loops in NumPy.', url: 'https://github.com/khoing-ml', topics: ['numpy','education','dl'] },
  { name: 'paper-summaries', description: 'Concise distillations of selected ML papers.', url: 'https://github.com/khoing-ml', topics: ['reading','summary'] }
];

function Tag({ t }: { t: string }) {
  return <span className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-[10px] tracking-wide uppercase text-neutral-600 dark:text-neutral-400">{t}</span>;
}

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm max-w-prose text-neutral-600 dark:text-neutral-300">Selected repositories & learning artifacts. Focus is on clarity, reproducibility, and incremental depth. More on GitHub.</p>
      </header>
      <div className="grid sm:grid-cols-2 gap-5">
        {repos.map(r => (
          <Link key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:shadow-md hover:border-[hsl(var(--accent)/0.4)]">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold tracking-tight text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] group-hover:scale-110 transition" />
                {r.name}
              </h2>
            </div>
            {r.description && <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 flex-1">{r.description}</p>}
            {r.topics && r.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.topics.map(t => <Tag key={t} t={t} />)}
              </div>
            )}
            <span className="mt-3 text-[11px] font-medium text-[hsl(var(--accent))]">View Repo →</span>
          </Link>
        ))}
      </div>
      <p className="text-xs text-neutral-500">Want more context? See my <Link className="font-medium" href="/cv">CV</Link>.</p>
    </div>
  );
}
