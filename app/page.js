import Link from "next/link";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getSettings } from "@/lib/settings";
import { getLang, pick, dict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lang = await getLang();
  const t = dict[lang];

  const [posts, images, projects, settings] = await Promise.all([
    db.select("posts", "select=*&published=eq.true&order=created_at.desc&limit=3"),
    db.select("gallery", "select=*&order=created_at.desc&limit=6"),
    db.select("projects", "select=*&order=created_at.desc&limit=3"),
    getSettings(),
  ]);

  const aboutText = pick(settings, "about_text", lang);
  const excerpt = aboutText.length > 260 ? aboutText.slice(0, 260) + "…" : aboutText;
  const photo = settings.photo_path;

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow md:flex-row">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicUrl(photo)}
            alt={pick(settings, "about_title", lang) || "Profil"}
            className="h-40 w-40 rounded-full object-cover shadow"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="mb-3 text-4xl font-bold text-indigo-900">
            {pick(settings, "about_title", lang) || t.siteName}
          </h1>
          <p className="max-w-2xl whitespace-pre-wrap text-gray-600">{excerpt || t.heroText}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/hakkinda" className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700">
              {t.readMore}
            </Link>
            <Link href="/iletisim" className="rounded-lg bg-gray-100 px-5 py-2 hover:bg-gray-200">
              {t.contact}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-900">{t.projects}</h2>
          <Link href="/projeler" className="text-sm text-indigo-600 hover:underline">
            {t.all}
          </Link>
        </div>
        {projects.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">{t.noProjects}</div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl bg-white shadow">
              {p.image_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={publicUrl(p.image_path)} alt={pick(p, "title", lang)} className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="mb-1 font-semibold text-indigo-800">{pick(p, "title", lang)}</h3>
                <p className="line-clamp-3 text-sm text-gray-600">{pick(p, "description", lang)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-900">{t.gallery}</h2>
          <Link href="/galeri" className="text-sm text-indigo-600 hover:underline">
            {t.all}
          </Link>
        </div>
        {images.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">{t.noImages}</div>
        )}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={publicUrl(img.image_path)}
              alt={pick(img, "title", lang) || "Galeri"}
              className="aspect-square w-full rounded-2xl object-cover shadow"
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-900">{t.latestArticles}</h2>
          <Link href="/makaleler" className="text-sm text-indigo-600 hover:underline">
            {t.all}
          </Link>
        </div>
        {posts.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">{t.noPosts}</div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/yazi/${post.slug}`}
              className="rounded-2xl bg-white p-5 shadow transition hover:shadow-lg"
            >
              <h3 className="mb-2 font-semibold text-indigo-800">{pick(post, "title", lang)}</h3>
              <p className="line-clamp-3 text-sm text-gray-600">{pick(post, "content", lang)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
