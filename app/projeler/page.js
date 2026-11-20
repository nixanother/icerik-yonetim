import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getLang, pick, dict } from "@/lib/i18n";
import { Chars } from "@/components/Split";
import { fun, tilt } from "@/lib/fun";
import Shapes, { Squiggle } from "@/components/Shapes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projeler" };

export default async function ProjectsPage() {
  const lang = await getLang();
  const t = dict[lang];
  const projects = await db.select("projects", "select=*&order=created_at.desc");

  return (
    <div className="relative isolate mx-auto max-w-6xl px-5 pt-12 md:pt-20">
      <Shapes set="page" />
      <h1 className="display text-[clamp(3.2rem,10vw,8rem)]">
        <Chars text={t.projects} />
      </h1>
      <Squiggle color="var(--mint)" className="mt-3" />
      <p data-reveal className="mt-5 max-w-xl font-serif text-xl text-slate">
        {t.projectsIntro}
      </p>

      {projects.length === 0 && <p className="mt-16 text-slate">{t.noProjects}</p>}

      <div className="mt-20 space-y-24 md:space-y-36">
        {projects.map((p, i) => (
          <article key={p.id} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
            <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <div
                className={`tilt ${tilt(i)} rounded-[1.75rem] border-2 border-ink p-2.5 shadow-[7px_7px_0_var(--ink)] ${fun(i).bg}`}
              >
              <div data-clip className="aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-paper-2">
                {p.image_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={publicUrl(p.image_path)}
                    alt={pick(p, "title", lang)}
                    className="h-full w-full object-cover object-top"
                  />
                )}
              </div>
              </div>
            </div>
            <div className="md:col-span-5">
              <h2 data-reveal className="display text-4xl md:text-5xl" style={{ color: fun(i).hex }}>
                {pick(p, "title", lang)}
              </h2>
              <p data-reveal className="mt-5 font-serif text-lg leading-relaxed whitespace-pre-wrap text-slate">
                {pick(p, "description", lang)}
              </p>
              {p.link && (
                <a
                  data-reveal
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wiggle mt-6 inline-flex rounded-full border-2 border-ink bg-amber px-6 py-2.5 font-bold text-ink shadow-[4px_4px_0_var(--ink)]"
                >
                  {t.visit}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
