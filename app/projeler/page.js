import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getLang, pick, dict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projeler" };

export default async function ProjectsPage() {
  const lang = await getLang();
  const t = dict[lang];
  const projects = await db.select("projects", "select=*&order=created_at.desc");

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-indigo-900">{t.projects}</h1>
      <p className="mb-8 text-gray-600">{t.projectsIntro}</p>

      {projects.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">{t.noProjects}</div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-2xl bg-white shadow">
            {p.image_path && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={publicUrl(p.image_path)} alt={pick(p, "title", lang)} className="h-56 w-full object-cover" />
            )}
            <div className="p-5">
              <h2 className="mb-2 text-xl font-semibold text-indigo-800">{pick(p, "title", lang)}</h2>
              <p className="whitespace-pre-wrap text-gray-600">{pick(p, "description", lang)}</p>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-indigo-600 hover:underline"
                >
                  {t.visit} →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
