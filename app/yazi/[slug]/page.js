import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getLang, pick, splitList, dateLocale, dict } from "@/lib/i18n";
import Prose, { plainText } from "@/components/Prose";

export const dynamic = "force-dynamic";

async function getPost(slug) {
  const rows = await db.select(
    "posts",
    `select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`
  );
  return rows[0];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title || "Yazı" };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const lang = await getLang();
  const t = dict[lang];

  const post = await getPost(slug);
  if (!post) notFound();

  const cat = pick(post, "category", lang);
  const tags = splitList(pick(post, "tags", lang));
  const content = pick(post, "content", lang);
  const minutes = Math.max(1, Math.round(plainText(content).split(" ").length / 200));

  return (
    <article className="mx-auto max-w-6xl px-5 pt-10 md:pt-16">
      {/* Okuma ilerleme çubuğu (menünün hemen altında) */}
      <div
        aria-hidden="true"
        data-progress
        className="fixed top-[61px] left-0 z-30 h-1.5 w-full origin-left scale-x-0 bg-gradient-to-r from-pink via-amber to-mint"
      />

      <Link href="/makaleler" className="link-line text-sm text-slate">
        {t.back}
      </Link>

      <header className="mt-8 max-w-4xl">
        {cat && (
          <Link
            href={`/makaleler?kategori=${encodeURIComponent(cat)}`}
            className="wiggle mb-5 inline-block rounded-full border-2 border-ink bg-amber px-4 py-1 text-sm font-bold shadow-[3px_3px_0_var(--ink)]"
          >
            {cat}
          </Link>
        )}
        <h1 data-reveal className="display text-[clamp(2.4rem,6vw,4.8rem)] leading-[0.98]">
          {pick(post, "title", lang)}
        </h1>
        <p data-reveal className="mt-6 text-sm text-slate">
          <time className="tc" dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString(dateLocale(lang), {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="mx-2">/</span>
          {minutes} {t.minRead}
        </p>
      </header>

      <div className="mt-14 grid gap-10 md:grid-cols-12">
        <div data-reveal className="md:col-span-8">
          <Prose text={content} />
        </div>
        {tags.length > 0 && (
          <aside className="md:col-span-3 md:col-start-10">
            <div className="md:sticky md:top-28">
              <h2 className="mb-3 text-sm font-semibold">{t.tags}</h2>
              <ul className="flex flex-wrap gap-2">
                {tags.map((tg) => (
                  <li key={tg}>
                    <Link
                      href={`/makaleler?etiket=${encodeURIComponent(tg)}`}
                      className="inline-block rounded-full border-2 border-ink bg-paper-2 px-3 py-1 text-sm font-semibold hover:bg-mint hover:text-white"
                    >
                      #{tg}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
