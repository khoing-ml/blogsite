"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Research Log" },
  { href: "/blog", label: "Blog" },
  { href: "/notes", label: "Notes" },
  { href: "/projects", label: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/search", label: "Search" },
];

export default function SiteSidebar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [dock, setDock] = useState<'left'|'right'|'floating'>('left');
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');

  useEffect(() => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) document.documentElement.classList.add('dark');
    }
  }, [theme]);

  function toggleTheme() {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
    setTheme(next as any);
  }

  const NavLinks = () => (
    <nav className="mt-6 flex flex-col gap-1 text-sm">
      {navItems.map(item => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href) && item.href !== '/';
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group relative rounded-md px-3 py-2 flex items-center
              transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] will-change-transform
              ${active ? 'bg-[hsl(var(--accent-muted))] dark:bg-[hsl(var(--accent-muted))]/40 text-neutral-900 dark:text-neutral-100 shadow-inner font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/50 hover:-translate-y-0.5 hover:shadow-sm'}`}
          >
            {active && <span className="mr-2 inline-block w-2 h-2 rounded-full bg-[hsl(var(--accent))]" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Floating / Docked panel (desktop) */}
      <div
        className={
          `hidden md:flex flex-col group/sidebar rounded-xl border border-neutral-300 dark:border-neutral-800 backdrop-blur-xl bg-neutral-100/90 dark:bg-neutral-900/85 shadow-lg transition-all duration-300 overflow-hidden
          ${dock === 'floating' ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[80vh]' : ''}
          ${dock === 'right' ? 'fixed top-1/2 right-6 -translate-y-1/2 w-72 h-[80vh]' : ''}
          ${dock === 'left' ? 'fixed top-1/2 left-6 -translate-y-1/2 w-72 h-[80vh]' : ''}`
        }
        style={{ zIndex: 60 }}
      >
        <div className="p-5 pb-3 shrink-0 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/95 dark:bg-neutral-900/90 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <Link href="/" className="font-semibold tracking-tight text-lg accent-text">Khoi Nguyen</Link>
            <div className="flex items-center gap-1">
              <button
                aria-label="Cycle Position"
                onClick={() => setDock(prev => prev === 'floating' ? 'right' : prev === 'right' ? 'left' : 'floating')}
                className="rounded-md p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></svg>
              </button>
              <button
                aria-label="Toggle Theme"
                onClick={toggleTheme}
                className="rounded-md p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true"><path fill="currentColor" d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 0 0 13Zm0 2a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-4 space-y-5">
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 pr-1">
            Documenting the journey into machine learning research: readings, experiments, weekly reflections.
          </p>
          <NavLinks />
        </div>
  <div className="px-5 py-3 text-[10px] text-neutral-500 dark:text-neutral-500 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-neutral-100/95 dark:bg-neutral-900/90">
          <span>© {new Date().getFullYear()} ML Journey</span>
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition">{dock}</span>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 backdrop-blur bg-white/90 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800">
  <button aria-label="Menu" onClick={() => setOpen(o => !o)} className="rounded-md p-2 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <Link href="/" className="font-semibold tracking-tight text-sm accent-text">Khoi Nguyen</Link>
  <button aria-label="Toggle Theme" onClick={toggleTheme} className="rounded-md p-2 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:shadow-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true"><path fill="currentColor" d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 0 0 13Zm0 2a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" /></svg>
        </button>
      </div>
      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-5 flex flex-col">
            <Link href="/" onClick={() => setOpen(false)} className="font-semibold tracking-tight text-base accent-text">Khoi Nguyen</Link>
            <NavLinks />
            <button onClick={toggleTheme} className="mt-auto rounded-md border border-neutral-200 dark:border-neutral-700 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:shadow-sm">
              Toggle Theme
            </button>
          </div>
        </div>
      )}
    </>
  );
}
