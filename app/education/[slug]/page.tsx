import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Nav from '@/components/marketing/Nav';
import Footer from '@/components/marketing/Footer';
import { listArticles, loadArticle } from '@/lib/education/load';

export async function generateStaticParams() {
  const articles = await listArticles();
  return articles.filter((a) => !a.draft).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: 'Not found — MR/STOCKS' };
  return { title: `${article.meta.title} — MR/STOCKS` };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article || article.meta.draft) return notFound();

  // Reading-order sequence across all tiers, by global `order`, for prev/next.
  const all = (await listArticles())
    .filter((a) => !a.draft)
    .sort((a, b) => a.order - b.order);
  const idx = all.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Nav />

      <article className="flex-1 max-w-[720px] w-full mx-auto px-4 md:px-8 py-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link
            href="/education"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/55 hover:text-white"
          >
            <ArrowLeft size={11} /> ALL ARTICLES
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[oklch(0.82_0.16_75)] hover:text-white"
          >
            DASHBOARD <ArrowRight size={11} />
          </Link>
        </div>

        <header className="mb-6 border-b border-white/12 pb-4">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            {article.meta.category}
          </span>
          <h1 className="text-[26px] md:text-[34px] uppercase tracking-tight mt-2 text-white">
            {article.meta.title}
          </h1>
          <p className="text-[10.5px] uppercase tracking-[0.12em] text-white/55 mt-2">
            UPDATED {article.meta.updated}
          </p>
        </header>

        <div className="prose-mrstocks">{article.content}</div>

        {(prev || next) && (
          <nav className="mt-12 pt-6 border-t border-white/12 grid grid-cols-2 gap-3">
            <div>
              {prev && (
                <Link
                  href={`/education/${prev.slug}`}
                  className="group block px-4 py-3 border border-white/12 hover:border-white/25 rounded-sm bg-[#0B0B0B] transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-white/45 group-hover:text-white/70">
                    <ArrowLeft size={11} /> PREVIOUS
                  </span>
                  <span className="block text-[13px] text-white mt-1.5">
                    {prev.title}
                  </span>
                </Link>
              )}
            </div>
            <div>
              {next && (
                <Link
                  href={`/education/${next.slug}`}
                  className="group block px-4 py-3 border border-white/12 hover:border-white/25 rounded-sm bg-[#0B0B0B] transition-colors text-right"
                >
                  <span className="flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-[0.12em] text-white/45 group-hover:text-white/70">
                    NEXT <ArrowRight size={11} />
                  </span>
                  <span className="block text-[13px] text-white mt-1.5">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>

      <Footer />
    </main>
  );
}
