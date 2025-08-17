#!/usr/bin/env python
"""Convert Jupyter notebooks to MDX blog post skeletons with frontmatter.

Usage:
  python scripts/convert_notebooks.py notebooks/example.ipynb --out-dir content/blog \
    --title "My Experiment" --tags experiment,notebook
"""
from __future__ import annotations
import argparse, datetime, json, re, shutil, subprocess, tempfile
from pathlib import Path

FRONTMATTER_TEMPLATE = """---\ntitle: {title}\ndate: {date}\ntags: [{tags}]\nsummary: {summary}\ndraft: true\nsource_notebook: {notebook}\n---\n\n"""

def slugify(title: str) -> str:
    s = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
    s = re.sub(r'\s+', '-', s)
    return s

def convert(ipynb: Path, out_dir: Path, title: str, tags: list[str], summary: str):
    date = datetime.date.today().isoformat()
    slug = f"{date}-{slugify(title)}"
    post_dir = out_dir / slug
    post_dir.mkdir(parents=True, exist_ok=True)
    # Use nbconvert to md
    with tempfile.TemporaryDirectory() as td:
        temp_md = Path(td) / 'out.md'
        cmd = ["jupyter", "nbconvert", "--to", "markdown", "--output", str(temp_md), str(ipynb)]
        subprocess.run(cmd, check=True, capture_output=True)
        # nbconvert appends .md
        produced = temp_md.with_suffix('.md')
        text = produced.read_text(encoding='utf-8')
    # Move any generated resources folder
    resources_dir = ipynb.with_suffix('').name + '_files'
    if Path(resources_dir).exists():
        dest_assets = post_dir / resources_dir
        if dest_assets.exists():
            shutil.rmtree(dest_assets)
        shutil.move(resources_dir, dest_assets)
    fm = FRONTMATTER_TEMPLATE.format(title=title, date=date, tags=', '.join(tags), summary=summary or 'Notebook conversion', notebook=str(ipynb))
    # Simple cleanup: convert fenced code blocks to preserve language markers.
    mdx = fm + text
    (post_dir / 'index.mdx').write_text(mdx, encoding='utf-8')
    print(f"Created {post_dir / 'index.mdx'}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('notebook', type=Path)
    ap.add_argument('--out-dir', type=Path, default=Path('content/blog'))
    ap.add_argument('--title', required=True)
    ap.add_argument('--tags', default='notebook')
    ap.add_argument('--summary', default='')
    args = ap.parse_args()
    tags = [t.strip() for t in args.tags.split(',') if t.strip()]
    convert(args.notebook, args.out_dir, args.title, tags, args.summary)

if __name__ == '__main__':
    main()
