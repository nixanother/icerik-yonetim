import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getSettings } from "@/lib/settings";
import { getLang, pick, dict } from "@/lib/i18n";
import { youtubeEmbed } from "@/lib/youtube";
import { Chars } from "@/components/Split";
import { fun } from "@/lib/fun";
import Shapes, { Squiggle } from "@/components/Shapes";
import Prose from "@/components/Prose";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hakkımda" };

export default async function AboutPage() {
  const lang = await getLang();
  const t = dict[lang];
  const [settings, skills] = await Promise.all([
    getSettings(),
    db.select("skills", "select=*&order=sort.asc,id.asc"),
  ]);

  const embed = youtubeEmbed(settings.video_url);
  const toLines = (v) =>
    String(v || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  const education = toLines(pick(settings, "education", lang));
  const interests = toLines(pick(settings, "interests", lang));
  const name = pick(settings, "about_title", lang) || t.about;

  return (
    <div className="relative isolate mx-auto max-w-6xl px-5 pt-12 md:pt-20">
      <Shapes set="page" />
      {/* Vesikalık + giriş */}
      <section className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-4">
          {settings.photo_path ? (
            <div className="-rotate-2 rounded-[2rem] border-2 border-ink bg-pink p-3 shadow-[7px_7px_0_var(--ink)] md:sticky md:top-24">
            <div data-clip className="overflow-hidden rounded-[1.4rem] bg-paper-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicUrl(settings.photo_path)}
                alt={name}
                className="aspect-[3/4] w-full max-w-xs object-cover md:max-w-none"
              />
            </div>
            </div>
          ) : null}
        </div>
        <div className="md:col-span-8">
          <h1 className="display text-[clamp(3rem,8vw,6.5rem)]">
            <Chars text={name} />
          </h1>
          <Squiggle color="var(--amber)" className="mt-3" />
          {settings.cv_path && (
            <a
              data-reveal
              href={`${publicUrl(settings.cv_path)}?download=${encodeURIComponent("CV.pdf")}`}
              className="wiggle mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-6 py-3 font-bold text-white shadow-[4px_4px_0_var(--ink)]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
              </svg>
              {t.downloadCv}
            </a>
          )}
          <div data-reveal className="mt-10">
            {pick(settings, "about_text", lang) ? (
              <Prose text={pick(settings, "about_text", lang)} />
            ) : (
              <p className="text-slate">{t.aboutEmpty}</p>
            )}
          </div>
        </div>
      </section>

      {/* Eğitim: gerçek bir zaman sırası olduğu için çizgili zaman çizelgesi */}
      {education.length > 0 && (
        <section className="mt-28 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 data-reveal className="display text-4xl md:text-5xl">
              {t.education}
            </h2>
            <p data-reveal className="mt-3 text-slate">
              {t.educationIntro}
            </p>
          </div>
          <ol className="relative md:col-span-8">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line" />
            <span
              aria-hidden="true"
              data-draw
              className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-cobalt"
            />
            {education.map((e, i) => (
              <li key={i} data-reveal className="relative pb-10 pl-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`absolute top-1 left-[-6px] h-6 w-6 rounded-full border-2 border-ink ${fun(i).bg}`}
                />
                <p className="text-xl leading-snug font-semibold md:text-2xl">{e}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {interests.length > 0 && (
        <section className="mt-28 grid gap-8 md:grid-cols-12">
          <h2 data-reveal className="display text-4xl md:col-span-4 md:text-5xl">
            {t.interests}
          </h2>
          <ul className="flex flex-wrap gap-3 md:col-span-8">
            {interests.map((e, i) => (
              <li
                key={e}
                data-reveal
                className={`wiggle rounded-full border-2 border-ink px-5 py-2.5 text-lg font-semibold shadow-[3px_3px_0_var(--ink)] ${fun(i).soft}`}
              >
                {e}
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-28 grid gap-8 md:grid-cols-12">
          <h2 data-reveal className="display text-4xl md:col-span-4 md:text-5xl">
            {t.skills}
          </h2>
          <ul className="space-y-6 md:col-span-8">
            {skills.map((s, i) => {
              const level = Math.min(100, Math.max(0, Number(s.level) || 0));
              return (
                <li key={s.id} data-reveal>
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <span className="text-lg font-semibold">{s.name}</span>
                    <span className="tc text-sm text-slate">%{level}</span>
                  </div>
                  <div className="h-5 overflow-hidden rounded-full border-2 border-ink bg-paper-2">
                    <div data-bar={level} className={`h-full rounded-full ${fun(i).bg}`} style={{ width: `${level}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {embed && (
        <section className="mt-28">
          <h2 data-reveal className="display mb-8 text-4xl md:text-5xl">
            {t.video}
          </h2>
          <div data-reveal className="aspect-video overflow-hidden rounded-[1.75rem] border-2 border-ink bg-ink shadow-[7px_7px_0_var(--ink)]">
            <iframe
              src={embed}
              title={t.video}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </div>
  );
}
