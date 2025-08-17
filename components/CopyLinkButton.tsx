"use client";
import React, { useState } from 'react';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  async function handle() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }
  return (
    <button
      onClick={handle}
      className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 hover:border-[hsl(var(--accent))] transition text-xs"
    >{copied ? 'Copied ✓' : 'Copy Link'}</button>
  );
}
