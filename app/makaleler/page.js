import Link from "next/link";
import { db } from "@/lib/db";
import { getLang, pick, splitList, dateLocale, dict } from "@/lib/i18n";
import { Chars } from "@/components/Split";
import { fun } from "@/lib/fun";
import Shapes, { Squiggle } from "@/components/Shapes";
import { plainText } from "@/components/Prose";

export const dynamic = "force-dynamic";
export const metadata = { title: "Makaleler" };

export default async function ArticlesPage({ searchParams }) {
  const lang = await getLang();
  const t = dict[lang];
  const sp = await searchParams;
  const category = typeof sp?.kategori === "string" ? sp.kategori : "";
  const tag = typeof sp?.etiket === "string" ? sp.etiket : "";

  const all = await db.select("posts", "select=*&published=eq.true&order=created_at.desc");
  // Öne çıkan yazılar en üstte (sıralama korunur)
  all.sort((a, b) => Number(b.featured === true) - Number(a.featured === true));

  // Filtre düğmeleri için tüm kategoriler ve etiketler
  const categories = [...new Set(all.map((p) => pick(p, "category", lang)).filter(Boolean))];
  const tags = [...new Set(all.flatMap((p) => splitList(pick(p, "tags", lang))))];

  let posts = all;
  if (category) posts = posts.filter((p) => pick(p, "category", lang) === category);
  if (tag) posts = posts.filter((p) => splitList(pick(p, "tags", lang)).includes(tag));

  const chip = (active, i = 5) =>
    `wiggle rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition-colors ${
      active ? `${fun(i).bg} text-white shadow-[3px_3px_0_var(--ink)]` : "bg-paper-2 hover:bg-amber"
    }`;

  return (
    <div className="relative isolate mx-auto max-w-6xl px-5 pt-12 md:pt-20">
      <Shapes set="page" />
      <h1 className="display text-[clamp(3.2rem,10vw,8rem)]">
        <Chars text={t.articles} />
      </h1>
      <Squiggle color="var(--sky)" className="mt-3" />
      <p data-reveal className="mt-5 max-w-xl font-serif text-xl text-slate">
        {t.articlesIntro}
      </p>

      {categories.length > 0 && (
        <nav data-reveal aria-label={t.category} className="mt-12 flex flex-wrap gap-2">
          <Link href="/makaleler" className={chip(!category && !tag)}>
            {t.allCategories}
          </Link>
          {categories.map((c, i) => (
            <Link key={c} href={`/makaleler?kategori=${encodeURIComponent(c)}`} className={chip(c === category, i)}>
              {c}
            </Link>
          ))}
        </nav>
      )}

      {tags.length > 0 && (
        <div data-reveal className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {tags.map((tg, i) => (
            <Link
              key={tg}
              href={`/makaleler?etiket=${encodeURIComponent(tg)}`}
              className={`font-semibold ${tg === tag ? "underline" : "opacity-80 hover:opacity-100"} ${fun(i).text}`}
            >
              #{tg}
            </Link>
          ))}
        </div>
      )}

      {tag && (
        <p className="mt-6 text-sm text-slate">
          {t.filter}: <strong className="text-ink">#{tag}</strong>{" "}
          <Link href="/makaleler" className="link-line ml-2 text-cobalt">
            {t.clearFilter}
          </Link>
        </p>
      )}

      {posts.length === 0 && <p className="mt-16 text-slate">{t.noPosts}</p>}

      <ul className="mt-12 space-y-6">
        {posts.map((post, i) => {
          const cat = pick(post, "category", lang);
          const text = plainText(pick(post, "content", lang));
          const minutes = Math.max(1, Math.round(text.split(" ").length / 200));
          return (
            <li
              key={post.id}
              data-reveal
              className="rounded-[1.75rem] border-2 border-ink bg-paper-2 shadow-[6px_6px_0_var(--ink)] transition-transform hover:-translate-y-1"
            >
              <Link
                href={`/yazi/${post.slug}`}
                className="group grid gap-3 p-6 md:grid-cols-[10rem_1fr] md:gap-10 md:p-8"
              >
                <div className="text-sm text-slate">
                  <time className="tc block" dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleDateString(dateLocale(lang))}
                  </time>
                  <span className="block">
                    {minutes} {t.minRead}
                  </span>
                </div>
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.featured === true && (
                      <span className="inline-block rounded-full border-2 border-ink bg-amber px-3 py-0.5 text-sm font-bold">
                        ★ {t.featured}
                      </span>
                    )}
                    {cat && (
                      <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${fun(i).soft}`}>{cat}</span>
                    )}
                  </div>
                  <h2
                    className="text-3xl leading-tight font-bold tracking-tight transition-colors group-hover:text-[var(--hover)] md:text-4xl"
                    style={{ "--hover": fun(i).hex }}
                  >
                    {pick(post, "title", lang)}
                  </h2>
                  <p className="mt-3 line-clamp-2 max-w-2xl font-serif text-lg text-slate">{text}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
