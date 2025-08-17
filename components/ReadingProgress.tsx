"use client";
import React, { useEffect, useState } from 'react';

export default function ReadingProgress({ targetId = 'article-root' }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const el = document.getElementById(targetId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY - (el.offsetTop - 0);
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(isFinite(pct) ? pct : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [targetId]);
  return (
    <div className="fixed top-0 left-0 right-0 h-0 pointer-events-none z-[60]">
      <div className="h-0.5 bg-[hsl(var(--accent)/0.15)]">
        <div style={{ width: progress + '%' }} className="h-full bg-[hsl(var(--accent))] transition-[width] duration-150" />
      </div>
    </div>
  );
}
