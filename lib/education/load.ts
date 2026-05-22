import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';

const ROOT = path.join(process.cwd(), 'content/education');

export interface ArticleMeta {
  slug: string;
  title: string;
  category: string;
  order: number;
  updated: string;
  draft: boolean;
}

export interface LoadedArticle {
  meta: ArticleMeta;
  content: React.ReactNode;
}

interface RawFrontmatter {
  slug?: string;
  title?: string;
  category?: string;
  order?: number;
  updated?: string | Date;
  draft?: boolean;
}

function formatUpdated(v: string | Date | undefined): string {
  if (!v) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  // Some YAML parsers normalize ISO dates to Date — defensive coerce.
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  return String(v);
}

function parseFrontmatter(raw: string, fileName: string): ArticleMeta {
  const { data } = matter(raw);
  const d = data as RawFrontmatter;
  const slug = d.slug ?? fileName.replace(/\.mdx$/, '');
  if (!d.title) throw new Error(`article ${fileName}: missing title`);
  if (!d.category) throw new Error(`article ${fileName}: missing category`);
  if (!d.updated) throw new Error(`article ${fileName}: missing updated`);
  return {
    slug,
    title: d.title,
    category: d.category,
    order: d.order ?? 99,
    updated: formatUpdated(d.updated),
    draft: d.draft ?? false,
  };
}

export async function listArticles(): Promise<ArticleMeta[]> {
  const files = (await fs.readdir(ROOT)).filter((f) => f.endsWith('.mdx'));
  const metas = await Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(path.join(ROOT, f), 'utf8');
      return parseFrontmatter(raw, f);
    }),
  );
  return metas.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.order - b.order;
  });
}

export async function loadArticle(slug: string): Promise<LoadedArticle | null> {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, '');
  if (!safeSlug || safeSlug !== slug) return null;
  const filePath = path.join(ROOT, `${safeSlug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
  const meta = parseFrontmatter(raw, `${safeSlug}.mdx`);
  const { content: source } = matter(raw);
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: false },
  });
  return { meta, content };
}
