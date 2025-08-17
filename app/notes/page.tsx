import { listNotes } from '../../lib/content';
import NotesBrowser from './NotesBrowser';

export const metadata = { title: 'Notes – ML Journey' };

export default async function NotesPage() {
  const notes = await listNotes();
  return (
    <div className="space-y-12">
      <header className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 px-4 py-1 text-xs font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]" /> Notes
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Notes</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-prose leading-relaxed">
          Compact, evolving artifacts captured while studying papers, implementing ideas, or revisiting fundamentals.
          They favor clarity over polish and are periodically revised as understanding deepens.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <Stat label="Total" value={notes.length} />
          <Stat label="Recent Month" value={notes.filter(n => n.date && n.date.slice(0,7) === new Date().toISOString().slice(0,7)).length} />
          <Stat label="With Summary" value={notes.filter(n => !!n.summary).length} />
          <Stat label="Avg Length" value={'—'} />
        </div>
      </header>
      <NotesBrowser notes={notes as any} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm p-3 flex flex-col">
      <span className="text-base font-semibold tracking-tight">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">{label}</span>
    </div>
  );
}
