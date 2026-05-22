import Link from 'next/link';
import Nav from '@/components/marketing/Nav';
import Footer from '@/components/marketing/Footer';
import { listArticles } from '@/lib/education/load';

export const metadata = { title: 'Education — MR/STOCKS' };

export default async function EducationHub() {
  const articles = await listArticles();
  const byCategory = new Map<string, typeof articles>();
  for (const a of articles) {
    if (a.draft) continue;
    const list = byCategory.get(a.category) ?? [];
    list.push(a);
    byCategory.set(a.category, list);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Nav />

      <header className="px-4 md:px-8 py-10 border-b border-white/10">
        <div className="max-w-[860px] mx-auto">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            EDUCATION
          </span>
          <h1 className="text-[28px] md:text-[40px] uppercase tracking-tight mt-2 text-white">
            How the scanner works
          </h1>
          <p className="text-[13px] text-white/65 mt-3 max-w-[640px] leading-relaxed">
            Short, opinionated articles on the setup states, the Prior45 zone
            system, and how to read each card on the dashboard. Read top-to-
            bottom your first day, then keep them as reference.
          </p>
        </div>
      </header>

      <section className="flex-1">
        <div className="max-w-[860px] mx-auto px-4 md:px-8 py-8 space-y-10">
          {[...byCategory.entries()].map(([cat, list]) => (
            <div key={cat}>
              <h2 className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-3">
                {cat}
              </h2>
              <ul className="space-y-2">
                {list.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/education/${a.slug}`}
                      className="block px-4 py-3 border border-white/12 hover:border-white/25 rounded-sm bg-[#0B0B0B] transition-colors"
                    >
                      <span className="block text-[14px] text-white">
                        {a.title}
                      </span>
                      <span className="block text-[10.5px] uppercase tracking-[0.12em] text-white/50 mt-1">
                        UPDATED {a.updated}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {byCategory.size === 0 && (
            <p className="text-[13px] text-white/55">
              No articles published yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
