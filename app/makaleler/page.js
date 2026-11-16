import Link from "next/link";
import { db } from "@/lib/db";
import { getLang, pick, splitList, dateLocale, dict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "Makaleler" };

export default async function ArticlesPage({ searchParams }) {
  const lang = await getLang();
  const t = dict[lang];
  const sp = await searchParams;
  const category = typeof sp?.kategori === "string" ? sp.kategori : "";
  const tag = typeof sp?.etiket === "string" ? sp.etiket : "";

  let posts = await db.select("posts", "select=*&published=eq.true&order=created_at.desc");

  if (category) posts = posts.filter((p) => pick(p, "category", lang) === category);
  if (tag) posts = posts.filter((p) => splitList(pick(p, "tags", lang)).includes(tag));

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-indigo-900">{t.articles}</h1>
      <p className="mb-6 text-gray-600">{t.articlesIntro}</p>

      {(category || tag) && (
        <p className="mb-6 text-sm text-gray-600">
          {t.filter}: <strong>{category || `#${tag}`}</strong> ·{" "}
          <Link href="/makaleler" className="text-indigo-600 hover:underline">
            {t.clearFilter}
          </Link>
        </p>
      )}

      {posts.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">{t.noPosts}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => {
          const cat = pick(post, "category", lang);
          const tags = splitList(pick(post, "tags", lang));
          return (
            <article key={post.id} className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
              {cat && (
                <Link
                  href={`/makaleler?kategori=${encodeURIComponent(cat)}`}
                  className="mb-2 inline-block rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200"
                >
                  {cat}
                </Link>
              )}
              <h2 className="mb-2 text-xl font-semibold text-indigo-800">
                <Link href={`/yazi/${post.slug}`}>{pick(post, "title", lang)}</Link>
              </h2>
              <p className="line-clamp-3 text-gray-600">{pick(post, "content", lang)}</p>
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tg) => (
                    <Link
                      key={tg}
                      href={`/makaleler?etiket=${encodeURIComponent(tg)}`}
                      className="text-xs text-violet-600 hover:underline"
                    >
                      #{tg}
                    </Link>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm text-gray-400">
                {new Date(post.created_at).toLocaleDateString(dateLocale(lang))}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
