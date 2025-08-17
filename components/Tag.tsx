export default function Tag({ tag }: { tag: string }) {
  return <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">{tag}</span>;
}
