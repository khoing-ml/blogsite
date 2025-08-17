import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="font-semibold">ML Journey</Link>
      <nav className="flex gap-6 text-sm">
        <Link href="/blog">Blog</Link>
        <Link href="/">Research Log</Link>
        <a href="/feed" className="opacity-70 hover:opacity-100">RSS</a>
      </nav>
    </header>
  );
}
