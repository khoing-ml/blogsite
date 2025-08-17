# ML Blog & Research Journey

Purpose: A personal platform to publish ML blog posts, reading notes, research logs, project write‑ups, and a narrative of your journey from undergrad to PhD.

## High-Level Goals

- Fast, static-friendly site (Next.js App Router + MDX)
- Clean content taxonomy: blog / notes / research-log / projects / about
- Reproducible ML/DS experiments via notebooks -> MDX pipeline
- Easy tagging, full‑text search (client-side Lunr) & RSS feed
- Weekly research log & timeline component
- Future-ready for interactive demos (Pyodide / WebAssembly / WASM runners) – placeholders added

## Directory Structure

```
.
├── app/                  # Next.js app router pages & routes
│   ├── layout.tsx
│   ├── page.tsx          # Landing page
│   ├── blog/
│   │   ├── page.tsx      # Blog index
│   │   └── [slug]/page.tsx
│   ├── api/search/route.ts  # JSON search index
│   └── feed/route.ts     # RSS/Atom feed
├── components/           # UI components (cards, timeline, header, MDX)
├── content/              # Raw authored content (MDX + assets)
│   ├── blog/
│   ├── notes/
│   └── research-log/
├── lib/                  # Content loading, MDX, search, rss helpers
├── notebooks/            # Source .ipynb notebooks (never edited after publish)
├── scripts/              # Automation scripts (convert notebooks -> MDX)
├── styles/               # Global styles (Tailwind + custom CSS)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.cjs
├── postcss.config.cjs
├── requirements.txt      # Python deps for conversion (optional env)
└── README.md
```

## Content Conventions

MDX files live under `content/` with frontmatter:

```md
---
title: "Building an Intuition for Attention"
date: 2025-08-17
tags: [transformers, attention, deep-learning]
summary: Short abstract used in cards and meta.
draft: false
type: blog
---

Your MDX content...
```

### Slug Rules
- Blog: `content/blog/YYYY-MM-DD-slug/index.mdx`
- Notes: `content/notes/topic-name.mdx`
- Research Log: `content/research-log/YYYY/week-NN.mdx`

`[slug]` is derived automatically. Assets (figures) sit beside `index.mdx`.

## Weekly Research Log
- Create a file: `content/research-log/2025/week-33.mdx`
- Frontmatter includes `week: 33`, `year: 2025`
- Displayed chronologically in a timeline.

## Notebook -> MDX Workflow
Place raw notebooks in `notebooks/`. Run:

```bash
python scripts/convert_notebooks.py notebooks/example.ipynb \
  --out-dir content/blog \
  --tags experimentation,notebook \
  --title "Exploring X"
```

Script generates an `index.mdx` with frontmatter + converted markdown & embedded images.

## Search
On build, we produce a minimal JSON index (title, summary, tags, slug, headings, plain text) consumed by a client-side Lunr instance (lightweight & no server DB required).

## RSS / Atom
`/feed` route emits XML compiled from blog posts (non-drafts only).

## Future Enhancements (Roadmap)
- Add /projects section listing key repos & artifacts
- Add citation export (BibTeX) for posts with academic references
- Add dark mode system preference toggle
- Integrate analytics (privacy-friendly: Plausible / Umami)
- Embed interactive Pyodide code cells
- Add tagging pages (/tag/[tag])
- Add OpenGraph image generation route

## Development

Install JS deps:

```bash
npm install
npm run dev
```

Convert notebook example (optional):

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/convert_notebooks.py --help
```

## Deployment
Static export (where feasible) or deploy to Vercel. The dynamic search API is static-friendly because it serializes content at build time.

## Philosophy
Keep raw research (logs, rough notes) separate from polished blog posts. Iterate quickly, then promote high-value log entries into refined articles.

---
Happy building – adapt as your workflow evolves.
