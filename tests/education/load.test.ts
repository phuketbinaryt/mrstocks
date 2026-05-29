import { describe, it, expect, vi } from 'vitest';
import { listArticles, loadArticle } from '@/lib/education/load';

// loadArticle lazily imports the MDX component registry, which transitively
// pulls in the client component tree (StockCard -> server actions -> auth).
// That chain can't resolve in the node test env, and isn't what we're testing
// here — stub the registry so compileMDX gets an (empty) components map.
vi.mock('@/components/education/MdxComponents', () => ({
  mdxComponents: {},
}));

describe('education/load', () => {
  it('lists all launch articles with required frontmatter', async () => {
    const articles = await listArticles();
    expect(articles.length).toBeGreaterThanOrEqual(11);
    const slugs = articles.map((a) => a.slug).sort();
    expect(slugs).toEqual(
      expect.arrayContaining([
        'what-is-mrstocks',
        'states-explained',
        'prior45-zones',
        'reading-a-card',
      ]),
    );
    for (const a of articles) {
      expect(a.title).toBeTruthy();
      expect(a.category).toBeTruthy();
      expect(a.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof a.draft).toBe('boolean');
    }
  });

  it('rejects unsafe slugs', async () => {
    expect(await loadArticle('../secret')).toBeNull();
    expect(await loadArticle('foo/bar')).toBeNull();
    expect(await loadArticle('')).toBeNull();
  });

  it('returns null for unknown slug', async () => {
    expect(await loadArticle('does-not-exist')).toBeNull();
  });

  it('loads + compiles a real article', async () => {
    const a = await loadArticle('what-is-mrstocks');
    expect(a).not.toBeNull();
    expect(a!.meta.slug).toBe('what-is-mrstocks');
    expect(a!.meta.title).toMatch(/MR\/STOCKS/);
    expect(a!.content).toBeDefined();
  });
});
