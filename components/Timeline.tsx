interface Entry { slug: string; title: string; date: string; week?: number; year?: number; summary?: string }

export default function Timeline({ entries }: { entries: Entry[] }) {
  return (
    <ol className="relative border-l border-neutral-300 dark:border-neutral-700 ml-2">
      {entries.map(e => (
        <li key={e.slug} className="ml-4 mb-6">
          <div className="absolute -left-2 w-3 h-3 rounded-full bg-[hsl(var(--accent))]" />
          <div className="text-xs text-neutral-500 mb-1">{e.date}</div>
          <div className="font-medium">{e.title}</div>
          {e.summary && <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-400">{e.summary}</p>}
        </li>
      ))}
    </ol>
  );
}
