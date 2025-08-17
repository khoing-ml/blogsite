import React from 'react';
import Link from 'next/link';
import { PrintButton } from '../../components/PrintButton';

export const metadata = { title: 'CV – Khoi Nguyen' };

interface CVSectionProps { title: string; children: React.ReactNode; }
function CVSection({ title, children }: CVSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]" /> {title}
      </h2>
      {children}
    </section>
  );
}

function Item({ heading, sub, meta, bullets }: { heading: string; sub?: string; meta?: string; bullets?: string[] }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h3 className="font-medium tracking-tight text-sm">{heading}</h3>
        {sub && <span className="text-xs text-neutral-500 dark:text-neutral-400">{sub}</span>}
        {meta && <span className="ml-auto text-[11px] font-medium text-neutral-500 dark:text-neutral-500">{meta}</span>}
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
          {bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}

export default function CVPage() {
  return (
    <div className="space-y-10 print:space-y-6">
      <header className="space-y-2 print:space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Curriculum Vitae</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">Khoi Nguyen – Machine Learning Student & Aspiring Researcher</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-3">
          <span>Email: <a href="mailto:REPLACE_WITH_EMAIL" className="font-medium">khoingmh@gmail.com</a></span>
          <span>GitHub: <a className="font-medium" href="https://github.com/khoing-ml" target="_blank" rel="noopener noreferrer">khoing-ml</a></span>
          <span>LinkedIn: <a className="font-medium" href="https://www.linkedin.com/in/khoing-ml" target="_blank" rel="noopener noreferrer">khoing-ml</a></span>
        </p>
        <div className="flex gap-2 pt-2 print:hidden">
          <PrintButton />
          <a href="/cv.pdf" download className="px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all" aria-label="Download CV as PDF">Download PDF</a>
          <Link href="/projects" className="px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">Projects</Link>
        </div>
      </header>

      <CVSection title="Education">
        <Item heading="B.S. Computer Science" sub="Hanoi University of Science and Technology" meta="2023 – Present" bullets={[
          'Focused coursework: Algorithms, Linear Algebra, Probability, Statistics, Calculus, Optimization',
          'Independent study: PyTorch, Large Language Models, Diffusion Models, Model Finetuning'
        ]} />
      </CVSection>

      <CVSection title="Projects / Experiments">
        <Item heading="Neural Network From Scratch" meta="2025" bullets={[
          'Implemented forward/backward passes for MLP & CNN layers in NumPy',
          'Compared training dynamics vs. PyTorch autograd baselines'
        ]} />
        <Item heading="Paper Summaries Series" meta="2025" bullets={[
          'Weekly distillation of recent ML papers emphasizing methods & limitations'
        ]} />
      </CVSection>

      <CVSection title="Skills">
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          {['Python','PyTorch','NumPy','Pandas','Matplotlib','scikit-learn','Jupyter','Git','Linux','Bash'].map(s => (
            <span key={s} className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">{s}</span>
          ))}
        </div>
      </CVSection>

      <CVSection title="Selected Coursework / Self-Study">
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-neutral-600 dark:text-neutral-300">
          {['Deep Learning','Deep Generative Models', 'Natural Language Processing', 'Probability and Statistics'].map(c => <li key={c}>{c}</li>)}
        </ul>
      </CVSection>

      <CVSection title="Interests">
        <p className="text-xs text-neutral-600 dark:text-neutral-300">Generative Models, Efficient Training, Model Interpretability, Model Compression</p>
      </CVSection>

      <footer className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-500 print:border-0 space-y-1">
        <p>Updated {new Date().toISOString().slice(0,10)} </p>
        
      </footer>
    </div>
  );
}
