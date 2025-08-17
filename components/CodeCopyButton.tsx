"use client";
import React, { useState } from 'react';

export default function CodeCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handle() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }
  return (
    <button
      onClick={handle}
      className="text-[10px] px-2 py-1 rounded-md bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700 transition border border-neutral-700"
      aria-label="Copy code"
      type="button"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
