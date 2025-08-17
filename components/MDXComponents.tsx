import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client copy button to avoid it being treated as server component
const CopyBtn = dynamic(() => import('./CodeCopyButton'), { ssr: false });

function CodeBlock(props: any) {
  // rehype-pretty-code already produces <pre><code/> so we just enhance wrapper
  const pre = props.children; // <code> element
  const code = typeof pre?.props?.children === 'string' ? pre.props.children.trimEnd() : '';
  const lang = pre?.props?.['data-language'] || pre?.props?.className?.replace('language-', '') || 'text';
  return (
    <div className="group relative my-6 first:mt-0">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <CopyBtn text={code} />
      </div>
  <pre {...props} className={`code-block relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950/95 backdrop-blur overflow-auto text-[13px] leading-relaxed p-4 pr-6 ${props.className || ''}`}
        data-lang={lang}
      >{pre}</pre>
    </div>
  );
}

export const mdxComponents: Record<string, any> = {
  h1: (props: any) => <h1 className="group scroll-mt-28 relative font-bold tracking-tight text-2xl md:text-3xl mt-12 mb-6 flex items-center gap-2 text-black dark:text-black" {...props} />,
  pre: (props: any) => <CodeBlock {...props} />,
  h2: (props: any) => <h2 className="group scroll-mt-24 relative font-semibold tracking-tight text-xl mt-10 mb-4 flex items-center gap-2 text-black dark:text-black" {...props} />,
  h3: (props: any) => <h3 className="group scroll-mt-24 relative font-semibold tracking-tight text-lg mt-8 mb-3 flex items-center gap-2 text-black dark:text-black" {...props} />,
  a: (props: any) => <a className="text-[hsl(var(--accent))] hover:underline underline-offset-2" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-2 border-[hsl(var(--accent))] pl-4 italic text-neutral-600 dark:text-neutral-400" {...props} />
};

export default function MDXContent({ children }: { children: React.ReactNode }) {
  return <div className="prose prose-neutral dark:prose-invert max-w-none">{children}</div>;
}
