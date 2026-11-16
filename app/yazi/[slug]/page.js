import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getLang, pick, splitList, dateLocale, dict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const lang = await getLang();
  const t = dict[lang];

  const rows = await db.select(
    "posts",
    `select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`
  );
  const post = rows[0];
  if (!post) notFound();

  const cat = pick(post, "category", lang);
  const tags = splitList(pick(post, "tags", lang));

  return (
    <article className="rounded-2xl bg-white p-8 shadow">
      <Link href="/makaleler" className="text-sm text-indigo-600 hover:underline">
        {t.back}
      </Link>
      <h1 className="mt-3 mb-2 text-3xl font-bold text-indigo-900">{pick(post, "title", lang)}</h1>
      <p className="mb-4 text-sm text-gray-400">
        {new Date(post.created_at).toLocaleDateString(dateLocale(lang))}
      </p>

      {(cat || tags.length > 0) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {cat && (
            <Link
              href={`/makaleler?kategori=${encodeURIComponent(cat)}`}
              className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200"
            >
              {t.category}: {cat}
            </Link>
          )}
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

      <div className="whitespace-pre-wrap leading-relaxed text-gray-800">{pick(post, "content", lang)}</div>
    </article>
  );
}
