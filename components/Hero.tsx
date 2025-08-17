import Image from 'next/image';
import Link from 'next/link';

interface SocialLink { href: string; label: string; icon: 'github' | 'linkedin' }

const socials: SocialLink[] = [
  { href: 'https://github.com/khoing-ml', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/khoing-ml', label: 'LinkedIn', icon: 'linkedin' }
];

function SocialIcon({ name, className }: { name: SocialLink['icon']; className?: string }) {
  if (name === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="currentColor" fillRule="evenodd" d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.6 1.2 1.6 1.2 1 .1.6 1.9 2.9 1.4.1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C18.8 5 19.9 5.3 19.9 5.3c.6 1.5.2 2.7.1 3 .8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.2 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" clipRule="evenodd" />
      </svg>
    );
  }
  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="currentColor" d="M20.45 20.45h-3.56v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.08 1.4-2.08 2.85v5.49H9.46V9h3.42v1.56h.05c.48-.9 1.66-1.84 3.42-1.84 3.66 0 4.34 2.41 4.34 5.55v6.18ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46C0 23.4.6 24 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0Z" />
      </svg>
    );
  }
  return null;
}

export default function Hero() {
  return (
    <section className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="shrink-0 relative w-28 h-28 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
        {/* Adjust scale / objectPosition to fine-tune face centering */}
        <Image
          src="/avatar.jpg"
          alt="Khoi Nguyen"
          fill
          sizes="120px"
          priority
          className="object-cover scale-150"
          style={{ objectPosition: '50% 20%' }}
        />
      </div>
      <div className="space-y-4 max-w-xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khoi Nguyen</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
            Computer Science student focused on Machine Learning, reproducible research workflows, and deliberate learning. I write about concepts I'm studying, paper notes, and weekly progress toward graduate-level research readiness.
          </p>
        </div>
    <div className="flex items-center gap-3 text-sm">
          {socials.map(s => (
            <Link
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:text-[hsl(var(--accent))] dark:hover:text-[hsl(var(--accent))] hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))]/60 hover:shadow-sm"
              title={s.label}
            >
              <SocialIcon name={s.icon} className="w-5 h-5" />
              <span className="sr-only">{s.label}</span>
            </Link>
          ))}
         
        </div>
      </div>
    </section>
  );
}
