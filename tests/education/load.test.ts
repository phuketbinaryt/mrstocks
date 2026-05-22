import { describe, it, expect } from 'vitest';
import { listArticles, loadArticle } from '@/lib/education/load';

describe('education/load', () => {
  it('lists all 4 launch articles with required frontmatter', async () => {
    const articles = await listArticles();
    expect(articles.length).toBeGreaterThanOrEqual(4);
    const slugs = articles.map((a) => a.slug).sort();
    expect(slugs).toEqual(
      expect.arrayContaining([
        'introduction',
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
    const a = await loadArticle('introduction');
    expect(a).not.toBeNull();
    expect(a!.meta.slug).toBe('introduction');
    expect(a!.meta.title).toMatch(/MR\/STOCKS/);
    expect(a!.content).toBeDefined();
  });
});
