"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/notes", label: "Notes" },
  { href: "/", label: "Research Log" }
];

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 bg-white/90 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="font-semibold tracking-tight text-sm sm:text-base">Khoi Nguyen</Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-1 text-sm">
            {navItems.map(item => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-3 py-2 rounded-md font-medium transition-colors
                    ${active ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'}
                    hover:text-neutral-900 dark:hover:text-neutral-100`}
                >
                  {/* Text */}
                  <span className="relative z-10 flex items-center gap-2">
                    {active && <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_0_2px_rgba(255,255,255,0.6)] dark:shadow-[0_0_0_2px_rgba(0,0,0,0.4)]" />}
                    {item.label}
                  </span>
                  {/* Background (active solid / hover subtle) */}
                  <span className={`absolute inset-0 rounded-md transition-colors duration-300
                    ${active ? 'bg-[hsl(var(--accent-muted))] dark:bg-[hsl(var(--accent-muted))]/40 ring-1 ring-[hsl(var(--accent)/0.3)]' : 'bg-transparent group-hover:bg-neutral-200/50 dark:group-hover:bg-neutral-700/40'}`} />
                  {/* Hover underline only (not persistent) */}
                  <span className="pointer-events-none absolute left-1/2 -bottom-[3px] h-[2px] w-0 translate-x-[-50%] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:w-2/3" />
                </Link>
              );
            })}
            <a href="/feed" className="group relative px-3 py-2 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              <span className="relative z-10">RSS</span>
              <span className="absolute inset-0 rounded-md transition-all duration-300 bg-transparent group-hover:bg-neutral-200/50 dark:group-hover:bg-neutral-700/40" />
              <span className="pointer-events-none absolute left-1/2 -bottom-[3px] h-[2px] w-0 translate-x-[-50%] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:w-2/3" />
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true"><path fill="currentColor" d="M12 18.5a6.5 6.5 0 0 1 0-13 6.5 6.5 0 0 0 0 13Z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true"><path fill="currentColor" d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 0 0 13Zm0 2a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden px-4 pb-2 pt-1 border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/90 flex flex-wrap gap-4 text-sm">
        {navItems.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`${active ? 'font-medium text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'} hover:text-[hsl(var(--accent))] dark:hover:text-[hsl(var(--accent))]`}>{item.label}</Link>
          );
        })}
  <a href="/feed" className="text-neutral-600 dark:text-neutral-400 hover:text-[hsl(var(--accent))] dark:hover:text-[hsl(var(--accent))]">RSS</a>
      </div>
    </header>
  );
}
